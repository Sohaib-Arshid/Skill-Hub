import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] p-4 text-slate-200">
      <div className="w-full max-w-[420px]">
        <div className="mb-6 flex justify-center flex-col items-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            SkillHub
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Join the professional community</p>
        </div>

        <div className="glass-panel p-8 sm:p-10 border-[#1e293b] shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Email <span className="text-red-500">*</span></label>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="input-field shadow-inner"
                 placeholder="Enter your email"
               />
             </div>

             <div>
               <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Password <span className="text-red-500">*</span></label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="input-field shadow-inner"
                 placeholder="Enter your password"
               />
             </div>
             
             <div className="flex justify-end pt-1">
               <span className="text-blue-400 text-sm font-semibold hover:text-blue-300 hover:underline cursor-pointer transition-colors">
                 Forgot password?
               </span>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full btn-primary h-[48px] mt-4"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
               ) : (
                 'Take me inside'
               )}
             </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1e293b] flex items-center justify-center space-x-2 text-sm">
             <span className="text-slate-400">First time here?</span>
             <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors hover:underline">
               Create an account
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;