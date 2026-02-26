import { test as base } from '@playwright/test';

const DEMO_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaXJzdF9uYW1lIjoiUSIsImxhc3RfbmFtZSI6IkEiLCJlbWFpbCI6InEuYUBzaXRlZ3JvdW5kLmNvbSIsImRvbWFpbiI6IiIsImxhbmciOiJlbiIsImV4cCI6MTk3MDEyNTA3NzJ9.MXA6ZIdl85XojUPStcz3JqyEct0bpKeOk_EEfOh7z7o';

export const HOME_URL = `https://sqqadevs.com/?demoToken=${DEMO_TOKEN}`;

export const test = base.extend<{ homePage: void }>({
  homePage: async ({ page }, use) => {
    await page.goto(HOME_URL);
    await use();
  },
});

export { expect } from '@playwright/test';
