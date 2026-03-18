import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/me")  // backend endpoint
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
      await API.post("/auth/logout")  // backend logout if needed
      logout()                        // AuthContext update
      navigate("/login")               // redirect
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <p><strong>Name:</strong> {profile?.name}</p>
      <p><strong>Email:</strong> {profile?.email}</p>
      <p><strong>Bio:</strong> {profile?.bio || "No bio provided"}</p>
      <p><strong>Skills:</strong> {profile?.skills?.length ? profile.skills.join(", ") : "No skills listed"}</p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard