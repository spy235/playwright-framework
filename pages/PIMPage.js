const { expect } = require('@playwright/test');

class PIMPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.pimPageTitle = this.page.locator(".oxd-table-filter-title");
    this.records = this.page.locator(".oxd-table-row--clickable")
  }

  async gotoDetails() {
    await this.page
      .locator(".oxd-main-menu-item--name")
      .getByText("PIM")
      .click();
    await expect(this.pimPageTitle).toBeVisible();
    await expect(this.pimPageTitle).toHaveText("Employee Information");
  }
  async clickOnDetails(detail = ""){
    await this.records.first().click() 
  }
}

module.exports =  PIMPage ;
