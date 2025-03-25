'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'My Trips',
    href: '/trips',
  },
  {
    title: 'Destinations',
    href: '/destinations',
  },
  {
    title: 'Stories',
    href: '/stories',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href || pathname?.startsWith(`${item.href}/`) 
              ? 'text-foreground' 
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}