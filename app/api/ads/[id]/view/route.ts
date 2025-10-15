import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }>}) {
  const p = await params;
  const db = await readDB();
  const ad = db.ads.find(a => a.id === p.id);
  if (!ad) return new NextResponse('Not found', { status: 404 });
  ad.views++;
  await writeDB(db);
  return NextResponse.json({ views: ad.views });
}
