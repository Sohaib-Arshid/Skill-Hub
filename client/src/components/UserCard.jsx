import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const UserCard = ({ user }) => {
  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       whileHover={{ y: -5 }}
       transition={{ duration: 0.2 }}
       className="glass-panel group flex flex-col justify-between overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgba(239,68,68,0.15)] hover:border-red-500/50"
    >
      <div>
         <div className="h-20 bg-gradient-to-r from-red-700 via-red-900 to-black relative opacity-[0.85] group-hover:opacity-100 transition-opacity"></div>
         
         <div className="px-5 -mt-10 relative">
           <img 
             src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0a0a0a&color=ef4444`} 
             alt={user.name}
             className="w-20 h-20 rounded-xl object-cover border-4 shadow-xl border-[var(--bg-panel)] bg-[var(--bg-main)] group-hover:scale-105 transition-transform"
           />
           <div className="mt-4">
             <Link to={`/profile/${user._id}`}>
               <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-red-500 transition-colors leading-tight tracking-wide">
                 {user.name}
               </h3>
             </Link>
             <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-2 leading-relaxed h-[42px]">
               {user.bio || "Active Professional on SkillHub"}
             </p>
           </div>
         </div>
         
         <div className="px-5 mt-4 flex flex-wrap gap-2 pb-6">
           {user.skills?.slice(0, 3).map((skill, index) => (
             <span 
               key={index} 
               className="px-2.5 py-1 bg-[var(--bg-main)] text-red-500 border border-[var(--border-line)] text-[11px] font-bold uppercase tracking-widest rounded-md"
             >
               {skill}
             </span>
           ))}
           {user.skills?.length > 3 && (
             <span className="px-2.5 py-1 bg-[var(--bg-main)] text-[var(--text-secondary)] border border-[var(--border-line)] text-[11px] font-bold uppercase tracking-widest rounded-md">
               +{user.skills.length - 3}
             </span>
           )}
         </div>
      </div>

      <div className="p-4 border-t border-[var(--border-line)] bg-[var(--bg-main)]/50">
        <Link 
          to={`/profile/${user._id}`}
          className="w-full flex justify-center items-center py-2.5 bg-red-500/5 hover:bg-red-500/20 border border-red-500/30 text-red-500 hover:text-red-400 rounded-lg text-sm font-bold tracking-wide transition-colors"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
};

export default UserCard;
