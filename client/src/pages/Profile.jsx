import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, MessageSquare, Award, Check, UserCheck, Shield, Clock } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'none', 'pending', 'accepted'
  const [isFollowing, setIsFollowing] = useState(false);
  
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
      if (data.statusCode === 200 || data.statusCode === 201) {
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
      if (data.statusCode === 200 || data.statusCode === 201) {
        // backend might return empty array
        const list = data.data || [];
        const conn = list.find(c => 
          (c.sender?._id === currentUser._id && c.receiver?._id === id) ||
          (c.receiver?._id === currentUser._id && c.sender?._id === id)
        );
        if (conn) {
          setConnectionStatus(conn.status);
        } else {
          setConnectionStatus('none');
        }
      }
    } catch (error) {
      setConnectionStatus('none');
    }

    try {
      const followRes = await api.get('/follow/following');
      if (followRes.data.statusCode === 200 || followRes.data.statusCode === 201) {
          const list = followRes.data.data || [];
          const isFoll = list.find(f => f.following?._id === id);
          setIsFollowing(!!isFoll);
      }
    } catch (error) {
      setIsFollowing(false);
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
    toast.success(`Endorsed ${skillName}`);
  };
  
  const handleFollowToggle = async () => {
      try {
          if (isFollowing) {
              await api.delete(`/follow/unfollow/${id}`);
              setIsFollowing(false);
              toast.success('Unfollowed');
          } else {
              await api.post(`/follow/follow/${id}`);
              setIsFollowing(true);
              toast.success('Following');
          }
      } catch (e) {
          toast.error('Could not update follow status');
      }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 tracking-wide pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
              
              {/* Profile Card */}
              <div className="glass-panel overflow-hidden relative shadow-2xl border-[#1e293b]">
                <div className="h-40 md:h-56 bg-gradient-to-tr from-blue-700 via-indigo-800 to-purple-900 absolute top-0 w-full left-0 z-0"></div>
                
                <div className="relative z-10 px-6 sm:px-10 pb-10 pt-20 md:pt-40 flex flex-col items-center md:items-start text-center md:text-left">
                    <img 
                      src={profile.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1e293b&color=3b82f6&size=200`}
                      alt={profile.name}
                      className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border-[6px] border-[#0b0f19] bg-[#1e293b] shadow-2xl object-cover relative z-20 -mt-10 md:mt-0"
                    />
                    
                    <div className="mt-5 w-full">
                      <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start">
                         {profile.name} 
                         {profile.isPrivate && <Shield className="w-5 h-5 ml-3 text-slate-500" title="Private Profile" />}
                      </h1>
                      <p className="text-slate-300 text-lg mt-2 max-w-2xl font-medium leading-relaxed">
                        {profile.bio || "Building the future on SkillHub"}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 bg-[#1e293b]/50 w-fit md:pr-6 pr-4 pl-4 py-2 rounded-xl border border-[#334155]/50">
                         <span className="font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">{profile.metrics?.connections || 0} <span className="text-slate-400 font-medium">connections</span></span>
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                         <span className="font-bold text-slate-200">{profile.metrics?.followers || 0} <span className="text-slate-400 font-medium">followers</span></span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 w-full justify-center md:justify-start">
                      {isOwner ? (
                        <button onClick={() => navigate('/settings')} className="btn-primary w-full sm:w-auto h-12 px-8">
                          Manage Profile
                        </button>
                      ) : (
                        <>
                          {connectionStatus === 'none' && (
                            <button onClick={handleConnect} className="btn-primary h-12 px-8 flex-1 sm:flex-none">
                              <UserPlus className="w-5 h-5 mr-2" /> Connect
                            </button>
                          )}
                          {connectionStatus === 'pending' && (
                            <button disabled className="btn-secondary h-12 px-8 flex-1 sm:flex-none opacity-100 bg-[#334155] border border-slate-600 text-slate-300">
                              <Clock className="w-5 h-5 mr-2 text-slate-400" /> Pending...
                            </button>
                          )}
                          {connectionStatus === 'accepted' && (
                            <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-primary h-12 px-8 flex-1 sm:flex-none shadow-blue-500/20">
                              <MessageSquare className="w-5 h-5 mr-2" /> Message
                            </button>
                          )}
                          <button onClick={handleFollowToggle} className="btn-outline h-12 px-8 flex-1 sm:flex-none border-[#334155] text-slate-300 hover:text-blue-400 hover:border-blue-500 focus:bg-blue-500/10">
                             {isFollowing ? <><UserCheck className="w-5 h-5 mr-2 text-blue-400" /> Following</> : '+ Follow'}
                          </button>
                        </>
                      )}
                    </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="glass-panel p-6 sm:p-10 border-[#1e293b]">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1e293b] pb-4">Verified Skills</h2>
                {profile.skills?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="bg-[#0b0f19] border border-[#1e293b] hover:border-[#334155] p-5 rounded-xl transition-colors group">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200 text-lg">{skill}</span>
                            {!isOwner && connectionStatus === 'accepted' && (
                              <button 
                                onClick={() => endorseSkill(skill)}
                                className="px-3 py-1.5 text-xs font-bold text-slate-400 border border-slate-600 hover:text-blue-400 hover:border-blue-400 rounded-lg transition-colors flex items-center bg-[#1e293b]/50 group-hover:bg-[#1e293b]"
                              >
                                <Check className="w-3.5 h-3.5 mr-1"/> Endorse
                              </button>
                            )}
                        </div>
                        <div className="flex items-center mt-3 text-sm text-slate-500 font-medium">
                          <Award className="w-4 h-4 mr-2 text-blue-500/70" />
                          <span>Endorsed by peers</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#0b0f19]/50 rounded-xl border border-dashed border-[#334155]">
                    <p className="text-slate-500 font-medium">No professional skills listed.</p>
                  </div>
                )}
              </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
              <div className="glass-panel p-6 border-[#1e293b]">
                  <h3 className="font-bold text-white mb-4 text-lg">Your Network</h3>
                  <div className="text-center py-6 border border-[#334155]/50 rounded-xl bg-[#0b0f19]/50">
                      <p className="text-sm text-slate-400 mb-4 px-4 font-medium leading-relaxed">Expand your network to unlock more career opportunities.</p>
                      <button onClick={() => navigate('/connections')} className="text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline">
                         View connections
                      </button>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default Profile;
