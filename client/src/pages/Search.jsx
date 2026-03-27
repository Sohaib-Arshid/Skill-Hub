import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import UserCard from '../components/UserCard';
import { Search as SearchIcon, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  
  const [query, setQuery] = useState(initialSkill);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Backend natively returns random users if search is empty
  const fetchResults = React.useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      const q = searchQuery ? `?skill=${encodeURIComponent(searchQuery)}` : '';
      const { data } = await api.get(`/search/${q}`);
      if (data.statusCode === 200 || data.statusCode === 201) {
        setResults(data.data || []);
      }
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(initialSkill);
  }, [initialSkill, fetchResults]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ skill: query.trim() });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1200px] mx-auto tracking-wide pb-10 transition-colors duration-300 relative z-10">
      
      <div className="glass-panel p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-t from-[var(--bg-panel)] to-red-900/10">
        {/* Abstract decor */}
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <Sparkles className="w-48 h-48 text-red-500" />
        </div>

        <div className="w-full max-w-3xl text-center mb-10 relative z-10 pt-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">Global Talent</span>
          </h1>
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
            Search completely across SkillHub for developers, designers, and innovators.
          </p>
        </div>

        <div className="w-full max-w-3xl relative z-10">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-6 top-5 w-5 h-5 opacity-60 group-focus-within:opacity-100 transition-opacity text-red-500" />
              <input
                type="text"
                className="input-field rounded-2xl py-5 pl-14 pr-6 text-lg shadow-[0_0_20px_rgba(239,68,68,0.05)] focus:shadow-[0_0_25px_rgba(239,68,68,0.2)]"
                placeholder="e.g. Node.js, Designer, Backend..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary rounded-2xl h-[68px] sm:px-12 text-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="pt-2 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-red-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>Scanning the network...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="glass-panel text-center py-20 px-8 border-dashed bg-transparent border-[var(--border-line)] shadow-none">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: 'var(--text-primary)' }} />
            <h3 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>No profiles matched your search</h3>
            <p className="mt-2 max-w-md mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>Try broadening your terms or searching for a different core skill like "React" or "Illustrator".</p>
            <button onClick={() => { setQuery(''); setSearchParams({ skill: '' }); }} className="mt-8 btn-outline mx-auto">Clear Search</button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{results.length}</span> professionals found
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((user, i) => (
                <div key={user._id}>
                  <UserCard user={user} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;