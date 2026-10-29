# Объединённый локальный preview

## Источники

- Общая согласованная база: `87d3e5514c826d368d5720d7f2c42415cee59afb`.
- Общий layout/«Пациентам»: `e3a0f0a053bd7c4655323eda40b0163f38823719`.
- About A: `7fc4ee7499e5baa8c616bd22cb1a1fe46df9cefa`, проверен fetch и перенесён cherry-pick в `af568b3`.
- Интеграционная ветка: `feature/internal-pages-integration`. Main не объединялся, workflow/Pages не запускались.

## Локальные маршруты

- http://localhost:4210/site-preview/ — главная с общей навигацией этой цепочки.
- http://localhost:4210/site-preview/about/ — автономный About внутри InternalPageLayout.
- http://localhost:4210/site-preview/patients/ — «Пациентам» в том же layout.

Все ссылки шапки/футера, breadcrumb, CTA к врачам и контактам используют эту семью маршрутов и BASE_URL. Исходные `/`, `/orthofamily-combined/`, `/about-clinic-preview/`, `/patients-preview/` сохранены. Это локальный сервер, не публичный сайт.

Новая копия композиции главной находится только в `src/pages/site-preview/index.astro`: те же Intro, Directions, Doctors, Contacts, Header/Footer. Различается навигация к внутренним страницам. Исходники вступления/анимации, данные и стили сцены, корневая главная и combined не изменялись.

## Lifecycle и сохранённая композиция About

`AboutPageContent` получил один необязательный prop `autoMotion` (default true). Для integrated route он false. Компонент не запускает второй initializer: общий `initInternalPage(root)` вызывает `initAboutMotion` только на About, у которого отключён auto-start.

`internal-lifecycle.ts` идемпотентен через WeakMap и владеет общим cleanup. При обычном уходе (`pagehide.persisted === false`) отключаются About observer/listeners/rAF и общий motion. Для bfcache очистки нет: страницы сохраняют свой экземпляр и native scroll/focus, существующий About pageshow завершает видимые эффекты; повторного module-init нет. Нативная MPA-навигация сохраняется, ClientRouter и ручное history.scrollRestoration не добавлялись.

`InternalPageLayout.contentOwnsHeaderOffset` позволяет About сохранять собственный padding-top из A. При true layout не добавляет второй header offset. Это адаптер композиции, About CSS/тайминги не переписываются. `homeHref` задаёт корень конкретной preview-семьи; `footerNavigation` остаётся относительной к нему.

В layout дополнительно передаётся `activeHref` (default текущий pathname). Header/Footer получили необязательный prop того же имени: SSR `aria-current="page"`, видимое подчёркивание и корректный активный пункт даже без JS. При отсутствии prop старые использования Header/Footer работают без изменения состояния. На главной текущей страницей отмечается ссылка-эмблема, на About/«Пациентам» — соответствующий пункт навигации.

Для CSS view transitions зарегистрированы только About и «Пациентам» в `transitionHrefs`. Главная остаётся вне этого opt-in. Переход к ней обычный, без задержки и изменения утверждённой сцены. Back/forward и anchors остаются нативными. Reduced-motion/no-JS отключают межстраничную анимацию, содержание доступно.

## Файлы интеграции

- `src/pages/site-preview/{index,about,patients}.astro`, `src/data/site-preview-navigation.ts` — цепочка и единая карта навигации.
- `src/layouts/InternalPageLayout.astro`, `src/components/internal-pages/internal-lifecycle.ts`, `internal-motion.ts`, `src/styles/internal-pages.css` — параметры offset/home/active и единый владелец lifecycle.
- `src/components/about-clinic/AboutPageContent.astro`, `README.md` — переключатель autoMotion и контракт. `about-motion.ts`, `AboutMedia`, `AboutReveal`, данные и CSS совпадают с переданным A-коммитом.
- `src/components/header-navigation/ClinicHeader.astro`, `src/components/contacts-footer/ClinicFooter.astro`, их локальные CSS — только optional activeHref/aria-current/подчёркивание. Их JS не менялся.
- `scripts/verify-site-preview.mjs` — сквозная проверка семейства страниц.
- `scripts/verify-site-preview-bfcache.mjs` — отдельная проверка настоящего BFCache, а не повторной загрузки документа.

Позднее назначение публичных адресов/подключение к корню и публикация требуют отдельного задания. Страницы услуг не добавлены. Демоматериалы About и «Пациентам» сохранены, реальное фото/документы/данные не выдумывались.

## Проверки

- `astro check`: 65 файлов, 0 ошибок/предупреждений/подсказок. Production build: 14 статических страниц.
- `verify-site-preview.mjs`: 1440×1000,1024×768,768×1024,390×844,320×568; reduced-motion390/1440; no-JS390. Во всех восьми сценариях цепочка главная → About → Пациентам → назад/вперёд → контакты главной работает.
- Проверены один main/h1/header/footer, разные title/description, активный пункт шапки/мобильного меню/футера через SSR, Escape/возврат фокуса, skip-link, локальные якоря, восстановление scrollY и hash при history/reload, отсутствие скрытого фокуса и переполнения.
- Сохранена реальная промежуточная фаза About `playing`, а не только финальный кадр. MutationObserver фиксирует одну установку acReady на документ; после back/forward второй запуск не возникает. В integrated About нет атрибута auto-start, собственный module initializer не выбирает этот root. Нативный переход About → Пациентам подтверждён событием pagereveal, reduced/no-JS используют обычную навигацию.
- Сравнение standalone `/about-clinic-preview/` и integrated About на 1440/390 px: совпадают breadcrumb top, высота hero, rect заголовка и медиа. Геометрия и состояние ready побайтно равны в JSON.
- Отдельно прошёл существующий `verify-header-navigation.mjs`: desktop/tablet/phone/320px, длинное меню, resize, focus/Escape, reduced/no-JS. Новые параметры optional и не ломают старое использование.
- Реальный BFCache дополнительно проверен на 1440/390 px: совпадает случайный токен JS-документа до/после ухода, pageshow даёт `[false,true]`, установка acReady одна, scrollY восстановлен. В этом тесте снят только стандартный флаг Playwright `--disable-back-forward-cache`, чтобы вернуть обычное поведение Chrome. Сам сайт историю/scrollRestoration не перехватывает.
- Основной сервер4210 из Scroll Craft отдаёт `Cache-Control: no-store` и исключает BFCache. Поэтому дополнительная проверка использует штатный Astro preview: `node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1 --port 4211`, затем `node scripts/verify-site-preview-bfcache.mjs`. Для восстановленного документа ожидается pageshow, не новый load. JSON-доказательство — `outputs/site-preview/bfcache.json`.
- Метаданные трёх готовых HTML отдельно сверены: разные title и description, бренд в title ровно один раз. После reload тест ждёт фактического восстановления scrollY/готовности шрифтов, а не произвольные700мс; это устраняет ложный таймаут no-JS smooth-scroll.
- Исходники сцены главной, её анимация/стили, корневая главная и combined совпадают с `e3a0f0a`; About motion/media/reveal/CSS/data совпадают с A `7fc4ee7`. Ни зависимости, ни lockfile, ни workflow не менялись.
- Кадры/JSON: `outputs/site-preview/`, `outputs/header-navigation/` (в Git не включаются). Видео нет. Проверен установленный Chrome с эмуляцией viewport, не физические iPhone/Android/Safari.
