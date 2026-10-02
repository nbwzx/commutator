import { mountShell } from "../ui/shell.ts";

const root = "../";

/** Inline formula image used throughout the introduction. */
const formula = (name: string, alt: string): string =>
  `<img style="transform: translateY(0.1em); background: white" src="${root}assets/svg/${name}.svg" alt="${alt}" />`;

mountShell({
  root,
  active: "introduction",
  main: `<main class="container">
      <br />
      <h2>Introduction</h2>
      <p>Decompose algorithms in commutator notation.</p>
      <p>
        Let
        ${formula("J9W6pjRIDj", "G")}
        be any group. If
        ${formula("hzGAuZv640", "a,b in G")}, then the commutator of
        ${formula("UhYiFhLcuQ", "a")}
        and
        ${formula("3eUfhUParw", "b")}
        is the element
        ${formula("Ntecnjrojy", "[a,b]=aba^-1b^-1")}. The expression
        ${formula("3LN26IAubW", "x:a")}
        denotes the conjugate of
        ${formula("2gxcQizkRw", "a")}
        by
        ${formula("9iB3HkjVB9", "x")}, defined as
        ${formula("GL6wwtSHya", "xax^-1")}. Therefore,
        ${formula("aeNksYUPvc", "c:[a,b]")}
        means
        ${formula("ECU0xU8Yfx", "c a b a^-1 b^-1 c^-1")}.
      </p>
      <p>
        In this repository, we assume that
        ${formula("Gc1pCvufb5", "G")}
        is a free group.
      </p>
      <p>
        In mathematics, the free group
        ${formula("EAUg5lHTBi", "F_S")}
        over a given set
        ${formula("Ibcd0FcTOp", "S")}
        consists of all words that can be built from members of
        ${formula("DWsWhbICkM", "S")}, considering two words to be different
        unless their equality follows from the group axioms (e.g.
        ${formula("fVzQWUoHVF", "s t=s u u^-1 t")}, but
        ${formula("iwq8fMflYT", "s != t^-1")}
        for
        ${formula("zZWgobxgom", "s, t, u in S")}
        ). The members of
        ${formula("egB8X9ylT4", "S")}
        are called generators of
        ${formula("xVA1KxA0G9", "F_S")}, and the number of generators is the
        rank of the free group. An arbitrary group
        ${formula("SEBZPzvZBn", "G")}
        is called free if it is isomorphic to
        ${formula("6ngjvQGpMe", "F_S")}
        for some subset
        ${formula("97GOyXaPGv", "S")}
        of
        ${formula("8dHefb78dL", "G")}, that is, if there is a subset
        ${formula("QYGvJ9ZjmI", "S")}
        of
        ${formula("Oqhmg8BnIn", "G")}
        such that every element of
        ${formula("BqRlGijkvY", "G")}
        can be written in exactly one way as a product of finitely many
        elements of
        ${formula("SBgCUnUpcK", "S")}
        and their inverses (disregarding trivial variations such as
        ${formula("C7FL0bS5Mk", "s t=s u u^-1 t")}
        ).
      </p>
      <p>
        It is worth researching since many 3-cycle and 5-cycle algorithms in a
        Rubik&#39;s cube can be decomposed into commutators.
      </p>
      <p>Example 1:</p>
      <pre><code>Input: s = "R U R' U'"
Output: "[R,U]"</code></pre>
      <p>Example 2:</p>
      <pre><code>Input: s = "a b c a' b' c'"
Output: "[a b,c a']"
Explanation: a b + c a' + b' a' + a c' = a b c a' b' c'.
And "[a b,c b]" is also a valid answer.</code></pre>
      <p>Example 3:</p>
      <pre><code>Input: s = "D F' R U' R' D' R D U R' F R D' R'"
Output: "D:[F' R U' R',D' R D R']"
And "[D F' R U' R' D',R D R' D']" is also a valid answer.</code></pre>
      <p>Example 4:</p>
      <pre><code>Input: s = "R' F' R D' R D R2 F2 R2 D' R' D R' F' R"
Output: "R' F':[R D' R D R2,F2]"</code></pre>
      <p>Example 5:</p>
      <pre><code>Input: s = "R U R'"
Output: "Not found."</code></pre>
      <p>Constraints:</p>
      <ul>
        <li>s consist of only English letters.</li>
      </ul>
    </main>`,
});
