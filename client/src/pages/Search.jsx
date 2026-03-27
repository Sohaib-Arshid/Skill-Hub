import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { SearchIcon, Loader2, Sparkles } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  
  const [query, setQuery] = useState(initialSkill);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Backend natively returns random users if search is empty
  const fetchResults = async (searchQuery) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/search?skill=${encodeURIComponent(searchQuery)}`);
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
    <div className="space-y-8 max-w-7xl mx-auto tracking-wide pb-10">
      
      <div className="glass-panel p-6 sm:p-10 flex flex-col items-center justify-center shadow-lg bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e293b] via-[#151b2b] to-[#0b0f19] relative overflow-hidden">
        {/* Abstract decor */}
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <Sparkles className="w-48 h-48 text-blue-500" />
        </div>

        <div className="w-full max-w-3xl text-center mb-8 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Discover Global Talent
          </h1>
          <p className="text-slate-400 text-lg">
            Search completely across SkillHub for developers, designers, and innovators.
          </p>
        </div>

        <div className="w-full max-w-3xl relative z-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-6 top-4 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                className="w-full bg-[#0b0f19] border-2 border-[#1e293b] hover:border-blue-500/50 rounded-2xl py-4 flex pl-14 pr-6 text-slate-200 font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-lg shadow-inner"
                placeholder="e.g. Node.js, Designer, Backend..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary rounded-2xl h-[60px] sm:px-10 text-lg shadow-blue-500/30"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="pt-2 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-blue-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Scanning the network...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel text-center py-20 px-8 border-dashed border-[#334155] border-2 bg-transparent">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">No profiles matched your search</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">Try broadening your terms or searching for a different core skill like "React" or "Illustrator".</p>
            <button onClick={() => { setQuery(''); setSearchParams({ skill: '' }); }} className="mt-8 btn-outline">Clear Search</button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-300"><span className="text-white">{results.length}</span> professionals found</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;