import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user || (sess.user as any).role !== 'ADMIN') return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  const { userId, role } = body || {};
  if (!userId || !['USER','ADMIN'].includes(role)) return new NextResponse('userId et role requis', { status: 400 });
  const db = await readDB();
  const u = db.users.find(x=>x.id===userId);
  if (!u) return new NextResponse('User not found', { status: 404 });
  (u as any).role = role;
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
