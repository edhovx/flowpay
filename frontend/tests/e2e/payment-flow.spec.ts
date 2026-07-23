import { test, expect } from "@playwright/test";

test.describe("Payment Flow", () => {
  test("create payment page loads (redirects if no wallet)", async ({ page }) => {
    await page.goto("/payments/create");
    await expect(page.locator("body")).toBeVisible();
    // May redirect to connect-wallet or show connect prompt
    await expect(page).toHaveURL(/\/(payments\/create|connect-wallet|dashboard)/);
  });

  test("payment detail page loads", async ({ page }) => {
    await page.goto("/payments/0");
    await expect(page.locator("body")).toBeVisible();
  });

  test("invoice page loads", async ({ page }) => {
    await page.goto("/invoice/0");
    await expect(page.locator("body")).toBeVisible();
  });
});
