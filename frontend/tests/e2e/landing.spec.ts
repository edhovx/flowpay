import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("displays hero section with correct heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FlowPay/);
    await expect(page.locator("h1")).toContainText("Programmable USDC");
    await expect(page.locator("h1")).toContainText("built on Arc");
  });

  test("displays FlowPay and Arc logos in hero", async ({ page }) => {
    await page.goto("/");
    const logos = page.locator("img[alt='FlowPay']");
    await expect(logos.first()).toBeVisible();
    const arcLogo = page.locator("img[alt='Arc']");
    await expect(arcLogo.first()).toBeVisible();
  });

  test("has Launch App button", async ({ page }) => {
    await page.goto("/");
    const launchButton = page.getByRole("button", { name: /Launch App/i });
    await expect(launchButton.first()).toBeVisible();
  });

  test("displays problem section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("The problem FlowPay solves")).toBeVisible();
    await expect(page.getByText("Trust between parties")).toBeVisible();
  });

  test("displays features section with cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Everything you need").first()).toBeVisible();
    await expect(page.getByText("Invoices").first()).toBeVisible();
    await expect(page.getByText("Escrow").first()).toBeVisible();
    await expect(page.getByText("Split Payments").first()).toBeVisible();
  });

  test("displays advantages section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Why choose FlowPay").first()).toBeVisible();
  });

  test("displays how it works section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Three steps to settle").first()).toBeVisible();
  });

  test("footer has copyright and Arc trademark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/All rights reserved/)).toBeVisible();
    await expect(page.getByText(/Circle Internet Group/)).toBeVisible();
  });
});
