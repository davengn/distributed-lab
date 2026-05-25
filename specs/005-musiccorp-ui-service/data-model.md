# Data Model: MusicCorp UI Service

## CatalogItem

Represents an album displayed by the storefront.

**Fields**:

- `id`: stable backend identifier
- `title`: album title
- `artist`: artist name
- `genre`: display/filter genre
- `price`: decimal customer price
- `stockQuantity`: available stock count when provided
- `coverRef`: local or derived visual asset reference

**Validation Rules**:

- `title`, `artist`, and `genre` must be displayable strings.
- `price` must be numeric and non-negative.
- Items with missing or zero stock are shown as unavailable and cannot be added to cart.

## CatalogFilter

Represents the learner's current catalog view.

**Fields**:

- `query`: search text matched against title and artist
- `genre`: selected genre or `all`
- `availability`: optional available-only filter

**Validation Rules**:

- Empty query shows all items matching the remaining filters.
- Unknown genre values fall back to `all`.

## CartItem

Represents a selected catalog item and quantity.

**Fields**:

- `catalogItemId`
- `title`
- `artist`
- `unitPrice`
- `quantity`
- `availableQuantity`
- `availabilityState`: `available`, `limited`, or `unavailable`

**Validation Rules**:

- `quantity` must be an integer from 1 through the known available quantity when stock is known.
- A cart item with `availabilityState = unavailable` blocks checkout until removed.

## Cart

Represents current purchase intent.

**Fields**:

- `items`
- `subtotal`
- `itemCount`
- `updatedAt`
- `persistenceState`: `fresh`, `restored`, or `cleared`

**Validation Rules**:

- Checkout requires at least one valid cart item.
- Subtotal is calculated from cart item unit prices and quantities.
- Local persistence stores only non-sensitive cart data.

**State Transitions**:

```text
empty -> active -> checking_out -> submitted -> empty
active -> restored
active -> blocked_by_availability
checking_out -> active_on_failure
```

## CheckoutDraft

Represents customer-entered checkout information.

**Fields**:

- `customerEmail`
- `customerName`
- `paymentMethod`
- `termsAccepted`
- `validationErrors`

**Validation Rules**:

- `customerEmail` must be present and email-shaped.
- `paymentMethod` must be one of the supported local lab payment options.
- Required acknowledgements must be accepted before submission.

## OrderSubmission

Represents an order attempt sent to the existing backend.

**Fields**:

- `clientActionId`
- `customerEmail`
- `cartSummary`
- `totalAmount`
- `backendStatus`: `idle`, `submitting`, `succeeded`, `failed`, or `timed_out`
- `backendOrderId`
- `errorMessage`
- `startedAt`
- `completedAt`

**Validation Rules**:

- Requires a valid cart and checkout draft.
- Duplicate submissions are blocked while `backendStatus = submitting`.

## PaymentSubmission

Represents a payment attempt for a created order.

**Fields**:

- `clientActionId`
- `backendOrderId`
- `amount`
- `paymentMethod`
- `backendStatus`
- `backendPaymentId`
- `transactionReference`
- `idempotencyKey`
- `errorMessage`
- `startedAt`
- `completedAt`

**Validation Rules**:

- Requires a successful order submission.
- Repeated retries reuse or display the associated action context so learners can correlate attempts.

## CheckoutResult

Represents the customer-facing outcome after order and payment steps.

**Fields**:

- `status`: `confirmed`, `order_created_payment_failed`, `failed`, or `pending`
- `order`
- `payment`
- `message`
- `nextAction`

**Validation Rules**:

- A confirmed result requires both order and payment success.
- Partial success must keep cart context available until the learner chooses to clear or retry.

## StorefrontEvent

Represents a lab-observable customer action.

**Fields**:

- `clientActionId`
- `label`: catalog load, add to cart, order submit, payment submit, retry
- `status`
- `durationMs`
- `timestamp`
- `businessSummary`

**Validation Rules**:

- Events must not expose secrets or raw payment data.
- Events should be bounded to recent session activity.

## BackendStatusMessage

Represents a customer-readable interpretation of backend availability or error state.

**Fields**:

- `scope`: catalog, cart, order, payment, or checkout
- `severity`: info, warning, error, success
- `title`
- `message`
- `retryAvailable`
- `technicalHint`

**Validation Rules**:

- `message` must be meaningful without requiring raw API knowledge.
- `technicalHint` may name the affected business capability but must not turn the website into a raw request inspector.
