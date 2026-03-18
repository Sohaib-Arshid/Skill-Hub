import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/User_Register"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App