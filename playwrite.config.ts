import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './e2e', 
  timeout: 30 * 1000, 
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173', 
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: undefined,
  },
});