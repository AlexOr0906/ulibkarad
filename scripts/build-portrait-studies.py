"""Native faceless graphic placeholders; not photos or representations of staff."""
from pathlib import Path
root = Path(__file__).resolve().parents[1] / 'public/team'
root.mkdir(exist_ok=True)
for n, (shift, tilt) in enumerate([(-10, -2), (12, 2), (-4, 1), (6, -1)], 1):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720">
<title>Нейтральный силуэт. Графический макет портрета, не сотрудник клиники.</title>
<defs>
<linearGradient id="back" x2="1" y2="1"><stop stop-color="#f7f8f9"/><stop offset="1" stop-color="#e5e9ec"/></linearGradient>
<linearGradient id="form" x2=".9" y2=".4"><stop stop-color="#8e9aa5"/><stop offset=".45" stop-color="#c0c9d0"/><stop offset="1" stop-color="#9ca8b2"/></linearGradient>
<linearGradient id="face" x1=".15" y1=".2" x2=".9" y2=".8"><stop stop-color="#e0e5e9"/><stop offset=".6" stop-color="#b2bdc6"/><stop offset="1" stop-color="#8d9aa5"/></linearGradient>
</defs>
<path fill="url(#back)" d="M0 0h600v720H0z"/>
<g transform="translate({shift} 0) rotate({tilt} 300 400)">
<path fill="#d9dfe4" opacity=".55" d="M70 720c7-153 31-228 109-264l66-28h112l65 28c82 39 104 117 111 264z"/>
<path fill="url(#form)" d="M83 720c8-138 30-215 104-250l73-31h82l73 31c78 39 99 117 103 250z"/>
<path fill="#a5b1ba" d="M258 351h86l12 103c-22 31-87 31-110 0z"/>
<path fill="url(#face)" d="M300 132c-63 0-95 45-93 113l8 57c5 38 27 85 56 105 17 13 42 13 59 0 30-20 51-67 56-105l8-57c2-68-30-113-94-113z"/>
<path fill="#f2f5f7" opacity=".45" d="M260 444c25 28 56 28 82 0l16 21-58 58-57-58z"/>
<path fill="none" stroke="#e0e5e9" stroke-width="2" opacity=".6" d="M243 465l57 58 58-58M300 523v197"/>
<path fill="none" stroke="#7c8a96" stroke-width="2" opacity=".2" d="M176 519l-28 201M424 519l28 201"/>
</g></svg>'''
    (root / f'portrait-study-{n}.svg').write_text(svg, encoding='utf-8')
print('Created four explicitly illustrative, faceless portrait studies. No real or fictional employee data.')
