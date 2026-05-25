# Quickstart: MusicCorp UI Service

This quickstart describes the planned verification path for implementation tasks.

## 1. Install Workspace Dependencies

```bash
pnpm install
```

During implementation, initialize shadcn/ui inside `apps/musiccorp-ui` and add only the primitives required by the storefront contract.

## 2. Run Test-First Storefront Checks

Add failing tests before implementation, then make them pass:

```bash
pnpm --filter musiccorp-ui test --runInBand
```

Required test coverage:

- Catalog load, empty, filter, and unavailable states
- Add, update, remove, and restore cart behavior
- Checkout validation and duplicate-submit prevention
- Successful order and payment flow using mocked backend adapter responses
- Order failure and payment failure preserving cart/form state
- Storefront activity summary without raw request editor behavior

## 3. Verify 004 Is Unchanged

Run the focused 004 checks after MusicCorp UI changes:

```bash
pnpm --filter control-panel test -- labs.prototype.test.tsx --runInBand
mvn -f pom.xml -pl apps/lab-api -Dtest=ServiceRequestControllerTest,ServiceRequestRunnerTest test
```

## 4. Build the New UI

```bash
pnpm --filter musiccorp-ui build
```

## 5. Start the Local Stack

After the Compose service is added:

```bash
docker compose up --build musiccorp-ui monolith postgres lab-api control-panel
```

Expected local endpoints:

- MusicCorp UI: `http://localhost:3003`
- Control panel: `http://localhost:3000`
- Lab API: `http://localhost:3001`
- MusicCorp backend default: `http://localhost:8080`

## 6. Manual Scenario

1. Open `http://localhost:3003`.
2. Confirm the album catalog loads from the MusicCorp backend.
3. Filter by genre and add one Jazz album to the cart.
4. Open checkout, enter `learner@distributedlab.dev`, and submit.
5. Confirm order and payment status appear.
6. Open the control panel separately and verify 004 lab testing utilities are still present.
7. Stop or fault a backend service during a lab and repeat checkout; verify the storefront preserves state and shows a customer-readable failure.

## 7. Compose Health

After implementation, `docker-compose.test.yml` should include the MusicCorp UI in the health runner so the standard platform smoke check covers the new service without replacing existing checks.
