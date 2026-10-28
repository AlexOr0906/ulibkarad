"""Exact Euclidean distance field from an alpha render of the original vector.
No smoothing, tracing or invented logo geometry. 2048px field, quarter-pixel steps.
"""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
mask = np.asarray(Image.open(root / 'work/family-mask.png').getchannel('A')) > 127

def line_distance(f):
    n = len(f)
    v = [0] * n
    z = [0.] * (n + 1)
    d = [0.] * n
    z[0], z[1], k = -1e30, 1e30, 0
    for q in range(1, n):
        p = v[k]
        s = ((f[q] + q*q) - (f[p] + p*p)) / (2*q - 2*p)
        while s <= z[k]:
            k -= 1
            p = v[k]
            s = ((f[q] + q*q) - (f[p] + p*p)) / (2*q - 2*p)
        k += 1
        v[k], z[k], z[k+1] = q, s, 1e30
    k = 0
    for q in range(n):
        while z[k+1] < q:
            k += 1
        d[q] = (q-v[k])**2 + f[v[k]]
    return d

def distance(seed):
    field = np.where(seed, 0., 1e9)
    for y in range(field.shape[0]):
        field[y,:] = line_distance(field[y,:].tolist())
    for x in range(field.shape[1]):
        field[:,x] = line_distance(field[:,x].tolist())
    return np.sqrt(field)

signed = np.where(mask, -(distance(~mask)-.5), distance(mask)-.5)
encoded = np.rint(np.clip((signed+64)/128,0,1)*255).astype(np.uint8)
target = root / 'public/brand/family-distance.png'
Image.fromarray(encoded).save(target,optimize=True)
print(f'Created {target.name}: {target.stat().st_size} bytes, unchanged source alpha, {mask.shape[0]}px distance')
