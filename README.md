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

Write the release notes in `.github/amo-metadata.json`, then push a tag in plain `N.N.N` form (for example, `0.10.1`) to run GitHub Actions. The tag becomes the version in the generated Firefox manifest. Prerelease suffixes are not supported.

The workflow checks formatting and the Firefox package on every push and pull request. A pushed tag then submits its version to the listed AMO channel. Configure repository secrets `AMO_JWT_ISSUER` and `AMO_JWT_SECRET` from [AMO API credentials](https://addons.mozilla.org/developers/addon/api/key/). Each listed submission is subject to Mozilla's review.

AMO has no separate beta channel for listed extensions. An unlisted signed build can be used for private testing.
