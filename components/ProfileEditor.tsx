'use client';
import { useState } from 'react';

export default function ProfileEditor({ me }: { me: any }) {
  const [firstName, setFirstName] = useState(me.firstName || '');
  const [lastName, setLastName] = useState(me.lastName || '');
  const [email, setEmail] = useState(me.email || '');
  const [bio, setBio] = useState(me.bio || '');
  const [website, setWebsite] = useState(me.website || '');
  const [links, setLinks] = useState((me.links || []).join(', '));
  const [msg, setMsg] = useState<string|null>(null);

  const save = async (e:any) => {
    e.preventDefault();
    const r = await fetch('/api/me/profile', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ firstName, lastName, email, bio, website, links }) });
    if (r.ok) setMsg('Profil mis à jour !'); else setMsg('Erreur');
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-3">Mon profil</h2>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Prénom" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Nom" value={lastName} onChange={e=>setLastName(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Site web" value={website} onChange={e=>setWebsite(e.target.value)} />
        <textarea className="p-3 rounded-xl bg-black/40 border border-white/10 md:col-span-2" placeholder="Description" value={bio} onChange={e=>setBio(e.target.value)} />
        <input className="p-3 rounded-xl bg-black/40 border border-white/10 md:col-span-2" placeholder="Liens (séparés par des virgules)" value={links} onChange={e=>setLinks(e.target.value)} />
        <button className="btn md:col-span-2">Enregistrer</button>
        {msg && <div className="text-white/70 text-sm md:col-span-2">{msg}</div>}
      </form>
    </div>
  );
}
