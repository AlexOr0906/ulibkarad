# Исправление закрепления ортопедии

Проверенный код: `6d942e6b135e8808097f0c77fb589d748c955415`, feature/fix-orthopedics-sticky. В main отправлен как исправление опубликованной регрессии.

Источник ошибки — padding-bottom вместо реальной области нормального потока. Теперь aria-hidden spacer удерживает figure position:sticky до завершения диапазона, без перехвата wheel/touch. Геометрия улыбки и ожидание готовности изображения сохранены.

`scripts/verify-restored-portrait.mjs` проверяет не только crop/scale, но и top панели относительно computed sticky top в 0/.5/1/.5/0. 320/390/768/1440 × normal/reduced/no-JS, все 12 случаев прошли (results.json). До: progress=.5, top=-94.91 вместо 85 (390) и -200.53 вместо 109 (1440). После: top=85/109 в середине и на .8. Нет переполнения/ошибок страницы. Check — 104 файла, 0 ошибок/предупреждений/hints, build прошёл.

Подробности: ORTHOPEDICS-STICKY-FIX.md и WORK-REPORT.md в кодовой ветке. Диагностические кадры остаются локально в work/verification/restored-portrait. Проверка — Chrome с эмуляцией, не физический телефон/Safari.

```sh
git fetch origin feature/fix-orthopedics-sticky qa/orthopedics-sticky
git show origin/qa/orthopedics-sticky:qa/orthopedics-sticky/results.json
```
