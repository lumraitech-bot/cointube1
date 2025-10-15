import { getSession } from '@/lib/auth';
import { readDB } from '@/lib/db';
import AvatarUpload from '@/components/AvatarUpload';
import ProfileEditor from '@/components/ProfileEditor';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const sess = await getSession();
  if (!sess?.user) {
    return <div className="card max-w-xl mx-auto">Merci de <a href="/login" className="underline">te connecter</a>.</div>
  }
  const db = await readDB();
  const myVideos = db.videos.filter(v => v.authorId === sess.user.id);
  const me = db.users.find(u=>u.id===sess.user!.id)!;
  return (
    <div className="space-y-4">
      <div className="card flex items-center gap-4">
        <img src={me.avatar || '/favicon.svg'} className="w-16 h-16 rounded-full border border-white/10" alt="avatar" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Bonjour, {sess.user.name}</h1>
          <p className="text-white/70">{sess.user.email}</p>
          <div className="text-white/60 text-sm">ID: {sess.user.id}</div>
          <form action="/api/logout" method="post" className="mt-3">
            <button className="btn">Se déconnecter</button>
          </form>
        </div>
        <AvatarUpload />
      </div>
      <ProfileEditor me={me} />
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Mes vidéos</h2>
        {myVideos.length === 0 ? <p className="text-white/70">Aucune vidéo.</p> : (
          <ul className="list-disc pl-6 space-y-2">
            {myVideos.map(v => <li key={v.id}><a className="underline" href={`/watch/${v.id}`}>{v.title}</a></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

