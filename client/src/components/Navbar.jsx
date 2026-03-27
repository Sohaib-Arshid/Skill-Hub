import { NavLink } from 'react-router-dom';
import { Home, User, Search, MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Navbar = () => {
  const { logout, user } = useAuth();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Users, label: 'Network', path: '/connections' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id || ''}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#151b2b] border-b border-[#1e293b] z-50 px-4 md:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
          SkillHub
        </h1>
        
        <div className="hidden md:flex space-x-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium',
                  isActive
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
                )
              }
            >
              <item.icon className="w-4 h-4 mr-2" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="hidden lg:flex items-center mr-2">
            <span className="text-sm font-medium text-slate-300 mr-3">{user.name}</span>
            <img src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e293b&color=3b82f6`} alt="profile" className="w-8 h-8 rounded-full border border-[#1e293b]" />
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
