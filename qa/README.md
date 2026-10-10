# QA Automation Take-Home — Playwright + TypeScript

This directory contains the automated test suite for **Section A** of the Recruiterflow Internship Take-Home Assignment.

It demonstrates end-to-end UI automation against [SauceDemo](https://www.saucedemo.com) and REST API automation against [ReqRes](https://reqres.in), implemented in **Playwright** with **strict TypeScript** and the **Page Object Model (POM)** pattern.

---

## 📁 Project Structure

```
qa/
├── pages/
│   ├── LoginPage.ts            # Page Object for SauceDemo login
│   └── ProductsPage.ts         # Page Object for inventory & cart
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts       # Valid login, locked-out user, and logout tests
│   │   └── cart.spec.ts        # Add to cart & remove from cart tests
│   └── api/
│       └── users.spec.ts       # GET user, POST create user, GET 404 tests
├── playwright.config.ts        # Configuration with data-test locator & Chromium
├── tsconfig.json               # Strict TypeScript config
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers (Chromium)
```bash
npx playwright install chromium
```

### 3. Run the Tests
Run the entire suite (UI + API):
```bash
npm test
# or
npx playwright test
```

Run only UI tests:
```bash
npm run test:ui
```

Run only API tests:
```bash
npm run test:api
```

Run in headed mode to see the browser:
```bash
npm run test:headed
```

View the generated HTML report:
```bash
npm run test:report
```

---

## 🧪 Scenarios Covered

### Part 1 — UI Automation (SauceDemo)
1. **Valid Login**:
   - Logs in with `standard_user` / `secret_sauce`.
   - Asserts that the "Products" title is visible on `/inventory.html`.
2. **Locked-Out User**:
   - Attempts login with `locked_out_user` / `secret_sauce`.
   - Asserts that an error banner containing `"locked out"` is displayed.
3. **Add to Cart**:
   - Logs in with `standard_user`.
   - Clicks "Add to cart" on the first product.
   - Asserts that the shopping cart badge displays `"1"`.
4. **Remove from Cart (Bonus)**:
   - Removes the added item from the inventory page.
   - Asserts that the shopping cart badge disappears.
5. **Logout (Bonus)**:
   - Opens the side menu and clicks "Logout".
   - Asserts that the user is redirected to `https://www.saucedemo.com/` and the login button is visible.

### Part 2 — API Automation (ReqRes)
1. **Get User (`GET /api/users/2`)**:
   - Asserts HTTP status is `200`.
   - Asserts `data.email` exists and is a valid non-empty string.
2. **Create User (`POST /api/users`)**:
   - Sends payload `{ "name": "morpheus", "job": "leader" }`.
   - Asserts HTTP status is `201`.
   - Asserts response name matches `"morpheus"`, job matches `"leader"`, and `id` + `createdAt` are present.
3. **User Not Found (`GET /api/users/23`) (Bonus)**:
   - Asserts HTTP status is `404`.

*Note on ReqRes API Key*: ReqRes documentation mentions an `x-api-key` header. The suite sends `x-api-key` using `process.env.REQRES_API_KEY` or a default fallback token.

---

## 🎯 Architectural Highlights
- **Page Object Model (POM)**: UI interactions are encapsulated into `LoginPage` and `ProductsPage`. Tests remain declarative, readable, and resilient against DOM changes.
- **Robust Locators**:
  - `playwright.config.ts` sets `testIdAttribute: 'data-test'`. This allows direct, high-resilience matching via `page.getByTestId('username')`, `page.getByTestId('login-button')`, etc.
  - Interactive controls use accessible role selectors (`page.getByRole('button', { name: 'Add to cart' })`).
- **Headless & CI-Friendly**: Configured to run in headless Chromium by default, with HTML and list reporters enabled.

---

## 📝 Written Reflection
- **What was completed**: All required core scenarios (3 UI tests, 2 API tests) plus all bonus scenarios (cart removal, side menu logout, API 404 verification, Page Object Model).
- **Encountered challenges & solutions**: SauceDemo's dynamic elements can have idiosyncratic CSS classes; utilizing Playwright's `testIdAttribute: 'data-test'` and accessible roles eliminated selector brittleness.
- **Future improvements**: Add visual regression testing via Playwright snapshots, cross-browser matrix execution in GitHub Actions, and environment-parameterized base URLs.
