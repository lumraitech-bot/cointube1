import { NextResponse } from 'next/server';
import { readDB, writeDB, uid } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const active = searchParams.get('active');
  const db = await readDB();
  let ads = db.ads;
  if (active) ads = ads.filter(a => a.active);
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  if (!body?.title || !body?.mediaUrl || !body?.targetUrl) return new NextResponse('title, mediaUrl, targetUrl requis', { status: 400 });
  const db = await readDB();
  const ad = { id: uid(), title: body.title, mediaUrl: body.mediaUrl, targetUrl: body.targetUrl, active: !!body.active, views: 0, clicks: 0, createdAt: new Date().toISOString() };
  db.ads.push(ad);
  await writeDB(db);
  return NextResponse.json(ad, { status: 201 });
}
