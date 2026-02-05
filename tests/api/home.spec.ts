import { test, expect, APIResponse } from "@playwright/test";

test.describe("Home API - First Tests", () => {
  let response: APIResponse;

  test.beforeEach(async ({ request }) => {
    response = await request.get("/");
  });

  test("should validate home page is accessible", async () => {
    expect.soft(response.status()).toBe(200);
    expect.soft(response.ok()).toBeTruthy();

    const contentType = response.headers()["content-type"];
    expect.soft(contentType).toContain("text/html");
  });

  test("should have proper response headers", async () => {
    const headers = response.headers();

    expect.soft(headers["date"]).toBeDefined();
    expect.soft(headers["server"]).toBeDefined();
  });

  test("should validate response is HTML", async () => {
    const html = await response.text();

    expect.soft(html).toContain("<!DOCTYPE html>");
    expect(html.length).toBeGreaterThan(0);
  });
});

test.describe("Home API - Negative Tests", () => {
  test("should return 404 for a non-existent route", async ({ request }) => {
    const response = await request.get("/a-random-non-existent-route-12345");
    expect(response.status()).toBe(404);
  });

  test("should return a client error for an invalid method", async ({ request }) => {
    const response = await request.post("/");
    expect.soft(response.status()).toBeGreaterThanOrEqual(400);
    expect.soft(response.status()).toBeLessThan(500);
  });
});
