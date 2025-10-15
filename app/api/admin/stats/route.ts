import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const db = await readDB();
  return NextResponse.json({
    users: db.users.length,
    videos: db.videos.length,
    subs: db.subscriptions.length,
    comments: db.comments.length,
  });
}
