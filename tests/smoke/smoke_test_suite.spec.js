const { expect } = require('@playwright/test');
const { test } = require('../../fixtures/baseFixtures');
const { LoginPage } = require('../../pages/LoginPage');
import { mockEmptyRecruitmentApi, mockRequestDetailsApi } from '../../utils/mockRectruimentRecods';
import { verifySnapshot, verifySnapshotWholePage } from '../../utils/screenshotHelper';
import fs from "fs"

test('Valid Login Test', async ({ page, cred }) => {
  const loginPage = new LoginPage(page);// new page without stored state
  await loginPage.goto("/web/index.php/auth/login");
  await loginPage.verifyLoginPage();
  await loginPage.login(cred.adminValidLogin.Username, cred.adminValidLogin.Password);
  await loginPage.verifyDashboard();
});

test('Invalid Login Test', async ({ page, cred }) => {
  const loginPage = new LoginPage(page);// new page without stored state
  await loginPage.goto("/web/index.php/auth/login");
  await loginPage.verifyLoginPage();
  await loginPage.login(cred.adminInvalidLogin.Username, cred.adminInvalidLogin.Password);
});
test('Add User Test', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'config/adminState.json',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const sidePanelPage = await loginPage.goto("/web/index.php/dashboard/index");
  await loginPage.verifyDashboard();

  const adminPage = await sidePanelPage.gotoPage("Admin");
  await adminPage.clickAdd();
  await adminPage.selectUserRole("Admin");
  await adminPage.fillEmployeeName("Joseph");
  await adminPage.selectStatus("Enabled");
  await adminPage.fillUsernameAndPassword("Test User1", "Yashas@235@");
  await adminPage.saveUser();

  fs.writeFileSync('testdata/testUser/test_user_data.json', JSON.stringify({ employeeName: "Test User1" }, null, 2));
});

test('Search User Test', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'config/adminState.json',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const sidePanelPage = await loginPage.goto("/web/index.php/dashboard/index");
  await loginPage.verifyDashboard();

  const adminPage = await sidePanelPage.gotoPage("Admin");
  const { employeeName } = JSON.parse(fs.readFileSync('testdata/testUser/test_user_data.json', "utf8"));
  await adminPage.searchUser(employeeName, "Admin");
  await adminPage.deleteUser(employeeName);

  await page.pause();
});

test('Recruitment Page Empty Records Founds', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'config/adminState.json',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const sidePanelPage = await loginPage.goto("/web/index.php/dashboard/index");
  await loginPage.verifyDashboard();

  const recruitmentPagePage = await sidePanelPage.gotoPage("Recruitment");
  await mockEmptyRecruitmentApi(page) // moking api response
  await recruitmentPagePage.gotoRecruitmentPage();

await expect(page.locator(".orangehrm-vertical-padding .oxd-text--span")).toContainText("No Records Found")
await page.pause();
});

test('PIM Page View Person details mocking with in valid data', async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'config/adminState.json',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const sidePanelPage = await loginPage.goto("/web/index.php/dashboard/index");
  await loginPage.verifyDashboard();



  const pimPagePage = await sidePanelPage.gotoPage("PIM");
  await pimPagePage.gotoDetails();
  await mockRequestDetailsApi(page) // moking api request
  await pimPagePage.clickOnDetails();
// await expect(page.locator(".orangehrm-vertical-padding .oxd-text--span")).toContainText("No Records Found")
});

//https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/86/personal-details

test("Visual Testing Login Page", async ({ context }) => {
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.goto("/web/index.php/auth/login");
  // ensure page fully loaded
  await page.waitForLoadState("networkidle");
  // take full-page snapshot AFTER stable state
  await verifySnapshotWholePage(page, "login_page.png");
});


test("Visual Testing Element", async ({ browser }) => {
  const context = await browser.newContext({
    storageState: 'config/adminState.json',
  });
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  const sidePanelPage = await loginPage.goto("/web/index.php/dashboard/index");
  await loginPage.verifyDashboard();
  const pimPage = await sidePanelPage.gotoPage("PIM");
  await pimPage.gotoDetails();
  await verifySnapshot(
    page.locator(".orangehrm-background-container .oxd-table-filter"),
    "tests/smoke/tests-screenshots-inputbox-chromium-win32.png"
  );
});