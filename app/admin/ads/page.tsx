import { getSession } from '@/lib/auth';
import { readDB } from '@/lib/db';
import AdminAdForm from '@/components/AdminAdForm';

export const dynamic = 'force-dynamic';

export default async function AdminAdsPage() {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') {
    return <div className="card max-w-xl mx-auto">Accès réservé aux administrateurs.</div>;
  }
  const db = await readDB();
  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold">Publicités</h1>
        <p className="text-white/70 text-sm">Créer et suivre des annonces (vues & clics).</p>
      </div>
      <AdminAdForm />
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Liste</h2>
        <table className="w-full text-sm">
          <thead className="text-white/60">
            <tr><th className="text-left py-2">Titre</th><th className="text-left">Active</th><th className="text-left">Vues</th><th className="text-left">Clics</th><th className="text-left">Créée le</th></tr>
          </thead>
          <tbody>
            {db.ads.map(a => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="py-2">{a.title}</td>
                <td>{a.active ? 'Oui' : 'Non'}</td>
                <td>{a.views}</td>
                <td>{a.clicks}</td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

