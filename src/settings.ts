import commutator from "./core/commutator.ts";

export type ExpandInput = Parameters<typeof commutator.expand>[0];
export type SearchInput = Parameters<typeof commutator.search>[0];

const COOKIE_DAYS = 30;

/** Text inputs and the value used when the user leaves them empty. */
const NUMBER_FIELDS: ReadonlyArray<{ id: string; fallback: number }> = [
  { id: "order", fallback: 4 },
  { id: "settingsMaxDepth", fallback: 0 },
  { id: "settingsSortScorea", fallback: 2.5 },
  { id: "settingsSortScoreb", fallback: 5 },
  { id: "settingsSortScoreAdd", fallback: 1 },
];

/** Checkboxes whose cookie is stored when they are turned *off*. */
const INVERTED_CHECKBOXES = [
  "settingsInitialReplace",
  "settingsFinalReplace",
  "settingsCommute",
] as const;

/** Checkboxes whose cookie is stored when they are turned *on*. */
const CHECKBOXES = ["settingsOuterBracket", "settingsFast"] as const;

const ALL_FIELDS = [
  ...NUMBER_FIELDS.map((field) => field.id),
  ...INVERTED_CHECKBOXES,
  ...CHECKBOXES,
];

export function byId<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string {
  const prefix = `${name}=`;
  for (const part of decodeURIComponent(document.cookie).split(";")) {
    let cookie = part;
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(prefix) === 0) {
      return cookie.substring(prefix.length, cookie.length);
    }
  }
  return "";
}

function restoreSettings(): void {
  for (const field of NUMBER_FIELDS) {
    const value = getCookie(field.id);
    if (value !== "") {
      byId<HTMLInputElement>(field.id).value = value;
    }
  }
  for (const id of INVERTED_CHECKBOXES) {
    if (getCookie(id) !== "") {
      byId<HTMLInputElement>(id).checked = false;
    }
  }
  for (const id of CHECKBOXES) {
    if (getCookie(id) !== "") {
      byId<HTMLInputElement>(id).checked = true;
    }
  }
}

function saveSettings(): void {
  for (const field of NUMBER_FIELDS) {
    const value = byId<HTMLInputElement>(field.id).value;
    if (value === "") {
      setCookie(field.id, "", -1);
    } else {
      setCookie(field.id, value, COOKIE_DAYS);
    }
  }
  for (const id of INVERTED_CHECKBOXES) {
    if (byId<HTMLInputElement>(id).checked) {
      setCookie(id, "", -1);
    } else {
      setCookie(id, "false", COOKIE_DAYS);
    }
  }
  for (const id of CHECKBOXES) {
    if (byId<HTMLInputElement>(id).checked) {
      setCookie(id, "true", COOKIE_DAYS);
    } else {
      setCookie(id, "", -1);
    }
  }
}

/** Reads the cookies back into the panel and keeps them in sync with every edit. */
export function initSettings(): void {
  restoreSettings();
  for (const id of ALL_FIELDS) {
    const element = byId<HTMLInputElement>(id);
    element.addEventListener("input", saveSettings);
    element.addEventListener("change", saveSettings);
  }
}

function numberField(id: string, fallback: number): number {
  const value = byId<HTMLInputElement>(id).value;
  return value === "" ? fallback : Number(value);
}

function checkbox(id: string): boolean {
  return byId<HTMLInputElement>(id).checked;
}

/** Turns an unchecked "Replace"/"Commute" box into the empty table that disables it. */
function optionalTable(enabled: boolean): Record<string, never> | undefined {
  return enabled ? undefined : {};
}

export function expandInput(algorithm: string): ExpandInput {
  return {
    algorithm,
    order: numberField("order", 4),
    initialReplace: optionalTable(checkbox("settingsInitialReplace")),
    finalReplace: optionalTable(checkbox("settingsFinalReplace")),
    commute: optionalTable(checkbox("settingsCommute")),
  };
}

export function searchInput(algorithm: string): SearchInput {
  return {
    algorithm,
    order: numberField("order", 4),
    outerBracket: checkbox("settingsOuterBracket"),
    initialReplace: optionalTable(checkbox("settingsInitialReplace")),
    finalReplace: optionalTable(checkbox("settingsFinalReplace")),
    abMaxScore: numberField("settingsSortScorea", 2.5),
    abMinScore: numberField("settingsSortScoreb", 5),
    addScore: numberField("settingsSortScoreAdd", 1),
    commute: optionalTable(checkbox("settingsCommute")),
    maxDepth: numberField("settingsMaxDepth", 0),
    fast: checkbox("settingsFast"),
  };
}
