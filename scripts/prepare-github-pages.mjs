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
  if (!/\.(?:html|css|webmanifest)$/i.test(file)) continue;
  const source = await readFile(file, "utf8");
  const prepared = source
    .replace(/\b(href|src|poster)=(['"])\/(?!\/)/g, `$1=$2${prefix}/`)
    .replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}/`)
    // TanStack serializes route chunk URLs inside its inline hydration payload.
    .replace(/(['"])\/assets\//g, `$1${prefix}/assets/`)
    .replace(/"start_url"\s*:\s*"\/(?!\/)/g, `"start_url": "${prefix}/`);
  if (prepared !== source) await writeFile(file, prepared);
}

// GitHub Pages uses this document for paths that are not pre-rendered.
await cp(join(output, "index.html"), join(output, "404.html"));
await writeFile(join(output, ".nojekyll"), "");
