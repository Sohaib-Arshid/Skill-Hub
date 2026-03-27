import { Link } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="glass-panel hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
      <div>
         <div className="h-16 bg-gradient-to-r from-blue-600 to-indigo-600 relative opacity-80 group-hover:opacity-100 transition-opacity"></div>
         
         <div className="px-5 -mt-10 relative">
           <img 
             src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e293b&color=3b82f6`} 
             alt={user.name}
             className="w-20 h-20 rounded-xl object-cover border-4 border-[#151b2b] bg-[#1e293b] shadow-lg shadow-black/40 group-hover:scale-105 transition-transform"
           />
           <div className="mt-4">
             <Link to={`/profile/${user._id}`}>
               <h3 className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors leading-tight tracking-wide">
                 {user.name}
               </h3>
             </Link>
             <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed h-[42px]">
               {user.bio || "Active Professional on SkillHub"}
             </p>
           </div>
         </div>
         
         <div className="px-5 mt-4 flex flex-wrap gap-2 pb-6">
           {user.skills?.slice(0, 3).map((skill, index) => (
             <span 
               key={index} 
               className="px-2.5 py-1 bg-[#1e293b] text-blue-300 border border-blue-500/20 text-[11px] font-semibold uppercase tracking-wider rounded-md shadow-sm"
             >
               {skill}
             </span>
           ))}
           {user.skills?.length > 3 && (
             <span className="px-2.5 py-1 bg-[#1e293b] text-slate-400 border border-slate-700 text-[11px] font-semibold uppercase tracking-wider rounded-md">
               +{user.skills.length - 3}
             </span>
           )}
         </div>
      </div>

      <div className="p-4 border-t border-[#1e293b] bg-[#0b0f19]/30">
        <Link 
          to={`/profile/${user._id}`}
          className="w-full flex justify-center items-center py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 rounded-lg text-sm font-bold tracking-wide transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
