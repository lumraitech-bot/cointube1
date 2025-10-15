import { NextResponse } from 'next/server';
import { readDB, writeDB, uid } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');
  if (!videoId) return new NextResponse('videoId requis', { status: 400 });
  const db = await readDB();
  const items = db.comments
    .filter(c => c.videoId === videoId)
    .sort((a,b)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const users = new Map(db.users.map(u => [u.id, u]));
  const withUsers = items.map(c => ({
    ...c,
    author: users.get(c.userId) ? { id: c.userId, name: users.get(c.userId)!.name, avatar: users.get(c.userId)!.avatar || null } : null
  }));
  return NextResponse.json(withUsers);
}

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const videoId = (body?.videoId || '').trim();
  const text = (body?.text || '').toString().trim();
  if (!videoId || !text) return new NextResponse('videoId et text requis', { status: 400 });
  const db = await readDB();
  if (!db.videos.find(v=>v.id===videoId)) return new NextResponse('Vidéo introuvable', { status: 404 });
  db.comments.push({ id: uid(), videoId, userId: sess.user.id, text, createdAt: new Date().toISOString() });
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
