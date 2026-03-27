import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, Link as LinkIcon, Edit3, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/search');
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 tracking-wide pb-20 md:pb-0">
      
      {/* Sidebar Profile Card */}
      <div className="md:col-span-1 space-y-4 hidden md:block">
        <div className="glass-panel overflow-hidden relative group">
          <div className="h-20 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity absolute w-full top-0"></div>
          
          <div className="relative pt-10 px-4 text-center pb-6">
            <img 
               src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=1e293b&color=3b82f6`} 
               alt={user?.name}
               className="w-20 h-20 rounded-xl object-cover border-4 border-[#151b2b] bg-[#1e293b] mx-auto shadow-xl cursor-pointer shadow-black/40 hover:scale-105 transition-transform duration-300"
               onClick={() => navigate(`/profile/${user?._id}`)}
            />
            <h2 className="mt-4 text-lg font-bold text-slate-100 leading-tight cursor-pointer hover:text-blue-400 transition-colors" onClick={() => navigate(`/profile/${user?._id}`)}>
              {user?.name}
            </h2>
            <p className="text-[13px] text-slate-400 mt-1.5 px-2">{user?.bio || "Connect with professionals to grow your network."}</p>
          </div>
          
          <div className="mt-2 border-t border-[#1e293b] bg-[#0b0f19]/30">
            <div className="px-5 py-4 hover:bg-[#1e293b]/50 transition-colors cursor-pointer text-sm" onClick={() => navigate('/connections')}>
              <div className="flex justify-between items-center font-bold mb-1">
                <span className="text-slate-400">My Network</span>
                <span className="text-blue-400 flex items-center group-hover:translate-x-1 transition-transform">
                  Grow <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="md:col-span-3 space-y-6">
        
        {/* Search Bar Block */}
        <div className="glass-panel p-4 flex items-center space-x-4 bg-gradient-to-r from-[#151b2b] to-[#1e293b]/40">
          <img 
             src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=1e293b&color=3b82f6`} 
             alt={user?.name}
             className="w-12 h-12 rounded-xl border border-[#334155] object-cover shadow-sm hidden sm:block"
          />
          <form onSubmit={handleSearch} className="flex-1 relative group">
             <input
                type="text"
                className="w-full bg-[#0b0f19] border border-[#1e293b] hover:border-[#334155] rounded-xl px-5 pl-14 py-3.5 text-slate-200 font-medium focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500 shadow-inner"
                placeholder="Search professionals by skills (e.g. React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <SearchIcon className="absolute left-5 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </form>
        </div>

        {/* Feed Roster */}
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-xl font-bold text-slate-100 tracking-tight">Suggested Professionals</h2>
               <p className="text-sm text-slate-400 mt-1">Discover individuals mapped to your industry</p>
            </div>
            <button onClick={() => navigate('/search')} className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-4 py-2 rounded-lg font-bold text-sm transition-colors hidden sm:block">
              Explore All
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-[#1e293b]/50 h-[300px] rounded-xl border border-[#334155]/50"></div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentUsers.map(u => <UserCard key={u._id} user={u} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0b0f19]/50 rounded-xl border border-[#1e293b]">
              <SearchIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300">No suggestions right now</h3>
              <p className="text-slate-500 mt-2 text-sm">Use the search bar above to find specific skills.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;