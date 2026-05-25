# UI Contract: MusicCorp UI Service

The MusicCorp UI is a customer-facing storefront used to generate realistic lab traffic. It must not duplicate the 004 lab testing workspace.

## Routes

### `/`

Primary catalog and cart page.

**Required states**:

- Loading catalog
- Catalog loaded
- Empty catalog
- Catalog unavailable
- Filtered no-results
- Cart empty
- Cart active
- Cart blocked by unavailable item

**Required interactions**:

- Search catalog by title or artist
- Filter by genre
- Add available item to cart
- Open cart
- Update item quantity
- Remove item
- Continue to checkout
- Retry catalog load

### `/checkout`

Cart review and checkout form.

**Required states**:

- Valid cart with empty form
- Field validation errors
- Submitting order
- Order created and payment submitting
- Order failed
- Payment failed after order success
- Checkout confirmed

**Required interactions**:

- Enter customer email
- Select payment method
- Submit checkout once
- Retry failed order or payment step
- Return to catalog with cart preserved

### `/confirmation`

Customer-readable result screen after checkout.

**Required states**:

- Confirmed order and payment
- Order created but payment failed
- Missing result context after refresh

**Required interactions**:

- Start a new cart after confirmed checkout
- Retry payment when order succeeded but payment failed
- Return to catalog

## Visual and Interaction Requirements

- First viewport must prioritize real catalog content and cart status.
- Use an entertainment storefront feel with high-contrast customer calls to action.
- Use shadcn/ui source components for shared primitives such as Button, Card, Sheet, Dialog, Input, Label, Select, Alert, Badge, Skeleton, Sonner, and Tooltip.
- Use a varied accessible palette based on deep text, light surfaces, indigo primary actions, orange checkout action, and one supporting success/accent color.
- Use product imagery or local cover visuals for catalog items.
- Do not use emoji icons as interface controls.
- Do not use in-app text explaining lab implementation details, keyboard shortcuts, or styling.
- Buttons, form fields, filters, and cart controls must have visible focus states.
- Primary touch targets must be at least 44px by 44px.
- Loading and disabled states must prevent duplicate checkout submissions.
- At 375px, 768px, 1024px, and 1440px widths, no text or controls may overlap and the page must avoid horizontal scrolling.

## Separation From 004

- No raw method/path/header/body composer appears in the MusicCorp UI.
- No request preset list from 004 appears in the MusicCorp UI.
- The control panel remains the place for lab orchestration, testing utilities, and observation.
- The MusicCorp UI can show recent customer actions, but not a full HTTP inspector.

## Storefront Activity Panel

The optional learner-facing activity summary shows the last few customer actions:

- Action label
- Status
- Duration
- Timestamp
- Business summary

It must not expose editable raw HTTP request controls.
