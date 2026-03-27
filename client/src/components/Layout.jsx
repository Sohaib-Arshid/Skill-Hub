import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex">
      <Navbar />
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Skill Hub
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0 min-h-screen">
        <div className="max-w-5xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
