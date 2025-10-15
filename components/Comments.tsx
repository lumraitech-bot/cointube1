'use client';
import { useEffect, useState } from 'react';

export default function Comments({ videoId }: { videoId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState<string|null>(null);
  const [me, setMe] = useState<any>(null);
  const emojis = ['😀','👍','🔥','💡','🚀','🪙'];

  const load = async () => {
    const r = await fetch(`/api/comments?videoId=${videoId}`, { cache: 'no-store' });
    const d = await r.json();
    setItems(d);
  };
  useEffect(()=>{ load(); fetch('/api/me').then(r=>r.json()).then(setMe); }, [videoId]);

  const submit = async (e: any) => {
    e.preventDefault();
    setErr(null);
    const r = await fetch('/api/comments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ videoId, text }) });
    if (r.ok) {
      setText('');
      load();
    } else {
      setErr('Erreur. Es-tu connecté ?');
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={submit} className="flex items-center gap-2">
        <img src={me?.user?.avatar || '/favicon.svg'} className="w-8 h-8 rounded-full border border-white/10" alt="me" />
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ajouter un commentaire" className="flex-1 p-2 rounded-xl bg-black/40 border border-white/10" />
        <button className="btn">Envoyer</button>
      </form>
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <div className="flex gap-2">
        {emojis.map(e => <button key={e} className="btn py-1" onClick={()=>setText(t=>t+e)}>{e}</button>)}
      </div>
      <ul className="space-y-2">
        {items.map(c => (
          <li key={c.id} className="flex items-start gap-2">
            <img src={c.author?.avatar || '/favicon.svg'} className="w-8 h-8 rounded-full border border-white/10" alt={c.author?.name||'user'} />
            <div>
              <div className="text-sm"><span className="font-semibold">{c.author?.name || 'Anonyme'}</span> <span className="text-white/50">{new Date(c.createdAt).toLocaleString()}</span></div>
              <div>{c.text}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
