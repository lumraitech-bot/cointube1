'use client';
export default function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Lien copié');
    }
  };
  return <button className="btn" onClick={share}>Partager</button>;
}
