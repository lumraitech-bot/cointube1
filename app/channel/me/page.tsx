import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function MyChannel() {
  const sess = await getSession();
  if (!sess?.user) redirect('/login');
  redirect(`/channel/${sess.user.id}`);
}
