import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }>}) {
  const db = await readDB();
  const p = await params;
  const user = db.users.find(u => u.id === p.id);
  if (!user) return new NextResponse('Not found', { status: 404 });
  const subs = db.subscriptions.filter(s => s.channelId === user.id).length;
  const vids = db.videos.filter(v => v.authorId === user.id).length;
  const sess = await getSession();
  const subscribed = !!(sess?.user && db.subscriptions.find(s => s.userId === sess.user.id && s.channelId === user.id));
  return NextResponse.json({
    id: user.id,
    name: user.name,
    avatar: user.avatar || null,
    subscribers: subs,
    videos: vids,
    subscribed,
  });
}
