import { test, expect } from '@playwright/test';

const BASE_URL = 'https://reqres.in';

test.describe('ReqRes API Automation Suite', () => {
  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    // Include x-api-key header if provided in environment
    if (process.env.REQRES_API_KEY) {
      headers['x-api-key'] = process.env.REQRES_API_KEY;
    }
    return headers;
  };

  test('GET /api/users/2 returns status 200 and data.email', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users/2`, {
      headers: getHeaders(),
    });

    // Check status code
    expect(response.status()).toBe(200);

    // Verify response body has data.email
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('email');
    expect(typeof body.data.email).toBe('string');
    expect(body.data.email.length).toBeGreaterThan(0);
    expect(body.data.id).toBe(2);
  });

  test('POST /api/users creates a user with status 201 and correct name', async ({ request }) => {
    const payload = {
      name: 'morpheus',
      job: 'leader',
    };

    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: getHeaders(),
      data: payload,
    });

    // Check status code
    expect(response.status()).toBe(201);

    // Verify response name matches payload
    const body = await response.json();
    expect(body).toHaveProperty('name', 'morpheus');
    expect(body).toHaveProperty('job', 'leader');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('GET /api/users/23 returns status 404 for non-existent user (bonus)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users/23`, {
      headers: getHeaders(),
    });

    expect(response.status()).toBe(404);
  });
});
