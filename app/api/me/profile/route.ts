import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readDB, writeDB } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json().catch(()=>null);
  if (!body) return new NextResponse('Bad JSON', { status: 400 });
  const db = await readDB();
  const u = db.users.find(x=>x.id===sess.user!.id)!;
  u.firstName = body.firstName ?? u.firstName;
  u.lastName = body.lastName ?? u.lastName;
  u.name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.name;
  u.email = body.email ?? u.email;
  u.bio = body.bio ?? u.bio;
  u.website = body.website ?? u.website;
  if (typeof body.links === 'string') {
    u.links = body.links.split(',').map((s:string)=>s.trim()).filter(Boolean);
  } else if (Array.isArray(body.links)) {
    u.links = body.links;
  }
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
