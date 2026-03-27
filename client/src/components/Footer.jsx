import { Globe, Link, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full relative z-40 border-t mt-12 bg-transparent backdrop-blur-md" style={{ borderColor: 'var(--border-line)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
        
        <div className="flex items-center flex-col md:flex-row text-center md:text-left mb-6 md:mb-0">
          <div className="flex items-center justify-center mb-4 md:mb-0 md:mr-6">
            <div className="w-8 h-8 bg-red-600 border-2 border-red-400 rounded-lg flex items-center justify-center mr-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
               <span className="text-white text-lg leading-none mt-0.5 font-black">S</span>
            </div>
            <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>SkillHub</span>
          </div>
          <div className="md:border-l md:pl-6 text-sm font-medium" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-line)' }}>
             Empowering developers worldwide. <br className="md:hidden" /> © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex space-x-6 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
            <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-500 transition-colors">Support</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
               <Link className="w-5 h-5 hover:text-blue-400 transition-colors" />
            </a>
            <a href="#" className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
               <Globe className="w-5 h-5 hover:text-slate-300 transition-colors" />
            </a>
            <a href="#" className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
               <Cpu className="w-5 h-5 hover:text-blue-500 transition-colors" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
