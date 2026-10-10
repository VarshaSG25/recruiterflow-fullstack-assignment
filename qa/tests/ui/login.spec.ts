import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { ProductsPage } from '../../pages/ProductsPage.js';

test.describe('SauceDemo Authentication Suite', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
  });

  test('valid user can log in and see the products title', async () => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();
    await expect(productsPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('user can log out from the side menu and return to login page', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();

    await productsPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
