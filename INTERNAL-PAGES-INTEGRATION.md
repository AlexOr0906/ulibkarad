# Общий шаблон внутренних страниц и «Пациентам»

Основа: `87d3e5514c826d368d5720d7f2c42415cee59afb`. Контракт A получен в `b5ae25c528f95e9e0ca27a6da005e5ed6baae725`. Ветка B: `feature/internal-pages-patients`. Главная и компоненты About не изменяются.

**Последующий интеграционный этап:** `feature/internal-pages-integration`, точный About A `7fc4ee7499e5baa8c616bd22cb1a1fe46df9cefa`. Актуальная сборка/добавления API и lifecycle описаны в `SITE-PREVIEW-INTEGRATION.md`; ниже сохраняется контракт исходного прототипа с уточнениями API.

## Направление до реализации

Серебристая информационная страница: крупный открытый заголовок, компактный индекс слева и читаемые разделы справа. Светлая бумага `#EEF1F3`, белый `#FFFFFF`, графит `#273037`, вторичный `#596770`, серебро `#C9CDD1`, тёмная поверхность `#292D30`. Manrope для русского текста; существующий Cormorant Garamond только в фирменном знаке. Эмблема прежняя.

```text
существующая шапка
хлебные крошки
крупный заголовок / серебристая плоскость с эмблемой
индекс разделов | открытые сведения и статусы материалов
               | лицензия на графитовом фоне
               | правила, документы, стоимость, обращения
существующий футер
```

Различие с главной: короткое чтение, без pin, сцен элайнера, автодвижения предмета и скрытых юридических материалов. Не превращать каждый пункт в одинаковую карточку; структурные линии используются для документов/списков. Характер движения: появление короткой группы hero и лёгкое раскрытие плоскостей при чтении, затем всё остаётся видимым. Сам переход между страницами короче раскрытия контента.

## Навигация и движение

Обычная MPA-навигация Astro. `ClientRouter` не добавляется: существующие Header/Footer и локальный About сохраняют обычный жизненный цикл документа. Нативные cross-document view transitions включаются маленьким классическим скриптом в head до первого рендера и CSS только на новых внутренних страницах. Без JS и в неподдерживающем браузере остаётся стандартная навигация; главная не opt-in и не меняется. При reduced-motion переход отключён. Никаких перехватов кликов ради задержки и ручного управления history.

Проверка обнаружила отмену нативного перехода при уходе на документ без opt-in. Поэтому head-обработчик `pageswap` вызывает `skipTransition()` для адресов вне `transitionHrefs`. Это не отменяет и не задерживает навигацию. Ожидаемое отклонение `ready` исходящего скрываемого документа обрабатывается локально; глобального подавления ошибок нет. Разрешённые маршруты перечисляются явно, поэтому внедрение ClientRouter или включение эффектов на главной не требуется.

Основание выбора: [Astro: native transitions и ClientRouter](https://docs.astro.build/en/guides/view-transitions/), [Chrome: cross-document transitions](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document). Оба документа должны быть opt-in; перезагрузка страницы сама по себе не является межстраничным переходом.

## Открытый источник плана

На момент начала реализации `REQUIREMENTS-PLAN.md` отсутствует во всех полученных remote-ветках. Его содержание не восстановлено по догадкам. В прототип входят только названные пользователем группы: сведения о клинике, лицензия, правила, документы, цены, обращения. Формулировки и состав требуют сверки с рабочим планом после его получения. Никакое юридическое соответствие не заявляется.

Backend, CMS, поиск, анкеты, приём/отправка обращений и страницы услуг остаются отдельными задачами.

## Контракт подключения

`src/layouts/InternalPageLayout.astro` принимает:

| Prop | Контракт |
| --- | --- |
| `title: string` | Название страницы без суффикса; layout добавляет ` · OrthoFamily` |
| `description: string` | Отдельное описание для meta description |
| `navigation?: HeaderLink[]` | Готовые href шапки, включая BASE_URL. По умолчанию ссылки на разделы главной и существующий `/patients-preview/` |
| `footerNavigation?: HeaderLink[]` | Относительные пути/хеши без BASE_URL: существующий Footer сам добавляет корень сайта |
| `contactHref?: string` | По умолчанию `${BASE_URL}#contacts`, существующий честный демоблок связи |
| `transitionHrefs?: string[]` | Полные site-relative href страниц, где уже подключён этот layout; по умолчанию два новых preview. Не регистрировать несуществующие маршруты или главную |
| `homeHref?: string` | Корень семьи маршрутов с завершающим `/`; default BASE_URL. Footer добавляет к нему относительные пути навигации |
| `activeHref?: string` | Default текущий pathname; SSR активный пункт Header/Footer через aria-current |
| `contentOwnsHeaderOffset?: boolean` | Default false; true для About A, у которого уже есть собственный отступ под фиксированную шапку |
| default slot | Контент с одним h1; layout не добавляет контейнер, article, дополнительный main или hero |
| named slot `head` | Дополнительные метаданные без повторных html/head/body |

Layout владеет html/head/body, одним `main#ip-main`, skip-link, существующими Header/Footer и **одним** IntegratedHeaderMetrics. Корень `body#ip-top`; футер возвращает к нему. Домашняя ссылка шапки/футера — homeHref (default BASE_URL); навигация футера использует именно этот префикс. Технические классы `of-document of-complete of-page` нужны существующим стилям/метрикам, новые общие классы имеют префикс `ip-*`.

Интерфейс About дополнительно сверен read-only с `origin/feature/about-clinic` / `7fc4ee7`: тот же `AboutPageContent.astro`, props homeHref/doctorsHref/contactHref, собственный initAboutMotion. Его компоненты в эту ветку не переносились и не редактировались.

Пример для будущей интеграции About после получения компонента A (это пример, публичный route здесь не создан):

```astro
---
import InternalPageLayout from '@/layouts/InternalPageLayout.astro';
import AboutPageContent from '@/components/about-clinic/AboutPageContent.astro';
const base = import.meta.env.BASE_URL;
---
<InternalPageLayout title="О клинике" description="Подтверждённое описание клиники" contentOwnsHeaderOffset>
  <AboutPageContent homeHref={base} doctorsHref={`${base}#doctors`} contactHref={`${base}#contacts`} autoMotion={false} />
</InternalPageLayout>
```

После назначения реальных `/about/` и `/patients/` обновить на **обеих** страницах `transitionHrefs`, `navigation`, `footerNavigation`. Значения в коде сейчас ведут только на существующие preview/главную. Страницы услуг и конечный `/about/` не созданы. About владеет собственными `.ac-shell`, `ac-*`, локальной анимацией и cleanup; layout не запускает и не изменяет её.

Общий motion: `initInternalMotion(root: HTMLElement): () => void`, файл `src/components/internal-pages/internal-motion.ts`. Повторный вызов на одном root возвращает существующий cleanup; второй набор observers/listeners не создаётся. В интеграции lifecycle принадлежит `initInternalPage` из `internal-lifecycle.ts`: он запускает общий эффект и локальный About один раз, вызывает cleanup при pagehide без bfcache. При восстановлении из bfcache эффекты завершаются, не повторяются. ClientRouter не подключён; если его решат добавить отдельно, владелец router должен вызвать cleanup старого root и инициализацию нового через этот coordinator.

Декоративные цели помечаются `data-ip-enter`, короткая задержка 0–120 мс — `data-ip-delay`, ограниченная маска заголовка — `data-ip-mask`. Без JS эти атрибуты ничего не скрывают. Не помечать main/section/nav/контейнер со всеми ссылками: эффекты применяются только к заголовку, короткому тексту или отдельной иллюстрации. Быстрый скролл, фокус, якорь и reduced-motion завершают эффект. Текст не требует ожидания длинной сцены.

## «Пациентам» и замена материалов

`src/components/patients/PatientsPageContent.astro` — автономный article `[data-patients-page]` с одним h1 и собственными `pa-*` ID. Props `homeHref`, `contactHref`; по умолчанию учитывают BASE_URL. Внешнего main и сайта Header/Footer не отдаёт.

`src/data/patients.ts` содержит индекс, сведения о клинике, заготовки правил и предварительные названия документов. Заглушки не являются юридическими документами; реальных файлов, цен, реквизитов, лицензии и фиктивных download/href нет. До получения и проверки клиникой демопометки сохранять. Перечень документов ещё требуется сверить с отсутствующим REQUIREMENTS-PLAN.md.

## Файлы для передачи

- `src/layouts/InternalPageLayout.astro` — оболочка, head и граница нативного перехода.
- `src/components/internal-pages/internal-motion.ts`, `src/styles/internal-pages.css` — общий контракт движения/размеров внутренних страниц.
- `src/components/patients/PatientsPageContent.astro`, `src/data/patients.ts`, `src/styles/patients.css` — контент прототипа.
- `src/pages/patients-preview.astro`, `src/pages/internal-layout-preview.astro` — две изолированные сборки; маршруты главной не изменяются.
- `scripts/verify-internal-pages.mjs` — браузерная проверка.
- `INTERNAL-PAGES-INTEGRATION.md` — этот контракт/ограничения/проверки.

## Проверки и предпросмотр

Локальный сервер этой копии: http://localhost:4210/patients-preview/ . Второй маршрут для проверки общего шаблона и переходов: http://localhost:4210/internal-layout-preview/ . Это локальные адреса, не публикация и не сервер другого аккаунта.

Проверены production build (10 статических страниц) и `astro check` (54 файла, 0 ошибок/предупреждений/подсказок). Браузерный сценарий `node scripts/verify-internal-pages.mjs`: 320×568,390×844,768×1024,1024×768,1440×1000; reduced-motion390/1440, no-JS390. `INTERNAL_PREVIEW_URL` переопределяет корневой URL, `SCROLLCRAFT_CHROME` — путь установленного Chrome. В обычных пяти случаях событие pagereveal подтвердило реальный нативный view transition; в reduced-motion переход отсутствует, без JS обычная навигация.

Проверяются заголовки/main, отсутствие фиктивных download/форм, все шесть якорей и положение заголовков под шапкой, back/forward, фокус/меню/Escape, перезагрузка в середине, CTA к контактам, отсутствие переполнения/браузерных ошибок и изоляция от главной. Кадры desktop/mobile и промежуточные состояния просмотрены визуально. Артефакты: `outputs/internal-pages/` (не включены в Git).

Ограничения: проверен установленный Chrome с эмуляцией viewport, не физический телефон/Safari/Firefox. Межстраничная анимация — progressive enhancement; в неподдерживающем браузере навигация обычная. Нет юридической проверки и полученного REQUIREMENTS-PLAN.md; точный состав будущих материалов остаётся открытым. Нет back-end, CMS, поиска, анкетирования, страниц услуг, слияния в main или публикации.
