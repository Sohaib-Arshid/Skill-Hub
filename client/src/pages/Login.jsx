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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f2ef] p-4 text-slate-800">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <h1 className="text-4xl font-extrabold text-[#0a66c2] tracking-tighter">
            SkillHub
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-3xl font-semibold mb-2">Sign in</h2>
          <p className="text-slate-600 font-medium mb-6">Stay updated on your professional world</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full border border-slate-500 rounded px-4 py-3 bg-white focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 transition-colors"
                 placeholder="Email or phone"
               />
             </div>

             <div>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full border border-slate-500 rounded px-4 py-3 bg-white focus:border-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-800 transition-colors"
                 placeholder="Password"
               />
             </div>
             
             <p className="text-[#0a66c2] font-semibold text-sm hover:underline cursor-pointer mb-2">
               Forgot password?
             </p>

             <button
               type="submit"
               disabled={loading}
               className="w-full items-center justify-center py-3.5 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full transition-colors flex"
             >
               {loading ? (
                 <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
               ) : (
                 'Sign in'
               )}
             </button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-1">
             <span className="text-slate-600">New to SkillHub?</span>
             <Link to="/register" className="text-[#0a66c2] font-semibold hover:bg-[#0a66c2]/10 px-2 py-1 rounded transition-colors underline">
               Join now
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;