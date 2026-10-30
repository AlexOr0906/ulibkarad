# Возврат прежнего раскрытия ортопедии

Текущий код — вершина `feature/site-review-polish`; точный SHA передан в commit.json рядом. Это продолжение 72c72b1 после выбора пользователя: прежняя геометрия апертуры восстановлена на desktop/mobile, загрузка и оптимизированный WebP сохранены. А/Б не подключены на основной маршрут.

Полный накопительный отчёт — [WORK-REPORT.md](../../WORK-REPORT.md): семь страниц, поиск/карта/чтение, типы прайса и профессиональных сведений, последние визуальные правки, карта Магнитогорска, производительность, проверки и открытые материалы до запуска. Подробности предыдущего прохода и его кадры сохранены отдельно в qa/site-review-polish с проверенным SHA 72c72b1; это не снимки нового выбора.

## Проверка после возврата

[results.json](results.json): 320/390/768/1440 × normal/reduced/no-JS, все 12 случаев прошли. Скрипт `scripts/verify-restored-portrait.mjs` дополнительно вычисляет ожидаемую геометрию по исходной формуле 17cda01 и сравнивает с фактической при progress=0; проверяет scale=1.35 и ход 0/.5/1/.5/0. Нет ошибок страницы и горизонтального переполнения. При reduced motion показывается полный портрет, без JS — статичная фотография.

Astro check: 104 файла, 0 ошибок/предупреждений/hints. Production build прошёл, git diff --check чистый. Диагностические кадры — локально в work/verification/restored-portrait, не в коде сайта.

Физический телефон/Safari и клиническая точность не проверялись. Другие ограничения и материалы до запуска описаны в WORK-REPORT.md и CONTENT-REPLACEMENT.md. Main и Pages этим push не обновлены.

```sh
git fetch origin feature/site-review-polish qa/portrait-restored
git show origin/feature/site-review-polish:WORK-REPORT.md
git show origin/qa/portrait-restored:qa/portrait-restored/results.json
```

Локальный preview этой рабочей копии: http://localhost:4186/orthopedics/. На другом компьютере нужно получить код, собрать и запустить собственный preview.
