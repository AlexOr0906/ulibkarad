# Две статичные концепции ортопедии

После выбора пользователем первого варианта реализовано раскрытие человеческого портрета на `/orthopedics/`. Актуальное описание — [HUMAN-REVEAL.md](HUMAN-REVEAL.md). Сама страница сравнения ниже остаётся статичной; дальнейший текст описывает исходный этап выбора.

30.10.2026. Пользователь согласовал предложение сначала сравнить два статичных макета: человеческий и керамический, затем выбирать движение. Это отдельное визуальное обсуждение, не утверждённая новая сцена и не изменение медицинских сведений.

Маршрут: `/orthopedics-concepts/`, локальный URL http://localhost:4186/orthopedics-concepts/ . Первый вариант `#concept-human`, второй `#concept-material`. Существующие `/orthopedics/`, главная и согласованные внутренние страницы не заменены.

## Варианты

- Человек: естественный вымышленный AI-портрет, светлая серебристая композиция и живой HTML-заголовок «Ближе к человеку». На телефоне портрет, непосредственная AI-пометка, затем текст. Не пациент/сотрудник клиники и не пример результата лечения. Предложение для последующего движения: раскрытие кадра от улыбки к человеку; сейчас анимации нет.
- Материал: абстрактная керамическая поверхность и серебристый край на графите, HTML-заголовок «Форма. В деталях». Не зуб/коронка/медицинское изделие и не утверждение о применяемом материале клиники. Предложение движения: раскрытие изгиба и один световой акцент; для настоящей смены света нужны согласованные состояния. Сейчас статичная композиция.

Изображения получены **штатным imagegen**, режим generate, не API/CLI. Исходные PNG скопированы в проект без замены существующих ассетов. Текст и UI не запечены в изображения. Превью использует существующие Header/Footer/шрифты, обе сцены без motion-атрибутов. CTA ведут к существующим демоконтактам, не отправляют обращения. Обе иллюстрации явно подписаны.

Файлы:

- `public/orthopedics-concepts/human-smile-v1.png`.
- `public/orthopedics-concepts/ceramic-material-v1.png`.
- `src/pages/orthopedics-concepts.astro` — изолированное сравнение с локальными стилями.
- Этот README — происхождение и точные prompt.

## Prompt портрета

```text
Generate one original photographic asset, not a webpage or collage. Use case: photorealistic-natural. Asset: premium editorial website concept for a family dental clinic, explicitly a fictional AI model, not a real patient or employee. Landscape 3:2 composition. A relaxed adult woman around 45 years old, natural skin texture, understated light grey shirt, shoulders visible, gentle authentic smile with natural ordinary teeth subtly visible, looking toward camera, head slightly turned. Warm human presence, no glamour retouch, no exaggerated perfectly white dental advertising smile. Subject occupies right half, generous pale silver-grey negative space on left. Soft daylight from left, silver-white-graphite restrained palette, quiet seamless light grey studio background. Keep entire head and shoulders comfortably within frame for mobile crop. Photorealistic, refined high-end editorial portrait. No dentist, instruments, scrubs, medical procedure, dental appliance, logos, words, badges, before/after, watermark or UI. No claim or implication of a treatment result.
```

## Prompt материала

```text
Generate one original photographic fine-art material asset for a premium silver-white-graphite website concept. Use case: photorealistic-natural, abstract material macro photography. Landscape 3:2 image. Extreme elegant macro of a large sculptural curved ivory porcelain surface, like a continuous smooth architectural ceramic sheet bending into a gentle wave, with one fine satin silver edge catching light. Rich restrained graphite background, creamy ceramic surface with subtle real microtexture and controlled pearly reflections, grazing soft studio light, tactile sophisticated composition. The material fills the right two-thirds and lower edge; upper left has quiet dark graphite negative space for real HTML typography later. Beautiful soft curved boundary and dimensional depth, not multiple little objects. This is an abstract material study, emphatically NOT a tooth, crown, dental restoration, jaw, mouth, appliance, model, or medical device. Avoid anything shaped like molars, roots or dentures. No text, UI, labels, logos, neon, sparkles, gradients as graphic effects, hands or tools. The image should feel like a premium ceramics/material editorial photograph, warm ivory balanced with silver and charcoal.
```

## Проверка

Astro check:81 файлов,0 ошибок/предупреждений/подсказок. Build:20 статических маршрутов. Проверены1440/768/390/320px, загрузка обеих иллюстраций и отсутствие горизонтального переполнения/ошибок браузера; прочитаны desktop/mobile кадры. Дополнительно клавиатурные переходы по двум якорям, reduced-motion/no-JS. Эмуляция Chrome, не физический телефон. Видео нет, новые клинические сведения не добавлены. Анимация текущей ортопедии сохранена, main/Pages не меняются.

Артефакты проверки: `outputs/orthopedics-concepts/` (не включаются в Git). После выбора концепции потребуется подготовка окончательных изображений/адаптивных размеров и отдельная реализация движения; текущие PNG сохранены как демоисточники, не объявляются финальной оптимизированной поставкой.
