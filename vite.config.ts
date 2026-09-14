import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {
  higgsfieldDesignInspectorVitePlugin,
  higgsfieldDesignSourceBabelPlugin,
} from "./src/module/design-inspector/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

// The vendored @higgsfield/quanta components import their glyphs from the private
// Nexus-only `@higgsfield-ai/icons`. Generated sites build on the PUBLIC npm
// registry, so we redirect every `@higgsfield-ai/icons/*` import to a Material
// Symbols shim instead (see src/lib/quanta-material-icons.ts). tsconfig.json has
// the matching `paths` entry so type-checking resolves it too.
const QUANTA_ICONS_SHIM = fileURLToPath(
  new URL("./src/lib/quanta-material-icons.ts", import.meta.url),
);

export default defineConfig(({ mode, command }) => {
  const designInspectorEnabled = process.env.HF_DESIGN_INSPECTOR === "1" || mode === "design";
  const githubPages = process.env.VITE_GITHUB_PAGES === "true";
  const netlify = process.env.NETLIFY === "true";

  return {
    // Deliberately NOT setting Vite's `base` for the GitHub Pages build: it
    // also feeds the SSR/prerender internal server's own route matching
    // (same coupling as `tanstackStart({ router: { basepath } })` — see the
    // comment on that plugin call below), and prerendering `/` 404s against
    // an internal server that now expects every request prefixed. The
    // GitHub Pages prefix is patched into the built output afterward — see
    // scripts/prepare-github-pages.mjs.
    resolve: {
      alias: [{ find: /^@higgsfield-ai\/icons(\/.*)?$/, replacement: QUANTA_ICONS_SHIM }],
    },
    // The server bundle runs as a Cloudflare Worker — there is no node_modules
    // at runtime. Vite's default SSR build leaves npm deps as bare external
    // imports (h3, react, @tanstack/*, seroval, …), which resolve on a Node
    // server but throw "No such module" in a Worker. Bundle them all in.
    // (node: builtins stay external — nodejs_compat provides them.)
    ssr: {
      // Bundle all dependencies for the Worker production build. During the
      // local Node-powered dev server, keep CommonJS packages external so
      // Vite does not evaluate React's `module.exports` entry as native ESM.
      ...(command === "build" ? { noExternal: true } : {}),
      // `cloudflare:workers` is a workerd runtime built-in that exposes the Worker
      // env / bindings (D1 `DB`, R2 `STORAGE`). Like node: builtins it must NOT be
      // bundled; the runtime provides it. (`ssr.external` is typed string[].)
      external: ["cloudflare:workers"],
    },
    build: {
      // Keep `cloudflare:*` external in the SSR rollup pass too — `noExternal`
      // above would otherwise try to resolve+bundle it and fail.
      rollupOptions: { external: [/^cloudflare:/] },
    },
    plugins: [
      // Material Symbols SVGs (the app icon set) import as React components via
      // `?react`. `icon: true` sizes them 1em; fill is forced to currentColor so
      // they color like text (the raw SVGs have no fill attribute). Keep the
      // viewBox so CSS sizing scales the glyph.
      svgr({
        svgrOptions: {
          icon: true,
          svgProps: { fill: "currentColor" },
          svgoConfig: {
            plugins: [
              { name: "preset-default", params: { overrides: { removeViewBox: false } } },
            ],
          },
        },
      }),
      // TanStack Start plugin must run before React's plugin.
      //
      // SSR build: `vite build` emits a Workers-shaped server bundle
      // (dist/server/server.js — `export default { fetch }`) plus dist/client
      // (hashed static assets). The platform publishes that as a per-tenant
      // Worker on Workers for Platforms, served at <sub>.higgsfield.app/ (host
      // root, so Vite's default base "/" — no base-path juggling).
      //
      // Rendering happens on the server per request, so site code must be
      // SSR-safe: never touch browser-only globals (window, document,
      // localStorage, navigator) during render or at module top level — only
      // inside effects/handlers, or guarded with `typeof window !== "undefined"`.
      tanstackStart({
        server: { entry: "server" },
        // Pages is static hosting, so emit standalone HTML for every public
        // route only during the Pages workflow.
        //
        // Deliberately NOT setting `router.basepath` here: tried it, and it
        // makes prerender's own "/" request redirect-loop and fail (the
        // internal preview server mounted at that basepath never settles
        // between the bare and trailing-slash form of the root). Prerendering
        // stays basepath-agnostic (server/router run at `/`); the GitHub
        // Pages prefix is patched into the built output afterward — see
        // scripts/prepare-github-pages.mjs, which also fixes up the client
        // bundle's hydration basepath (TanStack Start's `hydrateStart` calls
        // `router.update({ basepath: process.env.TSS_ROUTER_BASEPATH })`,
        // which is "" here, so left unpatched the client 404s after hydrating
        // since it never learns the page is served under `/comfort-home-kyiv`).
        ...(githubPages || netlify ? { prerender: { enabled: true, crawlLinks: true } } : {}),
      }),
      higgsfieldDesignInspectorVitePlugin(designInspectorEnabled),
      react({
        babel: {
          plugins: designInspectorEnabled ? [higgsfieldDesignSourceBabelPlugin] : [],
        },
      }),
      tailwindcss(),
      tsconfigPaths(),
    ],
  };
});
