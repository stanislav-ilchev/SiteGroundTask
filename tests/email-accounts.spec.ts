import { test, expect, HOME_URL } from './fixtures';
import { HomePage, EmailAccountsPage } from './pages';

const EXPECTED_DOMAIN_OPTIONS = [
  'qa-automation-tools.com',
  'store.qa-automation-tools.com',
  'parked-qa-automation-tools.com',
  'site-tools-demo.net',
];

const ACCOUNT_NAME = 'test_account';

/**
 * TC#1 Add an email account.
 * 1. Load the home page
 * 2. From the left navigation, select Email -> Accounts
 * 3. Click on the Select Domain dropdown and check that only the expected values are available
 * 4. Select site-tools-demo.net
 * 5. Enter Account Name - test_account
 * 6. Click on Generate in the Enter Password input field
 * 7. Verify that Password is populated
 * 8. Click on Create button
 * 9. Check that the successful message "Email account <account name> is created" is displayed
 * 10. Verify that account exists in the "Manage Email accounts" list
 */
test('TC#1 Add an email account', async ({ page }) => {
  const homePage = new HomePage(page);
  const accountsPage = new EmailAccountsPage(page);

  // 1. Load the home page
  await homePage.goto(HOME_URL);
  await expect(page).toHaveTitle(/QA Automation Tools/);

  // 2. From the left navigation, select Email -> Accounts
  await homePage.openEmailAccounts();
  await accountsPage.expectOnPage();

  // 3. Click on the Select Domain dropdown and check that only the expected values are available
  await accountsPage.openDomainDropdown();
  const options = accountsPage.domainOptions;
  await expect(options).toHaveCount(4);
  const optionTexts = await accountsPage.getDomainOptionTexts();
  for (const expected of EXPECTED_DOMAIN_OPTIONS) {
    expect(optionTexts).toContain(expected);
  }

  // 4. Select site-tools-demo.net
  await accountsPage.selectDomain('site-tools-demo.net');

  // 5. Enter Account Name - test_account
  await accountsPage.getAccountNameInput().fill(ACCOUNT_NAME);

  // 6. Click on Generate in the Enter Password input field
  await accountsPage.getGenerateButton().click();

  // 7. Verify that Password is populated
  const passwordInput = accountsPage.getPasswordInput();
  await expect(passwordInput).not.toHaveValue('');
  const passwordValue = await passwordInput.inputValue();
  expect(passwordValue.length).toBeGreaterThanOrEqual(8);

  // 8. Click on Create button
  await accountsPage.getCreateButton().click();

  // 9. Check that the successful message "Email account <account name> is created" is displayed
  await expect(accountsPage.getSuccessMessage(ACCOUNT_NAME)).toBeVisible({
    timeout: 10000,
  });

  // 10. Verify that account exists in the "Manage Email accounts" list
  const accountsTable = accountsPage.getAccountsTable();
  await expect(accountsTable).toBeVisible();
  const expectedAccountEmail = `${ACCOUNT_NAME}@site-tools-demo.net`;
  await expect(accountsPage.getAccountCell(expectedAccountEmail)).toBeVisible({
    timeout: 5000,
  });
});
