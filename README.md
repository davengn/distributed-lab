# DistributedLab

DistributedLab is a local learning sandbox for distributed systems and microservices.

## MusicCorp UI

The MusicCorp storefront is a separate customer-facing UI service for lab traffic generation. It
keeps the existing control panel and 004 lab testing utilities intact while giving learners a real
website flow for catalog browsing, cart management, checkout, and payment retries.

Local endpoints:

- MusicCorp UI: `http://localhost:3003`
- Control panel: `http://localhost:3000`
- Lab API: `http://localhost:3001`
- MusicCorp backend default: `http://localhost:8080`

Useful commands:

```bash
pnpm musiccorp:dev
pnpm musiccorp:test -- --runInBand
pnpm musiccorp:build
docker compose up --build musiccorp-ui monolith postgres lab-api control-panel
```

The UI reads backend traffic through `MUSICCORP_BACKEND_BASE_URL`. In Docker Compose it points to
`http://monolith:8080`; local development defaults to `http://localhost:8080`.
