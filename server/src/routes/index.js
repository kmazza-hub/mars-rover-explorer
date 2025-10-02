import express from 'express';
router.get('/health', (_req, res) => res.json({ ok: true }));


// GET /api/rovers – cached 1h
router.get('/rovers', async (req, res) => {
try {
const key = cacheKey(['rovers']);
const cached = getCache(key);
if (cached) return res.json(cached);


const data = await nasaGet('/rovers');
setCache(key, data, 60 * 60 * 1000);
res.json(data);
} catch (e) {
res.status(e.response?.status || 500).json({ error: e.message });
}
});


// GET /api/photos?rover=curiosity&sol=1000&page=1&camera=FHAZ or &earth_date=YYYY-MM-DD
router.get('/photos', async (req, res) => {
try {
const { rover, sol, earth_date, camera, page } = req.query;
if (!rover) return res.status(400).json({ error: 'rover is required' });
if (!sol && !earth_date)
return res.status(400).json({ error: 'Provide sol or earth_date' });


const params = {};
if (sol) params.sol = Number(sol);
if (earth_date) params.earth_date = earth_date;
if (camera) params.camera = camera;
if (page) params.page = Number(page);


const key = cacheKey(['photos', rover, params]);
const cached = getCache(key);
if (cached) return res.json(cached);


const data = await nasaGet(`/rovers/${rover}/photos`, params);
setCache(key, data, Number(process.env.CACHE_TTL_MS) || 5 * 60 * 1000);
res.json(data);
} catch (e) {
const status = e.response?.status || 500;
const msg = e.response?.data || { error: e.message };
res.status(status).json(msg);
}
});


// Favorites (MongoDB)
router.get('/favorites', async (_req, res) => {
const items = await Favorite.find().sort({ createdAt: -1 }).lean();
res.json(items);
});


router.post('/favorites', async (req, res) => {
try {
const { id, img_src, earth_date, sol, rover, camera } = req.body;
if (!id || !img_src || !rover)
return res.status(400).json({ error: 'id, img_src, rover required' });


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