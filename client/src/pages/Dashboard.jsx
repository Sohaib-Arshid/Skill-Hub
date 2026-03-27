import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/search/');
        if (data.statusCode === 200 || data.statusCode === 201) {
          setRecentUsers(data.data.slice(0, 6)); // Display top 6
        }
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?skill=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 tracking-wide pb-20 md:pb-0 relative z-10 transition-colors duration-300">
      
      {/* Sidebar Profile Card */}
      <div className="md:col-span-1 space-y-4 hidden md:block">
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-panel overflow-hidden relative group"
        >
          <div className="h-20 bg-gradient-to-br from-red-600 to-black opacity-90 group-hover:opacity-100 transition-opacity absolute w-full top-0 z-0"></div>
          
          <div className="relative z-10 pt-10 px-4 text-center pb-6">
            <img 
               src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=0a0a0a&color=ef4444`} 
               alt={user?.name}
               className="w-20 h-20 rounded-xl object-cover border-4 bg-[var(--bg-main)] shadow-xl cursor-pointer shadow-black/40 hover:scale-105 transition-transform duration-300 mx-auto"
               style={{ borderColor: 'var(--bg-panel)' }}
               onClick={() => navigate(`/profile/${user?._id}`)}
            />
            <h2 className="mt-4 text-lg font-black leading-tight cursor-pointer hover:text-red-500 transition-colors" 
                style={{ color: 'var(--text-primary)' }}
                onClick={() => navigate(`/profile/${user?._id}`)}>
              {user?.name}
            </h2>
            <p className="text-[13px] mt-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>
              {user?.bio || "Connect with professionals to grow your network."}
            </p>
          </div>
          
          <div className="mt-2 border-t" style={{ borderColor: 'var(--border-line)', backgroundColor: 'var(--bg-main)' }}>
            <div className="px-5 py-4 hover:bg-black/5 transition-colors cursor-pointer text-sm" onClick={() => navigate('/connections')}>
              <div className="flex justify-between items-center font-bold mb-1">
                <span style={{ color: 'var(--text-secondary)' }}>My Network</span>
                <span className="text-red-500 flex items-center group-hover:translate-x-1 transition-transform">
                  Grow <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Feed Area */}
      <div className="md:col-span-3 space-y-6">
        
        {/* Search Bar Block */}
        <motion.div 
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-panel p-4 flex items-center space-x-4 overflow-visible relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent z-0 pointer-events-none"></div>
          <img 
             src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=0a0a0a&color=ef4444`} 
             alt={user?.name}
             className="w-12 h-12 rounded-xl border border-[var(--border-line)] object-cover shadow-sm hidden sm:block relative z-10"
          />
          <form onSubmit={handleSearch} className="flex-1 relative group z-10">
             <input
                type="text"
                className="input-field pl-14 shadow-[0_0_15px_rgba(239,68,68,0.05)] focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                placeholder="Search professionals by skills (e.g. React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <Search className="absolute left-5 top-4 w-5 h-5 text-red-400 opacity-60 group-focus-within:opacity-100 transition-opacity" />
          </form>
        </motion.div>

        {/* Feed Roster */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="glass-panel p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Suggested Professionals</h2>
               <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Discover individuals mapped to your industry</p>
            </div>
            <button onClick={() => navigate('/search')} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors hidden sm:block">
              Explore All
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse h-[300px] rounded-xl border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-line)' }}></div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentUsers.map((u, i) => (
                <motion.div key={u._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                   <UserCard user={u} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-xl border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-line)' }}>
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-primary)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No suggestions right now</h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Use the search bar above to find specific skills.</p>
            </div>
          )}
        </motion.div>
      </div>
      
    </div>
  );
};

export default Dashboard;