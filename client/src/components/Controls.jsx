// client/src/components/Controls.jsx
import { useMemo, useState } from 'react';
import { api } from '../api/client';

export default function Controls({ roverMeta, state, onChange }) {
  const { rover, type, date, camera } = state;
  const [scanning, setScanning] = useState(false);
  const [hint, setHint] = useState('');

  const cameras = useMemo(() => roverMeta?.cameras?.map(c => c.name) || [], [roverMeta]);

  // ---- boundaries
  const earthMin = roverMeta?.landing_date;            // earliest Earth date w/ potential photos
  const earthMax = roverMeta?.max_date;                // latest Earth date w/ photos
  const solMin = 0;
  const solMax = roverMeta?.max_sol ?? 0;

  const atMin = useMemo(() => {
    if (!roverMeta) return true;
    if (type === 'earth') return !date || compareDate(date, earthMin) <= 0;
    const s = toInt(date, 0);
    return s <= solMin;
  }, [type, date, roverMeta, earthMin]);

  const atMax = useMemo(() => {
    if (!roverMeta) return true;
    if (type === 'earth') return !date || compareDate(date, earthMax) >= 0;
    const s = toInt(date, 0);
    return s >= solMax;
  }, [type, date, roverMeta, earthMax]);

  // ---- handlers
  const onTypeChange = (nextType) => {
    if (nextType === type) return;
    // Switch type and set a sensible default date
    if (nextType === 'earth') {
      onChange({ type: 'earth', date: roverMeta?.max_date, page: 1 });
    } else {
      onChange({ type: 'sol', date: String(roverMeta?.max_sol ?? 0), page: 1 });
    }
  };

  const onDateChange = (e) => {
    const v = e.target.value;
    // For earth type v is 'YYYY-MM-DD', for sol it's a number string
    onChange({ date: v, page: 1 });
  };

  const onCameraChange = (e) => {
    const v = e.target.value;
    onChange({ camera: v, page: 1 });
  };

  // ---- prev/next with skip-empty search
  const step = async (dir) => {
    if (!roverMeta || scanning) return;

    setHint(dir < 0 ? 'Searching previous date…' : 'Searching next date…');
    setScanning(true);

    try {
      const limit = 30; // how many steps to try before giving up (keeps UX snappy)
      let tries = 0;

      if (type === 'earth') {
        let curr = date || earthMax;
        while (tries < limit) {
          curr = stepDate(curr, dir);

          // boundaries
          if (compareDate(curr, earthMin) < 0 || compareDate(curr, earthMax) > 0) {
            setHint(dir < 0 ? 'Reached earliest date' : 'Reached latest date');
            break;
          }

          const ok = await hasPhotos({ rover, type, d: curr, camera });
          if (ok) {
            onChange({ date: curr, page: 1 });
            setHint('');
            return;
          }
          tries++;
        }
      } else {
        // sol
        let curr = toInt(date, solMax);
        while (tries < limit) {
          curr = curr + dir;

          // boundaries
          if (curr < solMin || curr > solMax) {
            setHint(dir < 0 ? 'Reached earliest sol' : 'Reached latest sol');
            break;
          }

          const ok = await hasPhotos({ rover, type, d: curr, camera });
          if (ok) {
            onChange({ date: String(curr), page: 1 });
            setHint('');
            return;
          }
          tries++;
        }
      }

      // If we got here, we didn’t find anything within the scan window
      if (!hint) setHint('No photos found nearby.');
    } finally {
      setScanning(false);
      // Clear hint after a moment
      setTimeout(() => setHint(''), 1500);
    }
  };

  return (
    <section className="controls" aria-label="Browse controls">
      <div className="row">
        <fieldset className="seg">
          <legend className="sr-only">Date type</legend>
          <button
            className={`btn ${type === 'earth' ? 'active' : ''}`}
            onClick={() => onTypeChange('earth')}
            aria-pressed={type === 'earth'}
            disabled={scanning}
          >
            Earth Date
          </button>
          <button
            className={`btn ${type === 'sol' ? 'active' : ''}`}
            onClick={() => onTypeChange('sol')}
            aria-pressed={type === 'sol'}
            disabled={scanning}
          >
            Sol
          </button>
        </fieldset>

        <div className="seg">
          {type === 'earth' ? (
            <label>
              <span className="label">Date</span>
              <input
                type="date"
                value={date || ''}
                min={earthMin || ''}
                max={earthMax || ''}
                onChange={onDateChange}
                disabled={scanning}
              />
            </label>
          ) : (
            <label>
              <span className="label">Sol</span>
              <input
                type="number"
                min={solMin}
                max={solMax}
                step={1}
                value={toInt(date, solMax)}
                onChange={onDateChange}
                disabled={scanning}
              />
            </label>
          )}
        </div>

        <div className="seg">
          <label>
            <span className="label">Camera</span>
            <select value={camera || ''} onChange={onCameraChange} disabled={scanning}>
              <option value="">All</option>
              {cameras.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="seg">
          <div className="date-stepper">
            <button className="btn" onClick={() => step(-1)} disabled={scanning || atMin} title="Previous date with photos">
              ← Prev
            </button>
            <button className="btn" onClick={() => step(1)} disabled={scanning || atMax} title="Next date with photos">
              Next →
            </button>
          </div>
          {hint && <div className="hint" aria-live="polite">{hint}</div>}
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

function toInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function compareDate(a, b) {
  if (!a || !b) return 0;
  // lexical compare works for YYYY-MM-DD
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function stepDate(iso, dir) {
  // iso = 'YYYY-MM-DD'; dir = ±1 day
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + dir);
  return d.toISOString().slice(0, 10);
}

async function hasPhotos({ rover, type, d, camera }) {
  const p = new URLSearchParams();
  p.set('rover', rover);
  if (type === 'earth') p.set('earth_date', String(d));
  else p.set('sol', String(d));
  p.set('page', '1');
  if (camera) p.set('camera', camera);

  const res = await api.get(`/photos?${p.toString()}`);
  const arr = res?.data?.photos;
  return Array.isArray(arr) && arr.length > 0;
}
