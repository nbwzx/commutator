import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";

import { Popover } from "bootstrap";

/** Navigation entries in display order; the repository link and About are appended. */
const NAV_LINKS = [
  { id: "home", label: "Home", path: "" },
  { id: "introduction", label: "Introduction", path: "introduction/" },
  { id: "cube", label: "Rubik's cube", path: "cube/" },
  { id: "excel", label: "Excel", path: "excel/" },
  { id: "code", label: "Source code", path: "code/" },
  { id: "about", label: "About", path: "about/" },
] as const;

const REPOSITORY = "https://github.com/nbwzx/Commutator";

export interface ShellOptions {
  /** Path back to the site root: "./" from the root page, "../" from a page directory. */
  root: string;
  /** Id of the current entry in `NAV_LINKS`. */
  active: string;
  /** The `<main>` element of the page. */
  main: string;
  /** Loads the Material Icons font, which only the settings panels need. */
  materialIcons?: boolean;
}

function navItem(
  root: string,
  active: string,
  link: (typeof NAV_LINKS)[number],
): string {
  const isActive = link.id === active;
  const className = isActive ? "nav-link active" : "nav-link";
  const ariaCurrent = isActive ? ' aria-current="page"' : "";
  return `<li class="nav-item"><a class="${className}"${ariaCurrent} href="${root}${link.path}">&nbsp;&nbsp;${link.label}&nbsp;&nbsp;</a></li>`;
}

function navbar(root: string, active: string): string {
  const items = NAV_LINKS.map((link) => navItem(root, active, link));
  items.splice(
    NAV_LINKS.findIndex((link) => link.id === "about"),
    0,
    `<li class="nav-item"><a class="nav-link" href="${REPOSITORY}" target="blank">&nbsp;&nbsp;Github repository&nbsp;&nbsp;</a></li>`,
  );
  return `<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="${root}">Commutator</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">${items.join("")}</ul>
        </div>
      </div>
    </nav>`;
}

/** Writes the shared head tags, the navigation bar and the page body. */
export function mountShell(options: ShellOptions): void {
  const { root, active, main, materialIcons = false } = options;
  document.documentElement.lang = "en";
  document.title = "Commutator";
  document.head.insertAdjacentHTML(
    "beforeend",
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
      '<meta name="description" content="" />' +
      '<meta name="author" content="Zixing Wang" />' +
      `<link rel="icon" href="${root}assets/images/logo.ico" type="image/x-icon" />` +
      (materialIcons
        ? '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />'
        : ""),
  );
  document.body.innerHTML = navbar(root, active) + main;
}

/** Enables the help popovers that the settings panels mark with `data-toggle="popover"`. */
export function initPopovers(): void {
  for (const trigger of document.querySelectorAll<HTMLElement>(
    '[data-toggle="popover"]',
  )) {
    new Popover(trigger);
  }
}
