import { NextResponse } from 'next/server';
import { readDB, writeDB, uid } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const channelId = (body?.channelId || '').trim();
  if (!channelId) return new NextResponse('channelId requis', { status: 400 });
  if (channelId === sess.user.id) return new NextResponse('Impossible de s’abonner à soi-même', { status: 400 });

  const db = await readDB();
  const existing = db.subscriptions.find(s => s.userId === sess.user.id && s.channelId === channelId);
  if (existing) {
    db.subscriptions = db.subscriptions.filter(s => s.id !== existing.id);
  } else {
    db.subscriptions.push({ id: uid(), userId: sess.user.id, channelId, createdAt: new Date().toISOString() });
  }
  await writeDB(db);
  const count = db.subscriptions.filter(s => s.channelId === channelId).length;
  const subscribed = !!db.subscriptions.find(s => s.userId === sess.user.id && s.channelId === channelId);
  return NextResponse.json({ subscribed, count });
}
