// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { getEnvURL, getTestPath } from "./utils/configLoader";
import { getBrowserProjects } from "./utils/browserSelector";

export default defineConfig({
  testDir: getTestPath(),
  globalSetup: require.resolve("./setup/global-setup.js"),
  globalTeardown: require.resolve("./setup/global-teardown.js"),
  reporter: [
    ["html"],
    ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //set BROWSER=chromium  && set ENV=qa && npx playwright test
    baseURL: getEnvURL(),
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // storageState: "config/adminState.json", // <– logged-in session
    screenshot: "only-on-failure", // <-- here
      ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  //set BROWSER=chromium  && set ENV=qa && npx playwright test
  projects: getBrowserProjects(),
});
