import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Camera, Save } from 'lucide-react';

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
      setPreviewImage(user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=1e293b&color=3b82f6`);
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
        setUser({ ...user, ...payload }); // update context gracefully
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
    <div className="max-w-3xl mx-auto tracking-wide space-y-8 pb-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Settings & Privacy</h1>
        <p className="text-slate-400 text-[15px] mt-1">Manage your professional identity and account preferences</p>
      </div>

      <div className="glass-panel p-6 sm:p-10 border-[#1e293b] shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32"></div>

        <h2 className="text-xl text-white font-bold mb-8 flex items-center border-b border-[#1e293b] pb-4">
          Profile Details
        </h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          {/* Profile Picture Upload Area */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
             <div className="relative group">
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-[#151b2b] bg-[#1e293b] shadow-xl group-hover:opacity-80 transition-opacity"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer rounded-2xl transition-opacity">
                   <div className="bg-blue-500 p-2 rounded-full text-white">
                      <Camera className="w-5 h-5" />
                   </div>
                   <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
             </div>
             <div className="text-center sm:text-left pt-2">
                <h3 className="text-white font-bold text-lg">Profile Picture</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm">
                  Upload a professional headshot. JPEG or PNG under 2MB. Click the image to change.
                </p>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Display Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field max-w-2xl bg-[#0b0f19] border-[#1e293b] focus:border-blue-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Professional Summary</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="input-field resize-none max-w-2xl bg-[#0b0f19] border-[#1e293b] focus:border-blue-500 shadow-inner"
              placeholder="Tell others about your experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Core Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="input-field max-w-2xl bg-[#0b0f19] border-[#1e293b] focus:border-blue-500 shadow-inner"
              placeholder="e.g. React, Node.js"
            />
          </div>

          <div className="pt-6 mt-4 border-t border-[#1e293b] flex justify-end">
             <button
               type="submit"
               disabled={loading}
               className="btn-primary min-w-[160px]"
             >
               {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2"/> Save Profile</>}
             </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-6 sm:p-10 border-[#1e293b] shadow-2xl">
        <h2 className="text-xl text-white font-bold mb-8 flex items-center border-b border-[#1e293b] pb-4">
          Visibility & Privacy
        </h2>
        <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 p-4 bg-[#0b0f19] border border-[#1e293b] rounded-xl shadow-inner">
          <div className="max-w-md text-center sm:text-left">
            <h3 className="font-bold text-slate-200">Private Mode</h3>
            <p className="text-sm text-slate-400 mt-1">
              When enabled, your profile details and full network remain hidden until you approve incoming connection requests.
            </p>
          </div>
          <button 
            onClick={handleTogglePrivacy}
            className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${isPrivate ? 'bg-blue-500' : 'bg-[#1e293b]'}`}
          >
            <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
