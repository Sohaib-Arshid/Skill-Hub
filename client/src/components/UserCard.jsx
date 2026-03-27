import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300 shadow-lg group">
      <div className="flex items-start space-x-4">
        <img 
          src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e293b&color=3b82f6`} 
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500/50 transition-colors"
        />
        <div className="flex-1">
          <Link to={`/profile/${user._id}`}>
            <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">{user.name}</h3>
          </Link>
          <p className="text-sm text-slate-400 line-clamp-2 mt-1 min-h-[40px]">
            {user.bio || "No bio provided"}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {user.skills?.slice(0, 4).map((skill, index) => (
          <span 
            key={index} 
            className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50"
          >
            {skill}
          </span>
        ))}
        {user.skills?.length > 4 && (
          <span className="px-2.5 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-full border border-slate-600/50">
            +{user.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-700/50 flex space-x-3">
        <Link 
          to={`/profile/${user._id}`}
          className="flex-1 text-center py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 rounded-lg text-sm font-medium transition-colors border border-blue-500/20"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
