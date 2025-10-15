'use client';
import { useState } from 'react';

export default function AvatarUpload() {
  const [file, setFile] = useState<File|null>(null);
  const [msg, setMsg] = useState<string|null>(null);

  const send = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const r = await fetch('/api/me/avatar', { method: 'POST', body: fd });
    if (r.ok) setMsg('Avatar mis à jour !');
    else setMsg('Erreur upload avatar');
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button className="btn" onClick={send}>Mettre à jour l’avatar</button>
      {msg && <div className="text-white/70 text-sm">{msg}</div>}
    </div>
  );
}
