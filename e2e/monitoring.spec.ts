import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Логін', { exact: true }).fill('admin');
  await page.getByLabel('Пароль', { exact: true }).fill('admin');
  await page.getByRole('button', { name: 'Увійти' }).click();
  await expect(page).toHaveURL(/\/stations$/);
}

test('keeps map CSS out of login and preserves station navigation when CSS fails', async ({
  page,
}) => {
  await page.goto('/login');
  await expect(page.locator('link[href*="/assets/leaflet/"]')).toHaveCount(0);
  await page.route('**/assets/leaflet/leaflet.css', (route) => route.abort());
  await login(page);
  await page.locator('.map-zone').scrollIntoViewIfNeeded();
  await expect(page.locator('.map-zone [role="status"]')).toContainText('Карта недоступна');
  await expect(page.locator('link[href*="/assets/leaflet/"]')).toHaveCount(0);
  await page.locator('.map-links a').first().click();
  await expect(page).toHaveURL(/\/stations\/kroshnya$/);
});

test('guards routes, validates credentials, persists the demo session and logs out', async ({
  page,
}) => {
  await page.goto('/stations/kroshnya');
  await expect(page).toHaveURL(/\/login$/);
  await page.screenshot({ path: 'test-results/login.png', fullPage: true });
  await page.getByLabel('Логін', { exact: true }).fill('admin');
  await page.getByLabel('Пароль', { exact: true }).fill('wrong');
  await page.getByRole('button', { name: 'Увійти' }).click();
  await expect(page.getByRole('alert')).toHaveText('Неправильний логін або пароль.');
  await page.getByLabel('Пароль', { exact: true }).fill('admin');
  await page.getByRole('button', { name: 'Увійти' }).click();
  await expect(page.getByRole('heading', { name: 'Огляд насосних станцій' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.station-card')).toHaveCount(3);
  await page.goto('/login');
  await expect(page).toHaveURL(/\/stations$/);
  await page.getByRole('button', { name: 'Вийти' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/stations');
  await expect(page).toHaveURL(/\/login$/);
});

test('renders original statuses, navigates from the map, shows charts and filters archive', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await login(page);
  await expect(page.locator('.network-summary strong')).toHaveText(['3', '1', '1', '1']);
  await expect(page.locator('.station-card app-station-metrics')).toHaveCount(3);
  await expect(page.locator('.station-status-label')).toHaveText(['НОРМА', 'АВАРІЯ', 'ЗУПИНКА']);
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(11, 16, 23)');
  await expect(page.locator('.station-status-label').first()).toHaveCSS(
    'color',
    'rgb(97, 214, 163)',
  );
  const cards = await page
    .locator('.station-card')
    .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(new Set(cards).size).toBe(1);
  await expect(page.locator('.leaflet-interactive')).toHaveCount(3);
  await expect(page.locator('.leaflet-tile-loaded').first()).toBeVisible({ timeout: 20000 });
  await expect
    .poll(
      () =>
        page
          .locator('.leaflet-tile')
          .evaluateAll(
            (images) =>
              images.length > 0 &&
              images.every(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth > 0 &&
                  getComputedStyle(image).opacity === '1',
              ),
          ),
      { timeout: 20000 },
    )
    .toBe(true);
  await page.screenshot({ path: 'test-results/hub.png', fullPage: true });
  await page.locator('.leaflet-interactive').first().click();
  await expect(page).toHaveURL(/\/stations\/kroshnya$/);
  await expect(page.locator('app-station-metrics .metrics > div')).toHaveCount(4);
  await expect(page.locator('.equipment-zone .data-table-wrap tbody tr')).toHaveCount(30);
  await expect(page.locator('.nested-status-pill')).toHaveCSS(
    'border-top-color',
    'rgb(52, 108, 86)',
  );
  for (const panel of await page.locator('app-chart-panel').all()) {
    await panel.scrollIntoViewIfNeeded();
    await expect(panel.locator('canvas')).toBeVisible();
  }
  await expect(page.locator('canvas')).toHaveCount(4);
  await page.locator('.nested-header').scrollIntoViewIfNeeded();
  await expect(page.locator('canvas').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/detail.png', fullPage: true });
  await page
    .getByRole('button', { name: /На весь екран/ })
    .first()
    .focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').locator('canvas')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('input[type=date]').first().fill('2026-07-22');
  await expect(page.locator('.equipment-zone .data-table-wrap tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Аварія', exact: true }).click();
  await expect(page.locator('.notifications-zone tbody')).toContainText('Немає записів');
  await page.getByRole('link', { name: '← Назад' }).click();
  await expect(page.locator('.leaflet-interactive')).toHaveCount(3);
  await expect(page.locator('.station-card')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('handles missing station and reversed dates', async ({ page }) => {
  await login(page);
  await page.goto('/stations/unknown');
  await expect(page.getByRole('heading', { name: 'Станцію не знайдено' })).toBeVisible();
  await page.goto('/stations/kroshnya');
  await page.locator('input[type=date]').first().fill('2026-07-22');
  await page.locator('input[type=date]').last().fill('2026-07-01');
  await expect(page.getByRole('alert')).toContainText('Вкажіть коректний період');
  await expect(page.locator('.equipment-zone .data-table-wrap tbody')).toContainText('Немає даних');
});

test('mobile detail remains within viewport and fullscreen supports keyboard close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await login(page);
  const cards = await page
    .locator('.station-card')
    .evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(new Set(cards).size).toBe(3);
  await page.locator('.station-card').last().click();
  await expect(page.locator('.nested-status-pill')).toHaveText('ЗУПИНКА');
  await expect(page.locator('canvas').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page
    .getByRole('button', { name: /На весь екран/ })
    .first()
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '✕ Закрити' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
