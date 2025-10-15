import { notFound } from 'next/navigation';
import { readDB } from '@/lib/db';
import ChannelSub from '@/components/ChannelSub';
import Comments from '@/components/Comments';
import ShareButton from '@/components/ShareButton';
import AdBanner from '@/components/AdBanner';

export const dynamic = 'force-dynamic';

async function incView(id: string) {
  await fetch('http://localhost:3000/api/videos/views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ videoId: id }),
    cache: 'no-store',
  });
}

export default async function WatchPage({ params }: { params: Promise<{ id?: string }>}) {
  const p = await params;
  const id = p?.id;
  if (!id) return notFound();

  const db = await readDB();
  const video = db.videos.find(v => v.id === id);
  if (!video) return notFound();
  await incView(video.id);

  const author = db.users.find(u => u.id === video.authorId);
  const isVideo = video.url.endsWith('.mp4') || (video.url.startsWith('http') && video.url.includes('.mp4'));

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-3">
        <div className="card">
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
            {isVideo ? (
              <video controls className="w-full h-full">
                <source src={video.url} type="video/mp4" />
              </video>
            ) : (
              <img src={video.url || '/videos/demo.jpg'} alt={video.title} className="w-full h-full object-cover" />
            )}
          </div>
          <h1 className="text-2xl font-bold mt-3">{video.title}</h1>
          <div className="text-white/70 text-sm">{(video.views||0)} vues • {new Date(video.createdAt).toLocaleDateString()}</div>
          <div className="mt-3 text-white/80">{video.description}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(video.tags||[]).map(t => <span key={t} className="px-2 py-1 rounded-lg bg-white/10 text-xs">#{t}</span>)}
          </div>
          <div className="mt-3"><ShareButton title={video.title} /></div>
        </div>

        {/* Comments */}
        <div className="card">
          <h2 className="font-semibold mb-2">Commentaires</h2>
          <Comments videoId={video.id} />
        </div>
      </div>

      <aside className="card h-fit">
        <div className="flex items-center gap-3">
          <img src={author?.avatar || '/favicon.svg'} className="w-12 h-12 rounded-full border border-white/10" alt="avatar" />
          <div className="flex-1">
            <div className="font-semibold">{author?.name || 'Chaîne'}</div>
            {/* subscriber count will be fetched client-side */}
            <ChannelSub channelId={video.authorId} />
          </div>
        </div>
        <div className="mt-4"><AdBanner placement="watch-aside" /></div>
      </aside>
    </div>
  );
}

// Client components
