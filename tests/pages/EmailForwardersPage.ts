import type { Page } from '@playwright/test';

export class EmailForwardersPage {
  constructor(private readonly page: Page) {}

  async expectOnPage(): Promise<void> {
    await this.page.waitForURL(/\/email-forward/);
    await this.page
      .getByRole('heading', { name: 'Email Forwarders', level: 1 })
      .waitFor({ state: 'visible' });
  }

  get domainCombobox() {
    return this.page.getByRole('combobox').first();
  }

  get domainListbox() {
    return this.page.getByRole('listbox');
  }

  get domainOptions() {
    return this.page.getByRole('option');
  }

  getForwardToInput() {
    return this.page.getByRole('textbox', {
      name: /Forward all messages sent to/i,
    });
  }

  getCreateButton() {
    return this.page.getByRole('button', { name: 'Create' });
  }

  getCreateRuleRegion() {
    return this.page.getByRole('region', { name: 'Create New Rule' });
  }

  getRequiredFieldError() {
    return this.page.getByText('Required field');
  }

  async openDomainDropdown(): Promise<void> {
    await this.domainCombobox.click();
    await this.domainListbox.waitFor({ state: 'visible' });
  }

  async selectDomain(domain: string): Promise<void> {
    await this.page.getByRole('option', { name: domain }).click();
    await this.page.getByText(`@${domain}`).first().waitFor({ state: 'visible' });
  }

  async getDomainOptionTexts(): Promise<string[]> {
    return this.page.getByRole('option').allTextContents();
  }
}
