import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const { videoId } = body || {};
  if (!videoId) return new NextResponse('videoId requis', { status: 400 });
  const db = await readDB();
  const before = db.videos.length;
  db.videos = db.videos.filter(v => v.id !== videoId);
  await writeDB(db);
  return NextResponse.json({ ok: true, removed: before - db.videos.length });
}
