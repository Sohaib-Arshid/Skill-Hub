import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('accepted');

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data } = await api.get('/connection/all');
      if (data.statusCode === 200) {
        setConnections(data.data);
      }
    } catch (error) {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.patch(`/connection/accept/${id}`);
      toast.success('Connection accepted');
      fetchConnections();
    } catch (error) {
      toast.error('Error accepting connection');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/connection/reject/${id}`);
      toast.success('Connection rejected');
      fetchConnections();
    } catch (error) {
      toast.error('Error rejecting connection');
    }
  };

  const filteredConnections = connections.filter(c => c.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-6">Network Connections</h1>

      <div className="flex space-x-2 border-b border-slate-700/50 mb-6">
        {['accepted', 'pending', 'rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div>
        {loading ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-700/30">
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No {activeTab} connections</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map(conn => {
              // Determine if we are sender or receiver to display the other person.
              // We assume backend populates both sender and receiver
              const otherUser = conn.sender._id === user._id ? conn.receiver : conn.sender;
              
              if (!otherUser) return null; // Safe guard

              return (
                <div key={conn._id} className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 shadow-lg flex flex-col justify-between h-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={otherUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=1e293b&color=3b82f6`}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full border border-slate-600"
                    />
                    <div>
                      <h3 className="font-semibold text-slate-200">{otherUser.name}</h3>
                      <p className="text-xs text-slate-400 capitalize">{conn.status}</p>
                    </div>
                  </div>
                  
                  {activeTab === 'pending' && conn.receiver._id === user._id && (
                    <div className="flex space-x-3 mt-4">
                      <button 
                        onClick={() => handleAccept(otherUser._id)}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1"/> Accept
                      </button>
                      <button 
                        onClick={() => handleReject(otherUser._id)}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg text-sm font-medium transition-colors flex justify-center items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1"/> Reject
                      </button>
                    </div>
                  )}

                  {activeTab === 'pending' && conn.sender._id === user._id && (
                   <div className="mt-4 p-2 bg-slate-700/30 text-center rounded-lg text-sm text-slate-400">
                     Awaiting response
                   </div>
                  )}

                  {activeTab === 'accepted' && (
                    <div className="mt-4">
                      <a href={`/messages?userId=${otherUser._id}`} className="block text-center py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors border border-slate-600">
                        Message
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
