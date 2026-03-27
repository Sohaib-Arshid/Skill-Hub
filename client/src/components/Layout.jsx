import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans flex flex-col pt-16">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1128px] mx-auto p-4 md:py-8 min-h-screen">
        <Outlet />
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#151b2b] border-t border-[#1e293b] flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center p-2 transition-all flex-1 h-full relative',
                isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              )
            }
          >
            {({ isActive }) => (
               <>
                 <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                 {isActive && <div className="absolute top-0 w-8 h-1 bg-blue-500 rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>}
               </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Layout;
