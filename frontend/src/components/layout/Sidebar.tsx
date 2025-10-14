import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={'sidebar ' + className}>
      <div className="flex flex-col items-center mb-6">
        <div className="w-40 h-20 mb-3 flex items-center justify-center">
          <img src="/assets/urbano-logo.png" alt="Urbano" className="w-full h-full object-contain" />
        </div>
        <Link to="/" className="no-underline">
          <h2 className="font-semibold text-center text-gray-700">CRM System</h2>
        </Link>
      </div>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-urbano-primary hover:bg-urbano-white-hover rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none border border-urbano-primary"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
