import { NextResponse } from 'next/server';
import { readDB, writeDB, uid, slugify, type Visibility } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const q = (searchParams.get('q') || '').toLowerCase();
  const sort = searchParams.get('sort') || 'date'; // 'date' | 'views' | 'likes'
  const db = await readDB();
  let videos = db.videos;

  if (category) videos = videos.filter(v => v.category === category);
  if (q) {
    videos = videos.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags?.some(t => t.toLowerCase().includes(q))
    );
  }

  // derive likes per video from likes table
  const likeCount = (id: string) => db.likes.filter(l => l.videoId === id).length;
  videos = videos.map(v => ({ ...v, likes: likeCount(v.id) }));

  if (sort === 'views') {
    videos = videos.sort((a,b)=> (b.views||0) - (a.views||0));
  } else if (sort === 'likes') {
    videos = videos.sort((a,b)=> (b.likes||0) - (a.likes||0));
  } else {
    videos = videos.sort((a,b)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json(videos);
}

export async function POST(req: Request) {
  const sess = await getSession();
  if (!sess?.user) return new NextResponse('Unauthorized', { status: 401 });

  const form = await req.formData();
  const title = String(form.get('title') || '').trim();
  const description = String(form.get('description') || '').trim();
  const category = (String(form.get('category') || 'Crypto') as any) ?? 'Crypto';
  const visibility = (String(form.get('visibility') || 'PUBLIC') as Visibility) ?? 'PUBLIC';
  const providedUrl = String(form.get('url') || '').trim();
  const tagsRaw = String(form.get('tags') || '').trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t=>t.trim()).filter(Boolean) : [];
  const file = form.get('file') as File | null;

  if (!title || !slugify(title)) return new NextResponse('title et slug sont requis', { status: 400 });
  if (!file && !providedUrl) return new NextResponse('Fournis soit un fichier (file), soit une URL (url)', { status: 400 });

  let url = providedUrl;
  let thumbnail = '/videos/demo.jpg';

  if (file) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (file.type.includes('mp4') ? '.mp4' : '.bin');
    const baseSlug = slugify(title);
    const id = uid().slice(0,8);
    const fileName = `${baseSlug}-${id}${ext}`;
    const outDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, fileName), bytes);
    url = `/videos/${fileName}`;
    if (ext.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      thumbnail = url;
    }
  } else {
    if (providedUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i)) thumbnail = providedUrl;
  }

  const db = await readDB();
  const video = {
    id: uid(),
    title,
    description,
    slug: slugify(title),
    category,
    visibility,
    url,
    thumbnail,
    authorId: sess.user.id,
    likes: 0,
    views: 0,
    tags,
    createdAt: new Date().toISOString(),
  };
  db.videos.push(video);
  await writeDB(db);
  return NextResponse.json(video, { status: 201 });
}
