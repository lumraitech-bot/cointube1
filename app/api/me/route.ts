import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const sess = await getSession();
  return NextResponse.json({ user: sess?.user ? { id: sess.user.id, name: sess.user.name, email: sess.user.email, role: (sess.user as any).role || 'USER' } : null });
}
