import { test, expect } from "@playwright/test";

test.describe("Home API - First Tests", () => {
  test("should validate home page is accessible", async ({ request }) => {
    const response = await request.get("/");

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("text/html");

    console.log(`✓ Status: ${response.status()}`);
    console.log(`✓ Content-Type: ${contentType}`);
  });

  test("should have proper response headers", async ({ request }) => {
    const response = await request.get("/");

    const headers = response.headers();

    expect(headers["content-type"]).toBeDefined();
    expect(headers["date"]).toBeDefined();
    expect(headers["server"]).toBeDefined();

    console.log("✓ Response headers are present");
    console.log(`✓ Server: ${headers["server"]}`);
    console.log(`✓ Date: ${headers["date"]}`);
  });

  test("should validate response is HTML", async ({ request }) => {
    const response = await request.get("/");

    const html = await response.text();

    expect(html).toContain("<html");
    expect(html.length).toBeGreaterThan(0);

    console.log(`✓ HTML response received`);
    console.log(`✓ Response size: ${html.length} bytes`);
  });
});
