export type Meal = {
  code: string;
  name: string;
  nameEn?: string;
  desc: string;
  descEn?: string;
  allergens: string;
  spicy?: boolean;
  veg?: boolean;
};

export type DayMenu = {
  day: string;
  dayEn?: string;
  soup: Meal;
  meals: Meal[];
  dessert: Meal;
};

export type WeeklyMenu = {
  weekStart: string;
  prices: { set: number; soup: number; main: number; dessert: number };
  days: DayMenu[];
};

type MenuPayload = Partial<WeeklyMenu> & { menuText?: unknown };

const DAY_NAMES = [
  { cz: "Pondělí", en: "Monday", match: "PONDĚLÍ" },
  { cz: "Úterý", en: "Tuesday", match: "ÚTERÝ" },
  { cz: "Středa", en: "Wednesday", match: "STŘEDA" },
  { cz: "Čtvrtek", en: "Thursday", match: "ČTVRTEK" },
  { cz: "Pátek", en: "Friday", match: "PÁTEK" },
] as const;

const DESCRIPTION_START = /\s+(křupav(?:á|é|ý)|restovan(?:é|á|ý)|grilovan(?:ý|á|é)|pečen(?:é|á|ý)|smažen(?:é|á|ý)|kuřecí|vepřové|hovězí|kachní|losos|krevety|thajsk(?:ý|á|é)|letní|rýžové|udon|zelenin(?:a|ový|ová|ové))(?=\s|,|$)/i;

function normalizeText(value: string) {
  return value
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.replace(/^[•·–—-]\s*/, "").trim())
    .filter(Boolean)
    .join("\n");
}

function normalizeAllergens(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean).join(", ");
}

function mergeAllergens(first: string, second: string) {
  const values = `${first},${second}`.split(",").map((item) => item.trim()).filter(Boolean);
  return [...new Set(values)].join(", ");
}

function extractAllergens(value: string) {
  const match = value.match(/(?:^|\s)((?:\d{1,2}\s*,\s*)*\d{1,2})\s*$/);
  if (!match || match.index === undefined) return { text: value.trim(), allergens: "" };
  return {
    text: value.slice(0, match.index).trim(),
    allergens: normalizeAllergens(match[1]),
  };
}

function cleanDishText(value: string) {
  const spicy = /🌶|\bchilli?\b/i.test(value);
  return { text: value.replace(/🌶️?/g, "").replace(/\s+/g, " ").trim(), spicy };
}

function splitSimpleDish(value: string) {
  const match = value.match(/\s+(s|se|tradiční)\s+/i);
  if (!match || match.index === undefined) return { name: value.trim(), desc: "" };
  return { name: value.slice(0, match.index).trim(), desc: value.slice(match.index + 1).trim() };
}

function splitMainDish(value: string) {
  const match = value.match(DESCRIPTION_START);
  if (!match || match.index === undefined) return { name: value.trim(), desc: "" };
  return { name: value.slice(0, match.index).trim(), desc: value.slice(match.index + 1).trim() };
}

function parseDish(code: string, value: string, simple = false): Meal {
  const allergenResult = extractAllergens(value);
  const cleaned = cleanDishText(allergenResult.text);
  const split = simple ? splitSimpleDish(cleaned.text) : splitMainDish(cleaned.text);
  return {
    code,
    name: split.name,
    desc: split.desc,
    allergens: allergenResult.allergens,
    spicy: cleaned.spicy,
  };
}

function priceFrom(text: string, pattern: RegExp, fallback: number) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : fallback;
}

function parsePrices(text: string) {
  return {
    set: priceFrom(text, /MENU\s*SET[\s\S]{0,80}?(\d{2,4})\s*Kč/i, 189),
    soup: priceFrom(text, /(?:^|\n)\s*Polévka\s*:\s*(\d{2,4})\s*Kč/im, 25),
    main: priceFrom(text, /Hlavní\s*chod\s*:\s*(\d{2,4})\s*Kč/i, 165),
    dessert: priceFrom(text, /(?:^|\n)\s*Dezert\s*:\s*(\d{2,4})\s*Kč/im, 20),
  };
}

function parseDayBlock(lines: string[], dayIndex: number): DayMenu | null {
  const day = DAY_NAMES[dayIndex];
  const firstLine = lines[0]?.replace(new RegExp(`^${day.match}\\s*`, "i"), "") ?? "";
  const soupMatch = firstLine.match(/Polévka\s*:\s*(.+)$/i);
  if (!soupMatch) return null;

  const soup = parseDish("Polévka", soupMatch[1], true);
  const meals: Meal[] = [];
  let dessert: Meal | null = null;
  let activeMeal: Meal | null = null;

  for (const line of lines.slice(1)) {
    const dessertMatch = line.match(/^Dezert\s*:\s*(.+)$/i);
    if (dessertMatch) {
      dessert = parseDish("Dezert", dessertMatch[1], true);
      activeMeal = null;
      continue;
    }

    const mealMatch = line.match(/^([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]\d+)\s*[.:]?\s+(.+)$/i);
    if (mealMatch) {
      activeMeal = parseDish(mealMatch[1].toUpperCase(), mealMatch[2]);
      meals.push(activeMeal);
      continue;
    }

    if (activeMeal) {
      const continuation = extractAllergens(line);
      const label = /^Příloha\s*:/i.test(continuation.text) ? " · " : " ";
      activeMeal.desc = `${activeMeal.desc}${label}${continuation.text}`.trim();
      activeMeal.allergens = mergeAllergens(activeMeal.allergens, continuation.allergens);
    }
  }

  if (!meals.length || !dessert || !soup.name) return null;
  return { day: day.cz, dayEn: day.en, soup, meals, dessert };
}

export function parsePastedMenu(menuText: string, weekStart: string): WeeklyMenu | null {
  const text = normalizeText(menuText);
  const lines = text.split("\n");
  const starts = DAY_NAMES.map((day) => lines.findIndex((line) => new RegExp(`^${day.match}(?:\\s|$)`, "i").test(line)));
  if (starts.some((index) => index < 0)) return null;

  const days = DAY_NAMES.map((_, index) => {
    const end = index === DAY_NAMES.length - 1 ? lines.length : starts[index + 1];
    return parseDayBlock(lines.slice(starts[index], end), index);
  });

  if (days.some((day) => !day)) return null;
  return { weekStart, prices: parsePrices(text), days: days as DayMenu[] };
}

function isStructuredMenu(value: MenuPayload): value is WeeklyMenu {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value.weekStart ?? ""))
    && !!value.prices
    && Array.isArray(value.days)
    && value.days.length === 5
    && value.days.every((day) => day?.soup && Array.isArray(day.meals) && day.meals.length > 0 && day?.dessert);
}

export function parseMenuPayload(value: unknown): WeeklyMenu | null {
  if (!value || typeof value !== "object") return null;
  const payload = value as MenuPayload;
  const weekStart = String(payload.weekStart ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) return null;
  if (typeof payload.menuText === "string" && payload.menuText.trim()) return parsePastedMenu(payload.menuText, weekStart);
  return isStructuredMenu(payload) ? payload : null;
}
