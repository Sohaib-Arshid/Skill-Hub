import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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
  }, [user?._id, initialUserId]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); 
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
    } catch (err) { }
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel h-[calc(100vh-140px)] flex flex-col md:flex-row overflow-hidden relative z-10 transition-colors duration-300">
      {/* Sidebar - Contacts */}
      <div className="w-full md:w-[320px] lg:w-[360px] flex flex-col border-r" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-main)' }}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-panel)' }}>
          <h2 className="font-black tracking-tight text-xl" style={{ color: 'var(--text-primary)' }}>Direct Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          {connections.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center opacity-50">
              <MessageSquare className="w-10 h-10 mb-3" style={{ color: 'var(--text-secondary)' }} />
              <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>No accepted connections to message.</p>
            </div>
          ) : (
            connections.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`w-full text-left p-4 flex items-center space-x-4 transition-all border-b ${
                  selectedUser?._id === contact._id 
                  ? 'border-l-4 border-l-red-500 bg-black/5 dark:bg-white/5' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 border-l-4 border-l-transparent'
                }`}
                style={{ borderColor: 'var(--border-line)' }}
              >
                <img 
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=0a0a0a&color=ef4444`} 
                  alt={contact.name}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm bg-[var(--bg-panel)]"
                />
                <div className="overflow-hidden flex-1">
                  <h3 className="font-bold truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>{contact.name}</h3>
                  <p className="text-xs font-medium line-clamp-1 mt-1" style={{ color: 'var(--text-secondary)' }}>{contact.bio || "Active on SkillHub"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full bg-[var(--bg-main)]">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-5 border-b flex items-center space-x-4 z-10 shadow-sm" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-panel)' }}>
              <img 
                 src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=0a0a0a&color=ef4444`} 
                 alt={selectedUser.name}
                 className="w-12 h-12 rounded-xl object-cover bg-[var(--bg-main)]"
              />
              <div>
                 <h2 className="font-black text-[17px] leading-tight" style={{ color: 'var(--text-primary)' }}>{selectedUser.name}</h2>
                 <p className="text-[10px] text-red-500 font-black tracking-widest uppercase mt-1">End-to-End Encrypted</p>
              </div>
            </div>
            
            {/* Messages body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar relative">
              <div className="absolute inset-0 bg-red-900/5 pointer-events-none mix-blend-overlay"></div>
              
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center relative z-10">
                  <p className="px-6 py-3 rounded-full border text-sm font-bold shadow-lg" style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-line)', color: 'var(--text-secondary)' }}>
                    Say hello to {selectedUser.name.split(' ')[0]} 👋
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender === user?._id || msg.sender?._id === user?._id;
                  return (
                    <div key={msg._id} className={`flex relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] shadow-lg ${
                        isMe 
                          ? 'bg-red-600 text-white rounded-br-none shadow-red-500/20 font-medium tracking-wide' 
                          : 'bg-[var(--bg-panel)] text-[var(--text-primary)] rounded-bl-none border border-[var(--border-line)] font-medium tracking-wide'
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
            <div className="p-4 border-t z-10 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)]" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-panel)' }}>
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field shadow-none py-4"
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="btn-primary rounded-xl px-8 shadow-red-500/30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 h-full opacity-50 relative z-10">
            <MessageSquare className="w-20 h-20 mb-6" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Your Messages</h3>
            <p className="mt-3 text-center max-w-sm text-[15px] font-bold leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Select a connection from the left panel to start chatting securely.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Messages;
