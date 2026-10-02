import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

import { mountShell } from "../ui/shell.ts";

import source from "../core/commutator.ts?raw";

mountShell({
  root: "../",
  active: "code",
  main: `<main class="container">
      <br />
      <h2 class="border-1">Source code</h2>
      <br />
      <pre class="line-numbers"><code class="language-typescript" id="source"></code></pre>
    </main>`,
});

const code = document.getElementById("source");

if (code !== null) {
  code.textContent = source;
  Prism.highlightElement(code);
}
