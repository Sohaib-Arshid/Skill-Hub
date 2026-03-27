import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Check, X, Users, UserCheck, MessageSquare } from 'lucide-react';
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
      // 1. Fetch Connections
      const connRes = await api.get('/connection/all');
      if (connRes.data.statusCode === 200) {
        setConnections(connRes.data.data);
      }

      // 2. Fetch Followers
      try {
        const follRes = await api.get('/follow/followers');
        if (follRes.data.statusCode === 200 || follRes.data.statusCode === 201) {
            setFollowers(follRes.data.data);
        }
      } catch (e) {
          console.error("No followers found or error");
      }
      
      // 3. Fetch Following
      try {
        const followRes = await api.get('/follow/following');
        if (followRes.data.statusCode === 200 || followRes.data.statusCode === 201) {
            setFollowing(followRes.data.data);
        }
      } catch (e) {
          console.error("No following found or error");
      }

    } catch (error) {
      toast.error('Failed to load network data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.patch(`/connection/accept/${id}`);
      toast.success('Connection accepted');
      fetchNetworkData();
    } catch (error) {
      toast.error('Error accepting connection');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/connection/reject/${id}`);
      toast.success('Connection rejected');
      fetchNetworkData();
    } catch (error) {
      toast.error('Error rejecting connection');
    }
  };

  const handleUnfollow = async (id) => {
    try {
        await api.delete(`/follow/unfollow/${id}`);
        toast.success('Unfollowed successfully');
        fetchNetworkData();
    } catch (error) {
        toast.error('Error unfollowing');
    }
  };

  const filteredConnections = connections.filter(c => c.status === activeTab);

  const tabs = [
    { id: 'accepted', label: 'Connections' },
    { id: 'pending', label: 'Invitations' },
    { id: 'followers', label: 'Followers' },
    { id: 'following', label: 'Following' }
  ];

  const renderUserList = () => {
    let list = [];
    if (activeTab === 'accepted' || activeTab === 'pending') {
       list = filteredConnections.map(conn => {
         // Because we patched getConnection.js, sender and receiver are populated!
         const otherUser = conn.sender?._id === user._id ? conn.receiver : conn.sender;
         if (!otherUser) return null;
         return { ...otherUser, connId: conn._id, status: conn.status, role: conn.sender?._id === user._id ? 'sent' : 'received' };
       }).filter(Boolean);
    } else if (activeTab === 'followers') {
       list = followers.map(f => f.follower);
    } else if (activeTab === 'following') {
       list = following.map(f => f.following);
    }

    if (list.length === 0) {
      return (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200 mt-4">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700">No {activeTab} yet</h3>
          <p className="text-sm text-slate-500 mt-1">Grow your network by discovering people.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {list.map((person, idx) => (
          <div key={idx} className="glass-panel overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 flex flex-col items-center">
               <img 
                 src={person.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=ffffff&color=0a66c2`}
                 alt={person.name}
                 className="w-16 h-16 rounded-full border border-slate-200 mb-3"
               />
               <h3 className="font-semibold text-slate-900 cursor-pointer hover:underline hover:text-[#0a66c2]" onClick={() => navigate(`/profile/${person._id}`)}>
                 {person.name}
               </h3>
               <p className="text-xs text-slate-500 line-clamp-1 mt-1 text-center h-4">{person.bio}</p>
               
               <div className="w-full mt-4 pt-4 border-t border-slate-100 flex justify-center space-x-2">
                 
                 {activeTab === 'pending' && person.role === 'received' && (
                    <>
                      <button onClick={() => handleAccept(person._id)} className="w-full btn-primary text-xs py-1.5 flex items-center justify-center">
                        <Check className="w-4 h-4 mr-1"/> Accept
                      </button>
                      <button onClick={() => handleReject(person._id)} className="w-full border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-full font-semibold px-2 py-1.5 flex items-center justify-center text-xs">
                        <X className="w-4 h-4 mr-1"/> Ignore
                      </button>
                    </>
                 )}

                 {activeTab === 'pending' && person.role === 'sent' && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      Request Sent
                    </span>
                 )}

                 {activeTab === 'accepted' && (
                   <button onClick={() => navigate(`/messages?userId=${person._id}`)} className="w-full btn-outline flex items-center justify-center text-xs py-1.5">
                     <MessageSquare className="w-4 h-4 mr-1"/> Message
                   </button>
                 )}

                 {activeTab === 'followers' && (
                    <button onClick={() => navigate(`/profile/${person._id}`)} className="w-full btn-outline flex items-center justify-center text-xs py-1.5">
                      View
                    </button>
                 )}

                 {activeTab === 'following' && (
                   <button onClick={() => handleUnfollow(person._id)} className="w-full px-3 py-1.5 border border-slate-300 rounded-full text-slate-600 font-semibold hover:bg-slate-50 text-xs flex items-center justify-center">
                     <UserCheck className="w-4 h-4 mr-1"/> Following
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
    <div className="max-w-6xl mx-auto space-y-6">
      
      <div className="glass-panel p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">Manage my network</h1>

        <div className="flex overflow-x-auto space-x-6 border-b border-slate-200 pb-1 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold text-sm transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id 
                  ? 'border-[#0a66c2] text-[#0a66c2]' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
              {tab.id === 'pending' && filteredConnections.filter(c => c.receiver?._id === user._id).length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full relative bottom-0.5">
                  {filteredConnections.filter(c => c.receiver?._id === user._id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin mx-auto"></div>
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
