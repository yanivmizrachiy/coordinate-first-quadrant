import { expect, test } from '@playwright/test';

test.describe('digital-next isolated prototype', () => {
  test('renders three activities without entering the canonical router', async ({ page }) => {
    await page.goto('/digital-next.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('מערכת צירים — הרביע הראשון');
    await expect(page.locator('[data-activity-id]')).toHaveCount(3);
    await expect(page).toHaveURL(/digital-next\.html$/);
  });

  test('keeps the canonical app unchanged and separate', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/digital-next\.html/);
    await expect(page.locator('#digital-next-app')).toHaveCount(0);
    await page.goto('/digital-next.html');
    await expect(page.locator('#digital-next-app')).toHaveCount(1);
  });

  test('diagnoses swapped coordinates with targeted remediation', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="read-a"]');
    await card.getByLabel('שיעור x').fill('7');
    await card.getByLabel('שיעור y').fill('3');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('החלפתם בין שיעור x לשיעור y');
    await expect(card.getByRole('status')).toContainText('קראו קודם את שיעור x');
  });

  test('supports keyboard movement and edge shortcuts on the interactive grid', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="place-b"]');
    const grid = card.locator('svg');
    await grid.focus();
    await grid.press('ArrowRight');
    await grid.press('ArrowUp');
    await expect(card.locator('.coordinate-readout')).toContainText('(2,2)');
    await grid.press('Home');
    await expect(card.locator('.coordinate-readout')).toContainText('(0,0)');
    await grid.press('End');
    await expect(card.locator('.coordinate-readout')).toContainText('(10,10)');
  });

  test('stores completed progress locally', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="segment-cd"]');
    await card.getByLabel('אורך הקטע').fill('6');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
    await page.reload();
    await expect(page.locator('.progress-text')).toContainText('הושלמו 1 מתוך 3');
  });
});
