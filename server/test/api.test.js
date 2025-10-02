import request from 'supertest';
import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import express from 'express';
import routes from '../src/routes/index.js';

// mock NASA to avoid real HTTP during tests
vi.mock('../src/nasa.js', () => ({
  nasaGet: vi.fn(async (path) => {
    if (path === '/rovers') return { rovers: [{ id: 1, name: 'Curiosity' }] };
    return { photos: [] };
  }),
}));

let server;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use('/api', routes);
  server = app.listen(0);
});

afterAll(async () => {
  server?.close();
});

describe('API', () => {
  it('health returns ok', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('rovers returns data', async () => {
    const res = await request(server).get('/api/rovers');
    expect(res.status).toBe(200);
    expect(res.body.rovers?.[0]?.name).toBe('Curiosity');
  });

  it('photos validates missing params', async () => {
    const res = await request(server).get('/api/photos').query({ rover: 'curiosity' });
    expect(res.status).toBe(400);
  });
});
