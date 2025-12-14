import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AppHeader from '@/components/AppHeader';
import type { User, Admin } from '@/lib/definitions';

async function getSession() {
  const cookie = cookies().get('guardianangel-session');
  if (!cookie) return null;
  try {
    const session = JSON.parse(cookie.value);
    return session.isLoggedIn ? session : null;
  } catch {
    return null;
  }
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  const user = session.user as User | Admin;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader user={user} />
      <main className="flex flex-1 flex-col bg-secondary/50">
        <div className="container mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
    </div>
  );
}
