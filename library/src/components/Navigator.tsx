'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type NavigatorProps = {
  user: { first_name: string; last_name: string; card_number: string } | null;
  setUser: (user: null) => void;
};

export default function Navigator({ user, setUser }: NavigatorProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Home', href: '/' },
    ...(user ? [{ name: 'Account', href: `/account?card=${user.card_number}` }] : []),
    ...(user ? [{ name: "Inventory", href: "/Inventory" }] : []),
  ];

  return (
    <nav className="relative flex items-center justify-center py-4 bg-gray-100 shadow">
      {/* Centered nav links */}
      <div className="flex space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded ${
              pathname.split('?')[0] === item.href.split('?')[0]
                ? 'bg-violet-700 text-white'
                : 'text-gray-700 hover:bg-purple-100'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Absolute positioned Sign Out button */}
      {user && (
        <button
          onClick={() => {
            localStorage.removeItem('user');
            setUser(null);
            router.push('/');
          }}
          className="absolute right-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}
