/**
 * Генератор тимчасових даних для сайту.
 * Запускати лише один раз: `node scripts/generate-placeholders.mjs`
 * Скрипт створює 130 профілів котів у src/content/animals
 * та 8 ілюстрацій-заглушок у public/images/animals.
 */
import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const animalsDir = path.join(root, 'src/content/animals');
const imagesDir = path.join(root, 'public/images/animals');

const NAMES = [
  'Мурка', 'Барсик', 'Васька', 'Сніжок', 'Ліза', 'Том', 'Джері', 'Пух', 'Соня', 'Рудько',
  'Чорниш', 'Білка', 'Маруся', 'Кузя', 'Персик', 'Мілка', 'Ніка', 'Лео', 'Тіша', 'Місяць',
  'Зірка', 'Карамель', 'Бусинка', 'Лакі', 'Сімба', 'Нора', 'Плюш', 'Філіп', 'Тофі', 'Іриска',
  'Кокос', 'Багіра', 'Сімка', 'Марс', 'Венера', 'Оскар', 'Лілу', 'Мія', 'Тайсон', 'Клео',
  'Бублик', 'Пиріжок', 'Вафля', 'Зефір', 'Маршмелоу', 'Шоколадка', 'Кава', 'Латте', 'Мокко', 'Чіпс',
  'Пончик', 'Круасан', 'Сирник', 'Тірамісу', 'Белла', 'Боня', 'Буся', 'Віола', 'Габі', 'Дафна',
  'Єва', 'Жужа', 'Зара', 'Іда', 'Йоші', 'Кіра', 'Лола', 'Люсі', 'Майя', 'Ніна',
  'Олівія', 'Пенні', 'Роза', 'Сіссі', 'Тора', 'Ума', 'Флора', 'Хлоя', 'Циля', 'Челсі',
  'Шері', 'Юкі', 'Ясна', 'Айс', 'Блейз', 'Вулкан', 'Гром', 'Димка', 'Єнісей', 'Жар',
  'Зевс', 'Іскра', 'Йод', 'Космос', 'Лев', 'Міраж', 'Немо', 'Оріон', 'Пірат', 'Ракета',
  'Сокіл', 'Тайфун', 'Уран', 'Фенікс', 'Хан', 'Цунамі', 'Чак', 'Шторм', 'Юпітер', 'Ягуар',
  'Ася', 'Баффі', 'Віскас', 'Гарфілд', 'Діксі', 'Елвіс', 'Жасмин', 'Зіггі', 'Іві', 'Йоко',
  'Кетчуп', 'Лімон', 'Макс', 'Нюша', 'Орео', 'Панда', 'Річі', 'Стефан', 'Твікс', 'Уля',
  'Фунтик', 'Хатіко', 'Цукерка', 'Шафран', 'Юджин', 'Яків', 'Амур', 'Батон', 'Вишня', 'Голубка',
];

const BREEDS = [
  ['Метис', 45],
  ['Європейська короткошерста', 12],
  ['Британська короткошерста', 9],
  ['Шотландська висловуха', 8],
  ['Сіамська', 6],
  ['Мейн-кун', 5],
  ['Сфінкс', 4],
  ['Бенгальська', 4],
  ['Сибірська', 4],
  ['Перська', 3],
];

const TEMPER_F = [
  'привчена до лотка',
  'добра з дітьми',
  'добра з котами',
  'ласкава',
  'грайлива',
  'спокійна',
  'любить увагу',
  'їсть сухий корм',
];

const TEMPER_M = [
  'привчений до лотка',
  'добрий з дітьми',
  'добрий з котами',
  'ласкавий',
  'грайливий',
  'спокійний',
  'любить увагу',
  'їсть сухий корм',
];

const SUMMARY_F = [
  (n) => `${n} — ласкава кішка, яка мріє про тихий дім і муркоче, щойно її торкаються.`,
  (n) => `${n} — допитлива кішка, яка любить спостерігати за всім із високої полиці.`,
  (n) => `${n} — грайлива кішка, яка швидко закохує в себе кожного, хто до неї завітає.`,
  (n) => `${n} — спокійна кішка, яка цінує затишок і лагідні руки.`,
  (n) => `${n} — товариська кішка, яка не любить залишатися на самоті.`,
];

const SUMMARY_M = [
  (n) => `${n} — ласкавий кіт, який мріє про тихий дім і муркоче, щойно його торкаються.`,
  (n) => `${n} — допитливий кіт, який любить спостерігати за всім із високої полиці.`,
  (n) => `${n} — грайливий кіт, який швидко закохує в себе кожного, хто до нього завітає.`,
  (n) => `${n} — спокійний кіт, який цінує затишок і лагідні руки.`,
  (n) => `${n} — товариський кіт, який не любить залишатися на самоті.`,
];

const HOBBIES = [
  'грітися на сонці біля вікна',
  'гратися з м’ячиком',
  'спати на чиїйсь ковдрі',
  'спостерігати за птахами',
  'досліджувати нові куточки',
  'сидіти на колінах і муркотіти',
];

const HOMES = [
  'спокійна квартира без інших тварин',
  'родина з дітьми шкільного віку',
  'дім, де є час на щоденне спілкування',
  'затишний дім із власним куточком для відпочинку',
];

const IMAGE_VARIANTS = [
  { bg: '#FFE9B8', cat: '#2B2B2B', accent: '#FFB72B', accent2: '#FFE61B' },
  { bg: '#FFF6B8', cat: '#5A4028', accent: '#FFE61B', accent2: '#B5FE83' },
  { bg: '#DFFFC9', cat: '#2B2B2B', accent: '#B5FE83', accent2: '#FFE61B' },
  { bg: '#F7F7F7', cat: '#FFB72B', accent: '#FFE61B', accent2: '#B5FE83' },
  { bg: '#FFD98A', cat: '#FFF7E6', accent: '#FFB72B', accent2: '#FFE61B' },
  { bg: '#E9FFD6', cat: '#4A4A4A', accent: '#B5FE83', accent2: '#FFB72B' },
  { bg: '#FFF1C9', cat: '#8A5A2B', accent: '#B5FE83', accent2: '#FFB72B' },
  { bg: '#D9F5C4', cat: '#FFFFFF', accent: '#FFB72B', accent2: '#FFE61B' },
];

// Детермінований генератор випадкових чисел, щоб дані не змінювалися між запусками
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261119);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

function pickWeighted(entries) {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rand() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh',
  з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n',
  о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya', "'": '', '’': '',
};

function slugify(name) {
  return name
    .toLowerCase()
    .split('')
    .map((char) => TRANSLIT[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(date) {
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date).replace(/\.$/, '');
}

function yamlList(key, values) {
  return `${key}:\n${values.map((value) => `  - "${value}"`).join('\n')}`;
}

function catImageSvg({ bg, cat, accent, accent2 }) {
  const eyeFill = cat === '#2B2B2B' || cat === '#4A4A4A' ? '#F7F7F7' : '#2B2B2B';
  const stroke = '#2A2A2A';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="Ілюстрація кота">
  <rect width="800" height="600" fill="${bg}"/>
  <circle cx="112" cy="118" r="188" fill="${accent}" opacity="0.55"/>
  <circle cx="710" cy="520" r="230" fill="${accent2}" opacity="0.55"/>
  <circle cx="742" cy="118" r="58" fill="${accent}" opacity="0.75"/>
  <circle cx="92" cy="512" r="30" fill="${accent2}" opacity="0.9"/>
  <ellipse cx="404" cy="540" rx="210" ry="24" fill="#2A2A2A" opacity="0.12"/>
  <g stroke="${stroke}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">
    <path d="M556 500 C652 508 690 430 640 368" fill="none" stroke="${cat}" stroke-width="34"/>
    <path d="M556 500 C652 508 690 430 640 368" fill="none"/>
    <path d="M262 520 C262 438 322 374 400 374 C478 374 538 438 538 520 Z" fill="${cat}"/>
    <path d="M326 222 L308 120 L398 190 Z" fill="${cat}"/>
    <path d="M474 222 L492 120 L402 190 Z" fill="${cat}"/>
    <circle cx="400" cy="298" r="116" fill="${cat}"/>
    <path d="M342 246 L328 168 L382 208 Z" fill="${accent}"/>
    <path d="M458 246 L472 168 L418 208 Z" fill="${accent}"/>
    <ellipse cx="360" cy="296" rx="15" ry="20" fill="${eyeFill}" stroke="none"/>
    <ellipse cx="440" cy="296" rx="15" ry="20" fill="${eyeFill}" stroke="none"/>
    <circle cx="360" cy="300" r="6" fill="#2A2A2A" stroke="none"/>
    <circle cx="440" cy="300" r="6" fill="#2A2A2A" stroke="none"/>
    <path d="M388 322 L412 322 L400 336 Z" fill="${accent}" stroke-width="4"/>
    <path d="M400 336 C400 348 388 350 380 344" fill="none" stroke-width="5"/>
    <path d="M400 336 C400 348 412 350 420 344" fill="none" stroke-width="5"/>
    <path d="M330 326 L278 318 M330 340 L276 344 M470 326 L522 318 M470 340 L524 344" fill="none" stroke-width="5" opacity="0.7"/>
    <path d="M352 210 C366 200 378 198 390 198 M448 210 C434 200 422 198 410 198" fill="none" stroke-width="5" opacity="0.55"/>
    <ellipse cx="352" cy="520" rx="34" ry="16" fill="${accent}" stroke-width="6"/>
    <ellipse cx="448" cy="520" rx="34" ry="16" fill="${accent}" stroke-width="6"/>
  </g>
  <path d="M400 430 C400 414 384 408 374 416 C364 424 366 440 400 458 C434 440 436 424 426 416 C416 408 400 414 400 430 Z" fill="${accent2}" opacity="0.9"/>
</svg>
`;
}

async function main() {
  await mkdir(animalsDir, { recursive: true });
  await mkdir(imagesDir, { recursive: true });

  // Прибираємо старі згенеровані профілі, щоб скрипт можна було запускати повторно
  for (const file of await readdir(animalsDir)) {
    if (file.endsWith('.md')) await rm(path.join(animalsDir, file));
  }

  for (let i = 0; i < IMAGE_VARIANTS.length; i += 1) {
    await writeFile(
      path.join(imagesDir, `cat-${String(i + 1).padStart(2, '0')}.svg`),
      catImageSvg(IMAGE_VARIANTS[i]),
      'utf8',
    );
  }

  const usedSlugs = new Set();
  const names = NAMES.slice(0, 130);
  if (names.length !== 130 || new Set(names).size !== 130) {
    throw new Error('Потрібно рівно 130 унікальних імен');
  }

  // Спочатку визначаємо статуси, щоб обране для головної було доступним
  const statuses = names.map(() => {
    const roll = rand();
    if (roll < 0.68) return 'available';
    if (roll < 0.85) return 'reserved';
    return 'adopted';
  });

  const featuredIndexes = new Set();
  for (let i = 0; i < names.length && featuredIndexes.size < 6; i += 1) {
    if (statuses[i] === 'available' && i % 7 === 0) featuredIndexes.add(i);
  }
  for (let i = 0; i < names.length && featuredIndexes.size < 6; i += 1) {
    if (statuses[i] === 'available') featuredIndexes.add(i);
  }

  for (let i = 0; i < names.length; i += 1) {
    const name = names[i];
    const sex = /[ая]$/u.test(name) ? 'female' : 'male';
    const status = statuses[i];
    const ageMonths = rand() < 0.16 ? randInt(3, 11) : randInt(12, 180);
    const breed = pickWeighted(BREEDS);
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    usedSlugs.add(slug);

    const daysAgo = randInt(14, 700);
    const intakeDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const dateLabel = formatDate(intakeDate);

    const primaryImage = `/images/animals/cat-${String((i % IMAGE_VARIANTS.length) + 1).padStart(2, '0')}.svg`;
    const secondaryImage = `/images/animals/cat-${String(((i + 3) % IMAGE_VARIANTS.length) + 1).padStart(2, '0')}.svg`;
    const photos = i % 3 === 0 ? [primaryImage, secondaryImage] : [primaryImage];

    const temperamentPool = sex === 'female' ? TEMPER_F : TEMPER_M;
    const shuffled = [...temperamentPool].sort(() => rand() - 0.5);
    const health = sex === 'female'
      ? ['щеплена', 'стерилізована', 'чіпована']
      : ['щеплений', 'кастрований', 'чіпований'];
    const traits = [...health, ...shuffled.slice(0, 2)];

    const summary = pick(sex === 'female' ? SUMMARY_F : SUMMARY_M)(name);
    const hobby = pick(HOBBIES);
    const home = pick(HOMES);

    const paragraphOne = sex === 'female'
      ? `${name} потрапила до притулку ${dateLabel}. Вона пройшла огляд у ветеринара, отримала всі необхідні щеплення та вже готова до знайомства з родиною.`
      : `${name} потрапив до притулку ${dateLabel}. Він пройшов огляд у ветеринара, отримав усі необхідні щеплення та вже готовий до знайомства з родиною.`;

    const paragraphTwo = sex === 'female'
      ? `Найбільше вона любить ${hobby}. Їй підійде ${home}.`
      : `Найбільше він любить ${hobby}. Йому підійде ${home}.`;

    const paragraphThree = (() => {
      if (status === 'available') {
        return sex === 'female'
          ? `Зараз ${name} чекає на знайомство в притулку. Завітайте — можливо, саме ви станете її родиною.`
          : `Зараз ${name} чекає на знайомство в притулку. Завітайте — можливо, саме ви станете його родиною.`;
      }
      if (status === 'reserved') {
        return `Зараз ${name} готується до переїзду в нову родину. Ви можете залишити заявку на випадок, якщо плани зміняться.`;
      }
      return sex === 'female'
        ? `Історія ${name} вже має щасливе завершення — вона вдома. Але в притулку залишилося багато інших котів, які чекають на вас.`
        : `Історія ${name} вже має щасливе завершення — він вдома. Але в притулку залишилося багато інших котів, які чекають на вас.`;
    })();

    const content = `---
name: "${name}"
sex: ${sex}
ageMonths: ${ageMonths}
breed: "${breed}"
status: ${status}
${yamlList('photos', photos)}
${yamlList('traits', traits)}
summary: "${summary}"
intakeDate: ${intakeDate.toISOString().slice(0, 10)}
featured: ${featuredIndexes.has(i)}
---

${paragraphOne}

${paragraphTwo}

${paragraphThree}
`;

    await writeFile(path.join(animalsDir, `${slug}.md`), content, 'utf8');
  }

  console.log(`Створено ${names.length} профілів котів і ${IMAGE_VARIANTS.length} зображень.`);
}

await main();
