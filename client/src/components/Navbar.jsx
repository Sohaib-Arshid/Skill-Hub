import { NavLink } from 'react-router-dom';
import { Home, User, Search, MessageSquare, Users, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Users, label: 'Network', path: '/connections' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id || ''}` },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] z-50 px-4 md:px-8 flex items-center justify-between shadow-sm border-b" 
         style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-line)' }}>
      <div className="flex items-center space-x-8">
        <h1 className="text-2xl font-black tracking-tight flex items-center cursor-pointer">
          <div className="w-8 h-8 bg-red-600 border-2 border-red-400 rounded-lg flex items-center justify-center mr-2 shadow-[0_0_15px_rgba(239,68,68,0.6)]">
             <span className="text-white text-lg leading-none mt-0.5">S</span>
          </div>
          <span style={{ color: 'var(--text-primary)' }}>SkillHub</span>
        </h1>
        
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 text-[15px] font-bold relative group overflow-hidden',
                  isActive
                    ? 'text-red-500 bg-red-500/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-line)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 mr-2 ${isActive ? 'drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]' : ''}`} strokeWidth={2.5} />
                  {item.label}
                  {isActive && <motion.div layoutId="navbar-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full transition-colors flex items-center justify-center outline-none"
          style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)' }}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 hover:text-yellow-400" /> : <Moon className="w-5 h-5 hover:text-indigo-500" />}
        </button>

        {user && (
          <div className="hidden lg:flex items-center space-x-3 px-3 py-1.5 rounded-full" style={{ border: '1px solid var(--border-line)', backgroundColor: 'var(--bg-main)' }}>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
            <img src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=111111&color=ef4444`} alt="profile" className="w-8 h-8 rounded-full border-2 border-[var(--border-line)] shadow-sm object-cover" />
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center justify-center p-2.5 rounded-xl transition-colors outline-none hover:text-red-500 hover:bg-red-500/10"
          style={{ color: 'var(--text-secondary)' }}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
