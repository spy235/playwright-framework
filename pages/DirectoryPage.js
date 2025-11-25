const { expect } = require('@playwright/test');

class DirectoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // fixed: missing dot
    this.directoryPageTitle = this.page.locator(".oxd-table-filter-title");
  }

  async gotoDirectory() {
    await this.page
      .locator(".oxd-main-menu-item--name")
      .getByText("Directory")
      .click();
    // corrected expect usage
    await expect(this.directoryPageTitle).toBeVisible();
    await expect(this.directoryPageTitle).toHaveText("Directory");
  }
}
module.exports =  DirectoryPage ;

