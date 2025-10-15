import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  const id = body?.videoId as string | undefined;
  if (!id) return new NextResponse('videoId requis', { status: 400 });
  const db = await readDB();
  const v = db.videos.find(x => x.id === id);
  if (!v) return new NextResponse('Not found', { status: 404 });
  v.views = (v.views || 0) + 1;
  await writeDB(db);
  return NextResponse.json({ views: v.views });
}
