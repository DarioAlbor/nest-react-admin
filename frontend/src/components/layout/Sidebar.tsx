import { BookOpen, Home, LogOut, Settings, Users } from 'react-feather';
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
    <div
      className={'sidebar ' + className}
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/assets/sidemenu-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-center mb-8">
        <Link to="/" className="no-underline">
          <img
            src="/assets/urbano-logo-white.png"
            alt="Urbano"
            className="w-40 h-auto object-contain"
          />
        </Link>
      </div>
      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home className="text-white" /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen className="text-white" /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users className="text-white" /> Users
          </SidebarItem>
        ) : null}
        <SidebarItem to="/profile">
          <Settings className="text-white" /> Mi Perfil
        </SidebarItem>
      </nav>
      <button
        className="bg-urbano-primary text-white hover:bg-opacity-90 rounded-lg p-3 transition-all flex gap-3 justify-center items-center font-semibold focus:outline-none shadow-md"
        onClick={handleLogout}
      >
        <LogOut className="text-white" /> Logout
      </button>
    </div>
  );
}
