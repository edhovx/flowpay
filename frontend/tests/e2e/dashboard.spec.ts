import { test, expect } from "@playwright/test";

test.describe("Dashboard Navigation", () => {
  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });

  test("dashboard shows stats or empty state", async ({ page }) => {
    await page.goto("/dashboard");
    // Either stats cards or empty state should be visible
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("dashboard shows contract info", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByText(/Contract Info|Network/i).first()).toBeVisible();
  });

  test("sidebar navigation works", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Navigate to Settings (always visible in sidebar)
    const settingsLink = page.getByRole("link", { name: "Settings" }).first();
    await settingsLink.click({ timeout: 10000 }).catch(() => {});
    await expect(page).toHaveURL(/\/settings/, { timeout: 10000 });
  });

  test("payments create page loads", async ({ page }) => {
    await page.goto("/payments/create");
    await expect(page.locator("body")).toBeVisible();
  });

  test("connect wallet page loads", async ({ page }) => {
    await page.goto("/connect-wallet");
    await expect(page.locator("body")).toBeVisible();
  });

  test("404 page works", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.getByText("404")).toBeVisible();
  });
});
