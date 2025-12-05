import * as envs from "../config/environments_url.json";

export function getEnvURL() {
  const env = (process.env.ENV || "qa").trim();
  const url = envs[env];

  if (!url) {
    throw new Error(`Environment '${env}' not found in environments_url.json`);
  }

  return url;
}

export function getTestPath(){
  const env = (process.env.TYPE || "smoke").trim();
  const testType = envs[env];

  if (!testType) {
    throw new Error(`Test Type '${env}' not found in environments_url.json`);
  }
  return testType;
}
