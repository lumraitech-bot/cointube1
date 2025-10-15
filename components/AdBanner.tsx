'use client';

import { useEffect, useState } from 'react';

type Ad = {
  id: string;
  title: string;
  mediaUrl: string;
  targetUrl: string;
  active: boolean;
};

export default function AdBanner({ placement: _placement }: { placement?: string }) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/ads?active=1', { cache: 'no-store' });
        if (!r.ok) return;
        const list: Ad[] = await r.json();
        if (!mounted) return;
        if (list.length) {
          const pick = list[Math.floor(Math.random() * list.length)];
          setAd(pick);
        }
      } catch {/* noop */}
    })();
    return () => { mounted = false; };
  }, []);

  if (!ad) return null;

  const mediaIsVideo = /\.mp4($|\?)/i.test(ad.mediaUrl);
  const onView  = () => { fetch(`/api/ads/${ad.id}/view`,  { method: 'POST' }).catch(()=>{}); };
  const onClick = () => { fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(()=>{}); };

  return (
    <aside className="card p-0 overflow-hidden">
      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {mediaIsVideo ? (
          <video
            onPlay={onView}
            src={ad.mediaUrl}
            className="w-full h-auto"
            controls={false}
            muted
            autoPlay
            loop
          />
        ) : (
          <img onLoad={onView} src={ad.mediaUrl} alt={ad.title} className="w-full h-auto" />
        )}
      </a>
    </aside>
  );
}
