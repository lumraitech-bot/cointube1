import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ [k: string]: string | undefined }>}) {
  const sp = await searchParams;
  const category = sp?.category;
  const q = sp?.q;
  const sort = sp?.sort || 'date';

  const url = new URL('http://localhost:3000/api/videos');
  if (category) url.searchParams.set('category', category);
  if (q) url.searchParams.set('q', q);
  if (sort) url.searchParams.set('sort', sort);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  const videos = await res.json();

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <div className="max-w-3xl mx-auto"><AdBanner placement="home-top" /></div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Tendances & Nouveautés</h1>
        <p className="text-white/80 max-w-2xl mx-auto">Découvrez les dernières vidéos courtes/moyennes de Crypto • Tech • Finance • Science.</p>
        <div className="flex justify-center flex-wrap gap-3">
          <Link href="/?sort=date" className={`btn ${sort==='date'?'border-yellow-400':''}`}>Plus récentes</Link>
          <Link href="/?sort=views" className={`btn ${sort==='views'?'border-yellow-400':''}`}>Plus vues</Link>
          <Link href="/?sort=likes" className={`btn ${sort==='likes'?'border-yellow-400':''}`}>Plus likées</Link>
          <Link href={`/?category=Crypto${q?`&q=${encodeURIComponent(q)}`:''}`} className="btn">Crypto</Link>
          <Link href={`/?category=Tech${q?`&q=${encodeURIComponent(q)}`:''}`} className="btn">Tech</Link>
          <Link href={`/?category=Finance${q?`&q=${encodeURIComponent(q)}`:''}`} className="btn">Finance</Link>
          <Link href={`/?category=Science${q?`&q=${encodeURIComponent(q)}`:''}`} className="btn">Science</Link>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <p className="text-white/70">Aucune vidéo. Va sur <Link href="/upload" className="underline">Upload</Link>.</p>
          ) : videos.map((v: any) => <VideoCard key={v.id} video={v} />)}
        </div>
      </section>
    </div>
  );
}

import VideoCard from '@/components/VideoCard';
import AdBanner from '@/components/AdBanner';
