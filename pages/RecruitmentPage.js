const { expect } = require('@playwright/test');

class RecruitmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // fixed: missing dot
    this.directoryPageTitle = this.page.locator(".oxd-table-filter-title");
  }

  async gotoRecruitmentPage() {
    await this.page
      .locator(".oxd-main-menu-item--name")
      .getByText("Recruitment")
      .click();
    // corrected expect usage
    await expect(this.directoryPageTitle).toBeVisible();
    await expect(this.directoryPageTitle).toHaveText("Candidates");
  }
}
module.exports =  RecruitmentPage ;

