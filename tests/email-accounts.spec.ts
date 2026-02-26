import { test, expect, HOME_URL } from './fixtures';

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
  // 1. Load the home page
  await page.goto(HOME_URL);
  await expect(page).toHaveTitle(/QA Automation Tools/);

  // 2. From the left navigation, select Email -> Accounts
  await page.getByRole('listitem').filter({ hasText: 'Email' }).first().click();
  await page.getByRole('link', { name: 'Accounts' }).click();
  await expect(page).toHaveURL(/\/email/);
  await expect(page.getByRole('heading', { name: 'Email Accounts', level: 1 })).toBeVisible();

  // 3. Click on the Select Domain dropdown and check that only the following values are available
  const domainCombobox = page.getByRole('combobox').first();
  await domainCombobox.click();
  const listbox = page.getByRole('listbox');
  await expect(listbox).toBeVisible();
  const options = page.getByRole('option');
  await expect(options).toHaveCount(4);
  const optionTexts = await options.allTextContents();
  for (const expected of EXPECTED_DOMAIN_OPTIONS) {
    expect(optionTexts).toContain(expected);
  }

  // 4. Select site-tools-demo.net
  await page.getByRole('option', { name: 'site-tools-demo.net' }).click();
  await expect(page.getByText('@site-tools-demo.net').first()).toBeVisible();

  // 5. Enter Account Name - test_account
  const accountNameInput = page.getByRole('textbox', { name: /Account Name/i });
  await accountNameInput.fill(ACCOUNT_NAME);

  // 6. Click on Generate in the Enter Password input field
  const generateBtn = page.getByRole('button', { name: 'Generate' });
  await generateBtn.click();

  // 7. Verify that Password is populated
  const passwordInput = page.getByRole('textbox', { name: /Password/i });
  await expect(passwordInput).not.toHaveValue('');
  const passwordValue = await passwordInput.inputValue();
  expect(passwordValue.length).toBeGreaterThanOrEqual(8);

  // 8. Click on Create button
  await page.getByRole('button', { name: 'Create' }).click();

  // 9. Check that the successful message "Email account <account name> is created" is displayed
  const successMessage = page.getByText(
    new RegExp(`Email account .*${ACCOUNT_NAME}.* is created`, 'i')
  );
  await expect(successMessage).toBeVisible({ timeout: 10000 });

  // 10. Verify that account exists in the "Manage Email accounts" list
  const accountsTable = page.getByRole('table', { name: 'Manage Email Accounts' });
  await expect(accountsTable).toBeVisible();
  const expectedAccountEmail = `${ACCOUNT_NAME}@site-tools-demo.net`;
  await expect(
    accountsTable.getByRole('cell', { name: expectedAccountEmail })
  ).toBeVisible({ timeout: 5000 });
});
