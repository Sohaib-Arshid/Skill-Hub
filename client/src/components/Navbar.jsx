import { NavLink } from 'react-router-dom';
import { Home, User, Search, MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Navbar = () => {
  const { logout, user } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Users, label: 'My Network', path: '/connections' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MessageSquare, label: 'Messaging', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id || ''}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-[#0a66c2] mr-4 tracking-tight">
          SkillHub
        </h1>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center px-4 py-1 pb-0 h-16 transition-colors border-b-2',
                  isActive
                    ? 'border-[#0a66c2] text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                )
              }
            >
              <item.icon className="w-6 h-6 mb-1" strokeWidth={1.5} />
              <span className="text-[10px] hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="hidden md:flex items-center mr-4">
            <span className="text-sm font-medium text-slate-600">Hi, {user.name}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm hidden md:block">Sign out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
