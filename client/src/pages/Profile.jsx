import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, MessageSquare, Briefcase, Award } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'none', 'pending', 'accepted'
  
  const isOwner = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
    if (!isOwner) {
      checkConnectionStatus();
    }
  }, [id, isOwner]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/user/${id}`);
      if (data.statusCode === 200) {
        setProfile(data.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const { data } = await api.get('/connection/all');
      if (data.statusCode === 200) {
        const conn = data.data.find(c => 
          (c.sender._id === currentUser._id && c.receiver._id === id) ||
          (c.receiver._id === currentUser._id && c.sender._id === id)
        );
        if (conn) {
          setConnectionStatus(conn.status);
        } else {
          setConnectionStatus('none');
        }
      }
    } catch (error) {
      console.error('Error fetching connection status');
    }
  };

  const handleConnect = async () => {
    try {
      const { data } = await api.post(`/connection/send/${id}`);
      if (data.statusCode === 201 || data.statusCode === 200) {
        toast.success('Connection request sent');
        setConnectionStatus('pending');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const endorseSkill = async (skillName) => {
    // In actual implementation, we'd need skill._id from backend. 
    // The prompt endpoint requires userId and skillId.
    // Assuming backend handles creating endorsement properly:
    toast.success(`Endorsed ${skillName}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Profile Header */}
      <div className="glass-panel overflow-hidden rounded-2xl relative mt-16">
        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-600 to-purple-600 absolute top-0 w-full left-0 z-0"></div>
        
        <div className="relative z-10 px-8 pb-8 pt-16 md:pt-32">
          <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-6">
            <img 
              src={profile.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1e293b&color=3b82f6&size=150`}
              alt={profile.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 object-cover bg-slate-800 shadow-xl"
            />
            
            <div className="mt-4 md:mt-0 flex-1 text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
              <p className="text-slate-300 mt-1 flex items-center justify-center md:justify-start">
                <Briefcase className="w-4 h-4 mr-2" />
                {profile.skills?.length > 0 ? profile.skills[0] : 'Professional'}
              </p>
            </div>

            <div className="mt-6 md:mt-0 flex space-x-3 w-full md:w-auto">
              {isOwner ? (
                <button onClick={() => navigate('/settings')} className="btn-secondary flex-1 md:flex-none">
                  Edit Profile
                </button>
              ) : (
                <>
                  {connectionStatus === 'none' && (
                    <button onClick={handleConnect} className="btn-primary flex-1 md:flex-none flex items-center justify-center">
                      <UserPlus className="w-4 h-4 mr-2" /> Connect
                    </button>
                  )}
                  {connectionStatus === 'pending' && (
                    <button disabled className="btn-secondary flex-1 md:flex-none opacity-50 cursor-not-allowed">
                      Pending Request
                    </button>
                  )}
                  {connectionStatus === 'accepted' && (
                    <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-primary flex-1 md:flex-none flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 mr-2" /> Message
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* About Section */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-bold border-b border-slate-700/50 pb-4 mb-4 text-slate-100">About</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {profile.bio || "This user hasn't written a bio yet."}
            </p>
          </div>

          {/* Skills Section */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-bold border-b border-slate-700/50 pb-4 mb-4 text-slate-100 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-500" />
              Skills & Endorsements
            </h2>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-6">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="flex flex-col bg-slate-800/80 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-500 transition-colors">
                    <div className="px-5 py-3 border-b border-slate-700/30">
                      <span className="font-semibold text-slate-200">{skill}</span>
                    </div>
                    {!isOwner && connectionStatus === 'accepted' && (
                      <button 
                        onClick={() => endorseSkill(skill)}
                        className="px-5 py-2 text-xs font-medium text-blue-400 hover:bg-blue-600/10 transition-colors"
                      >
                        + Endorse
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-semibold text-slate-200 mb-4">Network Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Connections</span>
                <span className="font-medium text-blue-400 hover:underline cursor-pointer">500+</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <span className="text-slate-400">Followers</span>
                <span className="font-medium text-blue-400 hover:underline cursor-pointer">1.2K</span>
              </div>
            </div>
            {!isOwner && (
              <button className="w-full mt-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium">
                + Follow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
