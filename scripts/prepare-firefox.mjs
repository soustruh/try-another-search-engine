import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "dist", "firefox");
const manifest = JSON.parse(readFileSync(join(root, "manifest.template.json"), "utf8"));
const versionPattern = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
const version = process.env.RELEASE_TAG ?? "0.0.0";

if (!versionPattern.test(version)) {
    throw new Error(`Version ${version} must use N.N.N without a suffix`);
}

manifest.version = version;

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
writeFileSync(join(target, "manifest.json"), `${JSON.stringify(manifest, null, 4)}\n`);
for (const directory of ["src", "icons"]) {
    cpSync(join(root, directory), join(target, directory), { recursive: true });
}
