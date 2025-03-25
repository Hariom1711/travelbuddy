import { ReactNode } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { MainNav } from '@/components/layouts/main-nav';
// import { UserNav } from '@/components/layouts/user-nav';
import Link from 'next/link';
import { UserNav } from '@/components/layouts/user-nav';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                <span className="text-white font-bold text-xs">TB</span>
              </div>
              <span className="font-bold">TravelBuddy</span>
            </Link>
            <MainNav />
          </div>
          <UserNav user={session.user} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}