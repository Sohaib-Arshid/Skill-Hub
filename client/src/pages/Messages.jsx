import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, MessageSquare, AlertCircle } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch accepted connections to act as the chat list
    const fetchConnections = async () => {
      try {
        const { data } = await api.get('/connection/all');
        if (data.statusCode === 200 || data.statusCode === 201) {
          const list = data.data || [];
          const accepted = list.filter(c => c.status === 'accepted');
          const contacts = accepted.map(c => c.sender?._id === user?._id ? c.receiver : c.sender).filter(Boolean);
          setConnections(contacts);

          if (initialUserId) {
            const foundUser = contacts.find(c => c._id === initialUserId);
            if (foundUser) setSelectedUser(foundUser);
          } else if (contacts.length > 0) {
            setSelectedUser(contacts[0]);
          }
        }
      } catch (err) {
        if(err.response?.status !== 404){
            toast.error("Error loading chat contacts");
        }
      }
    };
    fetchConnections();
  }, [user._id, initialUserId]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Polling simulate real-time
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const { data } = await api.get(`/message/conversation/${selectedUser._id}`);
      if (data.statusCode === 200 || data.statusCode === 201) {
        setMessages(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      setLoading(true);
      await api.post(`/message/send/${selectedUser._id}`, { content: newMessage.trim() });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel h-[calc(100vh-140px)] flex flex-col md:flex-row overflow-hidden shadow-2xl border-[#1e293b]">
      {/* Sidebar - Contacts */}
      <div className="w-full md:w-[320px] lg:w-[360px] border-r border-[#1e293b] flex flex-col bg-[#0b0f19]">
        <div className="p-5 border-b border-[#1e293b] bg-[#151b2b]">
          <h2 className="font-black text-white text-xl tracking-tight">Direct Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {connections.length === 0 ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <MessageSquare className="w-10 h-10 mb-3 text-[#1e293b]" />
              <p className="text-sm font-medium">No accepted connections to message.</p>
            </div>
          ) : (
            connections.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`w-full text-left p-4 flex items-center space-x-4 transition-all border-b border-[#1e293b]/50 ${
                  selectedUser?._id === contact._id 
                  ? 'bg-[#151b2b] border-l-4 border-l-blue-500' 
                  : 'hover:bg-[#151b2b] border-l-4 border-l-transparent'
                }`}
              >
                <img 
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=1e293b&color=3b82f6`} 
                  alt={contact.name}
                  className="w-12 h-12 rounded-xl object-cover shadow-md"
                />
                <div className="overflow-hidden flex-1">
                  <h3 className="font-bold text-slate-200 truncate tracking-tight">{contact.name}</h3>
                  <p className="text-xs font-medium text-slate-400 line-clamp-1 mt-1">{contact.bio || "Active on SkillHub"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0b0f19] relative h-full">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-5 border-b border-[#1e293b] bg-[#151b2b] flex items-center space-x-4 z-10 shadow-sm">
              <img 
                 src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=1e293b&color=3b82f6`} 
                 alt={selectedUser.name}
                 className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                 <h2 className="font-bold text-white text-[17px] leading-tight">{selectedUser.name}</h2>
                 <p className="text-xs text-blue-400 font-bold tracking-wide uppercase mt-1">Chatting securely</p>
              </div>
            </div>
            
            {/* Messages body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <p className="bg-[#151b2b] px-6 py-3 rounded-full border border-[#1e293b] text-sm font-bold shadow-lg text-slate-400">
                    Say hello to {selectedUser.name.split(' ')[0]} 👋
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-[15px] shadow-lg ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20' 
                          : 'bg-[#1e293b] text-slate-200 rounded-bl-none border border-[#334155]'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-5 bg-[#151b2b] border-t border-[#1e293b] z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#0b0f19] border border-[#1e293b] hover:border-[#334155] rounded-xl px-5 py-3.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="btn-primary rounded-xl px-6"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 h-full">
            <MessageSquare className="w-20 h-20 mb-6 text-[#1e293b]" />
            <h3 className="text-2xl font-black text-slate-300 tracking-tight">Your Messages</h3>
            <p className="mt-3 text-center max-w-sm text-[15px] font-medium leading-relaxed">Select a connection from the left panel to start chatting or view previous conversations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
