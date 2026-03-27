import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Camera, Save, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    profilePic: ''
  });
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        profilePic: user.profilePic || ''
      });
      setIsPrivate(user.isPrivate || false);
      setPreviewImage(user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=0a0a0a&color=ef4444`);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        bio: formData.bio,
        profilePic: formData.profilePic,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      const { data } = await api.patch('/user/updateProfile', payload);
      // Backend returns statusCode 201 for profile update 
      if (data.statusCode === 200 || data.statusCode === 201) {
        toast.success('Your profile has been saved');
        setUser({ ...user, ...payload });
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto tracking-wide space-y-8 pb-10 relative z-10 transition-colors duration-300">
      <div className="mb-8 flex items-center">
        <SettingsIcon className="w-10 h-10 text-red-500 mr-4" />
        <div>
           <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Settings & Privacy</h1>
           <p className="text-[15px] mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>Manage your professional identity and account preferences</p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] pointer-events-none -mt-32 -mr-32"></div>

        <h2 className="text-xl font-black mb-8 flex items-center border-b pb-4 tracking-wide" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-line)' }}>
          Profile Details
        </h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-10">
             <div className="relative group">
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-32 h-32 rounded-2xl object-cover border-4 bg-[var(--bg-main)] shadow-xl group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: 'var(--bg-panel)' }}
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-2xl transition-opacity">
                   <div className="bg-red-600 p-2.5 rounded-full text-white shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                      <Camera className="w-6 h-6" />
                   </div>
                   <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
             </div>
             <div className="text-center sm:text-left pt-2">
                <h3 className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>Profile Picture</h3>
                <p className="text-sm mt-1.5 max-w-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Upload a professional headshot. JPEG or PNG under 2MB. Click the image to change.
                </p>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field max-w-2xl px-5 py-4"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Professional Summary</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="input-field resize-none max-w-2xl px-5 py-4"
              placeholder="Tell others about your experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>Core Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-field max-w-2xl px-5 py-4"
              placeholder="e.g. React, Node.js"
            />
          </div>

          <div className="pt-8 mt-6 border-t flex justify-end" style={{ borderColor: 'var(--border-line)' }}>
             <button
               type="submit"
               disabled={loading}
               className="btn-primary min-w-[180px] h-[52px]"
             >
               {loading ? 'Saving Identity...' : <><Save className="w-5 h-5 mr-2"/> Save Profile</>}
             </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 sm:p-10 shadow-2xl">
        <h2 className="text-xl font-black mb-8 flex items-center border-b pb-4 tracking-wide" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-line)' }}>
          Visibility & Privacy
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-5 sm:space-y-0 p-6 rounded-2xl shadow-inner border bg-[var(--bg-main)]" style={{ borderColor: 'var(--border-line)' }}>
          <div className="max-w-md text-center sm:text-left">
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Private Mode</h3>
            <p className="text-[14px] mt-2 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When enabled, your profile details and full network remain hidden until you explicitly approve incoming connection requests.
            </p>
          </div>
          <button 
            onClick={handleTogglePrivacy}
            className={`relative inline-flex h-9 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${isPrivate ? 'bg-red-500 shadow-red-500/30' : 'bg-slate-400 dark:bg-slate-700'}`}
          >
            <span className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${isPrivate ? 'translate-x-[28px]' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
