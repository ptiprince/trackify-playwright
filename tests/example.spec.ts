import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

test('1.2 – Login fails with incorrect email or password', async ({ page }) => {

    // 1. Открыть локальную HTML-страницу
    const loginPagePath = path.resolve(__dirname, '../login.html');
    await page.goto('http://localhost:8080/login.html');

    // 2. Ввести email
    const emailInput = page.locator('input[placeholder="Email"]');
    await emailInput.fill('admin@admin.com');

    // 3. Нажать "Next"
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await nextBtn.click();

    // 4. Ввести неправильный пароль
    const passwordInput = page.locator('input[placeholder="Password"]');
    await passwordInput.fill('wrongpassword');

    // 5. Нажать Login
    const loginBtn = page.getByRole('button', { name: 'Login' });
    await loginBtn.click();

    // 6. Проверка: появилось сообщение об ошибке
    const errorMsg = page.locator('#error');
    await expect(errorMsg).toBeVisible();

    // 7. Убедиться, что остались на той же странице
    expect(page.url()).toContain('login.html');

    // 8. Проверить, что токен не установлен
    const cookies = await page.context().cookies();
    const hasToken = cookies.some(c => c.name.includes('token'));
    expect(hasToken).toBeFalsy();
});
test('1.3 — Successful login with correct credentials', async ({ page }) => {
    const loginPagePath = path.resolve(__dirname, '../login.html');
    await page.goto('http://localhost:8080/login.html');

    // Ввести email
    const emailInput = page.locator('input[placeholder="Email"]');
    await emailInput.fill('admin@admin.com');

    // Нажать "Next"
    const nextBtn = page.getByRole('button', { name: 'Next' });
    await nextBtn.click();

    // Ввести правильный пароль
    const passwordInput = page.locator('input[placeholder="Password"]');
    await passwordInput.fill('admin123');

    // Нажать "Login"
    const loginBtn = page.getByRole('button', { name: 'Login' });
    await loginBtn.click();

    // Убедиться, что перешли на dashboard.html
    await page.waitForURL(/dashboard\.html$/);
    expect(page.url()).toContain('dashboard.html');

    // Проверить, что токен установлен
    const cookies = await page.context().cookies();
    const hasToken = cookies.some(c => c.name.includes('token'));
    expect(hasToken).toBeTruthy();
});

