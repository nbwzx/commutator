/** The help popover of a settings field. */
function help(title: string): string {
  return `<i
          class="btn btn-default material-icons help-icon"
          title="${title}"
          data-toggle="popover"
          data-bs-placement="bottom"
          data-bs-html="true"
          >help_outline</i
        >`;
}

function numberInput(
  id: string,
  placeholder: string,
  label: string,
  ariaLabel: string,
  title: string,
): string {
  return `<div class="form-check form-check-inline">
        ${label}:
        <input
          type="text"
          class="number-input"
          placeholder="${placeholder}"
          id="${id}"
          aria-label="${ariaLabel}"
        />
        ${help(title)}
      </div>`;
}

function checkbox(
  id: string,
  label: string,
  title: string,
  checked = false,
): string {
  return `<div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="${id}"
          ${checked ? "checked" : ""}
        />
        <label class="form-check-label" for="${id}"> ${label} </label>
        ${help(title)}
      </div>`;
}

/** The panel shared by the Rubik's cube page and the Excel page. */
export function settingsPanel(): string {
  return `<strong>Settings:</strong>
      <br />
      ${numberInput(
        "order",
        "4",
        "Order",
        "Order",
        "order = 4 (e.g. cube)<br />order = 5 (e.g. Megaminx)<br />order = 3 (e.g. Pyraminx)<br />order = 0 means free group",
      )}
      ${checkbox(
        "settingsOuterBracket",
        "Outer bracket for all commutators",
        "Checked [a:[b,c][d,e]]<br />Unchecked a:[[b,c]+[d,e]]",
      )}
      ${checkbox(
        "settingsInitialReplace",
        "Initial Replace",
        "Replace double layer turns<br />(e.g. r → R M')",
        true,
      )}
      ${checkbox(
        "settingsFinalReplace",
        "Final Replace",
        "Replace double layer turns<br />(e.g. R M' → r)",
        true,
      )}
      ${checkbox(
        "settingsCommute",
        "Commute",
        "Handle commute moves<br />(e.g. R and L)",
        true,
      )}
      ${numberInput(
        "settingsMaxDepth",
        "0",
        "Max Depth",
        "Max depth",
        "Upper bound of search depth<br />0 means first solvable depth",
      )}
      <br />
      Sorting rules:
      <br />
      <div class="form-check form-check-inline">
        The score of C:[A,B] is
        <input
          type="text"
          class="number-input"
          placeholder="2.5"
          id="settingsSortScorea"
          aria-label="Score of the longer part"
        />
        * stm(A) +
        <input
          type="text"
          class="number-input"
          placeholder="5"
          id="settingsSortScoreb"
          aria-label="Score of the shorter part"
        />
        * stm(B) + stm(C) (Suppose stm(A) ≥ stm(B), stm means slice turn
        metric)
        ${help("Algs are sorted by score")}
      </div>
      <br />
      ${numberInput(
        "settingsSortScoreAdd",
        "1",
        "Addition penalty",
        "Addition penalty",
        "Score for commutator combo",
      )}
      ${checkbox("settingsFast", "Fast", "Show one result only")}`;
}
