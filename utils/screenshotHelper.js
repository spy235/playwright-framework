import { expect } from '@playwright/test';

export async function verifySnapshot(locator, snapshotName) {
  await expect(locator).toHaveScreenshot(snapshotName);
}

export async function verifySnapshotWholePage(page,name) {
  expect(await page.screenshot()).toMatchSnapshot(name);
}