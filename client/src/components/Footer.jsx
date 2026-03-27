const Footer = () => {
    return (
      <footer className="w-full py-6 mt-10 border-t border-[#1e293b] bg-[#0b0f19]">
        <div className="max-w-[1128px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-slate-400 tracking-wider">SkillHub</span> © {new Date().getFullYear()}
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
