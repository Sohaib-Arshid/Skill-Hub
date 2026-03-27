import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: ''
  });
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : ''
      });
      setIsPrivate(user.isPrivate || false);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const { data } = await api.patch('/user/update', payload);
      if (data.statusCode === 200) {
        toast.success('Profile updated successfully');
        setUser(data.data); // update context
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivacy = async () => {
    try {
      const { data } = await api.patch('/follow/private');
      if (data.statusCode === 200) {
        setIsPrivate(!isPrivate);
        toast.success(`Account is now ${!isPrivate ? 'private' : 'public'}`);
      }
    } catch (error) {
      toast.error('Failed to update privacy settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-8">Settings</h1>

      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-slate-200 mb-6 border-b border-slate-700/50 pb-4">
          Profile Details
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-field"
              placeholder="e.g. React, Node.js"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 mt-4"
          >
            {loading ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <h2 className="text-xl font-semibold text-slate-200 mb-6 border-b border-slate-700/50 pb-4">
          Privacy Settings
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-200">Private Account</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">
              If enabled, you need to approve connection requests before users can see your full details and activity.
            </p>
          </div>
          <button 
            onClick={handleTogglePrivacy}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? 'bg-blue-600' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
