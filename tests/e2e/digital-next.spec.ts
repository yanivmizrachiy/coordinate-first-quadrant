import { expect, test } from '@playwright/test';

const V2_KEY = 'coordinate-first-quadrant:digital-next:v2';

async function seedSession(page: import('@playwright/test').Page, completedIds: string[]) {
  await page.addInitScript(({ key, completed }) => {
    localStorage.setItem(key, JSON.stringify({
      version: 2,
      completedIds: completed,
      attemptsByActivity: {},
      mastery: {
        'ordered-pair-order': 0,
        'x-reading': 0,
        'y-reading': 0,
        'point-placement': 0,
        'axis-segment-length': 0,
        'axes-origin': 0,
        'coordinate-comparison': 0,
        'rectangle-dimensions': 0,
        'rectangle-perimeter': 0,
        'rectangle-area': 0,
      },
      updatedAt: new Date(0).toISOString(),
    }));
  }, { key: V2_KEY, completed: completedIds });
}

test.describe('digital-next adaptive isolated prototype', () => {
  test('renders one recommended activity without entering the canonical router', async ({ page }) => {
    await page.goto('/digital-next.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('מערכת צירים — הרביע הראשון');
    await expect(page.locator('[data-activity-id]')).toHaveCount(1);
    await expect(page.locator('[data-activity-id="read-a"]')).toHaveCount(1);
    await expect(page.locator('.recommendation-text')).toContainText('מומלץ עכשיו לחזק');
    await expect(page).toHaveURL(/digital-next\.html$/);
  });

  test('keeps the canonical app unchanged and separate', async ({ page }) => {
    await page.goto('/');
    await expect(page).not.toHaveURL(/digital-next\.html/);
    await expect(page.locator('#digital-next-app')).toHaveCount(0);
    await page.goto('/digital-next.html');
    await expect(page.locator('#digital-next-app')).toHaveCount(1);
  });

  test('read-only grid has no hidden keyboard stop', async ({ page }) => {
    await page.goto('/digital-next.html');
    const grid = page.locator('[data-activity-id="read-a"] svg');
    await expect(grid).toHaveAttribute('role', 'img');
    await expect(grid).not.toHaveAttribute('tabindex', '0');
  });

  test('escalates from a concise hint to guided support on the third mistake', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="read-a"]');
    await card.getByLabel('שיעור x').fill('7');
    await card.getByLabel('שיעור y').fill('3');

    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.locator('.learning-hint')).toHaveClass(/hint/);
    await expect(card.locator('.learning-hint')).toContainText('קודם x ואז y');

    await card.getByRole('button', { name: 'בדיקה' }).click();
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.locator('.learning-hint')).toHaveClass(/guided/);
    await expect(card.locator('.learning-hint')).toContainText('המספר הראשון');
  });

  test('diagnoses swapped coordinates, counts the attempt, then advances adaptively', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="read-a"]');
    await card.getByLabel('שיעור x').fill('7');
    await card.getByLabel('שיעור y').fill('3');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('החלפתם בין שיעור x לשיעור y');
    await expect(card.getByRole('status')).toContainText('קראו קודם את שיעור x');

    await card.getByLabel('שיעור x').fill('3');
    await card.getByLabel('שיעור y').fill('7');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
    await card.getByRole('button', { name: 'להמשך הפעילות המומלצת' }).click();
    await expect(page.locator('[data-activity-id="place-b"]')).toHaveCount(1);
  });

  test('supports keyboard movement and edge shortcuts when place-point is recommended', async ({ page }) => {
    await seedSession(page, ['read-a']);
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

  test('builds the segment by pointer drag before checking its length', async ({ page }) => {
    await seedSession(page, ['read-a', 'place-b']);
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="segment-cd"]');
    const grid = card.locator('svg.segment-builder');
    const endMarker = grid.locator('.draggable-point');
    const markerBox = await endMarker.boundingBox();
    const gridBox = await grid.boundingBox();
    expect(markerBox).not.toBeNull();
    expect(gridBox).not.toBeNull();
    if (!markerBox || !gridBox) return;

    const targetX = gridBox.x + gridBox.width * ((36 + 8 * 28.8) / 360);
    const targetY = gridBox.y + gridBox.height * ((360 - 36 - 5 * 28.8) / 360);
    await page.mouse.move(markerBox.x + markerBox.width / 2, markerBox.y + markerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 8 });
    await page.mouse.up();
    await expect(card.locator('.coordinate-readout')).toContainText('(8,5)');

    await card.getByLabel('אורך הקטע').fill('6');
    await card.getByRole('button', { name: 'בדיקת הקטע' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
  });

  test('can target later activity types through saved progress', async ({ page }) => {
    await seedSession(page, ['read-a', 'place-b', 'segment-cd']);
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="classify-e"]');
    await card.getByLabel('מיקום הנקודה').selectOption('y-axis');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
  });

  test('builds the rectangle before calculating its properties', async ({ page }) => {
    await seedSession(page, ['read-a', 'place-b', 'segment-cd', 'classify-e', 'compare-fg']);
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="rectangle-hijk"]');
    const grid = card.locator('svg.rectangle-builder');
    await expect(grid.locator('.built-rectangle')).toBeVisible();
    await grid.focus();
    for (let i = 0; i < 4; i += 1) await grid.press('ArrowRight');
    for (let i = 0; i < 2; i += 1) await grid.press('ArrowUp');
    await expect(card.locator('.rectangle-readout')).toContainText('(8,6)');

    await card.getByLabel('אורך').fill('6');
    await card.getByLabel('רוחב').fill('4');
    await card.getByLabel('היקף P').fill('20');
    await card.getByLabel('שטח S').fill('24');
    await card.getByRole('button', { name: 'בדיקת המלבן' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
  });

  test('persists adaptive progress and attempt counts across reload', async ({ page }) => {
    await page.goto('/digital-next.html');
    const card = page.locator('[data-activity-id="read-a"]');
    await card.getByLabel('שיעור x').fill('3');
    await card.getByLabel('שיעור y').fill('7');
    await card.getByRole('button', { name: 'בדיקה' }).click();
    await expect(card.getByRole('status')).toContainText('נכון');
    await page.reload();
    await expect(page.locator('.progress-text')).toContainText('הושלמו 1 מתוך 6');
    await expect(page.locator('[data-activity-id="place-b"]')).toHaveCount(1);
  });

  test('exposes accessible numeric progress', async ({ page }) => {
    await seedSession(page, ['read-a']);
    await page.goto('/digital-next.html');
    const progress = page.getByRole('progressbar', { name: 'התקדמות במסלול' });
    await expect(progress).toHaveAttribute('aria-valuemin', '0');
    await expect(progress).toHaveAttribute('aria-valuemax', '6');
    await expect(progress).toHaveAttribute('aria-valuenow', '1');
  });

  test('shows all ten mastery skills after the prototype is completed', async ({ page }) => {
    await seedSession(page, ['read-a', 'place-b', 'segment-cd', 'classify-e', 'compare-fg', 'rectangle-hijk']);
    await page.goto('/digital-next.html');
    await expect(page.getByRole('heading', { name: 'המסלול הושלם' })).toBeVisible();
    await expect(page.locator('.mastery-summary li')).toHaveCount(10);
    await expect(page.locator('.progress-text')).toContainText('הושלמו 6 מתוך 6');
  });
});