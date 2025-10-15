'use client';
import { useState } from 'react';

export default function AdminAdForm() {
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [active, setActive] = useState(true);
  const [msg, setMsg] = useState<string|null>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    const r = await fetch('/api/ads', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, mediaUrl, targetUrl, active }) });
    if (r.ok) setMsg('Annonce créée !'); else setMsg('Erreur');
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Créer une annonce</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Titre" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Media URL (image/mp4)" value={mediaUrl} onChange={e=>setMediaUrl(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Clic cible URL" value={targetUrl} onChange={e=>setTargetUrl(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} /> Active</label>
        <button className="btn col-span-full">Créer</button>
        {msg && <div className="text-white/70 text-sm col-span-full">{msg}</div>}
      </form>
    </div>
  );
}
