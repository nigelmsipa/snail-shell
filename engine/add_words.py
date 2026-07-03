#!/usr/bin/env python3
"""
add_words.py — increase the precision of the map. 🐌

Takes an already-rendered <base>.json (sentence-level timings) and writes a
word-level follow-along player <base>-words.html. The AUDIO and TEXT are
untouched; we only subdivide each sentence's exact [start_ms, end_ms] into its
words and highlight the current WORD during playback.

Phase 1 (this script): proportional estimate — each word gets a slice of its
sentence's span weighted by length. Approximate WITHIN a sentence, but exact at
every sentence boundary (those anchors come from real sample counts), so drift
never accumulates across the document.

Phase 2 (later): replace word_spans() with true forced alignment on each
sentence's audio clip. Same JSON, same player — only the numbers get sharper.

Usage:  add_words.py <base>.json
"""
import os
import re
import sys
import json

_WORD = re.compile(r"\S+")


def word_spans(text, start_ms, end_ms):
    """Split a sentence into words and distribute its [start,end] across them,
    weighted by characters (+1 per word to roughly account for inter-word gaps).
    Returns [{"t": word, "s": ms, "e": ms}, ...]."""
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


def build_words(sentences):
    """Flat list of every word with absolute [s,e] ms, plus a sentence index so
    the player can group/scroll by sentence if it wants."""
    flat = []
    for si, c in enumerate(sentences):
        for w in word_spans(c["text"], c["start_ms"], c["end_ms"]):
            w["si"] = si
            flat.append(w)
    return flat


PLAYER = """<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
 :root{--bg:#f4efe6;--fg:#2b2b2b;--hi:#ffe08a;--read:#cfc6b4;--dim:#9a9388}
 *{box-sizing:border-box}
 body{margin:0;background:var(--bg);color:var(--fg);
   font-family:"IBM Plex Sans",-apple-system,Segoe UI,Roboto,sans-serif;
   line-height:1.8;font-size:1.18rem}
 header{position:sticky;top:0;background:var(--bg);padding:.6rem 1rem;
   border-bottom:1px solid #ddd5c7;box-shadow:0 2px 8px rgba(0,0,0,.05)}
 audio{width:100%}
 main{max-width:42rem;margin:0 auto;padding:1.2rem 1.1rem 40vh}
 h1{font-size:1.1rem;color:var(--dim);font-weight:600;margin:.2rem 0 1rem}
 .w{cursor:pointer;border-radius:.22rem;padding:.04em .04em;
   transition:background .15s ease-out,color .15s ease-out,box-shadow .15s ease-out}
 .w:hover{background:#eadfc8}
 .w.read{color:var(--read)}
 .w.active{background:var(--hi);color:var(--fg);box-shadow:0 0 0 .12em var(--hi)}
 .spd{margin-top:.45rem;font-size:.85rem;color:var(--dim)}
 .spd button{font:inherit;margin:0 .12rem;padding:.18rem .55rem;border:1px solid #ccc3b2;
   background:#fbf7ee;color:var(--fg);border-radius:.4rem;cursor:pointer}
 .spd button.on{background:var(--hi);border-color:#e0c050}
</style></head><body>
<header><audio id="a" src="__AUDIO__" controls preload="metadata"></audio>
<div class="spd">Speed:
 <button data-r="1" class="on">1&times;</button><button data-r="1.25">1.25&times;</button>
 <button data-r="1.5">1.5&times;</button><button data-r="2">2&times;</button></div>
<div class="spd">Lead:
 <button id="lm">&minus;20ms</button><span id="lv" style="min-width:5ch;display:inline-block;text-align:center">0&thinsp;ms</span><button id="lp">+20ms</button>
 <span style="color:var(--dim)">&nbsp;(how far ahead the highlight runs)</span></div></header>
<main><h1>__TITLE__</h1><p id="t"></p></main>
<script>
const W=__DATA__,a=document.getElementById('a'),t=document.getElementById('t');
const spans=W.map((w,i)=>{const e=document.createElement('span');
 e.className='w';e.textContent=w.t+' ';e.onclick=()=>{a.currentTime=w.s/1000;a.play()};
 t.appendChild(e);return e});
let cur=-1;
// LEAD = ms the highlight runs AHEAD of the heard audio.
// Default 180 = 60ms CTC-lag correction (MMS emits late) + 120ms eye-voice lead.
let LEAD=+(localStorage.getItem('snailLead')||180);
const lv=document.getElementById('lv');
function showLead(){lv.innerHTML=LEAD+'&thinsp;ms';localStorage.setItem('snailLead',LEAD);}
document.getElementById('lm').onclick=()=>{LEAD=Math.max(-300,LEAD-20);showLead();};
document.getElementById('lp').onclick=()=>{LEAD=Math.min(900,LEAD+20);showLead();};
showLead();

// --- Rank 4: hardware (Bluetooth/buffer) latency, read from a bare AudioContext.
// We don't route audio through it (element keeps its own output) — we only read the
// device's output/base latency so the clock reflects what the EAR hears, not the buffer.
let hwLat=0;
try{const C=window.AudioContext||window.webkitAudioContext;
 if(C){const ctx=new C();
  const rd=()=>{hwLat=(ctx.baseLatency||0)+(ctx.outputLatency||0);};rd();
  a.addEventListener('play',()=>{if(ctx.state==='suspended')ctx.resume().then(rd);else rd();});}
}catch(e){}

// --- Rank 3 core: a smoothed media clock. a.currentTime updates in coarse chunks
// (same value for several frames, then jumps), so we extrapolate between updates with
// performance.now() for a continuous playhead, then subtract hardware latency.
let baseCT=-1,baseWall=0;
function playheadMs(){
 const ct=a.currentTime,now=performance.now();
 if(ct!==baseCT){baseCT=ct;baseWall=now;}
 const adv=a.paused?0:(now-baseWall)/1000*(a.playbackRate||1);
 return (baseCT+adv-hwLat)*1000;
}

function find(ms){ // cursor-forward scan; jump-safe fallback
 if(cur>=0&&ms>=W[cur].s&&ms<W[cur].e)return cur;
 if(cur>=0&&ms>=W[cur].e){for(let i=cur+1;i<W.length;i++){
   if(ms<W[i].e)return ms>=W[i].s?i:i-1>=cur?i-1:cur;}return W.length-1;}
 for(let i=0;i<W.length;i++)if(ms<W[i].e)return ms>=W[i].s?i:Math.max(0,i-1);
 return W.length-1;}

let lastScroll=0;
function paint(i){
 if(i===cur)return;
 if(i>cur){for(let k=Math.max(0,cur);k<i;k++)spans[k].classList.add('read');}
 else{for(let k=i;k<=cur&&k<spans.length;k++)spans[k].classList.remove('read');}
 if(cur>=0)spans[cur].classList.remove('active');
 cur=i;
 if(i>=0){spans[i].classList.remove('read');spans[i].classList.add('active');
  const now=performance.now();           // throttle smooth-scroll so it doesn't fight itself
  if(now-lastScroll>200){lastScroll=now;
   spans[i].scrollIntoView({block:'center',behavior:'smooth'});}}}

// --- Rank 3: 60/120Hz render loop, decoupled from the ~4Hz timeupdate event.
function loop(){paint(find(playheadMs()+LEAD));requestAnimationFrame(loop);}
requestAnimationFrame(loop);

// speed buttons only (scoped to [data-r] so this does NOT clobber the lead buttons)
document.querySelectorAll('.spd button[data-r]').forEach(b=>b.onclick=()=>{
 a.playbackRate=parseFloat(b.dataset.r); a.preservesPitch=true;
 document.querySelectorAll('.spd button[data-r]').forEach(x=>x.classList.toggle('on',x===b))});
</script></body></html>"""


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: add_words.py <base>.json")
    jpath = sys.argv[1]
    data = json.load(open(jpath, encoding="utf-8"))
    sentences = data["sentences"]
    words = build_words(sentences)

    base = os.path.splitext(jpath)[0]
    title = os.path.basename(base)
    audio = data.get("audio", title + ".opus")

    payload = json.dumps([{"s": w["s"], "e": w["e"], "t": w["t"]} for w in words],
                         ensure_ascii=False)
    html = (PLAYER.replace("__TITLE__", title)
                  .replace("__AUDIO__", audio)
                  .replace("__DATA__", payload))
    out = base + "-words.html"
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)

    # also write the augmented map (non-destructive: new file)
    data["words"] = words
    with open(base + "-words.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

    print("WROTE %s  (%d words across %d sentences)"
          % (out, len(words), len(sentences)))


if __name__ == "__main__":
    main()
