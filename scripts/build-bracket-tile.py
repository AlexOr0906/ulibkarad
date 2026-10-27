"""Wrap the existing product photograph in a seamless SVG crop, without resampling."""
from pathlib import Path
import base64

root = Path(__file__).resolve().parents[1]
source = root / 'public/orthodontics/wire-brackets-v1.png'
embedded = base64.b64encode(source.read_bytes()).decode('ascii')
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="254" height="240" viewBox="0 0 254 240">
<title>Repeating silver orthodontic bracket and straight wire, without teeth</title>
<image x="-150" y="-244" width="2073" height="758" href="data:image/png;base64,{embedded}" />
</svg>'''
(root / 'public/orthodontics/bracket-repeat-v1.svg').write_text(svg, encoding='utf-8')
print('Created a code-native 254 x 240 crop wrapper around the unchanged photographic asset.')
