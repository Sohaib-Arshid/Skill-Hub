import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import Search from "./Search" // <--- Import your old component here

const Dashboard = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me")
        setProfile(res.data.user)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout") 
      logout()
      navigate("/login")               
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      {/* Profile Info */}
      <div className="bg-white shadow rounded p-6 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600"><strong>Name:</strong> {profile?.name}</p>
          <p className="text-gray-600"><strong>Bio:</strong> {profile?.bio || "N/A"}</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded h-fit">
          Logout
        </button>
      </div>

      {/* Render the Search Component here */}
      <Search /> 
    </div>
  )
}

export default Dashboard