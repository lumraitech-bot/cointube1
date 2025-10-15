'use client';
import { useEffect, useState } from 'react';

export default function AdminStats() {
  const [stats, setStats] = useState<any>({ users: 0, videos: 0, subs: 0, comments: 0 });
  useEffect(()=>{
    fetch('/api/admin/stats').then(r=>r.json()).then(setStats).catch(()=>{});
  }, []);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
      <div className="card"><div className="text-white/60 text-sm">Utilisateurs</div><div className="text-2xl font-bold">{stats.users}</div></div>
      <div className="card"><div className="text-white/60 text-sm">Vidéos</div><div className="text-2xl font-bold">{stats.videos}</div></div>
      <div className="card"><div className="text-white/60 text-sm">Abonnements</div><div className="text-2xl font-bold">{stats.subs}</div></div>
      <div className="card"><div className="text-white/60 text-sm">Commentaires</div><div className="text-2xl font-bold">{stats.comments}</div></div>
    </div>
  );
}
