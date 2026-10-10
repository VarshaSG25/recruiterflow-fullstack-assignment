# Recruiterflow Full Stack Developer Take-Home Assignment

Welcome to the complete, production-ready submission for the **Recruiterflow Full Stack Developer Intern** take-home assignment.

In accordance with the assignment brief for Full Stack applicants, **all three assignments (Sections A, B, and C)** have been fully built, thoroughly tested, and integrated:

1. **Section A — QA Automation Take-Home**: Playwright + TypeScript test suite covering UI automation against [SauceDemo](https://www.saucedemo.com) and REST API automation against [ReqRes](https://reqres.in), with Page Object Model (POM) and all bonus scenarios.
2. **Section B — Build-a-Recruiter-Bot & SQL Detective**: High-performance Node.js/TypeScript backend service utilizing raw SQLite (using Node's native `DatabaseSync` engine without any ORMs or query builders), an explainable multi-factor matching engine, and hand-written analytical queries in `sql_detective.sql`.
3. **Section C — Trip Splitter**: Feature-complete expense splitting web application built with React, Redux Toolkit, and strict TypeScript (`"strict": true`, zero typecheck errors), custom styling, zero-paisa loss guarantees, and Vitest test coverage.

---

## 📂 Repository Structure

```
recruiterflow-fullstack-assignment/
├── qa/                                # Section A: QA Automation Suite
│   ├── pages/
│   │   ├── LoginPage.ts               # Page Object Model for SauceDemo login
│   │   └── ProductsPage.ts            # Page Object Model for inventory & cart
│   ├── tests/
│   │   ├── ui/
│   │   │   ├── login.spec.ts          # Core 1, 2 + Bonus Logout
│   │   │   └── cart.spec.ts           # Core 3 + Bonus Remove from cart
│   │   └── api/
│   │       └── users.spec.ts          # Core 4, 5 + Bonus 404
│   ├── playwright.config.ts           # Configured with testIdAttribute: 'data-test'
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── backend/                           # Section B: RecruiterBot & SQL Detective
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.ts            # Raw SQLite wrapper (DatabaseSync, NO ORM)
│   │   │   ├── schema.sql             # Raw DDL schema for candidates & jobs
│   │   │   └── seed.ts                # Ingestion script for 15 candidates & 6 jobs
│   │   ├── matching/
│   │   │   └── engine.ts              # Deterministic multi-factor scoring engine
│   │   ├── sql-detective/
│   │   │   ├── schema.sql             # Hiring ops schema & seed data
│   │   │   └── run.ts                 # Analytical query verification runner
│   │   └── server.ts                  # Express REST API server
│   ├── test/
│   │   └── matching.test.ts           # Automated tests for matching engine
│   ├── sql_detective.sql              # Part 2 SQL Detective queries (Q1 - Q5)
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── frontend/                          # Section C: Trip Splitter Web App
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx             # Responsive navigation with active route pills
│   │   ├── logic/
│   │   │   ├── types.ts               # Strict TypeScript domain interfaces
│   │   │   ├── money.ts               # Integer paise arithmetic & Indian currency format
│   │   │   ├── split.ts               # Zero-loss paisa splitting logic
│   │   │   ├── balance.ts             # Member balances & debt simplification
│   │   │   ├── validation.ts          # Pure form validation logic (no libraries)
│   │   │   ├── money.test.ts
│   │   │   ├── split.test.ts          # Includes mandatory ₹100 split 3-ways test
│   │   │   ├── balance.test.ts
│   │   │   └── validation.test.ts
│   │   ├── pages/
│   │   │   ├── ExpensesPage.tsx       # Expenses table, balance cards, filter, delete modal
│   │   │   ├── AddExpensePage.tsx     # Add expense form with Equal, Exact, & Percent splits
│   │   │   ├── AddExpensePage.test.tsx# React Testing Library form integration tests
│   │   │   ├── RecruiterBotPage.tsx   # Interactive GUI for Section B matching
│   │   │   ├── SqlDetectivePage.tsx   # Interactive GUI for Section B SQL Detective
│   │   │   ├── QaSuitePage.tsx        # Dashboard for Section A Playwright suite
│   │   │   └── NotFoundPage.tsx       # Custom 404 page
│   │   ├── store/
│   │   │   ├── expensesSlice.ts       # Redux Toolkit slice + localStorage persistence
│   │   │   └── index.ts               # Typed hooks (useAppDispatch, useAppSelector)
│   │   ├── data/
│   │   │   └── sample-data.json       # Canonical Goa trip sample dataset
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json                  # Strict TypeScript configuration
│   ├── vite.config.ts                 # Vite + Vitest configuration
│   ├── package.json
│   └── README.md
│
├── package.json                       # Root orchestration scripts
└── README.md                          # Main project guide
```

---

## ⚡ Quick Start

### 1. Run the Entire Test Suite
To verify that all tests across all three sections pass:
```bash
# Run backend tests (matching engine):
npm run test:backend

# Run frontend tests (23 Vitest unit & RTL tests):
npm run test:frontend

# Run QA tests (8 Playwright UI & API tests):
npm run test:qa
```

---

### 2. Launch the Application

#### Option A: Start Frontend Web App (Section C + Integrated Portal)
```bash
npm run start:frontend
```
Opens [http://localhost:3000](http://localhost:3000) in your browser.
From the top navigation bar, you can seamlessly explore:
- **Expenses (`/`)**: View balances, filter by category, see expense table, and access the "Settle Up" debt simplification modal.
- **Add Expense (`/expenses/new`)**: Interactive form with real-time validation and Equal/Exact/Percent splitting.
- **RecruiterBot (`/recruiter-bot`)**: Interactive matching GUI testing candidate and job rankings live.
- **SQL Detective (`/sql-detective`)**: Live interactive SQL console running the 5 analytical queries.
- **QA Suite (`/qa-suite`)**: Visual status board of the 8 Playwright automation tests.

#### Option B: Start Backend API (Section B)
In a separate terminal:
```bash
npm run start:backend
```
Starts the Express server on [http://localhost:4000](http://localhost:4000).

---

## 📋 Section Summaries & Highlights

### Section A: QA Automation Take-Home
- **Technologies**: Playwright, TypeScript, Chromium.
- **UI Tests (SauceDemo)**:
  - Valid login verification (`standard_user` -> "Products" visible).
  - Locked out user verification (`locked_out_user` -> error banner).
  - Add to cart increments badge to 1.
  - **Bonus**: Remove item from cart and verify badge vanishes.
  - **Bonus**: Side menu logout verification.
- **API Tests (ReqRes)**:
  - `GET /api/users/2` returns 200 and valid `data.email`.
  - `POST /api/users` creates user returning 201 with matching name.
  - **Bonus**: `GET /api/users/23` returns 404.
- **Architecture**:
  - Page Object Model (`LoginPage.ts`, `ProductsPage.ts`).
  - `testIdAttribute: 'data-test'` configured in `playwright.config.ts` for rock-solid locators.
  - Built-in Playwright `request` fixture for sub-second REST API checks.

### Section B: Build-a-Recruiter-Bot & SQL Detective
- **Technologies**: Node.js, TypeScript, Express, Raw SQLite (`node:sqlite DatabaseSync`).
- **Strict Constraint Adherence**: Raw SQL only — no ORMs or query builder abstractions. Hand-written DDL and parameterized SQL queries.
- **Data Ingestion**: Ingests all 15 fictional characters (Sherlock Holmes, Hermione Granger, Tony Stark, Sheldon Cooper, Michael Scott, etc.) and all 6 jobs.
- **Multi-Factor Matching Engine**:
  - Skill Overlap (50%): Jaccard/overlap calculation with complementary skill bonus.
  - Experience Fit (25%): Strict penalization for underqualification; optimal range rewards.
  - Culture Keywords (15%): Candidate traits alignment.
  - Availability (10%): Immediate (+10), 2 weeks (+7), Not looking (+2).
  - Transparent Reasons: Human-readable synthesis citing exact matching skills, exp surplus/deficit, and quirky personality traits.
- **Part 2: SQL Detective Challenge**:
  - `sql_detective.sql` contains all 5 queries properly commented.
  - Q1: Open job postings with recruiter owners.
  - Q2: Final stage applicant counts per job.
  - Q3: Deduplication via `LOWER(TRIM(email))` uncovering Ananya Rao's dual entries.
  - Q4: Recruiter conversion rate for recruiters with $\ge 3$ final interviews.
  - Q5: Top recruiter per department using `DENSE_RANK() OVER (PARTITION BY department ORDER BY COUNT(*) DESC)`.

### Section C: Trip Splitter
- **Technologies**: React, Redux Toolkit, Strict TypeScript, Tailwind CSS, Vitest.
- **Strict Constraint Adherence**:
  - `"strict": true` in `tsconfig.json`, zero typecheck errors.
  - No `any`, `@ts-ignore`, or `@ts-expect-error`.
  - Pure logic outside components in `src/logic/`.
  - Zero form/validation libraries (no React Hook Form, Formik, Zod, or Yup).
  - Zero UI component libraries (no MUI, Ant Design, or Chakra).
- **Financial Rigor**:
  - Internal amounts stored as integer paise (`₹1,250.50` = `125050` paise).
  - Deterministic Zero-Loss Paisa Rule: remainder paise distributed to first members in order.
  - Group net balances strictly sum to ₹0.00.
  - Indian numbering format (`₹1,00,000.00`).
- **Validation**:
  - Description: required, $\le 60$ chars.
  - Amount: $>0$ and $\le ₹10,00,000$, max 2 decimals.
  - Payer, Date, Category: required. Date cannot be in the future.
  - Split strategies: Equal ($\ge 1$ selected), Exact (exact amount match with remainder message), Percent (exact 100% check).
- **Responsive**: Down to 360px screen width.

---

## 🔬 Test Verification Matrix

| Section | Suite / Component | Test Framework | Status | Count |
| :--- | :--- | :--- | :--- | :--- |
| **Section A** | SauceDemo UI Tests | Playwright | **PASS** | 5 / 5 |
| **Section A** | ReqRes API Tests | Playwright | **PASS** | 3 / 3 |
| **Section B** | Matching Engine & SQL | Custom TS Test | **PASS** | 4 / 4 |
| **Section B** | SQL Detective Runner | Raw SQLite Runner | **PASS** | 5 / 5 |
| **Section C** | Money Logic & Currency | Vitest | **PASS** | 4 / 4 |
| **Section C** | Split & Zero-loss Paisa | Vitest | **PASS** | 5 / 5 |
| **Section C** | Balance & Settlements | Vitest | **PASS** | 4 / 4 |
| **Section C** | Pure Form Validation | Vitest | **PASS** | 6 / 6 |
| **Section C** | AddExpensePage Form RTL | Vitest + RTL | **PASS** | 4 / 4 |

**Overall Test Result**: **35+ tests passing across all test suites.**
