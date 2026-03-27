import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, Link as LinkIcon, Edit3 } from 'lucide-react';

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
        if (data.statusCode === 200) {
          // get top 6 users
          setRecentUsers(data.data.slice(0, 6));
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
        <div className="glass-panel overflow-hidden relative pb-4">
          <div className="h-16 bg-[#a0b4b7] absolute top-0 w-full"></div>
          <div className="relative pt-6 px-4 text-center">
            <img 
               src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=ffffff&color=0a66c2`} 
               alt={user?.name}
               className="w-20 h-20 rounded-full object-cover border-4 border-white bg-white mx-auto shadow-sm cursor-pointer"
               onClick={() => navigate(`/profile/${user?._id}`)}
            />
            <h2 className="mt-4 text-lg font-semibold text-slate-900 leading-tight cursor-pointer hover:underline" onClick={() => navigate(`/profile/${user?._id}`)}>
              {user?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{user?.bio || "Add a bio to get discovered"}</p>
          </div>
          
          <div className="mt-4 border-t border-slate-200">
            <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm" onClick={() => navigate('/connections')}>
              <div className="flex justify-between items-center text-slate-500 font-semibold mb-1 hover:text-[#0a66c2]">
                <span>Connections</span>
                <span className="text-[#0a66c2]">Grow network</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Area */}
      <div className="md:col-span-3 space-y-6">
        {/* Search Bar Block */}
        <div className="glass-panel p-4 flex items-center space-x-3">
          <img 
             src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=ffffff&color=0a66c2`} 
             alt={user?.name}
             className="w-12 h-12 rounded-full border border-slate-200 object-cover"
          />
          <form onSubmit={handleSearch} className="flex-1 relative">
             <input
                type="text"
                className="w-full bg-slate-100 hover:bg-slate-200 border border-transparent rounded-full px-4 pl-12 py-3 text-slate-900 font-medium focus:bg-white focus:border-slate-400 focus:outline-none transition-colors"
                placeholder="Search professionals by skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
          </form>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Suggested Professionals</h2>
            <button onClick={() => navigate('/search')} className="text-[#0a66c2] hover:bg-[#0a66c2]/10 px-3 py-1.5 rounded-md font-semibold text-sm transition-colors">
              See all
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-slate-200 h-64 rounded-xl border border-slate-200"></div>
              ))}
            </div>
          ) : recentUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentUsers.map(u => <UserCard key={u._id} user={u} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500">No users found. Try searching for specific skills.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;