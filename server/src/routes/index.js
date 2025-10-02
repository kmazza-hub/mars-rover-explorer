import express from 'express';
import Favorite from '../models/Favorite.js';
import { nasaGet } from '../nasa.js';
import { cacheKey, getCache, setCache } from '../cache.js';

const router = express.Router();

// Health
router.get('/health', (_req, res) => res.json({ ok: true }));

// Debug env (helps confirm key is loaded; remove later if you want)
router.get('/debug/env', (_req, res) => {
  res.json({
    hasKey: Boolean(process.env.NASA_API_KEY),
    keyIsDemo: process.env.NASA_API_KEY === 'DEMO_KEY',
    base: process.env.NASA_API_BASE
  });
});

// ---- Validation helpers
const validEarthDate = (d) =>
  typeof d === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(d) &&
  +d.slice(0, 4) >= 1990 &&
  +d.slice(0, 4) <= new Date().getFullYear() + 5;

const validSol = (s) => Number.isInteger(+s) && +s >= 0;

// ---- NASA proxy endpoints

// Rovers (cache 1h)
router.get('/rovers', async (_req, res) => {
  try {
    const key = cacheKey(['rovers']);
    const cached = getCache(key);
    if (cached) return res.json(cached);

    const data = await nasaGet('/rovers');
    setCache(key, data, 60 * 60 * 1000);
    res.json(data);
  } catch (e) {
    const status = e.response?.status || 500;
    const msg = e.response?.data || { error: e.message };
    res.status(status).json(msg);
  }
});

// Photos
// /api/photos?rover=curiosity&earth_date=YYYY-MM-DD&page=1&camera=FHAZ
// or /api/photos?rover=curiosity&sol=1000&page=1
router.get('/photos', async (req, res) => {
  try {
    const { rover, sol, earth_date, camera, page } = req.query;

    if (!rover) return res.status(400).json({ error: 'rover is required' });
    if (!sol && !earth_date) return res.status(400).json({ error: 'Provide sol or earth_date' });
    if (earth_date && !validEarthDate(earth_date)) return res.status(400).json({ error: 'Invalid earth_date' });
    if (sol && !validSol(sol)) return res.status(400).json({ error: 'Invalid sol' });

    const params = {};
    if (sol) params.sol = Number(sol);
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;
    if (page) params.page = Math.max(1, Number(page));

    const key = cacheKey(['photos', rover, params]);
    const cached = getCache(key);
    if (cached) return res.json(cached);

    const data = await nasaGet(`/rovers/${rover}/photos`, params);
    const ttl = Number(process.env.CACHE_TTL_MS) || 5 * 60 * 1000;
    setCache(key, data, ttl);
    res.json(data);
  } catch (e) {
    const status = e.response?.status || 500;
    const msg = e.response?.data || { error: e.message };
    res.status(status).json(msg);
  }
});

// ---- Favorites (MongoDB)

router.get('/favorites', async (_req, res) => {
  const items = await Favorite.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

router.post('/favorites', async (req, res) => {
  try {
    const { id, img_src, earth_date, sol, rover, camera } = req.body;
    if (!id || !img_src || !rover) {
      return res.status(400).json({ error: 'id, img_src, rover required' });
    }
    const doc = await Favorite.findOneAndUpdate(
      { nasa_id: id },
      { nasa_id: id, img_src, earth_date, sol, rover, camera },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/favorites/:id', async (req, res) => {
  await Favorite.findOneAndDelete({ nasa_id: Number(req.params.id) });
  res.status(204).send();
});

export default router;
