import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "dist", "firefox");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

if (process.env.RELEASE_TAG && process.env.RELEASE_TAG !== `v${manifest.version}`) {
    throw new Error(
        `Tag ${process.env.RELEASE_TAG} does not match manifest version ${manifest.version}`,
    );
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(join(root, "manifest.json"), join(target, "manifest.json"));
for (const directory of ["src", "icons"]) {
    cpSync(join(root, directory), join(target, directory), { recursive: true });
}
