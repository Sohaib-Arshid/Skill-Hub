import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Send, MessageSquare } from 'lucide-react';

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
          const accepted = data.data.filter(c => c.status === 'accepted');
          const contacts = accepted.map(c => c.sender?._id === user._id ? c.receiver : c.sender).filter(Boolean);
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
      // Optional: Polling could be added here for real-time without sockets
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
        setMessages(data.data);
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
    <div className="glass-panel h-[calc(100vh-140px)] flex flex-col md:flex-row overflow-hidden shadow-sm">
      {/* Sidebar - Contacts */}
      <div className="w-full md:w-1/3 xl:w-1/4 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800 text-lg">Messaging</h2>
        </div>
        <div className="flex-1 overflow-y-auto w-full border-t border-transparent bg-white">
          {connections.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No connections yet</p>
            </div>
          ) : (
            connections.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`w-full text-left p-4 flex items-center space-x-3 transition-colors border-b border-slate-100 ${
                  selectedUser?._id === contact._id 
                  ? 'bg-[#f3f2ef] border-l-4 border-l-[#0a66c2]' 
                  : 'hover:bg-[#f3f2ef] border-l-4 border-l-transparent'
                }`}
              >
                <img 
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=ffffff&color=0a66c2`} 
                  alt={contact.name}
                  className="w-12 h-12 rounded-full border border-slate-200 object-cover"
                />
                <div className="overflow-hidden">
                  <h3 className="font-medium text-slate-900 truncate tracking-tight">{contact.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{contact.bio || "Active on SkillHub"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-[2] flex flex-col bg-slate-50 relative h-full">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center space-x-3 z-10 shadow-sm">
              <img 
                src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=ffffff&color=0a66c2`} 
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full border border-slate-200"
              />
              <div>
                 <h2 className="font-semibold text-slate-900 leading-tight">{selectedUser.name}</h2>
                 <p className="text-xs text-[#0a66c2] font-medium leading-tight mt-0.5">{selectedUser.skills?.[0]}</p>
              </div>
            </div>
            
            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <p className="bg-white px-6 py-3 rounded-full border border-slate-200 text-sm font-medium shadow-sm">
                    Say hello to {selectedUser.name.split(' ')[0]}
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMe 
                          ? 'bg-[#0a66c2] text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-sm z-10">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 bg-[#f3f2ef] border border-transparent hover:border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="btn-primary flex items-center justify-center px-5 rounded-lg"
                >
                  <Send className="w-5 h-5 mr-1" />
                  <span className="font-semibold">Send</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 h-full bg-white">
            <MessageSquare className="w-16 h-16 mb-4 text-[#0a66c2]/20" />
            <h3 className="text-xl font-medium text-slate-700">Your Messages</h3>
            <p className="mt-2 text-center max-w-sm text-sm">Select a connection from the left panel to start chatting or view previous conversations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
