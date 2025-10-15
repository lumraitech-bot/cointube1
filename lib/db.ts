import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export type Visibility = 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  avatar?: string; // /avatars/xxx.png
  bio?: string;
  website?: string;
  links?: string[];
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string; // ISO
}

export interface Video {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: 'Crypto' | 'Tech' | 'Finance' | 'Science';
  visibility: Visibility;
  url: string;        // file path or external URL
  thumbnail: string;  // path to image (public/*) or URL
  authorId: string;
  likes: number;
  views: number;
  tags: string[];
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;     // who subscribes
  channelId: string;  // userId of the channel owner
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Ad {
  id: string;
  title: string;
  mediaUrl: string; // image or video URL
  targetUrl: string;
  active: boolean;
  views: number;
  clicks: number;
  createdAt: string;
}

export interface DB {
  users: User[];
  sessions: Session[];
  videos: Video[];
  likes: Like[];
  subscriptions: Subscription[];
  comments: Comment[];
  ads: Ad[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

async function ensureDB(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DB_PATH);
  } catch {
    const initial: DB = { users: [], sessions: [], videos: [], likes: [], subscriptions: [], comments: [], ads: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');
  }
}

export async function readDB(): Promise<DB> {
  await ensureDB();
  const raw = await fs.readFile(DB_PATH, 'utf8');
  let data: any = {};
  try { data = JSON.parse(raw) } catch { data = {}; }

  // Ensure arrays exist (migration-friendly)
  data.users = Array.isArray(data.users) ? data.users : [];
  data.sessions = Array.isArray(data.sessions) ? data.sessions : [];
  data.videos = Array.isArray(data.videos) ? data.videos : [];
  data.likes = Array.isArray(data.likes) ? data.likes : [];
  data.subscriptions = Array.isArray(data.subscriptions) ? data.subscriptions : [];
  data.comments = Array.isArray(data.comments) ? data.comments : [];
  data.ads = Array.isArray(data.ads) ? data.ads : [];

  // Normalize videos defaults
  for (const v of data.videos) {
    if (typeof v.views !== 'number') v.views = 0;
    if (!Array.isArray(v.tags)) v.tags = [];
  }

  return data as DB;
}

export async function writeDB(db: DB): Promise<void> {
  await ensureDB();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export function uid() {
  return uuidv4();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
