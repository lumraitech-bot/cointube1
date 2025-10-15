import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import ChannelHead from '@/components/ChannelHead';

export const dynamic = 'force-dynamic';

export default async function ChannelPage({ params }: { params: Promise<{ id: string }>}) {
  const db = await readDB();
  const p = await params;
  const user = db.users.find(u => u.id === p.id);
  if (!user) return notFound();
  const videos = db.videos.filter(v => v.authorId === user.id).sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <div className="card flex items-center gap-4">
        <img src={user.avatar || '/favicon.svg'} className="w-20 h-20 rounded-full border border-white/10" alt="avatar" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <ChannelHead channelId={user.id} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map(v => (
          <a key={v.id} href={`/watch/${v.id}`} className="card">
            <img src={v.thumbnail || '/videos/demo.jpg'} className="w-full h-40 object-cover rounded-xl" />
            <div className="mt-2 font-semibold">{v.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

