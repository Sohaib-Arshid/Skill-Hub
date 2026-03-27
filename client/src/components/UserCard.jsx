import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const UserCard = ({ user }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 relative pb-14">
      <div className="h-16 bg-gradient-to-r from-blue-100 to-[#dce6f1]"></div>
      
      <div className="px-4 -mt-10">
        <img 
          src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffffff&color=0a66c2`} 
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white bg-white"
        />
        <div className="mt-2">
          <Link to={`/profile/${user._id}`}>
            <h3 className="text-lg font-semibold text-slate-900 hover:text-[#0a66c2] hover:underline transition-colors leading-tight">
              {user.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-2 mt-1 min-h-[40px] leading-snug">
            {user.bio || "Member at SkillHub"}
          </p>
        </div>
      </div>
      
      <div className="px-4 mt-3 flex flex-wrap gap-1.5 pb-4">
        {user.skills?.slice(0, 3).map((skill, index) => (
          <span 
            key={index} 
            className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
        {user.skills?.length > 3 && (
          <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
            +{user.skills.length - 3}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50">
        <Link 
          to={`/profile/${user._id}`}
          className="w-full flex justify-center items-center py-1.5 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2]/10 rounded-full text-sm font-semibold transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
