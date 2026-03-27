import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../services/api"

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true)
                const response = await API.get(`/user/${id}`)
                setProfile(response.data.data)
                setError("")
            } catch (err) {
                setError("User profile load nahi ho saki.")
                console.error("API Error:", err)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchProfile()
    }, [id])

    // Loading State
    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )

    // Error State
    if (error) return (
        <div className="text-center mt-20">
            <p className="text-red-500 text-xl font-semibold">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
                Retry
            </button>
        </div>
    )

    // Main UI
    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
            <div className="flex flex-col items-center">
                {/* Profile Picture Placeholder */}
                <div className="w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-6">
                    {profile?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{profile?.name || "Anonymous User"}</h1>
                <p className="text-gray-500 text-lg mb-6">{profile?.email}</p>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    {/* Bio Section */}
                    <div className="bg-gray-50 p-5 rounded-xl">
                        <h2 className="text-lg font-bold text-gray-700 mb-2 border-b pb-1">About Me</h2>
                        <p className="text-gray-600 italic">
                            {profile?.bio || "Is user ne abhi koi bio share nahi kiya."}
                        </p>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-gray-50 p-5 rounded-xl">
                        <h2 className="text-lg font-bold text-gray-700 mb-2 border-b pb-1">Skills & Expertise</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {profile?.skills && profile.skills.length > 0 ? (
                                profile.skills.map((skill, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md uppercase tracking-wider"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm italic">No skills added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer/Action Buttons */}
                <div className="mt-10 flex gap-4">
                    <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition shadow-md">
                        Message
                    </button>
                    <button className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
                        Connect
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile