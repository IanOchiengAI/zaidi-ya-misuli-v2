import urllib.request
import re

url = "https://zaidiyamisuli.org/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    
    # Check for inline styles or any mentions of font-size
    sizes = re.findall(r'font-size:\s*([^;>]+)', html)
    from collections import Counter
    if sizes:
        print("Most common inline font sizes:", Counter(sizes).most_common(5))
        
    css_links = re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', html)
    for link in css_links:
        if not link.startswith('http'):
            link = "https://zaidiyamisuli.org/" + link.lstrip('/')
        print("Checking CSS:", link)
        try:
            css = urllib.request.urlopen(urllib.request.Request(link, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8', errors='ignore')
            body_sizes = re.findall(r'body\s*{[^}]*font-size:\s*([^;]+);', css)
            html_sizes = re.findall(r'html\s*{[^}]*font-size:\s*([^;]+);', css)
            root_sizes = re.findall(r':root\s*{[^}]*--[\w-]+font-size[^:]*:\s*([^;]+);', css)
            
            if body_sizes: print("Body sizes in", link, ":", body_sizes)
            if html_sizes: print("Html sizes in", link, ":", html_sizes)
            if root_sizes: print("Root sizes in", link, ":", root_sizes)
        except Exception as e:
            pass
            
except Exception as e:
    print("Error:", e)
