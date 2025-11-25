const AdminPage = require("./AdminPage");
const DirectoryPage = require("./DirectoryPage");
const RecruitmentPage = require("./RecruitmentPage");

class SidePanel {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nav = (nav) =>
      this.page.locator("span.oxd-main-menu-item--name", { hasText: nav });
  }

  async gotoPage(p) {
    await this.nav(p).click();
    if (p == "Admin") {
      return new AdminPage(this.page);
    }
     if (p == "Directory") {
      return new DirectoryPage(this.page);
    }
    if(p=="Recruitment"){
            return new RecruitmentPage(this.page);

    }
  }
}

module.exports = { SidePanel };
