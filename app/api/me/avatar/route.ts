import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { readDB, writeDB } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return new NextResponse('file requis', { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = (path.extname(file.name) || '.png').toLowerCase();
  const fileName = `${sess.user.id}${ext}`;
  const outDir = path.join(process.cwd(), 'public', 'avatars');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, fileName), bytes);

  const db = await readDB();
  const me = db.users.find(u => u.id === sess.user!.id)!;
  me.avatar = `/avatars/${fileName}`;
  await writeDB(db);

  return NextResponse.json({ ok: true, avatar: me.avatar });
}
