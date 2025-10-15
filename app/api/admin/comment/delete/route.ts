import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const { commentId } = body || {};
  if (!commentId) return new NextResponse('commentId requis', { status: 400 });
  const db = await readDB();
  const before = db.comments.length;
  db.comments = db.comments.filter(c => c.id !== commentId);
  await writeDB(db);
  return NextResponse.json({ ok: true, removed: before - db.comments.length });
}
