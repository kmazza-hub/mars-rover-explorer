import { useMemo } from 'react';


export default function Controls({ roverMeta, state, onChange }) {
const cameras = useMemo(() => roverMeta?.cameras?.map(c => c.name) || [], [roverMeta]);
if (!roverMeta) return null;


return (
<section className="controls" aria-label="Filters and date controls">
<div className="row">
<label className="switch">
<span>Date Type:</span>
<select
value={state.type}
onChange={(e) => onChange({ type: e.target.value })}
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
value={state.date || roverMeta.max_sol}
min={0}
max={roverMeta.max_sol}
onChange={(e) => onChange({ date: e.target.value })}
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