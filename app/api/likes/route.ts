import { NextResponse } from 'next/server';
import { readDB, writeDB, uid } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get('videoId');
  if (!videoId) return new NextResponse('videoId requis', { status: 400 });
  const sess = await getSession();
  const db = await readDB();
  const count = db.likes.filter(l => l.videoId === videoId).length;
  const liked = !!(sess?.user && db.likes.find(l => l.videoId === videoId && l.userId === sess.user.id));
  return NextResponse.json({ count, liked });
}

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const videoId = body?.videoId as string | undefined;
  if (!videoId) return new NextResponse('videoId requis', { status: 400 });
  const db = await readDB();
  const existing = db.likes.find(l => l.videoId === videoId && l.userId === sess.user.id);
  if (existing) {
    db.likes = db.likes.filter(l => l.id !== existing.id);
  } else {
    db.likes.push({ id: uid(), userId: sess.user.id, videoId, createdAt: new Date().toISOString() });
  }
  const count = db.likes.filter(l => l.videoId === videoId).length;
  await writeDB(db);
  const liked = !!db.likes.find(l => l.videoId === videoId && l.userId === sess.user.id);
  return NextResponse.json({ count, liked });
}
