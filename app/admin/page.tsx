import { getSession } from '@/lib/auth';
import { readDB } from '@/lib/db';
import AdminStats from '@/components/AdminStats';
import RoleAction from '@/components/RoleAction';
import DeleteVideoAction from '@/components/DeleteVideoAction';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const sess = await getSession();
  if (!sess?.user) {
    return <div className="card max-w-xl mx-auto">Accès refusé — merci de <a className="underline" href="/login">te connecter</a>.</div>;
  }
  if ((sess.user as any).role !== 'ADMIN') {
    return <div className="card max-w-xl mx-auto">Accès réservé aux administrateurs.</div>;
  }
  const db = await readDB();
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Admin • Tableau de bord</h1>
        <p className="text-white/70 text-sm">Bienvenue {sess.user.name}</p>
        <AdminStats />
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr><th className="text-left py-2">Nom</th><th className="text-left">Email</th><th className="text-left">Rôle</th><th className="text-left">Créé le</th><th className="text-left">Actions</th></tr>
          </thead>
          <tbody>
            {db.users.map(u => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{(u as any).role || 'USER'}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td><RoleAction userId={u.id} currentRole={(u as any).role || 'USER'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="flex justify-end mb-2"><a className="btn" href="/admin/ads">Gérer les publicités</a></div>
        <h2 className="text-xl font-semibold mb-2">Vidéos ({db.videos.length})</h2>
        <ul className="space-y-2">
          {db.videos.map(v => (
            <li key={v.id} className="flex items-center justify-between border border-white/10 rounded-xl p-2">
              <div>
                <div className="font-semibold">{v.title}</div>
                <div className="text-white/60 text-xs">{v.category} • {v.visibility} • {new Date(v.createdAt).toLocaleString()}</div>
              </div>
              <a className="btn" href={`/watch/${v.id}`}>Voir</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



