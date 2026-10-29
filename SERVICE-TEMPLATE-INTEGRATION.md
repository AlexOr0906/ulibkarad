# Общий шаблон услуг: подключение и проверка

30.10.2026. Ветка `feature/service-page-template`.

## Основа и границы

- Актуальная база `7ac5e17d7aed2b7ca122874c67686d5425de8f86`.
- Принятый план **`d1c7c5e80d1f9dbf585123c3edc358e8614012a4`** сохранён в истории и без изменения текста.
- Подготовка A **`17074e04b7e464ec45fd0e7282f2583c678a9511`** проверена: только SERVICE-PAGES-HANDOFF.md, BRIEF.md, CONTENT-CHECKLIST.md, src/data/clinic-confirmed.ts. Перенесена cherry-pick в `cc0e22f`.
- Код ортопедии, её visual, данные и локальный motion не получались и не импортируются шаблоном. Их реализация не дублируется.
- Существующие layout/lifecycle/motion, навигация, главная/About/Пациентам, глобальные стили, зависимости/lockfile и workflow не менялись. Новых глобальных motion-модулей нет.

## Предпросмотр

**http://localhost:4212/service-template-preview/**

Одна изолированная страница с тремя проверочными экземплярами шаблона: основной с явными placeholder-материалами и нейтральным scene-slot, раскрываемый минимальный, раскрываемый с автономным default body. Это техническая проверка компонентов, не три медицинские страницы. Четыре пустые страницы направлений не создавались. Нейтральная поверхность в scene-slot не является сценой ортопедии, изображением лечения или медицинским доказательством.

ООО «ПРОФИМЕД», только платный приём и статус неподтверждённой лицензии берутся из переданного clinic-confirmed.ts. Медицинские описания/цены/врачи не придуманы; показанные места явно обозначены. Никаких backend, CMS, форм, анкет или фиктивных download.

## Компонент и слоты

`src/components/services/ServicePageContent.astro` — article с hero/h1/breadcrumbs и собственными `sv-*` стилями. Сам не отдаёт html/body/main/Header/Footer. Его нужно размещать в **существующем InternalPageLayout**, который обеспечивает метаданные, общие Header/Footer, header-height, native navigation и lifecycle.

Props:

| Prop | Значение |
| --- | --- |
| `data: ServicePageData` | Типизированный контент/hero/необязательные блоки |
| `idPrefix?: string` | Default `sv-${data.id}`; задавать уникальный для нескольких экземпляров на одном preview |
| `headingLevel?: 'h1' \| 'h2'` | Default h1 для настоящей страницы; h2 только для вторичных проверочных экземпляров на preview |
| named slot `scene` | Отдельная индивидуальная сцена. При отсутствии не выводится wrapper и не резервируется высота |
| default slot | **Полностью заменяет стандартное тело:** описание, информационные блоки, врачей, стоимость и CTA. Не добавляется к ним |

Оба слота остаются full-width. Шаблон не добавляет к ним `.sv-shell`, transform, mask, progress, pin/spacer, animation initializer или привязку к ортопедии. Индивидуальные `.or-shell` и полноширинные поверхности A получают ровно один уровень своих полей. Ни scene, ни весь custom body не помечаются общим reveal.

## Данные и отсутствие материалов

`src/data/service-page.ts` экспортирует `ServicePageData`, `OpeningDirection`, `ServiceSection<T>`, `ServiceInfoBlock`, `ServicePrice`. В union только четыре направления открытия: детская/взрослая терапия, ортопедия, ортодонтия. Хирургии нет.

`ServiceSection<T>` различает:

- `undefined` — секция отсутствует;
- `{state:'placeholder', notice:'…'}` — явное демонстрационное место с непустой надписью;
- `{state:'ready', content:[…]}` — материалы клиники, переданные вызывающей страницей.

Пустые ready-массивы, пробельные тексты и пустая placeholder-надпись не создают заголовков/секций. При отсутствии всех стандартных блоков не создаётся даже `.sv-body` с нижним отступом. Information-блок требует непустых title и body; его ID строится из idPrefix и block.id. Не использовать повторные id в одном наборе данных.

Описание — массив абзацев; информационные блоки — readonly-массив с id/title/body. Related doctors — readonly DoctorProfile[] из **подтверждённых** данных; записи без имени, специальности и изображения с alt исключаются. Демонстрационные AI-примеры не выбираются автоматически. profileHref необязателен: без него нет ссылки «О враче». Если передаётся ссылка, вызывающая страница должна проверить существование реального маршрута.

Стоимость — readonly ServicePrice[] с label, положительным конечным amount в рублях и optional unit. Не прошедшие проверку записи не показываются. Настоящих ready-цен и ready-врачей для этой задачи не предоставлено; на preview их нет. Финансовые/медицинские сведения передаёт и утверждает клиника, шаблон не генерирует их.

`appointment` требует непустые label/href; пустой href или `#` не создают кнопку. В demo он ведёт к действующему блоку контактов, где честно указано отсутствие записи. Не добавлять выдуманные каналы связи.

`breadcrumbs` — готовые label/href; последний элемент без href означает текущую страницу. `title` обязателен и должен быть непустым. `lead`, `demoNotice` необязательны. Путь изображения/профиля врача относителен public/site, шаблон добавляет BASE_URL. Все ссылки самого preview также учитывают BASE_URL.

## Подключение ортопедии после отдельной передачи пакета A

Пример **будущей интеграции** (сейчас таких импортов в исходниках шаблона нет):

```astro
---
import InternalPageLayout from '@/layouts/InternalPageLayout.astro';
import ServicePageContent from '@/components/services/ServicePageContent.astro';
import OrthopedicsVisual from '@/components/orthopedics/OrthopedicsVisual.astro';
import OrthopedicsPageContent from '@/components/orthopedics/OrthopedicsPageContent.astro';
import type { ServicePageData } from '@/data/service-page';
const base = import.meta.env.BASE_URL;
const hero: ServicePageData = {
  id: 'prosthodontics', title: 'Ортопедия',
  breadcrumbs: [{label:'Главная',href:base},{label:'Ортопедия'}],
  demoNotice: 'Демонстрационный раздел. Медицинские материалы ожидаются.',
};
---
<InternalPageLayout title="Ортопедия" description="Демонстрационная страница направления OrthoFamily. Медицинские материалы ожидаются.">
  <ServicePageContent data={hero}>
    <OrthopedicsVisual slot="scene" id="or-visual" />
    <OrthopedicsPageContent doctorsHref={`${base}#doctors`} contactHref={`${base}#contacts`} />
  </ServicePageContent>
</InternalPageLayout>
```

В этом примере оставлен контрактный `autoMotion=true` по умолчанию, то есть индивидуальным движением пока владеют сами компоненты A. При отдельной полноценной интеграции с общим coordinator **одновременно** передать обоим `autoMotion={false}` и подключить `initOrthopedicsScene(sceneRoot)` / `initOrthopedicsContent(contentRoot)` к **существующему** internal-lifecycle. Сохранить возвращённые cleanup, вызывать при pagehide без bfcache, не повторять init при восстановлении сохранённого документа. Конкретные DOM-root получить из фактического пакета/README A, а не угадывать сейчас.

Нельзя просто выключить autoMotion до подключения coordinator, либо запустить coordinator поверх оставленного auto-start. Новый глобальный модуль, wheel/touch interception и отдельный router не требуются. Сейчас существующий coordinator не редактировался, несуществующих импортов A в нём нет.

`OrthopedicsPreviewIntro` при таком подключении не использовать: его заменяют h1/hero шаблона. Тело A отдаёт h2 и свои секции один раз; переданный default slot автоматически исключает стандартные placeholders шаблона. Назначение реального маршрута и регистрация его в navigation/transitionHrefs — отдельная интеграционная задача; ни новая услуга в меню, ни production route здесь не создавались.

## Проверки

- `astro check`: **73 файла, 0 ошибок, 0 предупреждений, 0 подсказок**.
- Production build: **17 статических маршрутов**, включая старые preview и одну новую страницу шаблона.
- `node scripts/verify-service-template.mjs`: 1440×1000,1024×768,768×1024,390×844,320×568,844×390,390 reduced-motion,390 no-JS. Все восемь прошли.
- Проверены один h1/main/Header/Footer, уникальные id, named scene без общего transform/reveal, все стандартные placeholders, минимальный вариант без сцены/тела/пустых секций, замена тела без дублирования описания/врачей/стоимости/CTA.
- Проверены клавиатурные раскрытия, видимый фокус, меню/Escape/возврат фокуса, CTA к существующим контактам, Back, прямой вход на якорь и reload, отсутствие переполнения и ошибок JS/HTTP. При reduced-motion декоративные анимации не выполняются; no-JS сохраняет контент и нативные раскрытия/ссылки.
- Desktop/mobile кадры прочитаны визуально. Артефакты `outputs/service-template/` исключены из Git. Это эмуляция установленного Chrome, не физические iPhone/Safari/Android. Видео не записывалось.
- Реальная сцена, медицинское наполнение, прайс и связанные врачи ортопедии не проверялись: они ещё не переданы для этой задачи. Юридическое соответствие не заявляется.

## Передаваемые файлы

1. `src/components/services/ServicePageContent.astro`.
2. `src/data/service-page.ts`.
3. `src/data/service-template-demo.ts`.
4. `src/styles/service-page.css`.
5. `src/pages/service-template-preview.astro`.
6. `scripts/verify-service-template.mjs`.
7. `SERVICE-TEMPLATE-INTEGRATION.md` — этот документ.

Проверенная подготовка и неизменённый принятый план находятся в истории той же ветки. Main и публикация не затрагиваются.
