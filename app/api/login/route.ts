import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json().catch(()=>null);
  if (!body) return new NextResponse('Bad JSON', { status: 400 });
  const parse = schema.safeParse(body);
  if (!parse.success) return new NextResponse('Invalid payload', { status: 400 });

  const { email, password } = parse.data;
  const db = await readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return new NextResponse('Identifiants invalides', { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return new NextResponse('Identifiants invalides', { status: 401 });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
