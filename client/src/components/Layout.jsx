import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { NavLink } from 'react-router-dom';
import { Home, User, Search, MessageSquare, Users, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import CursorBackground from './CursorBackground';

const Layout = () => {
  const { user } = useAuth();
  
  const navItems = [
    { icon: Home, path: '/dashboard' },
    { icon: Users, path: '/connections' },
    { icon: Search, path: '/search' },
    { icon: MessageSquare, path: '/messages' },
    { icon: User, path: `/profile/${user?._id || ''}` },
    { icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-20 relative font-sans transition-colors duration-300">
      <CursorBackground />
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 min-h-screen relative z-40">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] border-t frosted-glass flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center p-2 transition-all flex-1 h-full relative',
                isActive ? 'text-red-500' : 'var(--text-secondary) hover:text-red-400'
              )
            }
          >
            {({ isActive }) => (
               <>
                 <item.icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                 {isActive && <div className="absolute top-0 w-10 h-1 bg-red-500 rounded-b-full shadow-[0_0_12px_rgba(239,68,68,1)]"></div>}
               </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Layout;
