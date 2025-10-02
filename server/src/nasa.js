import axios from 'axios';

const BASE = process.env.NASA_API_BASE;
const KEY = process.env.NASA_API_KEY;

const client = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { 'User-Agent': 'MarsRoverExplorer/1.0' },
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * GET wrapper with polite retries for 429/5xx.
 */
export async function nasaGet(path, params = {}, attempt = 0) {
  try {
    const res = await client.get(path, { params: { api_key: KEY, ...params } });
    return res.data;
  } catch (e) {
    const status = e?.response?.status;
    if ((status === 429 || (status >= 500 && status < 600)) && attempt < 2) {
      const retryAfterHeader = e.response?.headers?.['retry-after'];
      const retryAfter = Number(retryAfterHeader);
      const delayMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 800 * (attempt + 1);
      await sleep(delayMs);
      return nasaGet(path, params, attempt + 1);
    }
    throw e;
  }
}
