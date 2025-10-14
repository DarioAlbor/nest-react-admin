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
      className="no-underline bg-urbano-primary text-white hover:bg-opacity-90 rounded-lg p-3 transition-all shadow-sm"
    >
      <span className="flex gap-5 font-semibold items-center text-white">
        {children} {active ? <ChevronRight className="text-white" /> : null}
      </span>
    </Link>
  );
}
