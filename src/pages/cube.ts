import { settingsPanel } from "../ui/settings.ts";

import commutator from "../core/commutator.ts";
import { initPopovers, mountShell } from "../ui/shell.ts";
import { byId, expandInput, initSettings, searchInput } from "../settings.ts";

mountShell({
  root: "../",
  active: "cube",
  materialIcons: true,
  main: `<main class="container">
      <br />
      <h2 class="border-1">
        Decompose an algorithm in commutator notation.
      </h2>
      <br />
      ${settingsPanel()}
      <br /><br />
      <div class="mb-3">
        <label class="form-label" for="alg"><strong>Input:</strong></label>
        <input
          id="alg"
          type="text"
          class="form-control"
          placeholder="Enter an algorithm"
          aria-label="Enter an algorithm"
          style="font-size: 30px"
        />
      </div>
      <button type="button" id="cube" class="btn btn-danger">
        Decompose Me</button
      >&nbsp;&nbsp;
      <button type="button" id="expand" class="btn btn-danger">Expand Me</button>
      <br />
      <br />
      <div class="mb-3">
        <label class="form-label" for="out"><strong>Output:</strong></label>
        <textarea
          class="form-control"
          id="out"
          rows="1"
          style="font-size: 30px"
          disabled
          readonly
        ></textarea>
      </div>
      <br />
    </main>`,
});

const algorithmInput = byId<HTMLInputElement>("alg");
const output = byId<HTMLTextAreaElement>("out");

function updateTextAreaRows(): void {
  output.rows = 1;
  const style = window.getComputedStyle(output);
  const lineHeight = parseInt(style.lineHeight, 10);
  const padding =
    parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
  output.rows = Math.round((output.scrollHeight - padding) / lineHeight);
}

function decompose(): void {
  output.value = commutator.search(searchInput(algorithmInput.value)).join("\n");
  updateTextAreaRows();
}

function expandNotation(): void {
  output.value = commutator.expand(expandInput(algorithmInput.value));
  updateTextAreaRows();
}

initSettings();
initPopovers();

byId<HTMLButtonElement>("cube").addEventListener("click", decompose);
byId<HTMLButtonElement>("expand").addEventListener("click", expandNotation);
