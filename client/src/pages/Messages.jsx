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
        if (data.statusCode === 200) {
          const accepted = data.data.filter(c => c.status === 'accepted');
          const contacts = accepted.map(c => c.sender._id === user._id ? c.receiver : c.sender).filter(Boolean);
          setConnections(contacts);

          if (initialUserId) {
            const foundUser = contacts.find(c => c._id === initialUserId);
            if (foundUser) setSelectedUser(foundUser);
          } else if (contacts.length > 0) {
            setSelectedUser(contacts[0]);
          }
        }
      } catch (err) {
        toast.error("Error loading chat contacts");
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
      if (data.statusCode === 200) {
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
    <div className="h-[80vh] flex flex-col md:flex-row bg-slate-800/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-500">
      {/* Sidebar - Contacts */}
      <div className="md:w-1/3 border-r border-slate-700/50 flex flex-col">
        <div className="p-4 border-b border-slate-700/50 bg-slate-800">
          <h2 className="font-bold text-slate-100 text-lg">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto w-full max-h-[25vh] md:max-h-full">
          {connections.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No connections yet</p>
            </div>
          ) : (
            connections.map(contact => (
              <button
                key={contact._id}
                onClick={() => setSelectedUser(contact)}
                className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${
                  selectedUser?._id === contact._id ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'hover:bg-slate-700/30 border-l-4 border-transparent'
                }`}
              >
                <img 
                  src={contact.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=1e293b&color=3b82f6`} 
                  alt={contact.name}
                  className="w-10 h-10 rounded-full border border-slate-600"
                />
                <div className="overflow-hidden">
                  <h3 className="font-medium text-slate-200 truncate">{contact.name}</h3>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900/50 relative">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 flex items-center space-x-3 backdrop-blur-sm shadow-sm z-10">
              <img 
                src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=1e293b&color=3b82f6`} 
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              <h2 className="font-semibold text-slate-100">{selectedUser.name}</h2>
            </div>
            
            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-20 md:pb-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <p>Start a conversation with {selectedUser.name}</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender === user._id || msg.sender?._id === user._id; // depending on backend population
                  return (
                    <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
                      }`}>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-slate-800 border-t border-slate-700/50">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="btn-primary flex items-center justify-center px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
            <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
            <h3 className="text-xl font-medium text-slate-400">Your Messages</h3>
            <p className="mt-2 text-center max-w-sm">Select a connection from the sidebar to view your conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
