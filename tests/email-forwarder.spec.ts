import { test, expect, HOME_URL } from './fixtures';

const EXPECTED_DOMAIN_OPTIONS = [
  'qa-automation-tools.com',
  'store.qa-automation-tools.com',
  'parked-qa-automation-tools.com',
  'site-tools-demo.net',
];

/**
 * TC#2 Add an empty email Forwarder.
 * 1. Load the home page
 * 2. From the left navigation, select Email -> Forwarders
 * 3. Click on the Select Domain dropdown and check that only the expected values are available
 * 4. Select site-tools-demo.net
 * 5. Leave inputs empty
 * 6. Click on Create button
 * 7. Validate that the following error "Required field" appears for the "Forward all messages sent to:" input
 */
test('TC#2 Add an empty email Forwarder', async ({ page }) => {
  // 1. Load the home page
  await page.goto(HOME_URL);
  await expect(page).toHaveTitle(/QA Automation Tools/);

  // 2. From the left navigation, select Email -> Forwarders
  await page.getByRole('listitem').filter({ hasText: 'Email' }).first().click();
  await page.getByRole('link', { name: 'Forwarders' }).click();
  await expect(page).toHaveURL(/\/email-forward/);
  await expect(
    page.getByRole('heading', { name: 'Email Forwarders', level: 1 })
  ).toBeVisible();

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

  // 5. Leave inputs empty (do not fill "Forward all messages sent to:" or "To email address:")
  // Ensure the forward-to field is empty
  const forwardToInput = page.getByRole('textbox', {
    name: /Forward all messages sent to/i,
  });
  await forwardToInput.clear();

  // 6. Click on Create button
  await page.getByRole('button', { name: 'Create' }).click();

  // 7. Validate that the following error "Required field" appears for the "Forward all messages sent to:" input
  const requiredFieldError = page.getByText('Required field');
  await expect(requiredFieldError).toBeVisible();
  // Ensure the error is in the context of the forwarder form (near "Forward all messages sent to:")
  const createRuleRegion = page.getByRole('region', { name: 'Create New Rule' });
  await expect(createRuleRegion.getByText('Required field')).toBeVisible();
});
