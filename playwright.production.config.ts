import { defineConfig } from '@playwright/test';
import base from './playwright.config';

const url = 'http://127.0.0.1:4201';
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: url },
  webServer: {
    command: 'npm run preview -- --port 4201',
    url,
    reuseExistingServer: false,
    timeout: 30000,
  },
});
