# Контракт внутренних страниц OrthoFamily

29.10.2026. Точная база: **`87d3e5514c826d368d5720d7f2c42415cee59afb`** (согласованная главная и новое написание бренда). На момент подготовки `github/main` и `github/feature/orthofamily-home` указывают на эту версию. Прямое новое задание разрешает внутренние страницы; утверждённую главную не переделывать. Имя **OrthoFamily**, подпись **«Стоматология для всей семьи»**.

## Владение

- A, `feature/about-clinic`: только этот контракт, `src/components/about-clinic/**`, `src/data/about-clinic.ts`, `src/styles/about-clinic.css`, `src/pages/about-clinic-preview.astro`, локальная проверка/отчёт About. Контентный компонент **`AboutPageContent.astro`** автономен.
- Второй аккаунт: общий шаблон внутренних страниц, общие layout/motion/router-файлы и «Пациентам». A их не создаёт и не редактирует. Публичный `/about/` пока не назначен; его и конечную навигацию подключает владелец общего шаблона после интеграции.
- Общие шапка/футер, layout, главная, команды, контакты, их CSS/JS и workflow остаются исходными. Никакого параллельного изменения межстраничных переходов.

## Что уже есть в базе

| Назначение | Точный путь / контракт |
| --- | --- |
| Существующая оболочка | `src/components/orthofamily/OrthofamilyShell.astro`: html/head/body, `<main id="of-main">`, skip-link, default slot для содержимого; named slots **header** и **closing**. Пока нет props для title/description, head остаётся общим демо. Не изменять её ради About; будущие метаданные — задача общего layout |
| Шапка | `src/components/header-navigation/ClinicHeader.astro`, стили `src/styles/header-navigation.css`, локальный initializer в той же папке. Props `homeHref`, `contactHref`, `links`; cross-page href строить через BASE_URL, не выдавать отсутствующий локальный hash за ссылку на другую страницу |
| Высота шапки | `src/components/orthofamily/IntegratedHeaderMetrics.astro`, измеряет закрытую `.hn-bar`, передаёт `--of-header-height`/`--site-header-height`. На preview вызвать один раз. Не копировать обработчики меню |
| Футер | `src/components/contacts-footer/ClinicFooter.astro`, `src/styles/contacts-footer.css`. Props `homeHref`, `topHref`, `navigation`; href навигации соединяется с `homeHref`, поэтому передавать относительные пути/хеши. Данные/документы пока демо, не заполнять вымышленным |
| Базовые стили | `src/styles/global.css`, `src/styles/clinic-motion.css`, `src/styles/orthofamily.css`, `src/styles/orthofamily-integration.css`. About импортирует нужную базу только через preview/существующую оболочку; не меняет эти файлы |
| Шрифты | Manrope локально (`OF Manrope`/текущий sans), Cormorant Garamond400 (`OF Brand`, латиница) в `src/styles/orthofamily-wordmark.css`. Для кириллицы использовать существующий Manrope, без внешних загрузок/новых гарнитур |
| Цвета | Холодная основа `#EEF1F3`, светлая поверхность `#F5F6F6`, графит `#273037`, светлый текст `#F2F4F5`, вторичный `#596770`, серебро `#C9CDD1`. Существующие базовые значения важнее новых декоративных токенов |
| Эмблема | `public/brand/logo-chrome.svg` и исходные брендовые материалы. Не рисовать новый знак; технические имена orthofamily не переименовывать |

## Будущий layout и встраивание контента

1. Общий layout владеет html/head/body, title/description, header/footer, **одним main**, skip-link, межстраничными переходами и общим жизненным циклом. Минимум props: `title`, `description`; **default slot** внутри main. Дополнительные named slots определяет второй аккаунт, About от них не зависит.
2. `AboutPageContent.astro` отдаёт **article** с корнем `[data-about-page]`, одним h1 и собственными секциями/ID `ac-*`. Не отдаёт html/head/body/main/header сайта/footer сайта. Префиксы CSS/data только `ac-*`/`data-ac-*`.
3. Контейнеры принадлежат контенту: `.ac-shell` шириной `min(calc(100% - 7rem),90rem)`,32px поля на планшете,16px на телефоне. Не оборачивать весь default slot ещё в узкий контейнер: тёмный блок About должен оставаться на всю ширину. Общий layout может предоставить CSS-токен для тех же размеров позже по соглашению.
4. Props About: `homeHref`, `doctorsHref`, `contactHref`. Значения по умолчанию через `import.meta.env.BASE_URL`: главная, `#doctors`, `#contacts` на главной. Конечную навигацию меняет владелец layout. Все медиа-пути относительны public и получают BASE_URL в компоненте.
5. Локальное движение: экспорт `initAboutMotion(root: HTMLElement): () => void` из `src/components/about-clinic/about-motion.ts`. Идемпотентная инициализация, возвращаемый cleanup. Сам About запускает только этот локальный эффект; общие router/page-transition hooks не регистрирует. При подключении client-router владелец общего motion вызывает этот initializer/cleanup в своём цикле, не дублирует анимацию.
6. Без JS содержимое видимо; reduced-motion остаётся статичным. Ранние якоря/возврат и быстрый скролл не должны оставлять скрытые тексты. Нет wheel/touch interception, длинного pin, WebGL или обязательного курсора.

## Безопасный preview

`src/pages/about-clinic-preview.astro` — только композиция существующих Shell/Header/Footer/метрик и AboutPageContent. Это **не общий новый layout**, не публичная навигация и не замена главной. Будущий layout подменяет эту композицию при интеграции. Локальный сервер другого аккаунта надо запускать отдельно из его собственной копии.

## Передача и проверка базы

Транспорт: push **только `feature/about-clinic`** в `https://github.com/AlexOr0906/ulibkarad`. Автор A сообщит точный SHA отдельного подготовительного коммита после его создания/push; наличие документа локально ещё не означает доступности второму аккаунту. Если push не подтверждён — не объявлять передачу выполненной; возможен Git bundle с историей ветки.

Во второй копии сначала сохранить свою работу, затем:

Подготовительный коммит уже создан и push подтверждён: **`b5ae25c528f95e9e0ca27a6da005e5ed6baae725`** в `github/feature/about-clinic`. Он содержит только этот контракт. Последующие коммиты ветки содержат самостоятельный About; их не нужно переносить ради одного соглашения.

```powershell
git fetch origin feature/about-clinic
git show --stat b5ae25c528f95e9e0ca27a6da005e5ed6baae725
git merge-base --is-ancestor 87d3e5514c826d368d5720d7f2c42415cee59afb b5ae25c528f95e9e0ca27a6da005e5ed6baae725
# Только если нужен сам контракт в своей ветке, перенести названный подготовительный commit:
git cherry-pick b5ae25c528f95e9e0ca27a6da005e5ed6baae725
```

`origin` здесь — имя remote второй копии; у A он называется `github`. Не выполнять reset/checkout поверх несохранённой работы и не переносить поздние About-коммиты ради одного документа. В новой копии: Node24, `npm ci`, `npm run build`. Preview: `npm run dev -- --host 127.0.0.1 --port 4184`, URL `/about-clinic-preview/`. Desktop/mobile320/390px, keyboard, reduced/no-JS и движение проверить в своей копии. Главную сравнивать с базой87d3e55; main/Pages/dispatch не трогать.
