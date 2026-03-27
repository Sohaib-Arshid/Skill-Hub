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
    <div className="min-h-screen flex flex-col items-center bg-[#f3f2ef] p-4 text-slate-800 py-10">
      <div className="mb-8 w-full max-w-md flex justify-center mt-6">
        <h1 className="text-4xl font-extrabold text-[#0a66c2] tracking-tighter">
          SkillHub
        </h1>
      </div>

      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <h2 className="text-3xl text-slate-900 mb-1 tracking-tight pr-4">Make the most of your professional life</h2>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-500 rounded px-3 py-2 bg-white focus:border-slate-800 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-500 rounded px-3 py-2 bg-white focus:border-slate-800 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password (6+ characters) *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-500 rounded px-3 py-2 bg-white focus:border-slate-800 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Skills (comma separated) *</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full border border-slate-500 rounded px-3 py-2 bg-white focus:border-slate-800 focus:outline-none transition-colors"
                placeholder="React, Node.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={2}
                className="w-full border border-slate-500 rounded px-3 py-2 bg-white focus:border-slate-800 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <p className="text-xs text-slate-500 text-center px-4 mt-6">
              By clicking Agree & Join, you agree to the SkillHub User Agreement, Privacy Policy, and Cookie Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 mt-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold rounded-full transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
              ) : (
                'Agree & Join'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-slate-600">
             Already on SkillHub?{' '}
             <Link to="/login" className="text-[#0a66c2] hover:text-[#004182] font-semibold underline">
               Sign in
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
