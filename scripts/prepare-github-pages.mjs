import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const output = resolve("dist/client");
const prefix = "/comfort-home-kyiv";

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(target) : [target];
  }));
  return nested.flat();
}

for (const file of await filesIn(output)) {
  if (/\.(?:html|css|webmanifest)$/i.test(file)) {
    const source = await readFile(file, "utf8");
    const prepared = source
      .replace(/\b(href|src|poster)=(['"])\/(?!\/)/g, `$1=$2${prefix}/`)
      .replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}/`)
      // TanStack serializes route chunk URLs inside its inline hydration payload.
      .replace(/(['"])\/assets\//g, `$1${prefix}/assets/`)
      .replace(/"start_url"\s*:\s*"\/(?!\/)/g, `"start_url": "${prefix}/`);
    if (prepared !== source) await writeFile(file, prepared);
    continue;
  }

  if (/\.js$/i.test(file)) {
    const source = await readFile(file, "utf8");
    const prepared = source
      // TanStack Start's client hydration always runs
      // `router.update({ basepath: process.env.TSS_ROUTER_BASEPATH, ... })`
      // right before hydrating (see @tanstack/start-client-core's
      // hydrateStart), which stomps the router's own basepath. That env var
      // is "" for this build (see vite.config.ts for why `router.basepath`
      // isn't set at the plugin level), so left unpatched the client thinks
      // it's mounted at "/", can't match the "/comfort-home-kyiv/..." URL
      // GitHub Pages actually serves it at, and 404s right after hydrating.
      // `basepath`/`serializationAdapters` are the real (unminified) property
      // names on that public `router.update()` call, so this string is stable
      // across builds even though surrounding identifiers get minified.
      .replace(
        /basepath:"",serializationAdapters:/g,
        `basepath:${JSON.stringify(prefix)},serializationAdapters:`,
      )
      // Deliberately NOT touching bare `/assets/...` string literals here
      // (route-level CSS-preload hrefs TanStack Start embeds for its own
      // "is this stylesheet already on the page" check) — patching those
      // produced a double-prefixed `/comfort-home-kyiv/comfort-home-kyiv/...`
      // href on repeat client-side navigations in testing. Left alone they
      // just leave behind a handful of harmless failed speculative-preload
      // requests (`GET /assets/<chunk>.js` 404) that don't affect anything
      // the app actually needs — every real fetch goes through the
      // correctly-prefixed URLs the HTML patch above produces.
      //
      // Portfolio/media/brand image paths are plain public-directory strings
      // baked into route data (e.g. the lightbox's full-size image), not
      // real `<img>` markup — anything that only renders after a client-side
      // interaction (never present in the prerendered HTML) skips the
      // html-file prefixing above entirely and 404s unless patched here too.
      .replace(/(['"])\/(brand|media|presets|projects)\//g, `$1${prefix}/$2/`);
    if (prepared !== source) await writeFile(file, prepared);
  }
}

// GitHub Pages uses this document for paths that are not pre-rendered.
await cp(join(output, "index.html"), join(output, "404.html"));
await writeFile(join(output, ".nojekyll"), "");
