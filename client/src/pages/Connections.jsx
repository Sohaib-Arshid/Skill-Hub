import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Check, X, Users, UserCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      // 1. Fetch Connections safely
      try {
          const connRes = await api.get('/connection/all');
          if (connRes.data.statusCode === 200 || connRes.data.statusCode === 201) {
            setConnections(connRes.data.data || []);
          }
      } catch(e) {
          if (e.response?.status !== 404) console.error("Error fetching connections");
          setConnections([]);
      }

      // 2. Fetch Followers safely
      try {
        const follRes = await api.get('/follow/followers');
        if (follRes.data.statusCode === 200 || follRes.data.statusCode === 201) {
            setFollowers(follRes.data.data || []);
        }
      } catch (e) {
          if (e.response?.status !== 404) console.error("Error fetching followers");
          setFollowers([]);
      }
      
      // 3. Fetch Following safely
      try {
        const followRes = await api.get('/follow/following');
        if (followRes.data.statusCode === 200 || followRes.data.statusCode === 201) {
            setFollowing(followRes.data.data || []);
        }
      } catch (e) {
          if (e.response?.status !== 404) console.error("Error fetching following");
          setFollowing([]);
      }

    } catch (error) {
      toast.error('Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connId) => {
    if(!connId) return toast.error("Invalid Request ID");
    try {
      await api.patch(`/connection/accept/${connId}`);
      toast.success('Connection request accepted');
      fetchNetworkData(); // refresh lists
    } catch (error) {
      toast.error('Error accepting connection');
    }
  };

  const handleReject = async (connId) => {
    if(!connId) return toast.error("Invalid Request ID");
    try {
      await api.patch(`/connection/reject/${connId}`);
      toast.success('Connection ignored');
      fetchNetworkData(); // refresh lists
    } catch (error) {
      toast.error('Error rejecting connection');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
        await api.delete(`/follow/unfollow/${userId}`);
        toast.success('Unfollowed successfully');
        fetchNetworkData();
    } catch (error) {
        toast.error('Error unfollowing');
    }
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
         const isSender = conn.sender?._id === user._id;
         const otherUser = isSender ? conn.receiver : conn.sender;
         if (!otherUser) return null;
         
         // IMPORTANT FIX: Passing the conn._id as connId so handleAccept works correctly.
         return { ...otherUser, connId: conn._id, status: conn.status, role: isSender ? 'sent' : 'received' };
       }).filter(Boolean);
    } else if (activeTab === 'followers') {
       list = followers.map(f => f.follower);
    } else if (activeTab === 'following') {
       list = following.map(f => f.following);
    }

    if (list.length === 0) {
      return (
        <div className="text-center py-20 bg-[#0b0f19]/30 rounded-xl border border-[#1e293b] mt-4 shadow-inner">
          <AlertCircle className="w-12 h-12 text-[#334155] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No {tabs.find(t=>t.id===activeTab)?.label} Found</h3>
          <p className="text-sm text-slate-500 mt-1">Start connecting with professionals to populate this list.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {list.map((person, idx) => (
          <div key={idx} className="glass-panel group pb-2 shadow-lg">
            
            <div className="h-16 bg-gradient-to-tr from-slate-800 to-[#1e293b]"></div>
            
            <div className="px-4 -mt-8 flex flex-col items-center">
               <img 
                 src={person.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1e293b&color=3b82f6`}
                 alt={person.name}
                 className="w-16 h-16 rounded-xl border-[3px] border-[#151b2b] bg-[#1e293b] mb-3 shadow-lg group-hover:-translate-y-1 transition-transform"
               />
               <h3 className="font-bold text-slate-100 cursor-pointer hover:text-blue-400 leading-tight" onClick={() => navigate(`/profile/${person._id}`)}>
                 {person.name}
               </h3>
               <p className="text-xs text-slate-500 mt-1 text-center h-4 line-clamp-1">{person.bio || "Active Professional"}</p>
               
               <div className="w-full mt-4 pt-4 flex space-x-2">
                 
                 {activeTab === 'pending' && person.role === 'received' && (
                    <>
                      <button onClick={() => handleAccept(person.connId)} className="flex-1 btn-primary py-1.5 px-0 text-xs shadow-blue-500/20">
                        <Check className="w-4 h-4 mr-1"/> Accept
                      </button>
                      <button onClick={() => handleReject(person.connId)} className="flex-1 bg-[#1e293b] hover:bg-slate-800 text-slate-300 hover:text-red-400 font-bold rounded-lg transition-colors flex items-center justify-center text-xs py-1.5 shadow-sm">
                        <X className="w-4 h-4 mr-1"/> Ignore
                      </button>
                    </>
                 )}

                 {activeTab === 'pending' && person.role === 'sent' && (
                    <div className="w-full text-center py-2 text-xs font-bold text-slate-500 bg-[#0b0f19] rounded-lg border border-[#1e293b] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div> Request Pending
                    </div>
                 )}

                 {activeTab === 'accepted' && (
                   <button onClick={() => navigate(`/messages?userId=${person._id}`)} className="w-full btn-secondary text-xs py-2 shadow-sm">
                     <MessageSquare className="w-4 h-4 mr-1.5 text-blue-400"/> Message User
                   </button>
                 )}

                 {activeTab === 'followers' && (
                    <button onClick={() => navigate(`/profile/${person._id}`)} className="w-full btn-outline text-xs py-2 border-[#334155] text-slate-300 hover:border-blue-500 hover:text-blue-400">
                      View Profile
                    </button>
                 )}

                 {activeTab === 'following' && (
                   <button onClick={() => handleUnfollow(person._id)} className="w-full bg-[#1e293b] hover:bg-[#334155] border border-transparent rounded-lg text-blue-400 font-bold text-xs flex items-center justify-center py-2 transition-colors">
                     <UserCheck className="w-4 h-4 mr-1.5"/> Following
                   </button>
                 )}

               </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      <div className="glass-panel p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tight flex items-center">
          <Users className="w-6 h-6 mr-3 text-blue-500" /> Professional Network
        </h1>

        <div className="flex overflow-x-auto space-x-2 border-b border-[#1e293b] pb-2 scrollbar-hide">
          {tabs.map(tab => {
            const invitationsCount = tab.id === 'pending' ? filteredConnections.filter(c => c.receiver?._id === user._id).length : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 font-bold text-sm transition-all rounded-t-lg mx-1 flex items-center ${
                  activeTab === tab.id 
                    ? 'border-b-4 border-blue-500 text-white bg-blue-500/10' 
                    : 'border-b-4 border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
                }`}
              >
                {tab.label}
                {invitationsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">
                    {invitationsCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-blue-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Syncing network...</p>
            </div>
          ) : (
            renderUserList()
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;
