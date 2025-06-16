import { useState, useEffect } from "react";
import axios from "axios";
import Post from '../components/profile.post'
import { Camera, Edit3, Save, X, User, FileText } from 'lucide-react'

function Profile() {
  const [response, setresponse] = useState([])
  const [selected_img, setselected_img] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [userbio, setuserbio] = useState("")
  const [recevied_pp, setrecevied_pp] = useState("")
  const [recevied_username, setrecevied_username] = useState("")
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setselected_img(file)
    }
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      const form = new FormData()
      if (selected_img) {
        form.append("pp", selected_img)
      }
      form.append("bio", bio)
      form.append("username", username)

      await axios.post("http://localhost:3000/profile_data", form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setIsEditing(false);
      setrecevied_username(username)
      setuserbio(bio)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    axios.post("http://localhost:3000/profile_data", {}, { withCredentials: true })
      .then((res) => {
        setrecevied_username(res.data.username)
        setuserbio(res.data.bio)
        setrecevied_pp(res.data.imgurl)
        setUsername(res.data.username);
        setBio(res.data.bio);
        setImage(res.data.imgurl)
      })
  }, [])

  useEffect(() => {
    axios.post("http://localhost:3000/my_posts", {}, { withCredentials: true })
      .then((res) => {
        setresponse(res.data)
      })
  }, [])

  return (
    <div className="bg-[#0a0a0a] min-h-screen px-4 py-6 max-w-xl mx-auto space-y-6">
      <div className="bg-[#101010] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
        
        <div className="relative z-10">
  
          <div className="relative inline-block mb-6">
            <div className="relative">
              <img
                src={image || 'https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-gray-700 object-cover shadow-xl"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {isEditing && (
              <label className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 mb-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
                />
              </div>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 resize-none"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {recevied_username}
              </h2>
              <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto">
                {userbio || "No bio available"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setUsername(recevied_username)
                    setBio(userbio)
                    setImage(recevied_pp)
                    setselected_img(null)
                  }}
                  className="group bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 relative overflow-hidden"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
<div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
  <div className="absolute -left-full top-0 w-full h-full bg-white/10 transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out"></div>
</div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-6">
        {response.length > 0 ? (
          response.map((res, index) => (
            <Post
              key={index}
              username={res.username}
              caption={res.caption}
              media={res.link[0]}
              time={res.time}
              dp={image}
            />
          ))
        ) : (
          <div className="bg-[#101010] border border-gray-800 rounded-2xl p-12 text-center">
            <div className="text-gray-500 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
            <p className="text-gray-500">Share your first post to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;