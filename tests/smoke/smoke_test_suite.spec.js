const { expect } = require("@playwright/test");
const { test } = require("../../fixtures/baseFixtures");
const { LoginPage } = require("../../pages/LoginPage");
import { logger } from "../../utils/logger/logger";
import {
  mockEmptyRecruitmentApi,
  mockRequestDetailsApi,
} from "../../utils/mockRectruimentRecods";
import fs from "fs";

test("Valid Login Test", async ({ page, cred }) => {
  logger.info("Starting Valid Login Test");
  try {
    const loginPage = new LoginPage(page);
    logger.debug("Navigating to login page");
    await loginPage.goto("/web/index.php/auth/login");

    logger.debug("Verifying login page");
    await loginPage.verifyLoginPage();

    logger.info("Performing login with valid credentials");
    await loginPage.login(
      cred.adminValidLogin.Username,
      cred.adminValidLogin.Password
    );

    logger.debug("Verifying dashboard");
    await loginPage.verifyDashboard();
    logger.info("Valid Login Test completed successfully");
  } catch (error) {
    logger.error(`Valid Login Test failed: ${error}`);
  }
});

test("Invalid Login Test", async ({ page, cred }) => {
  logger.info("Starting Invalid Login Test");
  try {
    const loginPage = new LoginPage(page);
    logger.debug("Navigating to login page");
    await loginPage.goto("/web/index.php/auth/login");

    logger.debug("Verifying login page");
    await loginPage.verifyLoginPage();

    logger.warn("Performing login with invalid credentials");
    await loginPage.login(
      cred.adminInvalidLogin.Username,
      cred.adminInvalidLogin.Password
    );

    logger.info("Invalid Login Test completed");
  } catch (error) {
    logger.error(`Invalid Login Test failed: ${error}`);
  }
});

test("Add User Test", async ({ browser }) => {
  logger.info("Starting Add User Test");
  try {
    const context = await browser.newContext({
      storageState: "config/adminState.json",
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    logger.debug("Navigating to dashboard");
    const sidePanelPage = await loginPage.goto(
      "/web/index.php/dashboard/index"
    );
    await loginPage.verifyDashboard();

    const adminPage = await sidePanelPage.gotoPage("Admin");
    logger.debug("Clicking Add button");
    await adminPage.clickAdd();

    logger.info("Filling user details");
    await adminPage.selectUserRole("Admin");
    await adminPage.fillEmployeeName("Joseph");
    await adminPage.selectStatus("Enabled");
    await adminPage.fillUsernameAndPassword("Test User1", "Yashas@235@");
    await adminPage.saveUser();

    fs.writeFileSync(
      "testdata/testUser/test_user_data.json",
      JSON.stringify({ employeeName: "Test User1" }, null, 2)
    );
    logger.info("Add User Test completed successfully");
  } catch (error) {
    logger.error(`Add User Test failed: ${error}`);
  }
});

test("Search User Test", async ({ browser }) => {
  logger.info("Starting Search User Test");
  try {
    const context = await browser.newContext({
      storageState: "config/adminState.json",
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const sidePanelPage = await loginPage.goto(
      "/web/index.php/dashboard/index"
    );
    await loginPage.verifyDashboard();

    const adminPage = await sidePanelPage.gotoPage("Admin");
    const { employeeName } = JSON.parse(
      fs.readFileSync("testdata/testUser/test_user_data.json", "utf8")
    );

    logger.debug(`Searching for user: ${employeeName}`);
    await adminPage.searchUser(employeeName, "Admin");

    logger.info("Deleting user");
    await adminPage.deleteUser(employeeName);
    logger.info("Search User Test completed");
  } catch (error) {
    logger.error(`Search User Test failed: ${error}`);
  }
});

test("Recruitment Page Empty Records Found", async ({ browser }) => {
  logger.info("Starting Recruitment Page Empty Records Test");
  try {
    const context = await browser.newContext({
      storageState: "config/adminState.json",
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const sidePanelPage = await loginPage.goto(
      "/web/index.php/dashboard/index"
    );
    await loginPage.verifyDashboard();

    const recruitmentPagePage = await sidePanelPage.gotoPage("Recruitment");
    logger.debug("Mocking empty recruitment API");
    await mockEmptyRecruitmentApi(page);

    await recruitmentPagePage.gotoRecruitmentPage();
    await expect(
      page.locator(".orangehrm-vertical-padding .oxd-text--span")
    ).toContainText("No Records Found");
    logger.info("Recruitment Page Empty Records Test completed");
  } catch (error) {
    logger.error(`Recruitment Page Test failed: ${error}`);
  }
});

test("PIM Page View Person Details with Invalid Data", async ({ browser }) => {
  logger.info("Starting PIM Page Details Test");
  try {
    const context = await browser.newContext({
      storageState: "config/adminState.json",
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const sidePanelPage = await loginPage.goto(
      "/web/index.php/dashboard/index"
    );
    await loginPage.verifyDashboard();

    const pimPagePage = await sidePanelPage.gotoPage("PIM");
    await pimPagePage.gotoDetails();

    logger.debug("Mocking request details API");
    await mockRequestDetailsApi(page);

    await pimPagePage.clickOnDetails();
    logger.info("PIM Page Details Test completed");
  } catch (error) {
    logger.error(`PIM Page Test failed: ${error}`);
  }
});
