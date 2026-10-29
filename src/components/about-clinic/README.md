# Страница «О клинике»: автономный контент

29.10.2026. База **87d3e5514c826d368d5720d7f2c42415cee59afb**, отдельная ветка `feature/about-clinic`. Подготовительный контракт **b5ae25c528f95e9e0ca27a6da005e5ed6baae725** передан push в эту ветку до реализации About. Общий шаблон и межстраничный motion принадлежат второму аккаунту; здесь они не создавались.

## Подключение после доставки общего layout

```astro
---
import InternalLayout from '@/layouts/InternalPageLayout.astro';
import AboutPageContent from '@/components/about-clinic/AboutPageContent.astro';
const base = import.meta.env.BASE_URL;
---
<InternalLayout title="О клинике" description="Стоматология для всей семьи. Знакомство с OrthoFamily." contentOwnsHeaderOffset>
  <AboutPageContent homeHref={base} doctorsHref={`${base}#doctors`} contactHref={`${base}#contacts`} autoMotion={false} />
</InternalLayout>
```

Layout подключён в интеграционной ветке `feature/internal-pages-integration`: `/site-preview/about/`. Общая цепочка начинается с `/site-preview/`, «Пациентам» — `/site-preview/patients/`. Это изолированные маршруты, не публикация. Навигация цепочки задаётся `src/data/site-preview-navigation.ts`; реальная сборка About — `src/pages/site-preview/about.astro`. About содержит article/h1, не второй main. Его `.ac-shell` уже задаёт поля; не сжимать slot дополнительным контейнером. `contentOwnsHeaderOffset` сохраняет исходный верхний отступ About без двойного отступа layout.

`initAboutMotion(root: HTMLElement): () => void` — локальный идемпотентный initializer/cleanup. `autoMotion` по умолчанию true: самостоятельный About preview запускает локальный эффект как раньше. В общем layout передавать **autoMotion={false}**: единственным владельцем становится `initInternalPage` из `internal-lifecycle.ts`. Он вызывает локальный initializer один раз и его cleanup при pagehide без bfcache; при bfcache оставляет обработчики для собственного pageshow About. ClientRouter не используется, поэтому замены DOM и повторного module-script нет. `about-motion.ts`, композиция, данные, media и тайминги сохранены из A-коммита. Не регистрировать второй initializer.

## Все передаваемые файлы

- `INTERNAL-PAGES-HANDOFF.md` — контракт и подтверждённый подготовительный hash.
- `src/components/about-clinic/AboutPageContent.astro` — автономная семантическая страница.
- `src/components/about-clinic/AboutReveal.astro` — обёртка локального reveal.
- `src/components/about-clinic/AboutMedia.astro` — реальное фото или честно обозначенное место для него.
- `src/components/about-clinic/about-motion.ts` — только локальная однократная анимация.
- `src/components/about-clinic/ABOUT-PLAN.md` — план композиции/движения до реализации.
- Этот README — встраивание, состояние и проверки.
- `src/data/about-clinic.ts` — отдельно заменяемый текст/сведения/фото.
- `src/styles/about-clinic.css` — только префикс `ac-*`; общие стили не изменены.
- `src/pages/about-clinic-preview.astro` — preview-композиция существующих Shell/Header/Footer, не новый общий layout.
- `scripts/verify-about-clinic.mjs` — воспроизводимая проверка.

Не передавать отдельно CSS вместо этих файлов и полной базы репозитория. Конечный About commit берётся после подготовительного b5ae25c. Если общий шаблон уже разрабатывается в другой ветке, сначала сохранить её, получить feature/about-clinic и переносить названные коммиты осознанно. Не merge main, не reset и не force push.

## Контент и изображения

Все предлагаемые тексты помечены как концепция/ожидающие подтверждения. Факты ограничены существующей базой: OrthoFamily, семейная стоматология, Магнитогорск. Направления и реальная помощь отдельно требуют подтверждения. Нет придуманных достижений, оснащения, квалификаций или гарантий.

Настоящее фото клиники **не получено**. Вместо него спокойная поверхность с предоставленным семейным знаком `public/brand/logo-chrome.svg`, явными надписями и подписью; это не фотография интерьера. ImageGen/платные API не использовались. Для фото заполнить `aboutClinic.photo.src` (путь относительно public), точный `alt`, `caption`, `position`; получить исходник/разрешение, проверить кадрирование. Остальные тексты заменяются в том же data-файле. Медицинских материалов для этого явно обозначенного прототипа не ожидали.

## Проверки и preview

- Node24, `npm run build`:54 проверенных файла,0 ошибок/предупреждений/подсказок,9 статических маршрутов.
- `node scripts/verify-about-clinic.mjs`:1440×1000,1024×768,768×1024,390×844,320×568,844×390 normal;390×844 reduced и no-JS. Все8 прошли. Проверены один h1/main/header/footer, геометрия/переполнение, keyboard/меню/Escape, верхний отступ, быстрые якоря/обратный scroll, reload в середине и hash back/forward, доступность ссылок к врачам/контактам.
- Отдельно проверена реальная промежуточная фаза reveal на1440/390px: `playing`, меняющаяся transform, анимации завершаются `complete`. Изображение раскрывается умеренно; наблюдается нескрытый wrapper, поэтому clip не блокирует IntersectionObserver.
- Контент без JS сразу виден, reduced не запускает декоративное движение. Focus/быстрый якорь завершают нужную анимацию; обратный scroll не проигрывает её заново.
- Просмотрены реальные PNG desktop/mobile, графитовый блок и место фото. Кадры/JSON в `work/verification/about-clinic/` (игнорируются Git, передаются отдельно).
- Общие компоненты/стили/layout/главная/команда и deploy workflow побайтно совпадают с базой87d3e55. Утверждённый элайнер не трогали.

Проверенный локальный адрес: **http://localhost:4184/about-clinic-preview/**. Python-сервер14044 привязан к127.0.0.1 и обслуживает dist этой рабочей копии; это не URL для клиента из интернета и не сервер другого аккаунта. Для своей копии: `npm ci`, `npm run build`, затем `npm run dev -- --host 127.0.0.1 --port 4184` и тот же route.

Ограничения: физические iPhone/Safari/Android не проверены; реальное фото и медицинское наполнение ещё не получены. Head/title/description пока общие демо от существующей оболочки, конечные metadata подключает владелец общего layout. Новых production routes/межстраничных переходов/CMS/backend нет. Видео не записывалось. Публикация main/Pages не выполнялась; разрешён только обмен feature-веткой.
