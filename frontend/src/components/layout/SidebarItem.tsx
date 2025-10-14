import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`no-underline rounded-md p-3 transition-colors ${
        active
          ? 'bg-urbano-primary text-white'
          : 'text-gray-700 hover:bg-urbano-white-hover hover:text-urbano-primary'
      }`}
    >
      <span className="flex gap-5 font-semibold items-center">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
