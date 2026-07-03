import os
import re
import subprocess

def capture_html(html_file, prefix):
    with open(html_file) as f:
        html = f.read()

    # Split by <div class="tn">
    parts = html.split('<div class="tn">')
    header = parts[0]
    
    # We want to replace body padding
    header = header.replace('padding:54px 54px 90px', 'padding:0; margin:0; overflow:hidden')
    
    for i in range(1, len(parts)):
        # find where this div ends. Since there are nested divs, we might just split by "  <div class="seclbl">"
        # Actually, looking at bookends.html, each block ends right before the next seclbl or body end.
        pass

