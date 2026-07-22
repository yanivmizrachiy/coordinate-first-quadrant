import { test, expect } from '@playwright/test';

test('on a tall screen the district badge stays outside the film', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/');
  await page.waitForTimeout(700);

  const layout = await page.evaluate(() => {
    const badge = document.querySelector('.opening__badge img') as HTMLElement;
    const stage = document.querySelector('.opening__stage') as HTMLElement;
    const sound = document.querySelector('.soundbtn') as HTMLElement;
    const b = badge.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    const c = sound.getBoundingClientRect();
    const overlaps = (a: DOMRect, other: DOMRect): boolean =>
      a.left < other.right && a.right > other.left && a.top < other.bottom && a.bottom > other.top;

    return {
      gapFromFilm: s.top - b.bottom,
      badgeTouchesFilm: overlaps(b, s),
      badgeTouchesSound: overlaps(b, c),
      verticalOverflow: document.scrollingElement!.scrollHeight - window.innerHeight,
    };
  });

  expect(layout.badgeTouchesFilm, 'the district badge still covers the film').toBe(false);
  expect(layout.gapFromFilm, 'there is no clear gap between the badge and film').toBeGreaterThanOrEqual(8);
  expect(layout.badgeTouchesSound, 'the badge collides with the sound control').toBe(false);
  expect(layout.verticalOverflow, 'moving the badge created opening-screen scroll').toBeLessThanOrEqual(1);
});
