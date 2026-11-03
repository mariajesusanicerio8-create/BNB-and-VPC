"""Builds ../index.html from style.css and js/*.js (files are joined in name order).
Run from this folder:  python3 build.py"""
import glob, os
here = os.path.dirname(os.path.abspath(__file__))
css = open(os.path.join(here, 'style.css'), encoding='utf-8').read()
js = "\n".join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(here, 'js', '*.js'))))
assert '</script' not in js.lower()
html = ('<title>Iontech Sales Workspace</title>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap">\n'
        '<style>' + css + '</style>\n<div id="app"></div>\n<script>\n(function(){\n' + js + '\n})();\n</script>\n')
out = os.path.join(here, '..', 'index.html')
open(out, 'w', encoding='utf-8').write(html)
print('Wrote', os.path.normpath(out), len(html) // 1024, 'KB')
