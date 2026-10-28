# Temporary demo portraits

Four original anonymous adult portraits were generated on 28 October 2026 with the built-in ImageGen tool under the owner's explicit permission to use temporary fake photos. They are AI-generated demonstration images, not photos of clinic employees, and their number is not the clinic headcount. No real doctor's face, identity, name or biography was used as a reference. No external paid API was used. The previous faceless SVG studies remain available as a reversible fallback.

The exact final prompt set is `portrait-prompts.json`. Shared direction: pale silver-gray studio background, soft light, natural skin, gray logo-free medical tunic, centered chest/waist crop and headroom. Subjects: woman around 35 with dark shoulder-length hair; man around 43 with dark short hair; woman around 48 with light brown bob; man around 31 with sandy-blond hair. These are visual generation specifications, not staff ages or credentials.

Website files: `portrait-demo-{1..4}-480.webp` and `portrait-demo-{1..4}-800.webp`. Originals are preserved inside the workspace at `work/ai-portrait-originals/portrait-demo-{1..4}.png` and at the built-in generated-image destination. They were only downsampled/encoded, with no retouch or face changes, using `scripts/prepare-demo-portraits.py`. Each website file is 16–47 KB, 480×600 or 800×1000. Source files are not fetched by the website.

## Replace with approved real team

1. Add approved portrait files inside `public/team/`, ideally 4:5 with headroom and consistent background/light. Generate appropriate 480/800px versions.
2. In `src/data/doctors.ts`, populate `clinicDoctors` with verified `name`, `specialty`, `summary` and `portrait` (`src`, `srcSet`, `alt`, `position`, `width`, `height`). Image paths are relative to `public/`; `srcSet` uses the same convention. Keep `profileHref: null` unless that profile page actually exists.
3. The filled `clinicDoctors` array replaces `doctorCardExamples`. The examples remain separate: never copy their AI paths into the real staff list or treat four layouts as four employees.
4. Confirm crop in `DoctorCard.astro` and `DoctorCollection.astro` on phone and desktop. Current top-aligned cards preserve hair and faces; dialogs contain the whole portrait. Approved real content switches to the real-data caption and alt, rather than the demo note.

Until then the collection visibly states: «Демонстрационные изображения. Не являются фотографиями сотрудников клиники». The selected modal repeats that the AI portrait is temporary. Names, specialties and summaries remain neutral placeholders. No fake professional biography or profile page was created.

## Доработка блока команды — 28.10.2026

Ветка `feature/doctors-section`. Точка входа главной уже существует: `<Doctors generalClinic={true} showDivider={false} />` в `DemoPage.astro`; дополнительно менять страницу не нужно. `DoctorCollection.astro` сам импортирует `src/styles/doctors-section.css`. Новые правила ограничены `.doctors-section` и `.doctors-profile`; глобальные CSS, hero, эмблема, услуги и архивные страницы не редактировались.

Карточки используют единый формат 4:5. `portrait.position` задаёт положение лица и переносится в диалог; диалог показывает полный портрет через `object-fit: contain`. Сохранены оригинальные AI-файлы и структура `src/data/doctors.ts`: временные карточки — `doctorCardExamples`, реальные подтверждённые профили — `clinicDoctors`. Не заполняйте реальные профили демонстрационными AI-портретами. Число примеров не является численностью команды.

Нужны: согласованные реальные фотографии с разрешением на использование, ФИО, специальности и короткое представление каждого врача. Стаж, образование и квалификации добавляются только после подтверждения клиникой. Новые страницы и настоящая запись не создавались.

Взаимодействия: стрелки, нативная горизонтальная прокрутка и клавиши Left/Right/Home/End при фокусе на коллекции. Вся демонстрационная карточка открывает нативный dialog. Escape, обе кнопки закрытия и щелчок по подложке закрывают его; фокус возвращается на кнопку выбранной карточки. Tab остаётся внутри диалога. Текст доступен сразу, без ожидания декодирования изображения или View Transition. Раскрытие — короткое появление 220 мс, при reduced motion отключается вместе с hover и плавным листанием. Без JS остаются изображения и подписи, управление скрыто существующим fallback.

### Проверки этой ветки

- `astro check`: 30 файлов, 0 ошибок / предупреждений / hints.
- Production `astro build`: успешно, 4 страницы. Выполнены команды, соответствующие `npm run check` и `npm run build`, через локальный Astro CLI; npm отсутствовал в PATH. Зависимости установлены `npm ci` строго из существующего lock-файла; зависимости и lock не изменялись.
- Браузер, production preview: desktop 1440 px, мобильные 390 и 320 px; дополнительно измерено переполнение на 768 px. Горизонтального переполнения документа нет.
- Все четыре диалога проверены на desktop и 390 px: правильный портрет, целое лицо, подписи демо, закрытие кнопками и Escape. Проверены Tab/Shift+Tab и возврат фокуса; Home/End и кнопки листания, отключение следующей стрелки в конце коллекции.
- Reduced motion и no-JS проверены по реализации; отдельная браузерная эмуляция этих режимов не выполнялась. Физический touch-свайп, Safari и физический телефон остаются для проверки основным разработчиком.
- Локальные скриншоты: `outputs/doctors/desktop.jpg`, `mobile.jpg`, `mobile-profile.jpg` (папка outputs игнорируется Git).

Референсы просмотрены в браузере: https://insmile.ru/ и https://insmile.ru/team. Наблюдались крупные студийные портреты, отдельная типографика специальности/имени, ссылки на страницы врачей и стрелки коллекции на главной. Видео в этой среде выдаёт ошибку воспроизведения; специфическое видео/hover-поведение не заимствовано и не заявляется как проверенное. Фотографии референса не скачивались.

Для основного разработчика: вне блока сохранилось старое название «Дело в улыбке» в header/hero/meta/footer. Его замена на «Ортофэмили» относится к общей задаче брендинга. Локальные стили перекрывают прежние шторки портретов, чтобы содержимое команды не ожидало общей анимации. Общих изменений для этой интеграции не требуется.
