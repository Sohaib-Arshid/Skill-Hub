import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { SearchIcon, Loader2 } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  
  const [query, setQuery] = useState(initialSkill);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Note: the backend handles empty searches by returning random users
  const fetchResults = async (searchQuery) => {
    setLoading(true);
    try {
      // Encode URI handles empty correctly
      const { data } = await api.get(`/search?skill=${encodeURIComponent(searchQuery)}`);
      // Since backend is modified, it will give us users even for empty search
      if (data.statusCode === 200 || data.statusCode === 201) {
        setResults(data.data || []);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(initialSkill);
  }, [initialSkill]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ skill: query.trim() });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto tracking-wide">
      
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-1/3">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Discover Network
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build your professional connections by skill.
          </p>
        </div>

        <div className="w-full md:w-2/3">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-100 hover:bg-slate-200 border border-transparent rounded-lg py-3 pl-10 pr-4 text-slate-900 font-medium focus:bg-white focus:border-slate-400 focus:outline-none transition-colors"
                placeholder="Search individuals by role, skill e.g. React"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#0a66c2]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel text-center py-20 px-4">
            <h3 className="text-lg font-semibold text-slate-800">No matching professionals found</h3>
            <p className="text-slate-500 mt-2">Try searching for a different core skill like "Node.js" or "Design"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;