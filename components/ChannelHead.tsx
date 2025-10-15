'use client';
import { useEffect, useState } from 'react';

export default function ChannelHead({ channelId }: { channelId: string }) {
  const [info, setInfo] = useState<any>(null);
  useEffect(()=>{ fetch(`/api/channel/${channelId}`).then(r=>r.json()).then(setInfo).catch(()=>{}); }, [channelId]);
  const toggle = async () => {
    const r = await fetch('/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ channelId }) });
    if (r.ok) {
      const d = await r.json();
      setInfo((prev:any)=> ({ ...(prev||{}), subscribed: d.subscribed, subscribers: d.count }));
    }
  };
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-white/60">{info?.subscribers || 0} abonnés</span>
      <button className="btn py-1" onClick={toggle}>{info?.subscribed ? 'Abonné' : 'S’abonner'}</button>
    </div>
  );
}
