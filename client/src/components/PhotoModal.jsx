import { useEffect, useRef, useState } from 'react';


export default function PhotoModal() {
const [photo, setPhoto] = useState(null);
const dialogRef = useRef(null);


useEffect(() => {
const handler = (e) => {
setPhoto(e.detail);
dialogRef.current?.showModal();
};
window.addEventListener('open-photo-modal', handler);
return () => window.removeEventListener('open-photo-modal', handler);
}, []);


const onClose = () => dialogRef.current?.close();


return (
<dialog ref={dialogRef} className="modal" aria-labelledby="modal-title">
{photo && (
<div>
<h2 id="modal-title">{photo.rover?.name} • {photo.camera?.full_name || photo.camera?.name}</h2>
<img src={photo.img_src} alt="Enlarged rover photo" />
<ul className="meta-list">
<li><strong>Earth date:</strong> {photo.earth_date || '—'}</li>
<li><strong>Sol:</strong> {photo.sol ?? '—'}</li>
<li><strong>Rover:</strong> {photo.rover?.name}</li>
<li><strong>Camera:</strong> {photo.camera?.name}</li>
<li><strong>URL:</strong> <a href={photo.img_src} target="_blank" rel="noreferrer">Open original</a></li>
</ul>
<div className="modal-actions">
<button className="btn" onClick={onClose} autoFocus>Close</button>
</div>
</div>
)}
</dialog>
);
}