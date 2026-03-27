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
      // Backend returns statusCode 201 for profile update 
      if (data.statusCode === 200 || data.statusCode === 201) {
        toast.success('Your profile has been saved');
        setUser(data.data); // update context
      } else {
        toast.error('Could not save profile');
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
      if (data.statusCode === 200 || data.statusCode === 201) {
        setIsPrivate(!isPrivate);
        toast.success(`Account is now ${!isPrivate ? 'Private' : 'Public'}`);
      }
    } catch (error) {
      toast.error('Failed to update privacy settings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto tracking-wide space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Settings & Privacy</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="glass-panel p-6 sm:p-8">
        <h2 className="text-lg text-slate-800 font-semibold mb-6 border-b border-slate-200 pb-3">
          Profile Details
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field max-w-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Headline / Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="input-field resize-none max-w-lg"
            />
            <p className="text-xs text-slate-500 mt-1">Appear at the top of your profile</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-field max-w-lg"
              placeholder="e.g. React, Node.js"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex space-x-3">
             <button
               type="submit"
               disabled={loading}
               className="btn-primary py-2 px-6"
             >
               {loading ? 'Saving...' : 'Save changes'}
             </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 sm:p-8 mt-6">
        <h2 className="text-lg text-slate-800 font-semibold mb-6 border-b border-slate-200 pb-3">
          Visibility & Privacy
        </h2>
        <div className="flex items-center justify-between">
          <div className="max-w-md">
            <h3 className="font-semibold text-slate-800">Private Account</h3>
            <p className="text-sm text-slate-500 mt-1">
              If enabled, you need to approve connection requests before other users can see your full details and activity feed.
            </p>
          </div>
          <button 
            onClick={handleTogglePrivacy}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPrivate ? 'bg-[#0a66c2]' : 'bg-slate-300'}`}
          >
            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPrivate ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
