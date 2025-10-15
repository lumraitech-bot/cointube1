'use client';
export default function DeleteVideoAction({ videoId }: { videoId: string }) {
  const delit = async () => {
    if (!confirm('Supprimer cette vidéo ?')) return;
    const r = await fetch('/api/admin/video/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ videoId }) });
    if (!r.ok) alert('Erreur suppression'); else location.reload();
  };
  return <button className="btn py-1" onClick={delit}>Supprimer</button>;
}
