import type { Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async openEmailAccounts(): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: 'Email' }).first().click();
    await this.page.getByRole('link', { name: 'Accounts' }).click();
  }

  async openEmailForwarders(): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: 'Email' }).first().click();
    await this.page.getByRole('link', { name: 'Forwarders' }).click();
  }
}
