import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const notes = event.release?.body;

if (typeof notes !== "string" || !notes.trim()) {
    throw new Error("Add release notes to the GitHub release before publishing");
}

const metadata = { version: { release_notes: { "en-US": notes } } };
writeFileSync(join(process.env.RUNNER_TEMP, "amo-metadata.json"), JSON.stringify(metadata));
