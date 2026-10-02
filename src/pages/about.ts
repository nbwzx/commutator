import { mountShell } from "../ui/shell.ts";

mountShell({
  root: "../",
  active: "about",
  main: `<main class="container">
      <br />
      <h2>Author</h2>
      <p>This project is made by <b>Zixing Wang</b>.</p>
      <p>Contact me at:</p>
      <ul>
        <li><a href="https://zixingwang.com">Personal website</a></li>
        <li><a href="mailto:nbwzx@126.com">Email</a></li>
        <li><a href="https://github.com/nbwzx">Github</a></li>
        <li><a href="https://www.facebook.com/zixingwang.cn">Facebook</a></li>
        <li>
          <a href="https://www.researchgate.net/profile/Zixing-Wang-5"
            >Researchgate</a
          >
        </li>
        <li><a href="https://twitter.com/nbwzx123">Twitter</a></li>
      </ul>
      <h2>License</h2>
      <p>
        This project is licensed under
        <a href="https://mit-license.org">MIT</a>.
      </p>
      <h2>Support</h2>
      <p>
        This website is built with
        <a href="https://www.typescriptlang.org">TypeScript</a> and
        <a href="https://vite.dev">Vite</a>, and styled by
        <a href="https://getbootstrap.com">Bootstrap v5.3</a>.
      </p>
      <p>
        The image in the Home page was created by
        <a href="https://da.m.wikipedia.org/wiki/Fil:Cayley_graph_of_F2.svg"
          >Dbenbenn</a
        >.
      </p>
      <p>
        The Source code page is powered by
        <a href="https://prismjs.com">Prism</a>.
      </p>
      <p>
        The Excel page is powered by <a href="https://sheetjs.com">SheetJS</a>.
      </p>
      <p>
        Thank <a href="https://github.com/abunickabhi">Abhijeet Ghodgaonkar</a>,
        <a href="https://github.com/lgarron">Lucas Garron</a> and
        <a href="https://github.com/jarlly678">Songtao Mao</a> for their
        valuable suggestions on this project.
      </p>
    </main>`,
});
