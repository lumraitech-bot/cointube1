'use client';

export default function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (_e) {
        // Annulé par l’utilisateur — noop
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié');
      } catch (_e) {
        // Clipboard indisponible — noop
      }
    }
  };
  return <button className="btn" onClick={share}>Partager</button>;
}
