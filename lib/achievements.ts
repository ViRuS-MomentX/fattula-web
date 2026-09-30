export const ACHIEVEMENTS = [
  { id: "search", title: "Искатель", hint: "Откройте поиск (Ctrl + K)" },
  { id: "theme", title: "Свет и тьма", hint: "Переключите тему оформления" },
  { id: "accent", title: "Свой оттенок", hint: "Выберите другой оттенок фиолетового" },
  { id: "letters", title: "Тыкаю буквы", hint: "Нажмите на букву в заголовке главной" },
  { id: "collector", title: "Коллекционер", hint: "Соберите все предметы в карусели" },
  { id: "konami", title: "Старая школа", hint: "↑ ↑ ↓ ↓ ← → ← → B A" },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];

export const ACHIEVEMENTS_KEY = "fattula:achievements";
export const UNLOCK_EVENT = "fattula:unlock";
export const CHANGED_EVENT = "fattula:achievements-changed";

export function readUnlocked(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Ask the Achievements component to record and announce an achievement. */
export function unlock(id: AchievementId) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(UNLOCK_EVENT, { detail: id }));
}
