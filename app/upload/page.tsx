'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    visibility: 'PUBLIC',
    url: '',
    tags: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(()=>{
    fetch('/api/me').then(r=>r.json()).then(setMe).catch(()=>{});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k, String(v)));
    if (file) fd.append('file', file);
    const res = await fetch('/api/videos', { method: 'POST', body: fd });
    if (res.ok) {
      router.push('/');
    } else {
      const txt = await res.text();
      setError(txt || 'Erreur upload');
    }
  };

  if (!me?.user) {
    return <div className="max-w-xl mx-auto card">Merci de <a href="/login" className="underline">te connecter</a> pour uploader.</div>
  }

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-2xl font-bold mb-4">Uploader</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Titre" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
        <textarea className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
        <input className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Tags (séparés par des virgules)" value={form.tags} onChange={e=>setForm({...form, tags: e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <select className="p-3 rounded-xl bg-black/40 border border-white/10" value={form.category} onChange={e=>setForm({...form, category: e.target.value})}>
            <option>Crypto</option>
            <option>Tech</option>
            <option>Finance</option>
            <option>Science</option>
          </select>
          <select className="p-3 rounded-xl bg-black/40 border border-white/10" value={form.visibility} onChange={e=>setForm({...form, visibility: e.target.value})}>
            <option value="PUBLIC">PUBLIC</option>
            <option value="FOLLOWERS">FOLLOWERS</option>
            <option value="PRIVATE">PRIVATE</option>
          </select>
        </div>
        <input type="url" className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="OU fournir une URL (mp4 ou image)" value={form.url} onChange={e=>setForm({...form, url: e.target.value})} />
        <div className="text-center text-white/60">— OU —</div>
        <input type="file" accept="video/mp4,image/*" onChange={e=>setFile(e.target.files?.[0] || null)} />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button className="btn w-full" type="submit">Envoyer</button>
      </form>
    </div>
  );
}
