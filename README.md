# SiteGround QA Engineer Interview Task

E2E test automation for the SiteGround demo web application using **Playwright** and **TypeScript**.

## Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install Playwright browsers** (required once per machine)

   ```bash
   npx playwright install chromium
   ```

   To install all browsers (Chromium, Firefox, WebKit):

   ```bash
   npx playwright install
   ```

## Running the Tests

- **Run all tests** (headless):

  ```bash
  npm test
  ```

- **Run with browser visible**:

  ```bash
  npm run test:headed
  ```

- **Run tests in UI mode** (interactive):

  ```bash
  npm run test:ui
  ```

- **Run a specific test file**:

  ```bash
  npx playwright test tests/email-accounts.spec.ts
  npx playwright test tests/email-forwarder.spec.ts
  ```

- **Run a single test by name**:

  ```bash
  npx playwright test -g "TC#1"
  npx playwright test -g "TC#2"
  ```

## Viewing the Report

After a run, open the HTML report:

```bash
npm run test:report
```

Or open the report file manually: `playwright-report/index.html` (created after `npm test`).

## Test Cases

### TC#1 – Add an email account

- Loads the home page with the demo token.
- Navigates to **Email → Accounts**.
- Verifies the **Select Domain** dropdown contains only:  
  `qa-automation-tools.com`, `store.qa-automation-tools.com`, `parked-qa-automation-tools.com`, `site-tools-demo.net`.
- Selects **site-tools-demo.net**.
- Enters account name **test_account**.
- Clicks **Generate** for the password and checks the password field is filled.
- Clicks **Create** and verifies the success message:  
  **"Email account &lt;account name&gt; is created"**.
- Verifies the new account appears in the **Manage Email accounts** list.

### TC#2 – Add an empty email Forwarder

- Loads the home page with the demo token.
- Navigates to **Email → Forwarders**.
- Verifies the **Select Domain** dropdown contains the same four domains as above.
- Selects **site-tools-demo.net**.
- Leaves **Forward all messages sent to:** and **To email address:** empty.
- Clicks **Create**.
- Verifies the **"Required field"** error is shown for the **"Forward all messages sent to:"** input.

## Project Structure

The tests use the **Page Object Model (POM)** to keep selectors and page interactions in reusable classes; specs focus on test flow and assertions.

```
SiteGroundTask/
├── playwright.config.ts       # Playwright configuration
├── package.json
├── tsconfig.json
├── README.md                  # This file
└── tests/
    ├── fixtures.ts            # Test fixtures and HOME_URL with demo token
    ├── email-accounts.spec.ts # TC#1 – Add email account
    ├── email-forwarder.spec.ts # TC#2 – Add empty email forwarder
    └── pages/                 # Page objects
        ├── index.ts           # Re-exports all page objects
        ├── HomePage.ts        # Home page: navigation (Email → Accounts / Forwarders)
        ├── EmailAccountsPage.ts   # Email Accounts: domain, form, table
        └── EmailForwardersPage.ts # Email Forwarders: domain, form, validation
```

### Page objects

- **HomePage** – `goto()`, `openEmailAccounts()`, `openEmailForwarders()` for navigation.
- **EmailAccountsPage** – Domain dropdown, account name/password inputs, Generate/Create, success message, and accounts table.
- **EmailForwardersPage** – Domain dropdown, “Forward to” input, Create button, and validation errors.

Specs instantiate these with the Playwright `page` and call their methods; assertions remain in the test files.

## Application Under Test

- **URL:** `https://sqqadevs.com/?demoToken=<token>`
- Access requires the `demoToken` query parameter (JWT). The token used in the tests is provided in the task and is set in `tests/fixtures.ts` (`HOME_URL`).

## Notes

- Tests use **Chromium** by default (see `playwright.config.ts`).
- Runs are **sequential** (`workers: 1`) to avoid shared state issues with the demo app (e.g. localStorage).
- The demo app stores data in the browser’s **localStorage**; each test starts from a fresh page load with the demo token.
