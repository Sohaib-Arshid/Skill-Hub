import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Check, X, Users, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accepted');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      try {
          const connRes = await api.get('/connection/all');
          if (connRes.data.statusCode === 200 || connRes.data.statusCode === 201) {
            setConnections(connRes.data.data || []);
          }
      } catch(e) { if (e.response?.status !== 404) console.error("Error fetching connections"); setConnections([]); }

      try {
        const follRes = await api.get('/follow/followers');
        if (follRes.data.statusCode === 200 || follRes.data.statusCode === 201) {
            setFollowers(follRes.data.data || []);
        }
      } catch (e) { if (e.response?.status !== 404) console.error("Error fetching followers"); setFollowers([]); }
      
      try {
        const followRes = await api.get('/follow/following');
        if (followRes.data.statusCode === 200 || followRes.data.statusCode === 201) {
            setFollowing(followRes.data.data || []);
        }
      } catch (e) { if (e.response?.status !== 404) console.error("Error fetching following"); setFollowing([]); }

    } catch (error) { toast.error('Failed to load network data'); } 
    finally { setLoading(false); }
  };

  const handleAccept = async (connId) => {
    if(!connId) return toast.error("Invalid Request ID");
    try {
      await api.patch(`/connection/accept/${connId}`);
      toast.success('Connection request accepted');
      fetchNetworkData(); 
    } catch (error) { toast.error('Error accepting connection'); }
  };

  const handleReject = async (connId) => {
    if(!connId) return toast.error("Invalid Request ID");
    try {
      await api.patch(`/connection/reject/${connId}`);
      toast.success('Connection ignored');
      fetchNetworkData(); 
    } catch (error) { toast.error('Error rejecting connection'); }
  };

  const handleUnfollow = async (userId) => {
    try {
        await api.delete(`/follow/unfollow/${userId}`);
        toast.success('Unfollowed successfully');
        fetchNetworkData();
    } catch (error) { toast.error('Error unfollowing'); }
  };

  const filteredConnections = connections.filter(c => c.status === activeTab);

  const tabs = [
    { id: 'accepted', label: 'My Network' },
    { id: 'pending', label: 'Invitations' },
    { id: 'followers', label: 'Followers' },
    { id: 'following', label: 'Following' }
  ];

  const renderUserList = () => {
    let list = [];
    if (activeTab === 'accepted' || activeTab === 'pending') {
       list = filteredConnections.map(conn => {
         const isSender = conn.sender?._id === user?._id;
         const otherUser = isSender ? conn.receiver : conn.sender;
         if (!otherUser) return null;
         return { ...otherUser, connId: conn._id, status: conn.status, role: isSender ? 'sent' : 'received' };
       }).filter(Boolean);
    } else if (activeTab === 'followers') {
       list = followers.map(f => f.follower).filter(Boolean);
    } else if (activeTab === 'following') {
       list = following.map(f => f.following).filter(Boolean);
    }

    if (list.length === 0) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 rounded-2xl border bg-transparent mt-4 shadow-none" style={{ borderColor: 'var(--border-line)' }}>
          <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-primary)' }} />
          <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>No {tabs.find(t=>t.id===activeTab)?.label} Found</h3>
          <p className="font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>Start connecting with professionals to populate this list.</p>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        <AnimatePresence>
          {list.map((person, idx) => (
            <motion.div 
               key={person._id || idx} 
               layout
               initial={{ opacity: 0, y: 15 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ delay: idx * 0.05 }}
               className="glass-panel group pb-4 shadow-lg overflow-hidden hover:border-red-500/50"
            >
              <div className="h-20 bg-gradient-to-tr from-red-600 via-red-900 to-black relative z-0"></div>
              
              <div className="px-5 -mt-10 flex flex-col items-center relative z-10">
                 <img 
                   src={person.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&background=0a0a0a&color=ef4444`}
                   alt={person.name}
                   className="w-20 h-20 rounded-xl border-4 mb-3 shadow-xl bg-[var(--bg-main)] group-hover:-translate-y-2 transition-transform duration-300"
                   style={{ borderColor: 'var(--bg-panel)' }}
                 />
                 <h3 className="font-black text-lg cursor-pointer hover:text-red-500 transition-colors leading-tight tracking-wide" 
                     style={{ color: 'var(--text-primary)' }}
                     onClick={() => navigate(`/profile/${person._id}`)}>
                   {person.name || 'Unknown User'}
                 </h3>
                 <p className="text-xs font-semibold mt-1 text-center h-4 line-clamp-1 uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                   {person.bio || "Active Professional"}
                 </p>
                 
                 <div className="w-full mt-6 flex space-x-2">
                   
                   {activeTab === 'pending' && person.role === 'received' && (
                      <>
                        <button onClick={() => handleAccept(person.connId)} className="flex-1 btn-primary py-2 px-0 text-sm shadow-red-500/20 active:scale-95 transition-transform">
                          <Check className="w-4 h-4 mr-1"/> Accept
                        </button>
                        <button onClick={() => handleReject(person.connId)} className="flex-1 btn-secondary text-sm py-2 group/ignore hover:bg-black/10 hover:border-[var(--border-line)]" style={{ color: 'var(--text-secondary)' }}>
                          <X className="w-4 h-4 mr-1 group-hover/ignore:text-red-500 transition-colors"/> Ignore
                        </button>
                      </>
                   )}

                   {activeTab === 'pending' && person.role === 'sent' && (
                      <div className="w-full text-center py-2 text-xs font-bold rounded-lg border flex items-center justify-center bg-[var(--bg-main)]" style={{ borderColor: 'var(--border-line)', color: 'var(--text-secondary)' }}>
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div> Request Pending
                      </div>
                   )}

                   {activeTab === 'accepted' && (
                     <button onClick={() => navigate(`/messages?userId=${person._id}`)} className="w-full btn-secondary text-sm py-2.5 shadow-sm group/btn hover:border-red-500/20 hover:bg-red-500/5">
                       <MessageSquare className="w-4 h-4 mr-2 text-red-500 group-hover/btn:animate-pulse"/> Message
                     </button>
                   )}

                   {activeTab === 'followers' && (
                      <button onClick={() => navigate(`/profile/${person._id}`)} className="w-full btn-outline text-sm py-2.5">
                        View Profile
                      </button>
                   )}

                   {activeTab === 'following' && (
                     <button onClick={() => handleUnfollow(person._id)} className="w-full border rounded-xl font-bold text-sm flex items-center justify-center py-2.5 transition-colors hover:bg-red-500 hover:text-white border-red-500 text-red-500">
                       <UserCheck className="w-4 h-4 mr-1.5"/> Following
                     </button>
                   )}

                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto space-y-6 pb-10 transition-colors duration-300 relative z-10">
      
      <div className="glass-panel p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <h1 className="text-3xl sm:text-4xl font-black mb-8 tracking-tight flex items-center relative z-10" style={{ color: 'var(--text-primary)' }}>
          <Users className="w-8 h-8 mr-4 text-red-500" /> Professional Network
        </h1>

        <div className="flex overflow-x-auto space-x-2 border-b pb-1 scrollbar-hide relative z-10" style={{ borderColor: 'var(--border-line)' }}>
          {tabs.map(tab => {
            const invitationsCount = tab.id === 'pending' ? filteredConnections.filter(c => c.receiver?._id === user?._id).length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-3 font-bold text-[15px] transition-all rounded-t-xl mx-1 flex items-center tracking-wide ${
                  activeTab === tab.id 
                    ? 'border-b-[3px] border-red-500 bg-red-500/10' 
                    : 'border-b-[3px] border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {tab.label}
                {invitationsCount > 0 && (
                  <span className="ml-3 bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-full shadow-lg shadow-red-500/40">
                    {invitationsCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="min-h-[500px] relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 text-red-500">
              <div className="w-12 h-12 border-[5px] border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4 shadow-lg"></div>
              <p className="font-bold tracking-widest uppercase text-sm" style={{ color: 'var(--text-secondary)' }}>Syncing Matrix...</p>
            </div>
          ) : (
            renderUserList()
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Connections;
