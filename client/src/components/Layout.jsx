import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';
import { Home, User, Search, MessageSquare, Users, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

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
    <div className="min-h-screen bg-[#f3f2ef] text-slate-900 font-sans flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1128px] mx-auto p-4 md:py-8 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-50 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center p-2 transition-colors flex-1',
                isActive ? 'text-[#0a66c2]' : 'text-slate-500 mix-blend-multiply'
              )
            }
          >
            <item.icon className="w-6 h-6" strokeWidth={1.5} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Layout;
