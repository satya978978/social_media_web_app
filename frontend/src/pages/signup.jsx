import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, Sparkles, UserPlus } from 'lucide-react'

function Signup() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signup_data, Set_signup_data] = useState({
    username: "",
    email: "",
    password: ""
  })

  const submitform = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:3000/signup", signup_data, { withCredentials: true })
      
      if (response.data.message === "newuserok") {
        navigate("/feed")
      } else if (response.data.message === "notok") {
        alert("Email already exists")
      }
    } catch (error) {
      alert("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlechange = (e) => {
    Set_signup_data({
      ...signup_data,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#101010] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Satya World
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Join our community today</p>
          </div>

          <form onSubmit={submitform} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  value={signup_data.username}
                  onChange={handlechange}
                  type="text"
                  name="username"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={signup_data.email}
                  onChange={handlechange}
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signup_data.password}
                  onChange={handlechange}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a 
                href="/" 
                className="text-white font-medium hover:text-gray-300 transition-colors duration-200 relative group"
              >
                Sign in
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup