#!/usr/bin/env python3
"""
make_youtube.py — broadcast / lyric-video variants of the read-along. 🐌🎬

The everyday player (add_words.py -> <base>-words.html) is built for a READER on
a phone: a long cream scroll with audio + speed + lead controls.

This builds SCREEN-RECORDABLE versions instead: a fixed 1920x1080 stage, no
chrome, large centered text with the current word lit. Point OBS at it, hit play,
get a YouTube-ready read-along. Same alignment numbers + same rAF sync engine as
the phone player — only the LAYOUT changes.

Three layouts (--layout), from least to most on-screen context:
  solo     one verse centered, swaps each boundary (minimal, pure lyric video)
  window   3 lines visible: prev (dim) / current (lit) / next (dim)   [DEFAULT]
  passage  whole chapter on screen, broadcast-styled, auto-scrolls to keep the
           active verse centered — the "what we have on the web" feel, 16:9

Usage:
  make_youtube.py psalm-23-aligned.json                      # window (default)
  make_youtube.py psalm-23-aligned.json --layout passage
  make_youtube.py psalm-23-aligned.json --all                # write all 3
  make_youtube.py john-01-aligned.json --title "John 1" --sub "Berean Standard Bible"
Writes: <base>-yt-<layout>.html  (needs the .opus next to it)
"""
import os
import re
import sys
import json
import argparse

_WORD = re.compile(r"\S+")


def word_spans(text, start_ms, end_ms):
    words = _WORD.findall(text)
    if not words:
        return []
    weights = [len(w) + 1 for w in words]
    total = sum(weights)
    span = max(0, end_ms - start_ms)
    out, acc = [], 0
    for w, wt in zip(words, weights):
        s = start_ms + round(span * acc / total)
        acc += wt
        e = start_ms + round(span * acc / total)
        out.append({"t": w, "s": s, "e": e})
    return out


def load_words(data):
    if data.get("words"):
        return [{"t": w["t"], "s": w["s"], "e": w["e"], "si": w.get("si", 0)}
                for w in data["words"]]
    flat = []
    for si, c in enumerate(data["sentences"]):
        for w in word_spans(c["text"], c["start_ms"], c["end_ms"]):
            w["si"] = si
            flat.append(w)
    return flat


def load_versemap(base):
    p = base.replace("-aligned", "").replace("-words", "") + ".versemap.json"
    if not os.path.exists(p):
        return None
    try:
        vm = json.load(open(p, encoding="utf-8"))
        return {"book": vm.get("book"), "chapter": vm.get("chapter"),
                "verses": vm.get("verses", [])}
    except Exception:
        return None


PLAYER = r"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
 :root{
   --bg:#f4efe6; --fg:#2b2b2b; --hi:#c8472f;
   --hl:#eccd86;                       /* soft warm honey — gentle, not in-your-face */
   --read:#cfc6b4; --ghost:#bdb39e; --dim:#9a9388;
 }
 *{box-sizing:border-box;margin:0;padding:0}
 html,body{width:100%;height:100%;background:#0c0b0a;overflow:hidden}
 #fit{position:fixed;inset:0;display:grid;place-items:center}
 #stage{width:1920px;height:1080px;position:relative;
   background:var(--bg);color:var(--fg);overflow:hidden;
   font-family:"IBM Plex Serif",Georgia,serif;
   box-shadow:0 0 80px rgba(0,0,0,.5);transform-origin:center}
 #stage::before{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
   background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/></svg>");
   mix-blend-mode:multiply;opacity:.6}
 #stage::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:1;
   background:radial-gradient(ellipse 78% 70% at 50% 45%,transparent 56%,rgba(60,45,25,.16) 100%)}

 .mark{position:absolute;top:60px;left:84px;z-index:5;
   font-family:"IBM Plex Sans",sans-serif;letter-spacing:.22em;text-transform:uppercase;
   padding-bottom:14px;border-bottom:1px solid rgba(43,43,43,.14)}
 .mark .t{font-size:23px;font-weight:600}
 .mark .s{font-size:15px;font-weight:500;color:var(--dim);margin-top:5px;letter-spacing:.18em}
 .verse{position:absolute;top:62px;right:84px;z-index:5;
   font-family:"IBM Plex Sans",sans-serif;font-weight:600;font-size:23px;
   color:var(--dim);letter-spacing:.1em;opacity:0;transition:opacity .4s}
 .verse b{font-weight:400;color:var(--dim);font-size:23px}
 .snail{position:absolute;bottom:54px;right:84px;z-index:5;
   font-family:"IBM Plex Sans",sans-serif;font-size:14px;font-weight:600;
   letter-spacing:.26em;text-transform:uppercase;color:var(--dim);opacity:.6}
 #bar{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--hi);z-index:6;opacity:.45}

 /* ---- shared word states ---- */
 .w{transition:color .14s ease-out,opacity .14s ease-out}
 .w.read{color:var(--read)}
 .w.ahead{color:var(--fg);opacity:.30}
 .w.active{color:var(--hi)}

 /* ===== layout: solo / window (the 3-line stack) ===== */
 #lines{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
   justify-content:center;align-items:center;padding:0 13%;text-align:center}
 .ln{width:100%;transition:opacity .5s ease,max-height .5s ease,margin .5s ease,font-size .5s ease}
 .ln.side{font-size:50px;line-height:1.36;color:var(--ghost);opacity:.42;margin:22px 0}
 .ln.cur{font-size:64px;line-height:1.36;font-weight:500;margin:30px 0}
 body[data-layout="solo"] .ln.side{opacity:0;max-height:0;margin:0;overflow:hidden}
 body[data-layout="passage"] #lines{display:none}

 /* ===== layout: passage (whole chapter, web-style word dimming, auto-scroll) ===== */
 #scrollwrap{position:absolute;inset:0;z-index:2;display:none;overflow:hidden;
   /* fade text out near the top (under the title) and bottom so nothing collides */
   -webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 19%,#000 84%,transparent 100%);
   mask-image:linear-gradient(to bottom,transparent 0,#000 19%,#000 84%,transparent 100%)}
 body[data-layout="passage"] #scrollwrap{display:block}
 #flow{position:absolute;left:0;right:0;padding:0 25%;text-align:left;
   font-size:54px;line-height:1.6;letter-spacing:-.005em;will-change:transform;
   transition:transform .55s cubic-bezier(.33,0,.15,1)}
 /* the whole chapter flows like a real Bible; read=recedes, ahead=full ink, active=red square */
 #flow .w{color:var(--fg);padding:.04em .14em;border-radius:.32em;
   transition:color .18s ease-out,background .22s ease-out}          /* unread = full ink */
 #flow .w.read{color:var(--read)}                                    /* read = recedes */
 #flow .w.active{background:var(--hl);color:var(--fg)}               /* soft honey wash, rounded */
 .vn{font-family:"IBM Plex Sans",sans-serif;font-weight:700;font-size:26px;
   color:var(--hi);vertical-align:.6em;margin:0 .35em 0 .15em;opacity:.7}

 #veil{position:absolute;inset:0;z-index:9;display:grid;place-items:center;
   background:rgba(12,11,10,.55);cursor:pointer;backdrop-filter:blur(2px)}
 #veil .play{width:0;height:0;border-left:44px solid #f4efe6;
   border-top:28px solid transparent;border-bottom:28px solid transparent;margin:0 auto 22px}
 #veil .b{font-family:"IBM Plex Sans",sans-serif;color:#f4efe6;text-align:center}
 #veil .l{font-size:24px;letter-spacing:.16em;text-transform:uppercase;opacity:.9}
 #veil .h{font-size:15px;letter-spacing:.1em;margin-top:10px;opacity:.55}
 #veil.hide{display:none}
</style></head><body data-layout="__LAYOUT__">
<div id="fit"><div id="stage">
 <div class="mark"><div class="t">__MARK_T__</div><div class="s">__MARK_S__</div></div>
 <div class="verse" id="vb"></div>
 <div id="lines">
  <div class="ln side" id="lp"></div>
  <div class="ln cur"  id="lc"></div>
  <div class="ln side" id="ln"></div>
 </div>
 <div id="scrollwrap"><div id="flow"></div></div>
 <div class="snail">Snail 🐌</div>
 <div id="bar"></div>
 <div id="veil"><div class="b"><div class="play"></div>
   <div class="l">__MARK_T__</div><div class="h">click to begin · record at 1080p</div></div></div>
 <audio id="a" src="__AUDIO__" preload="auto"></audio>
</div></div>
<script>
const W=__WORDS__, S=__SENTS__, VM=__VERSES__, DUR=__DUR__, LAYOUT="__LAYOUT__";
const a=document.getElementById('a'),bar=document.getElementById('bar');
const lc=document.getElementById('lc'),lp=document.getElementById('lp'),ln=document.getElementById('ln');
const vb=document.getElementById('vb'),veil=document.getElementById('veil');
const flow=document.getElementById('flow'),stage=document.getElementById('stage');

function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);
  stage.style.transform='scale('+s+')';}
addEventListener('resize',fit);fit();

function verseAt(wi){ if(!VM||wi<0) return null; let n=null;
  for(const v of VM.verses){ if(wi>=v.word) n=v.n; else break; } return n; }
function showVerse(wi){ if(!VM) return; const n=verseAt(wi);
  if(n){vb.style.opacity=1;vb.innerHTML='<b>'+(VM.book||'')+' </b>'+(VM.chapter||'')+':'+n;} }

// --- sync engine (identical math to the phone player) ---
let LEAD=180, hwLat=0;
try{const C=window.AudioContext||window.webkitAudioContext;
 if(C){const ctx=new C();const rd=()=>{hwLat=(ctx.baseLatency||0)+(ctx.outputLatency||0);};rd();
  a.addEventListener('play',()=>{ctx.state==='suspended'?ctx.resume().then(rd):rd();});}}catch(e){}
let baseCT=-1,baseWall=0;
function playheadMs(){const ct=a.currentTime,now=performance.now();
 if(ct!==baseCT){baseCT=ct;baseWall=now;}
 const adv=a.paused?0:(now-baseWall)/1000*(a.playbackRate||1);
 return (baseCT+adv-hwLat)*1000;}
let cur=-1;
function find(ms){
 if(cur>=0&&ms>=W[cur].s&&ms<W[cur].e)return cur;
 if(cur>=0&&ms>=W[cur].e){for(let i=cur+1;i<W.length;i++){
   if(ms<W[i].e)return ms>=W[i].s?i:i-1>=cur?i-1:cur;}return W.length-1;}
 for(let i=0;i<W.length;i++)if(ms<W[i].e)return ms>=W[i].s?i:Math.max(0,i-1);
 return W.length-1;}

/* ===== renderer A: solo / window (3-line stack) ===== */
let curSent=-1, wordEls=[];
function renderSentence(si){
 curSent=si;
 lp.textContent = si>0 ? S[si-1].text : '';
 ln.textContent = si<S.length-1 ? S[si+1].text : '';
 lc.innerHTML='';wordEls=[];
 for(let i=0;i<W.length;i++){ if(W[i].si!==si) continue;
   const e=document.createElement('span');e.className='w ahead';
   e.textContent=W[i].t+' ';e.dataset.wi=i;lc.appendChild(e);wordEls.push(e);}
 showVerse(W.findIndex(w=>w.si===si));
}
function paintStack(i){
 if(W[i].si!==curSent) renderSentence(W[i].si);
 for(const e of wordEls){const wi=+e.dataset.wi;
   e.className='w '+(wi<i?'read':wi===i?'active':'ahead');}
}

/* ===== renderer B: passage (whole chapter inline, like the web player) ===== */
let pEls=[], pLastTop=-1, pPrev=-1;
function buildPassage(){
 // verse-number markers, then every word flows inline like a real Bible page
 const marks = (VM&&VM.verses.length) ? VM.verses.slice() : [];
 const startMark = {};                       // word index -> verse number
 for(const v of marks) startMark[v.word]=v.n;
 flow.innerHTML='';pEls=new Array(W.length);
 for(let i=0;i<W.length;i++){
   if(startMark[i]!==undefined && startMark[i]!==1){      // small verse superscript
     const b=document.createElement('span');b.className='vn';
     b.textContent=startMark[i];flow.appendChild(b);}
   const e=document.createElement('span');e.className='w';
   e.textContent=W[i].t+' ';flow.appendChild(e);pEls[i]=e;
 }
}
function paintPassage(i){
 // word-level: everything BEFORE i dims (read), i is the highlighter, everything AFTER stays full ink.
 // uses its own pPrev — the shared `cur` is already advanced by the loop, so we can't lean on it.
 if(i>pPrev){ for(let k=Math.max(0,pPrev);k<i;k++) pEls[k].className='w read'; }
 else if(i<pPrev){ for(let k=i+1;k<=pPrev && k<pEls.length;k++) pEls[k].className='w'; } // scrubbed back
 pEls[i].className='w active';
 pPrev=i;
 // keep the LIVE line vertically centered; only re-scroll when the line changes
 const top=pEls[i].offsetTop;
 if(top!==pLastTop){ pLastTop=top;
   flow.style.transform='translateY('+(496 - top)+'px)'; showVerse(i); }
}

function paint(i){ if(LAYOUT==='passage') paintPassage(i); else paintStack(i); }

function loop(){
 if(!a.paused){
   const i=find(playheadMs()+LEAD);
   if(i!==cur&&i>=0){cur=i;paint(i);}
   bar.style.width=(100*Math.min(1,(a.currentTime*1000)/(DUR||1)))+'%';
 }
 requestAnimationFrame(loop);
}
if(LAYOUT==='passage') buildPassage();
requestAnimationFrame(loop);

veil.onclick=()=>{veil.classList.add('hide');a.play();};
a.addEventListener('ended',()=>{bar.style.width='100%';});
</script></body></html>"""


def render(data, base, vm, title, sub, layout):
    words = load_words(data)
    sentences = data["sentences"]
    audio = data.get("audio", os.path.basename(base).replace("-aligned", "") + ".opus")
    dur = data.get("duration_ms", words[-1]["e"] if words else 0)
    html = (PLAYER
            .replace("__TITLE__", title)
            .replace("__MARK_T__", title)
            .replace("__MARK_S__", sub)
            .replace("__AUDIO__", audio)
            .replace("__LAYOUT__", layout)
            .replace("__WORDS__", json.dumps(
                [{"t": w["t"], "s": w["s"], "e": w["e"], "si": w["si"]} for w in words],
                ensure_ascii=False))
            .replace("__SENTS__", json.dumps(
                [{"text": s["text"]} for s in sentences], ensure_ascii=False))
            .replace("__VERSES__", json.dumps(vm, ensure_ascii=False) if vm else "null")
            .replace("__DUR__", str(dur)))
    out = base.replace("-aligned", "") + "-yt-" + layout + ".html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE %s  (%d words / %d sentences, %.0fs)"
          % (out, len(words), len(sentences), dur / 1000))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("json")
    ap.add_argument("--layout", choices=["solo", "window", "passage"], default="window")
    ap.add_argument("--all", action="store_true", help="write all three layouts")
    ap.add_argument("--title")
    ap.add_argument("--sub", default="Berean Standard Bible")
    args = ap.parse_args()

    data = json.load(open(args.json, encoding="utf-8"))
    base = os.path.splitext(args.json)[0]
    vm = load_versemap(base)
    if args.title:
        title = args.title
    elif vm and vm.get("book"):
        title = "%s %s" % (vm["book"], vm.get("chapter", ""))
    else:
        title = os.path.basename(base).replace("-aligned", "").replace("-", " ").title()

    layouts = ["solo", "window", "passage"] if args.all else [args.layout]
    for L in layouts:
        render(data, base, vm, title, args.sub, L)


if __name__ == "__main__":
    main()
