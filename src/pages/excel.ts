import * as XLSX from "xlsx";

import { settingsPanel } from "../ui/settings.ts";

import commutator from "../core/commutator.ts";
import { initPopovers, mountShell } from "../ui/shell.ts";
import { byId, expandInput, initSettings, searchInput } from "../settings.ts";

type Mode = "decompose" | "expand";

const MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const root = "../";

mountShell({
  root,
  active: "excel",
  materialIcons: true,
  main: `<main class="container">
      <br />
      <h2 class="border-1">
        Decompose algorithms in commutator notation.
      </h2>
      <br />
      ${settingsPanel()}
      <br /><br />
      <p>
        Import an excel file(*.xlsx, *.xls, *.csv), decompose all the algorithms
        in commutator notation or expand commutator notation into regular ones.
      </p>
      <p>
        You can download the excel example
        <a href="${root}assets/files/test.xlsx" target="blank">here</a> first.
      </p>
      <div class="mb-3">
        <label class="form-label" for="upfile1"
          ><strong>Decompose:</strong></label
        >
        <input
          type="file"
          class="form-control"
          id="upfile1"
          accept=".xlsx, .xls, .csv"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upfile2"><strong>Expand:</strong></label>
        <input
          type="file"
          class="form-control"
          id="upfile2"
          accept=".xlsx, .xls, .csv"
        />
      </div>
      <div id="out"></div>
    </main>`,
});

const output = byId<HTMLDivElement>("out");

function run(algorithm: string, mode: Mode): string {
  return mode === "decompose"
    ? commutator.search(searchInput(algorithm))[0]
    : commutator.expand(expandInput(algorithm));
}

function ordinal(day: number): string {
  const digit = day % 10;
  const suffix = ["st", "nd", "rd", "th"];
  if (digit < 1 || digit > 3) {
    return `${day}${suffix[3]}`;
  }
  return `${day}${suffix[digit - 1]}`;
}

function readmeSheet(now: Date): XLSX.WorkSheet {
  return XLSX.utils.aoa_to_sheet([
    ["This file is post processed by https://zixingwang.com/commutator"],
    [
      `Latest update on ${ordinal(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    ],
  ]);
}

function processWorkbook(workbook: XLSX.WorkBook, mode: Mode): void {
  const formulae = XLSX.utils.sheet_to_formulae(
    workbook.Sheets[workbook.SheetNames[0]],
  );
  const cells: Record<string, string> = {};
  const columns: string[] = [];
  let rowCount = 0;
  for (const formula of formulae) {
    const [reference, value] = formula.split("=");
    const row = parseInt(reference.slice(1), 10);
    if (row >= rowCount) {
      rowCount = row;
    }
    cells[reference] = value;
    columns.push(reference.charAt(0));
  }
  const uniqueColumns = Array.from(new Set(columns));
  const rows: string[][] = [];
  let html = '<table class="excel-table">';
  for (let i = 1; i <= rowCount; i++) {
    html += "<tr>";
    const row: string[] = [];
    for (const column of uniqueColumns) {
      const reference = `${column}${i}`;
      if (!(reference in cells)) {
        html += "<td></td>";
        continue;
      }
      const algorithm = cells[reference].replace("'", "");
      html += `<td>${algorithm}</td>`;
      row.push(algorithm);
      if (algorithm.length < 4) {
        continue;
      }
      const start = performance.now();
      const result = run(algorithm, mode);
      const duration = (performance.now() - start).toFixed(3);
      html += `<td>${result} (Time: ${duration} ms)</td>`;
      row.push(result);
      row.push(duration);
    }
    html += "</tr>";
    rows.push(row);
  }
  html += "</table>";
  output.innerHTML = html;

  const resultBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    resultBook,
    XLSX.utils.aoa_to_sheet(rows),
    "Sheet1",
  );
  XLSX.utils.book_append_sheet(resultBook, readmeSheet(new Date()), "Readme");
  XLSX.writeFile(resultBook, "output.xlsx");
}

function load(file: File, mode: Mode): void {
  const reader = new FileReader();
  reader.onload = () => {
    processWorkbook(XLSX.read(reader.result, { type: "binary" }), mode);
  };
  reader.readAsBinaryString(file);
}

function handle(mode: Mode) {
  return (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files === null) {
      return;
    }
    for (const file of files) {
      load(file, mode);
    }
    byId<HTMLInputElement>("upfile1").value = "";
    byId<HTMLInputElement>("upfile2").value = "";
  };
}

initSettings();
initPopovers();

byId<HTMLInputElement>("upfile1").addEventListener(
  "change",
  handle("decompose"),
);
byId<HTMLInputElement>("upfile2").addEventListener("change", handle("expand"));
