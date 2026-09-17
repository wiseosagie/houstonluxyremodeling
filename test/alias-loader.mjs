// Minimal ESM loader hook so `node --test` can resolve the project's `@/*`
// path alias (defined in tsconfig.json) without pulling in a bundler or
// test framework. Registered from test/register.mjs via node:module.
import { pathToFileURL, fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(projectRoot, "..", "src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const relative = specifier.slice(2);
    const hasExtension = /\.(ts|tsx|js|jsx|json)$/.test(relative);
    const candidates = hasExtension
      ? [join(srcRoot, relative)]
      : [
          join(srcRoot, `${relative}.ts`),
          join(srcRoot, `${relative}.tsx`),
          join(srcRoot, relative, "index.ts"),
        ];
    const match = candidates.find((path) => existsSync(path));
    if (match) {
      return nextResolve(pathToFileURL(match).href, context);
    }
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    // Extensionless imports (relative project files ending up as .ts, or
    // Next.js's own subpath entry points like "next/server" which have no
    // package.json "exports" map) aren't auto-resolved by native ESM the way
    // webpack/CJS require do it. Retry with common extensions.
    if (error?.code === "ERR_MODULE_NOT_FOUND" && !/\.\w+$/.test(specifier)) {
      for (const ext of [".ts", ".tsx", ".js"]) {
        try {
          return await nextResolve(`${specifier}${ext}`, context);
        } catch {
          // try the next extension
        }
      }
    }
    throw error;
  }
}
