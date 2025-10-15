'use client';
import { useEffect, useState } from 'react';

export default function AdBanner({ placement: _placement }: { placement?: string }) {
  const [ad, setAd] = useState<any>(null);
  useEffect(()=>{
    fetch('/api/ads?active=1').then(r=>r.json()).then((list)=>{
      if (Array.isArray(list) && list.length) {
        const pick = list[Math.floor(Math.random()*list.length)];
        setAd(pick);
        fetch(`/api/ads/${pick.id}/view`, { method: 'POST' });
      }
    }).catch(()=>{});
  }, []);

  if (!ad) return null;
  const onClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(()=>{});
    window.open(ad.targetUrl, '_blank');
  };

  const isVideo = ad.mediaUrl.endsWith('.mp4') || (ad.mediaUrl.startsWith('http') && ad.mediaUrl.includes('.mp4'));
  return (
    <div className="card cursor-pointer" onClick={onClick} title={ad.title}>
      <div className="text-xs text-white/60 mb-1">Publicité</div>
      <div className="rounded-xl overflow-hidden">
        {isVideo ? (
          <video className="w-full" muted autoPlay loop playsInline>
            <source src={ad.mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={ad.mediaUrl} alt={ad.title} className="w-full object-cover" />
        )}
      </div>
      <div className="mt-2 text-sm">{ad.title}</div>
    </div>
  );
}
