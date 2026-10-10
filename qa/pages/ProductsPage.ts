import { Page, Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly openMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async addFirstProductToCart() {
    // Locate the first "Add to cart" button on the inventory page
    const firstAddButton = this.page.getByRole('button', { name: 'Add to cart' }).first();
    await firstAddButton.click();
  }

  async removeFirstProductFromCart() {
    const firstRemoveButton = this.page.getByRole('button', { name: 'Remove' }).first();
    await firstRemoveButton.click();
  }

  async logout() {
    await this.openMenuButton.click();
    await this.logoutLink.click();
  }
}
