import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

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
        toast.success('Identity created successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 relative z-10 transition-colors duration-300 bg-[var(--bg-main)]">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-[480px] relative z-10">
        <div className="mb-8 flex justify-center flex-col items-center">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Join Skill<span className="text-red-500">Hub</span>
          </h1>
          <p className="text-[14px] mt-2 font-bold uppercase tracking-widest text-red-500/80">Build Your Network</p>
        </div>

        <div className="glass-panel p-8 sm:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] border-[var(--border-line)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Full Name <span className="text-red-500">*</span></label>
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
              <label className="block text-[13px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Email <span className="text-red-500">*</span></label>
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
              <label className="block text-[13px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Password <span className="text-red-500">*</span></label>
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
               <label className="block text-[13px] font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Core Skills <span className="text-red-500">*</span></label>
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
              <label className="block text-[13px] font-bold mb-2 drop-shadow-sm uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Professional Summary</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={2}
                className="input-field resize-none block"
                placeholder="Tell us about your work..."
              />
            </div>

            <p className="text-xs text-center mt-6 font-bold leading-relaxed px-2 opacity-60" style={{ color: 'var(--text-secondary)' }}>
              By submitting this system initialization, you accept all transmission protocols and privacy rules.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-[56px] mt-6 text-[15px] tracking-widest uppercase shadow-red-500/30"
            >
              {loading ? (
                <div className="w-6 h-6 border-[3px] border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                'Initialize Identity'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm font-medium" style={{ borderColor: 'var(--border-line)' }}>
             <span style={{ color: 'var(--text-secondary)' }}>Already synchronized? </span>
             <Link to="/login" className="text-red-500 font-bold hover:text-red-400 uppercase tracking-widest ml-1 transition-colors">
               Sign In
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
