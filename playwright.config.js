// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { getEnvURL } from "./utils/configLoader";

export default defineConfig({
  testDir: "./tests",
  globalSetup: require.resolve("./setup/global-setup.js"),
  globalTeardown: require.resolve("./setup/global-teardown.js"),
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // baseURL: 'http://127.0.0.1:3000',
    baseURL: getEnvURL(),
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // storageState: "config/adminState.json", // <– logged-in session
    screenshot: "only-on-failure",  // <-- here  
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ]
});
