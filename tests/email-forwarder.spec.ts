import { test, expect, HOME_URL } from './fixtures';
import { HomePage, EmailForwardersPage } from './pages';

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
  const homePage = new HomePage(page);
  const forwardersPage = new EmailForwardersPage(page);

  // 1. Load the home page
  await homePage.goto(HOME_URL);
  await expect(page).toHaveTitle(/QA Automation Tools/);

  // 2. From the left navigation, select Email -> Forwarders
  await homePage.openEmailForwarders();
  await forwardersPage.expectOnPage();

  // 3. Click on the Select Domain dropdown and check that only the expected values are available
  await forwardersPage.openDomainDropdown();
  const options = forwardersPage.domainOptions;
  await expect(options).toHaveCount(4);
  const optionTexts = await forwardersPage.getDomainOptionTexts();
  for (const expected of EXPECTED_DOMAIN_OPTIONS) {
    expect(optionTexts).toContain(expected);
  }

  // 4. Select site-tools-demo.net
  await forwardersPage.selectDomain('site-tools-demo.net');

  // 5. Leave inputs empty - ensure the forward-to field is empty
  await forwardersPage.getForwardToInput().clear();

  // 6. Click on Create button
  await forwardersPage.getCreateButton().click();

  // 7. Validate that the following error "Required field" appears for the "Forward all messages sent to:" input
  await expect(forwardersPage.getRequiredFieldError()).toBeVisible();
  await expect(
    forwardersPage.getCreateRuleRegion().getByText('Required field')
  ).toBeVisible();
});
