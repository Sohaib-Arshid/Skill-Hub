import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('All fields are required');

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative z-10 transition-colors duration-300 bg-[var(--bg-main)]">
      {/* Background glow effects strictly limited to the login page container */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[440px] relative z-10">
        <div className="mb-8 flex justify-center flex-col items-center">
          <div className="w-16 h-16 bg-red-600 border-4 border-[var(--bg-main)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] mb-6">
             <span className="text-white text-4xl font-black mt-1">S</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Skill<span className="text-red-500">Hub</span>
          </h1>
          <p className="text-[15px] mt-3 font-medium uppercase tracking-widest text-red-500/80">Developer Network</p>
        </div>

        <div className="glass-panel p-8 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] border-[var(--border-line)]">
          <h2 className="text-2xl font-black mb-6 tracking-wide" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
             <div>
               <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Email Address <span className="text-red-500">*</span></label>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="input-field"
                 placeholder="Enter your email"
               />
             </div>

             <div>
               <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Password <span className="text-red-500">*</span></label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="input-field"
                 placeholder="Enter your password"
               />
             </div>
             
             <div className="flex justify-end pt-1">
               <span className="text-[13px] font-bold hover:text-red-500 hover:underline cursor-pointer transition-colors" style={{ color: 'var(--text-secondary)' }}>
                 Forgot password?
               </span>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full btn-primary h-[56px] mt-6 text-lg tracking-wide uppercase shadow-red-500/30"
             >
               {loading ? (
                 <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 'Access Network'
               )}
             </button>
          </form>

          <div className="mt-8 pt-6 border-t flex items-center justify-center space-x-2 text-sm font-medium" style={{ borderColor: 'var(--border-line)' }}>
             <span style={{ color: 'var(--text-secondary)' }}>First time here?</span>
             <Link to="/register" className="text-red-500 font-bold hover:text-red-400 transition-colors uppercase tracking-wide ml-1">
               Create Identity
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;