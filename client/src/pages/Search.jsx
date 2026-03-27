import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { SearchIcon, Loader2, Frown } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  
  const [query, setQuery] = useState(initialSkill);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialSkill);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const { data } = await api.get(`/search?skill=${encodeURIComponent(searchQuery)}`);
      if (data.statusCode === 200) {
        setResults(data.data);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSkill) {
      fetchResults(initialSkill);
    }
  }, [initialSkill]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ skill: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="text-center mb-10 mt-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-4">
          Discover Professionals
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Search for talent by skills. Connect, collaborate, and grow your professional network.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative flex items-center shadow-lg">
          <SearchIcon className="absolute left-4 w-6 h-6 text-slate-400" />
          <input
            type="text"
            className="w-full bg-slate-800/80 border-2 border-slate-700/50 rounded-xl py-4 pl-14 pr-32 text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all text-lg placeholder-slate-500"
            placeholder="Search by skill e.g. Node.js, Design..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-slate-400 text-sm">Searching network...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-slate-700/30">
            <Frown className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-300">No professionals found</h3>
            <p className="text-slate-500 mt-2">Try searching for a different skill</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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