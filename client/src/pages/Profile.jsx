import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, MessageSquare, Briefcase, Award, Check, UserCheck } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'none', 'pending', 'accepted'
  const [isFollowing, setIsFollowing] = useState(false);
  const [metrics, setMetrics] = useState({ followers: 0, following: 0, connections: 0 });
  
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
      // If no connections, it might throw 404 (though we patched backend, better safe)
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
    // Requires backend setup for individual skills
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
        <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 tracking-wide pb-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
              {/* Profile Card */}
              <div className="glass-panel overflow-hidden relative">
                <div className="h-32 md:h-48 bg-[#a0b4b7] absolute top-0 w-full left-0 z-0"></div>
                
                <div className="relative z-10 px-6 sm:px-8 pb-8 pt-16 md:pt-32">
                  <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
                    
                    <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-6 w-full">
                        <img 
                          src={profile.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=ffffff&color=0a66c2&size=150`}
                          alt={profile.name}
                          className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-white shadow-sm object-cover relative z-20"
                        />
                        
                        <div className="mt-4 md:mt-2 text-center md:text-left flex-1 pb-2">
                          <h1 className="text-2xl font-semibold text-slate-900 leading-tight">{profile.name}</h1>
                          <p className="text-slate-700 text-[15px] mt-1 pr-4 whitespace-pre-wrap">
                            {profile.bio || "Member at SkillHub"}
                          </p>
                          <div className="text-slate-500 text-sm mt-2 flex items-center justify-center md:justify-start">
                             <span className="font-semibold text-[#0a66c2] hover:underline cursor-pointer">{profile.metrics?.connections || 0} connections</span>
                             <span className="mx-2">•</span>
                             <span className="text-slate-500">{profile.metrics?.followers || 0} followers</span>
                          </div>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 md:pl-4 flex space-x-2 w-full md:w-auto">
                      {isOwner ? (
                        <>
                           <button onClick={() => navigate('/settings')} className="btn-primary w-full md:w-auto text-sm px-5 py-1.5 flex items-center justify-center h-9">
                             Edit
                           </button>
                        </>
                      ) : (
                        <>
                          {connectionStatus === 'none' && (
                            <button onClick={handleConnect} className="btn-primary flex items-center justify-center flex-1 md:flex-none text-sm px-5 h-9">
                              <UserPlus className="w-4 h-4 mr-1.5" /> Connect
                            </button>
                          )}
                          {connectionStatus === 'pending' && (
                            <button disabled className="btn-secondary opacity-80 cursor-not-allowed flex items-center justify-center flex-1 md:flex-none text-sm px-5 h-9">
                              Pending
                            </button>
                          )}
                          {connectionStatus === 'accepted' && (
                            <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-primary flex items-center justify-center flex-1 md:flex-none text-sm px-5 h-9">
                              <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                            </button>
                          )}
                          <button onClick={handleFollowToggle} className="btn-outline flex items-center justify-center flex-1 md:flex-none text-sm px-5 h-9">
                             {isFollowing ? <><UserCheck className="w-4 h-4 mr-1.5" /> Following</> : '+ Follow'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="glass-panel p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">Skills</h2>
                {profile.skills?.length > 0 ? (
                  <div className="flex flex-col space-y-4">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="flex flex-col border-b border-slate-200 pb-4 last:border-0 last:pb-0 group">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 tracking-tight">{skill}</span>
                            {!isOwner && connectionStatus === 'accepted' && (
                              <button 
                                onClick={() => endorseSkill(skill)}
                                className="px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-500 hover:bg-slate-50 hover:border-slate-800 rounded-full transition-colors flex items-center"
                              >
                                <Check className="w-3 h-3 mr-1"/> Endorse
                              </button>
                            )}
                        </div>
                        <div className="flex items-center mt-2 text-sm text-slate-600">
                          <Award className="w-4 h-4 mr-2" />
                          <span>Endorsed by professionals on SkillHub</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No skills added yet.</p>
                )}
              </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">People you may know</h3>
                  {/* Simulate Network suggestions */}
                  <div className="text-center py-6 border border-slate-200 rounded-xl bg-slate-50">
                      <p className="text-sm text-slate-500 mb-2 px-2">Expand your network to unlock more opportunities.</p>
                      <button onClick={() => navigate('/connections')} className="text-sm font-semibold text-[#0a66c2] hover:underline">
                         View your network
                      </button>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default Profile;
