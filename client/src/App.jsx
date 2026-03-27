import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/User_Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/User_Profile"
import Search from "./pages/Search"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/Search" element={<Search />} />
    </Routes>
  )
}

export default App