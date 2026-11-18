# Try another search engine

Firefox extension for switching between search engines from a results page. The existing Firefox add-on is [available on AMO](https://addons.mozilla.org/firefox/addon/try-another-search-engine/).

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run check
npm run lint:firefox
```

The Firefox package is generated from `manifest.template.json`, `src/`, and `icons/` in `dist/firefox/`. Local checks use a temporary version `0.0.0`. To load the extension manually in Firefox, run `npm run prepare:firefox` and select `dist/firefox/manifest.json` as the temporary add-on.

The extension settings let users enable search engines and change their order. Search URLs and source-page rules live together in `src/common/searchEngines.js`; adding an engine also requires its host in `manifest.template.json` and an icon in `icons/`. The toolbar and settings page follow the browser's light or dark color scheme.

## Release

Create a draft in GitHub Releases with a tag in plain `N.N.N` form (for example, `1.0.0`) and write the release notes in its description. The tag must point to a commit containing the release workflow and becomes the version in the generated Firefox manifest.

Click **Publish release** to submit a stable release to the listed AMO channel. The workflow sends the GitHub release description as the English release notes at publication time. Drafts, tag pushes, and GitHub prereleases do not submit to AMO. Later edits to the GitHub description do not update AMO.

The workflow checks formatting and the Firefox package on branch pushes, pull requests, and published releases. Configure repository secrets `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` from [AMO API credentials](https://addons.mozilla.org/developers/addon/api/key/). Each listed submission is subject to Mozilla's review.

AMO has no separate beta channel for listed extensions. An unlisted signed build can be used for private testing.
