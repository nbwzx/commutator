import { fileURLToPath } from "node:url";

import { defineConfig, type Plugin } from "vite";

/** Pages that used to live at `/<name>.html` and now live at `/<name>/`. */
const PAGES = ["cube", "excel", "code", "introduction", "about"] as const;

const LEGACY_URL = /^\/([a-z]+)\.html$/;

function redirectPage(name: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Commutator</title>
    <link rel="canonical" href="./${name}/" />
    <meta http-equiv="refresh" content="0; url=./${name}/" />
    <script>
      location.replace(new URL("./${name}/", location.href).href);
    </script>
  </head>
  <body>
    <p>Moved to <a href="./${name}/">${name}</a>.</p>
  </body>
</html>
`;
}

/**
 * Keeps `/cube.html`, `/excel.html`, ... working. The old paths are emitted as
 * redirect stubs and served the same way by the dev server.
 */
function legacyUrls(): Plugin {
  return {
    name: "commutator-legacy-urls",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0];
        const name = LEGACY_URL.exec(path)?.[1];
        if (name !== undefined && (PAGES as readonly string[]).includes(name)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(redirectPage(name));
          return;
        }
        next();
      });
    },
    generateBundle() {
      for (const name of PAGES) {
        this.emitFile({
          type: "asset",
          fileName: `${name}.html`,
          source: redirectPage(name),
        });
      }
    },
  };
}

const resolvePath = (relative: string): string =>
  fileURLToPath(new URL(relative, import.meta.url));

export default defineConfig({
  base: "./",
  publicDir: "public",
  plugins: [legacyUrls()],
  build: {
    outDir: "dist",
    // Keeps the bundle out of `dist/assets`, which `publicDir` already owns.
    assetsDir: "build",
    rollupOptions: {
      input: {
        index: resolvePath("index.html"),
        cube: resolvePath("cube/index.html"),
        excel: resolvePath("excel/index.html"),
        code: resolvePath("code/index.html"),
        introduction: resolvePath("introduction/index.html"),
        about: resolvePath("about/index.html"),
      },
    },
  },
});
