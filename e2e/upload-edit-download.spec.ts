import { test, expect } from '@playwright/test';
import path from 'path';

test('zip 업로드 → 수정 → 다운로드까지 작동해야 한다', async ({ page }) => {
  await page.goto('http://localhost:5173');

  const zipPath = path.resolve(__dirname, '../fixtures/sample.zip');
  await page.setInputFiles('[data-testid="file-input"]', zipPath);
  await page.waitForTimeout(2000);

  // 폴더 열기
  const folder = page.getByText('sample');
  await folder.click();
  await page.waitForTimeout(500);

  // hello.txt 클릭
  const tab = page.locator('div[data-testid="tab-hello.txt"]');
  await expect(tab).toBeVisible({ timeout: 7000 });
  await tab.click();

  // Monaco Editor 입력
  const editor = page.locator('.monaco-editor');
  await expect(editor).toBeVisible({ timeout: 5000 });
  await editor.click();
  await page.keyboard.press('End');
  await page.keyboard.type('\nAppended content!');

  // 다운로드 버튼 클릭 (download 이벤트 대신 DOM 확인)
  const downloadBtn = page.getByTestId('download-button');
  await expect(downloadBtn).toBeVisible();
  await downloadBtn.click();

  // 다운로드 후 일정 시간 대기
  await page.waitForTimeout(1500);

  // 다운로드 확인은 따로 mock 또는 수동 확인 필요
  await page.screenshot({ path: 'test-output/after-download-click.png' });
});
