'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PlayCircle, Menu, LogIn, User, Upload, SlidersHorizontal, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Header() {
  const [me, setMe] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') || '');

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe).catch(()=>{});
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = q ? `/?q=${encodeURIComponent(q)}` : '/';
    router.push(url);
  };

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
      <button className="btn md:hidden" onClick={()=>setSidebar(v=>!v)}><Menu className="w-5 h-5" /></button>
      <Link href="/" className="flex items-center gap-2">
        <PlayCircle className="text-yellow-400 w-7 h-7" />
        <span className="text-xl font-bold text-yellow-400 tracking-wide">CoinTube</span>
      </Link>

      <form onSubmit={onSearch} className="flex-1 flex items-center gap-2 max-w-2xl mx-auto">
        <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 mr-2 opacity-70" />
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            placeholder="Rechercher des vidéos, tags..."
            className="bg-transparent outline-none w-full"
          />
        </div>
        <Link href={`/?q=${encodeURIComponent(q||'')}&filters=1`} className="btn" title="Filtres">
          <SlidersHorizontal className="w-4 h-4" />
        </Link>
      </form>

      <nav className="hidden md:flex items-center gap-4">
        <Link href="/upload" className="hover:text-yellow-400">Upload</Link>
        <Link href="/disclaimer" className="hover:text-yellow-400">Disclaimer</Link>
        <Link href="/profile" className="hover:text-yellow-400">{me?.user ? 'Profil' : 'Connexion'}</Link>
        {me?.user && <Link href="/channel/me" className="hover:text-yellow-400">Ma chaîne</Link>}
        {me?.user?.role === 'ADMIN' && <Link href="/admin" className="hover:text-yellow-400">Admin</Link>}
      </nav>

      {sidebar && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-black/90 border-r border-white/10 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="text-yellow-400 w-6 h-6" />
              <span className="font-bold">CoinTube</span>
            </div>
            <button className="btn" onClick={()=>setSidebar(false)}>Fermer</button>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/" onClick={()=>setSidebar(false)} className="btn">Accueil</Link>
            <Link href="/upload" onClick={()=>setSidebar(false)} className="btn">Upload</Link>
            <Link href="/disclaimer" onClick={()=>setSidebar(false)} className="btn">Disclaimer</Link>
            <Link href="/profile" onClick={()=>setSidebar(false)} className="btn">{me?.user ? 'Profil' : 'Connexion'}</Link>
            {me?.user && <Link href="/channel/me" onClick={()=>setSidebar(false)} className="btn">Ma chaîne</Link>}
            {me?.user?.role === 'ADMIN' && <Link href="/admin" onClick={()=>setSidebar(false)} className="btn">Admin</Link>}
            {me?.user ? (
              <form action="/api/logout" method="post"><button className="btn w-full mt-2">Se déconnecter</button></form>
            ) : (
              <Link href="/login" onClick={()=>setSidebar(false)} className="btn mt-2">Se connecter</Link>
            )}
          </div>
        </aside>
      )}
    <form action="/api/logout" method="post" className="hidden md:block">
        {me?.user ? <button className="btn ml-2">Se déconnecter</button> : <Link href="/login" className="btn ml-2">Se connecter</Link>}
      </form>
    </header>
  );
}
