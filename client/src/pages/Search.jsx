import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

const Search = () => {
  const [skill, setSkill] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!skill.trim()) return

    setLoading(true)
    setError("")
    try {
      const res = await API.get(`/search?skill=${skill}`)
      setResults(res.data)
    } catch (err) {
      setError("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-4">Find Others</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input 
          type="text"
          placeholder="Search skills..."
          className="border p-2 rounded flex-grow outline-none focus:ring-2 focus:ring-blue-500"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((resUser) => (
          <div 
            key={resUser._id} 
            className="border p-4 rounded bg-white shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/profile/${resUser._id}`)}
          >
            <h3 className="font-bold">{resUser.name}</h3>
            <p className="text-sm text-gray-500">{resUser.skills?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search