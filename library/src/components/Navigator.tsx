'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Account', href: '/account' },
  { name: 'Inventory', href: '/inventory' },
];

export default function Navigator() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center space-x-4 py-4 bg-gray-100">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-4 py-2 rounded ${
            pathname === item.href
              ? 'bg-violet-700 text-white'
              : 'text-gray-700 hover:bg-purple-100'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
