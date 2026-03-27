import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, MessageSquare, Award, Check, UserCheck, Shield, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null); // 'none', 'pending', 'accepted'
  const [isFollowing, setIsFollowing] = useState(false);
  const [endorsements, setEndorsements] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]); // Database mapping
  
  const isOwner = currentUser?._id === id;

  useEffect(() => {
    fetchProfile();
    fetchEndorsements();
    fetchMasterSkills(); // Load skills database for mapping names to ObjectIds
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

  const fetchMasterSkills = async () => {
    try {
      const { data } = await api.get('/skill/all');
      if (data.statusCode === 200 || data.statusCode === 201) {
        setMasterSkills(data.data || []);
      }
    } catch (error) {
      console.error("Master skills fetch error:", error);
    }
  };

  const fetchEndorsements = async () => {
    try {
      const { data } = await api.get(`/endorsement/get/${id}`);
      if (data.statusCode === 200 || data.statusCode === 201) {
        setEndorsements(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const { data } = await api.get('/connection/all');
      if (data.statusCode === 200 || data.statusCode === 201) {
        const list = data.data || [];
        const conn = list.find(c => 
          (c.sender?._id === currentUser?._id && c.receiver?._id === id) ||
          (c.receiver?._id === currentUser?._id && c.sender?._id === id)
        );
        if (conn) setConnectionStatus(conn.status);
        else setConnectionStatus('none');
      }
    } catch (error) { setConnectionStatus('none'); }

    try {
      const followRes = await api.get('/follow/following');
      if (followRes.data.statusCode === 200 || followRes.data.statusCode === 201) {
          const list = followRes.data.data || [];
          const isFoll = list.find(f => f.following?._id === id);
          setIsFollowing(!!isFoll);
      }
    } catch (error) { setIsFollowing(false); }
  };

  const handleConnect = async () => {
    try {
      const { data } = await api.post(`/connection/send/${id}`);
      if (data.statusCode === 201 || data.statusCode === 200) {
        toast.success('Connection request sent');
        setConnectionStatus('pending');
        fetchProfile(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
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
          fetchProfile(); 
      } catch (e) { toast.error('Could not update follow status'); }
  };

  // Helper to resolve skill name string to ObjectId from master list
  const getSkillId = (skillName) => {
    if (!skillName || !masterSkills) return null;
    const found = masterSkills.find(s => s?.skill && s.skill.toLowerCase() === skillName.toLowerCase());
    return found ? found._id : null;
  };

  const handleEndorse = async (skillName) => {
    const skillId = getSkillId(skillName);
    if (!skillId) {
       toast.error(`Skill "${skillName}" is not registered in our database.`);
       return;
    }
    try {
       await api.post(`/endorsement/endorse/${id}/${skillId}`);
       toast.success(`Endorsed ${skillName}`);
       fetchEndorsements(); // Refetch instantly
    } catch (e) { 
       toast.error(e.response?.data?.message || 'Failed to endorse skill'); 
    }
  };

  const handleRemoveEndorse = async (skillName) => {
    const skillId = getSkillId(skillName);
    if (!skillId) return;
    try {
       await api.delete(`/endorsement/delete/${id}/${skillId}`);
       toast.success(`Removed endorsement for ${skillName}`);
       fetchEndorsements(); // Refetch instantly
    } catch (e) { 
       toast.error(e.response?.data?.message || 'Failed to remove endorsement'); 
    }
  };

  const isSkillEndorsedByMe = (skillName) => {
      const skillId = getSkillId(skillName);
      if (!skillId) return false;
      const endorsementDoc = endorsements.find(e => e.skill?._id === skillId || e.skill === skillId);
      if(!endorsementDoc || !endorsementDoc.endorsers) return false;
      return endorsementDoc.endorsers.some(endorserId => 
          (endorserId === currentUser?._id || endorserId?._id === currentUser?._id)
      );
  };
  
  const getEndorsementCount = (skillName) => {
      const skillId = getSkillId(skillName);
      if (!skillId) return 0;
      const endorsementDoc = endorsements.find(e => e.skill?._id === skillId || e.skill === skillId);
      return endorsementDoc ? endorsementDoc.endorsers?.length || 0 : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto space-y-8 tracking-wide pb-20 relative z-10 transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
              
              {/* Profile Card Override */}
              <div className="glass-panel overflow-hidden relative shadow-2xl">
                {/* Banner */}
                <div className="h-40 md:h-56 bg-gradient-to-tr from-red-800 via-red-900 to-black absolute top-0 w-full left-0 z-0"></div>
                
                <div className="relative z-10 px-6 sm:px-10 pb-10 pt-20 md:pt-40 flex flex-col items-center md:items-start text-center md:text-left">
                    <img 
                      src={profile.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0a0a0a&color=ef4444&size=200`}
                      alt={profile.name}
                      className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border-[6px] shadow-[0_0_30px_rgba(239,68,68,0.2)] object-cover relative z-20 -mt-10 md:mt-0 bg-[var(--bg-main)]"
                      style={{ borderColor: 'var(--bg-panel)' }}
                    />
                    
                    <div className="mt-5 w-full">
                      <h1 className="text-3xl font-black tracking-tight flex items-center justify-center md:justify-start" style={{ color: 'var(--text-primary)' }}>
                         {profile.name} 
                         {profile.isPrivate && <Shield className="w-5 h-5 ml-3 opacity-50" title="Private Profile" />}
                      </h1>
                      <p className="text-lg mt-2 font-medium leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                        {profile.bio || "Building the future on SkillHub"}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 bg-[var(--bg-main)]/50 w-fit md:pr-6 pr-4 pl-4 py-2 rounded-xl border border-[var(--border-line)]">
                         <span className="font-bold text-red-500 hover:text-red-400 transition-colors cursor-pointer">{profile.metrics?.connections || 0} <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>connections</span></span>
                         <div className="w-1.5 h-1.5 rounded-full bg-[var(--border-line)]"></div>
                         <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{profile.metrics?.followers || 0} <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>followers</span></span>
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
                            <button disabled className="btn-secondary h-12 px-8 flex-1 sm:flex-none opacity-50">
                              <Clock className="w-5 h-5 mr-2" /> Pending...
                            </button>
                          )}
                          {connectionStatus === 'accepted' && (
                            <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-primary h-12 px-8 flex-1 sm:flex-none shadow-red-500/20">
                              <MessageSquare className="w-5 h-5 mr-2" /> Message
                            </button>
                          )}
                          <button onClick={handleFollowToggle} className="btn-secondary h-12 px-8 flex-1 sm:flex-none">
                             {isFollowing ? <><UserCheck className="w-5 h-5 mr-2 text-red-500" /> Following</> : '+ Follow'}
                          </button>
                        </>
                      )}
                    </div>
                </div>
              </div>

              {/* Skills & Endorsements System */}
              <div className="glass-panel p-6 sm:p-10">
                <h2 className="text-2xl font-black mb-6 border-b pb-4 flex items-center" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-line)' }}>
                  <Award className="w-6 h-6 mr-3 text-red-500" /> Verified Skills & Endorsements
                </h2>
                {profile.skills?.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {profile.skills.map((skill, index) => {
                      const count = getEndorsementCount(skill);
                      const endorsedByMe = isSkillEndorsedByMe(skill);
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                          key={index} 
                          className="group p-5 rounded-2xl flex items-center justify-between border shadow-sm transition-all"
                          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-line)' }}
                        >
                          <div className="flex items-center">
                              <div className="flex flex-col">
                                 <span className="font-extrabold text-lg tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>{skill}</span>
                                 {count > 0 && (
                                   <span className="text-xs font-bold text-red-500 mt-1 uppercase tracking-widest flex items-center">
                                     <Award className="w-3.5 h-3.5 mr-1"/> {count} Endorsement{count !== 1 ? 's' : ''}
                                   </span>
                                 )}
                              </div>
                          </div>
                          
                          {/* Endorse Button Logic */}
                          {!isOwner && connectionStatus === 'accepted' && (
                            <div className="flex items-center">
                              {endorsedByMe ? (
                                <button 
                                  onClick={() => handleRemoveEndorse(skill)}
                                  className="btn-secondary h-10 px-4 text-xs group-hover:border-red-500 group-hover:text-red-500"
                                >
                                  <Check className="w-4 h-4 mr-1 text-red-500"/> Endorsed
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleEndorse(skill)}
                                  className="btn-outline h-10 px-4 text-xs"
                                >
                                  + Endorse
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 rounded-xl border border-dashed" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-line)' }}>
                    <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No professional skills listed.</p>
                  </div>
                )}
              </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
              <div className="glass-panel p-6">
                  <h3 className="font-black mb-4 text-lg" style={{ color: 'var(--text-primary)' }}>Your Network</h3>
                  <div className="text-center py-6 border rounded-xl" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-main)' }}>
                      <p className="text-sm mb-4 px-4 font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Expand your network to unlock career opportunities.
                      </p>
                      <button onClick={() => navigate('/connections')} className="text-sm font-bold text-red-500 hover:text-red-400 hover:underline">
                         View connections
                      </button>
                  </div>
              </div>
          </div>

      </div>
    </motion.div>
  );
};

export default Profile;
