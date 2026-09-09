# Onamea

Onamea is a client-side Preact application built with Vite.

## Development

Install dependencies with pnpm, then start the development server:

```sh
pnpm install
pnpm dev
```

Run checks and create a production build with:

```sh
pnpm check
pnpm build
```

Preview the Cloudflare Workers Static Assets deployment locally or deploy it with:

```sh
pnpm cf:dev
pnpm cf:deploy
```

GitHub Actions deploys pushes to `main`. Add `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN` as repository actions secrets. The initial deployment
uses the Worker `workers.dev` address; attach a custom domain in Cloudflare if
desired.
