import { mountShell } from "../ui/shell.ts";

const root = "./";

mountShell({
  root,
  active: "home",
  main: `<main class="flex-shrink-0">
      <div class="container col-xxl-8 px-4 py-5">
        <div class="row g-5 py-5 row-cols-1 row-cols-lg-2">
          <div class="col order-last order-lg-first" style="margin-top: 8%">
            <h1 class="display-5 fw-bold lh-1 mb-3">Commutator</h1>
            <h4 class="lead">Description</h4>
            <ul class="fa-ul pt-2 checklist">
              <li>Decompose a Rubik's cube algorithm.</li>
              <li>Expand a Rubik's cube commutator notation.</li>
              <li>Decompose a free group algorithm.</li>
              <li>Decompose for algorithms in an excel file.</li>
              <li>······</li>
            </ul>
            <div>
              <a type="button" class="btn btn-outline-dark btn-lg px-4 me-md-2" href="${root}cube/">Try It Out</a>
            </div>
          </div>
          <div class="col">
            <img src="${root}assets/images/logo.png" class="img-fluid center-block d-block mx-auto" alt="Commutator Logo"
              width="375" height="375" />
          </div>
        </div>
      </div>
    </main>`,
});
