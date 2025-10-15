import { cookies } from 'next/headers';
import { readDB, writeDB, uid, type Session } from './db';

const SESSION_COOKIE = 'session_id';

export async function getSession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  const db = await readDB();
  const session = db.sessions.find(s => s.id === sid);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // expire
    db.sessions = db.sessions.filter(s => s.id !== sid);
    await writeDB(db);
    return null;
  }
  const user = db.users.find(u => u.id === session.userId) || null;
  return { session, user };
}

export async function createSession(userId: string) {
  const db = await readDB();
  const session: Session = {
    id: uid(),
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
  };
  db.sessions.push(session);
  await writeDB(db);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 3600
  });
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sid) return;
  const db = await readDB();
  db.sessions = db.sessions.filter(s => s.id !== sid);
  await writeDB(db);
  cookieStore.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
}
