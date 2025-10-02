import axios from 'axios';


const BASE = process.env.NASA_API_BASE;
const KEY = process.env.NASA_API_KEY;


export async function nasaGet(path, params = {}) {
const url = `${BASE}${path}`;
const res = await axios.get(url, { params: { api_key: KEY, ...params } });
return res.data;
}