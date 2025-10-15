import { NextResponse } from 'next/server';
import { readDB, writeDB, uid } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  if (!body) return new NextResponse('Bad JSON', { status: 400 });
  const parse = schema.safeParse(body);
  if (!parse.success) return new NextResponse('Invalid payload', { status: 400 });
  const { name, email, password } = parse.data;

  const db = await readDB();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return new NextResponse('Email déjà utilisé', { status: 409 });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  db.users.push({ id: uid(), name, email, passwordHash, role: 'USER', createdAt: new Date().toISOString() });
  await writeDB(db);
  return NextResponse.json({ ok: true });
}
