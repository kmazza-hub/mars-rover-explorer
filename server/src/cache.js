const store = new Map();


export function setCache(key, value, ttlMs) {
const expiresAt = Date.now() + (ttlMs || 5 * 60 * 1000);
store.set(key, { value, expiresAt });
}


export function getCache(key) {
const hit = store.get(key);
if (!hit) return null;
if (Date.now() > hit.expiresAt) {
store.delete(key);
return null;
}
return hit.value;
}


export function cacheKey(parts) {
return JSON.stringify(parts);
}