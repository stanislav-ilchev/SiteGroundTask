import type { Page } from '@playwright/test';

export class EmailAccountsPage {
  constructor(private readonly page: Page) {}

  async expectOnPage(): Promise<void> {
    await this.page.waitForURL(/\/email/);
    await this.page.getByRole('heading', { name: 'Email Accounts', level: 1 }).waitFor({ state: 'visible' });
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

  getAccountNameInput() {
    return this.page.getByRole('textbox', { name: /Account Name/i });
  }

  getPasswordInput() {
    return this.page.getByRole('textbox', { name: /Password/i });
  }

  getGenerateButton() {
    return this.page.getByRole('button', { name: 'Generate' });
  }

  getCreateButton() {
    return this.page.getByRole('button', { name: 'Create' });
  }

  getAccountsTable() {
    return this.page.getByRole('table', { name: 'Manage Email Accounts' });
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

  getSuccessMessage(accountName: string) {
    return this.page.getByText(
      new RegExp(`Email account .*${accountName}.* is created`, 'i')
    );
  }

  getAccountCell(email: string) {
    return this.getAccountsTable().getByRole('cell', { name: email });
  }
}
