import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.js';
import { ProductsPage } from '../../pages/ProductsPage.js';

test.describe('SauceDemo Shopping Cart Suite', () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(productsPage.title).toBeVisible();
  });

  test('user can add a product to cart and verify cart badge shows 1', async () => {
    await productsPage.addFirstProductToCart();
    await expect(productsPage.cartBadge).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('1');
  });

  test('user can remove a product from cart and verify badge disappears', async () => {
    await productsPage.addFirstProductToCart();
    await expect(productsPage.cartBadge).toBeVisible();
    await expect(productsPage.cartBadge).toHaveText('1');

    await productsPage.removeFirstProductFromCart();
    await expect(productsPage.cartBadge).not.toBeVisible();
  });
});
