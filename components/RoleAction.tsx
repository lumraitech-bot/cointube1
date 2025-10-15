'use client';
import { useState } from 'react';

export default function RoleAction({ userId, currentRole }: { userId: string, currentRole: 'USER'|'ADMIN' }) {
  const [role, setRole] = useState(currentRole);
  const save = async () => {
    const r = await fetch('/api/admin/user/role', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId, role }) });
    if (!r.ok) alert('Erreur rôle');
  };
  return (
    <div className="flex items-center gap-2">
      <select className="p-1 rounded bg-black/40 border border-white/10" value={role} onChange={e=>setRole(e.target.value as any)}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <button className="btn py-1" onClick={save}>OK</button>
    </div>
  );
}
