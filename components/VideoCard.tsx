'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function VideoCard({ video }: { video: any }) {
  const [likeInfo, setLikeInfo] = useState<{count:number; liked:boolean}>({count: video.likes || 0, liked:false});
  const [chan, setChan] = useState<any>(null);

  useEffect(()=>{
    fetch(`/api/likes?videoId=${video.id}`).then(r=>r.json()).then(setLikeInfo).catch(()=>{});
    fetch(`/api/channel/${video.authorId}`).then(r=>r.json()).then(setChan).catch(()=>{});
  }, [video.id, video.authorId]);

  const toggleLike = async () => {
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ videoId: video.id }),
    });
    if (res.ok) {
      const data = await res.json();
      setLikeInfo(data);
    }
  };

  const toggleSub = async () => {
    if (!chan) return;
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ channelId: video.authorId }),
    });
    if (res.ok) {
      const data = await res.json();
      setChan({ ...chan, subscribed: data.subscribed, subscribers: data.count });
    }
  };

  return (
    <div className="card hover:scale-[1.01] transition">
      <Link href={`/watch/${video.id}`}>
        <img src={video.thumbnail || '/videos/demo.jpg'} alt={video.title} className="w-full h-44 object-cover rounded-xl" />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/watch/${video.id}`} className="text-lg font-semibold hover:text-yellow-400 line-clamp-2">{video.title}</Link>
          <div className="text-sm text-white/70">
            <span>{chan?.name || 'Chaîne'}</span> • <span>{video.category}</span> • <span>{video.views||0} vues</span> • <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button onClick={toggleLike} className={`btn ${likeInfo.liked ? 'text-pink-400' : ''}`}>
            <Heart className="w-4 h-4 mr-2" /> {likeInfo.count}
          </button>
          <button onClick={toggleSub} className="btn text-xs">
            {chan?.subscribed ? 'Abonné' : 'S’abonner'} {chan ? `(${chan.subscribers})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
