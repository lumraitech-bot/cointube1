'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      const txt = await res.text();
      setError(txt || 'Erreur de connexion');
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-4">Se connecter</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input required className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input required className="w-full p-3 rounded-xl bg-black/40 border border-white/10" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button className="btn w-full" type="submit">Connexion</button>
      </form>
      <p className="text-white/70 mt-4">Pas de compte ? <a href="/signup" className="underline">Créer un compte</a></p>
    </div>
  );
}
