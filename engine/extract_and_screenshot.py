import sys
import os
import subprocess
from html.parser import HTMLParser

class TNParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.div_depth = 0
        self.tn_depth = -1
        self.tns = []
        self.current_tn = ""

    def handle_starttag(self, tag, attrs):
        if tag == "div":
            self.div_depth += 1
            if self.tn_depth == -1:
                for k, v in attrs:
                    if k == "class" and v and "tn" in v:
                        self.tn_depth = self.div_depth
                        self.current_tn = ""
        
        if self.tn_depth != -1:
            attr_str = " ".join(f'{k}="{v}"' if v else k for k,v in attrs)
            self.current_tn += f"<{tag} {attr_str}>" if attr_str else f"<{tag}>"

    def handle_data(self, data):
        if self.tn_depth != -1:
            self.current_tn += data

    def handle_entityref(self, name):
        if self.tn_depth != -1:
            self.current_tn += f"&{name};"

    def handle_charref(self, name):
        if self.tn_depth != -1:
            self.current_tn += f"&#{name};"

    def handle_endtag(self, tag):
        if self.tn_depth != -1:
            self.current_tn += f"</{tag}>"
        
        if tag == "div":
            if self.div_depth == self.tn_depth:
                self.tns.append(self.current_tn)
                self.tn_depth = -1
            self.div_depth -= 1

def process_file(html_file, prefix):
    with open(html_file) as f:
        html = f.read()
    
    # get the head
    head = html.split("</head>")[0] + "</head>"
    # replace body style to remove padding
    head = head.replace("padding:54px 54px 90px", "padding:0; margin:0; overflow:hidden;")
    
    parser = TNParser()
    parser.feed(html)
    
    for i, tn_html in enumerate(parser.tns):
        temp_file = f"temp_{prefix}_{i}.html"
        with open(temp_file, "w") as f:
            f.write(f"{head}\n<body>\n{tn_html}\n</body>\n</html>")
        
        out_png = f"{prefix}-{i+1}.png"
        print(f"Capturing {out_png}...")
        subprocess.run([
            "chromium", "--headless",
            f"--screenshot={os.path.abspath(out_png)}",
            "--window-size=1920,1080",
            f"file://{os.path.abspath(temp_file)}"
        ], check=True)
        os.remove(temp_file)
        
process_file("bookends.html", "bookends")
process_file("memory-card.html", "memory-card")
