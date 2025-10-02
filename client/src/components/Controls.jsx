import { useMemo } from 'react';

export default function Controls({ roverMeta, state, onChange }) {
  const cameras = useMemo(() => roverMeta?.cameras?.map(c => c.name) || [], [roverMeta]);
  if (!roverMeta) return null;

  const handleTypeChange = (e) => {
    const nextType = e.target.value;
    const nextDate = nextType === 'earth' ? roverMeta.max_date : roverMeta.max_sol;
    onChange({ type: nextType, date: nextDate });
  };

  return (
    <section className="controls" aria-label="Filters and date controls">
      <div className="row">
        <label className="switch">
          <span>Date Type:</span>
          <select
            value={state.type}
            onChange={handleTypeChange}
            aria-label="Select date type"
          >
            <option value="earth">Earth Date</option>
            <option value="sol">Sol</option>
          </select>
        </label>

        {state.type === 'earth' ? (
          <label>
            <span>Date:</span>
            <input
              type="date"
              value={state.date || roverMeta.max_date}
              min={roverMeta.landing_date}
              max={roverMeta.max_date}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </label>
        ) : (
          <label>
            <span>Sol:</span>
            <input
              type="number"
              value={Number.isFinite(Number(state.date)) ? state.date : roverMeta.max_sol}
              min={0}
              max={roverMeta.max_sol}
              step={1}
              onChange={(e) => {
                const n = e.target.value === '' ? '' : Math.max(0, Math.min(Number(roverMeta.max_sol), Number(e.target.value)));
                onChange({ date: n });
              }}
            />
          </label>
        )}

        <label>
          <span>Camera:</span>
          <select
            value={state.camera}
            onChange={(e) => onChange({ camera: e.target.value })}
            aria-label="Filter by camera"
          >
            <option value="">All</option>
            {cameras.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
