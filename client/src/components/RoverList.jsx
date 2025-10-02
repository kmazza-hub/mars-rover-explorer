import { useNavigate, useParams } from 'react-router-dom';
import { useRovers } from '../hooks/useRovers';


export default function RoverList({ active }) {
const { data, isLoading, error } = useRovers();
const navigate = useNavigate();
const { roverName } = useParams();


if (isLoading) return <div>Loading rovers…</div>;
if (error) return <div className="error">Failed to load rovers.</div>;


return (
<ul className="rover-list" role="list">
{data.rovers.map((r) => {
const k = r.name.toLowerCase();
return (
<li key={r.id}>
<button
className={`rover-item ${active === k ? 'active' : ''}`}
onClick={() => navigate(`/${k}`)}
>
<strong>{r.name}</strong>
<div className="meta">
<span>Launch: {r.launch_date}</span>
<span>Landing: {r.landing_date}</span>
<span>Status: {r.status}</span>
<span>Total photos: {r.total_photos}</span>
</div>
<div className="cameras">Cameras: {r.cameras.map(c=>c.name).join(', ')}</div>
</button>
</li>
);
})}
</ul>
);
}