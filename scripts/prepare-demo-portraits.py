"""Encode approved demo ImageGen originals as responsive WebP, without retouching."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
originals = root / 'work/ai-portrait-originals'
destination = root / 'public/team'
for index in range(1, 5):
    source = originals / f'portrait-demo-{index}.png'
    image = Image.open(source).convert('RGB')
    for width in (480, 800):
        resized = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
        path = destination / f'portrait-demo-{index}-{width}.webp'
        resized.save(path, 'WEBP', quality=86, method=6)
        print(f'{path.name}: {resized.size}, {path.stat().st_size} bytes')
