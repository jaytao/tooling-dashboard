# Dev Toolbox

A portal for common developer tooling, built with React, TypeScript, and Vite.

The app has a sidebar listing available utilities; the selected utility is
shown in the main area.

## Getting started

```bash
npm install
npm run dev
```

## Adding a new utility

Each utility lives in its own folder under `src/utilities/` and exports a
`UtilityDefinition` (see `src/utilities/types.ts`):

```ts
export interface UtilityDefinition {
  id: string;            // unique id, also used as the route path
  name: string;          // shown in the sidebar
  description: string;   // shown in the page header
  component: ComponentType;
}
```

To add a utility:

1. Create a folder under `src/utilities/<your-utility>/` containing the
   component and an `index.ts` that exports a `UtilityDefinition`
   (see `src/utilities/timestamp-converter/` for an example).
2. Register it in `src/utilities/registry.ts` by adding it to the
   `utilities` array.

It will automatically appear in the sidebar and be reachable at
`/#/<id>` — no other wiring required.

## Deployment

This project deploys to GitHub Pages automatically via the workflow in
`.github/workflows/deploy.yml` on every push to `main`. It builds the app
and publishes the `dist/` folder using GitHub's Pages Actions.

To enable it for a repository, go to **Settings → Pages** and set the
"Build and deployment" source to **GitHub Actions**.

The Vite `base` path in `vite.config.ts` is set to `/tooling-dashboard/` for
production builds, matching this repo's name
(`https://<user>.github.io/tooling-dashboard/`). Update it if the repo is
renamed.
