# Backend Adapter Contract: MusicCorp UI Service

The MusicCorp UI uses an internal server-side adapter to consume the existing MusicCorp backend. Browser components call storefront actions and receive normalized customer-facing data; they do not call backend containers directly.

## Configuration

- `MUSICCORP_BACKEND_BASE_URL`: server-side base URL for the MusicCorp backend entrypoint.
- Default Docker value: `http://monolith:8080`
- Default local development value: `http://localhost:8080`
- Future gateway-compatible value: `http://proxy:8000` or equivalent once the gateway is active in Compose.

## Adapter Functions

```ts
type BackendResult<T> =
  | { ok: true; data: T; durationMs: number; actionId: string }
  | {
      ok: false;
      scope: 'catalog' | 'order' | 'payment';
      category: 'unavailable' | 'validation' | 'timeout' | 'unexpected';
      message: string;
      durationMs: number;
      actionId: string;
      statusCode?: number;
    };
```

### `listCatalogItems()`

Fetches the current catalog.

**Backend request**:

```http
GET /api/catalog
```

**Normalized success shape**:

```json
[
  {
    "id": "1",
    "title": "Kind of Blue",
    "artist": "Miles Davis",
    "genre": "Jazz",
    "price": 12.99,
    "stockQuantity": 50
  }
]
```

**Failure handling**:

- Connection refused, timeout, or 5xx maps to `scope = catalog`, `category = unavailable`.
- Empty arrays are valid and become the storefront empty state.
- Missing optional stock fields are treated as unknown availability, not a crash.

### `getCatalogItem(id)`

Fetches a single catalog item for detail display.

**Backend request**:

```http
GET /api/catalog/{id}
```

**Failure handling**:

- 404 maps to a customer-readable unavailable item message.
- Other backend errors map through the same catalog failure categories.

### `createOrder(input)`

Creates an order from the cart.

**Adapter input**:

```json
{
  "customerEmail": "learner@distributedlab.dev",
  "items": [
    { "catalogItemId": "1", "title": "Kind of Blue", "quantity": 1, "unitPrice": 12.99 }
  ],
  "totalAmount": 12.99
}
```

**Backend request**:

```http
POST /api/orders
Content-Type: application/json
X-Correlation-ID: <clientActionId>
```

The adapter sends a backend-compatible body containing customer email and total amount, while preserving cart line details in the storefront event context.

**Normalized success shape**:

```json
{
  "orderId": "1",
  "status": "PENDING",
  "totalAmount": 12.99,
  "createdAt": "2026-05-25T00:00:00Z"
}
```

**Failure handling**:

- 4xx maps to `category = validation`.
- Timeout maps to `category = timeout`.
- Connection and 5xx errors map to `category = unavailable`.
- The cart must remain intact for retry.

### `submitPayment(input)`

Submits payment for an order.

**Adapter input**:

```json
{
  "orderId": "1",
  "amount": 12.99,
  "method": "CREDIT_CARD",
  "idempotencyKey": "checkout-abc123"
}
```

**Backend request**:

```http
POST /api/payments
Content-Type: application/json
X-Correlation-ID: <clientActionId>
```

**Normalized success shape**:

```json
{
  "paymentId": "1",
  "orderId": "1",
  "status": "COMPLETED",
  "transactionReference": "TXN-abc12345",
  "processedAt": "2026-05-25T00:00:00Z"
}
```

**Failure handling**:

- Payment failure after order success yields a partial checkout result.
- Payment retry must not rebuild the cart or customer details.

## Cross-Cutting Requirements

- All adapter calls generate a `clientActionId`.
- Adapter calls set `X-Correlation-ID` when making backend requests.
- Adapter errors are normalized before reaching UI components.
- The adapter does not expose arbitrary URL, method, header, or body editing to users.
- The adapter must be covered by tests for success, empty response, validation error, unavailable backend, timeout, and malformed backend response.
