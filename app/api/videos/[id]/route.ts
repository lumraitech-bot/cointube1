import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: { id: string }}) {
  const db = await readDB();
  const video = db.videos.find(v => v.id === params.id);
  if (!video) return new NextResponse('Not found', { status: 404 });
  return NextResponse.json(video);
}
