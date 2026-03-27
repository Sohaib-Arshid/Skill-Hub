import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';
import { SearchIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // We fetch a few users with a default search to populate dashboard
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mt-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-slate-400 mt-1">Here is what's happening in your network.</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
          <input
            type="text"
            className="input-field pl-10 bg-slate-800 border-slate-700/50"
            placeholder="Search by skill (e.g., React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
        </form>
      </header>

      <section className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
           <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-200 mb-2">Complete Your Profile</h2>
        <p className="text-slate-400 max-w-xl mb-6 text-sm">
          A complete profile helps you get discovered by recruiters and peers. Add your skills, bio, and a profile picture to stand out.
        </p>
        <button onClick={() => navigate('/settings')} className="btn-primary">
          Update Profile
        </button>
      </section>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">Suggested Professionals</h2>
          <button onClick={() => navigate('/search')} className="text-blue-500 hover:text-blue-400 text-sm font-medium">View All</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800/50 h-56 rounded-xl border border-slate-700"></div>
            ))}
          </div>
        ) : recentUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentUsers.map(u => <UserCard key={u._id} user={u} />)}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <p className="text-slate-400">No users found. Try searching for specific skills.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;