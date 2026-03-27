import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, skills } = formData;
    if (!name || !email || !password || !skills) {
      return toast.error('Please fill all required fields');
    }

    const payload = {
      ...formData,
      skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s)
    };

    setLoading(true);
    try {
      const success = await register(payload);
      if (success) {
        toast.success('Account created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19] p-4 text-slate-200 py-10">
      <div className="w-full max-w-[460px]">
        <div className="mb-8 flex justify-center flex-col items-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            SkillHub
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Build your professional future.</p>
        </div>

        <div className="glass-panel p-6 sm:p-10 border-[#1e293b] shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Core Skills <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input-field"
                placeholder="React, CSS, Node.js (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5 ml-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={2}
                className="input-field resize-none block"
                placeholder="Tell us about your work..."
              />
            </div>

            <p className="text-xs text-slate-500 text-center mt-6 font-medium px-4">
              By submitting this form, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-[48px] mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1e293b] text-center text-sm">
             <span className="text-slate-400 font-medium">Already have an account? </span>
             <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 hover:underline">
               Sign in
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
