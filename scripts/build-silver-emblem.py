"""Give the existing family vector a polished silver material; preserve its path."""
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import quoteattr

root = Path(__file__).resolve().parents[1]
source = ET.parse(root / 'public/brand/logo-graphite.svg').getroot()
path = source.find('{http://www.w3.org/2000/svg}path')
assert path is not None
shape = quoteattr(path.attrib['d'])
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 921 960">
<title>Семейный знак — полированное серебро</title>
<defs>
  <path id="family" fill-rule="evenodd" d={shape}/>
  <linearGradient id="silver" x1="0" y1="0" x2=".85" y2="1">
    <stop stop-color="#f6f8fa"/><stop offset=".13" stop-color="#adb6bf"/>
    <stop offset=".27" stop-color="#535f6a"/><stop offset=".34" stop-color="#d8e0e6"/>
    <stop offset=".41" stop-color="#ffffff"/><stop offset=".49" stop-color="#9ba6b1"/>
    <stop offset=".56" stop-color="#414e5a"/><stop offset=".64" stop-color="#b9c3cc"/>
    <stop offset=".76" stop-color="#f8fbfd"/><stop offset=".86" stop-color="#c4cdd5"/>
    <stop offset="1" stop-color="#606d79"/>
  </linearGradient>
  <filter id="bevel" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="surface"/>
    <feSpecularLighting in="surface" surfaceScale="8" specularConstant=".8" specularExponent="24" lighting-color="#ffffff" result="reflection">
      <feDistantLight azimuth="225" elevation="42"/>
    </feSpecularLighting>
    <feComposite in="reflection" in2="SourceAlpha" operator="in" result="edgeLight"/>
    <feBlend in="SourceGraphic" in2="edgeLight" mode="screen"/>
  </filter>
</defs>
<use href="#family" fill="#414c56" transform="translate(2 3)"/>
<use href="#family" fill="url(#silver)" stroke="#e0e7ed" stroke-width=".6" stroke-opacity=".55" filter="url(#bevel)"/>
</svg>'''
(root / 'public/brand/logo-chrome.svg').write_text(svg, encoding='utf-8')
print('Created polished silver material using the unchanged family vector.')
