import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Heart, Bookmark } from "lucide-react";
import axios from "axios";
import Panels from "./panels";

function Sidebar() {
  const navigate = useNavigate();
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/profile_data`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setImage(res.data.imgurl);
    };
    fetchImage();
  }, []);

  const navItems = [
    { icon: Home, label: "Home", action: () => navigate("/feed") },
    { icon: Search, label: "Search", action: () => { setShowSearchPanel(true); setShowNotifications(false); } },
    { icon: Heart, label: "Notifications", action: () => { setShowNotifications(true); setShowSearchPanel(false); } },
    { icon: Bookmark, label: "Saved", action: () => navigate("/saved") },
  ];

  return (
    <>
<div className="h-screen w-20 md:w-64 p-6 fixed top-0 left-0 flex flex-col justify-between bg-[#101010] border-r border-gray-800 z-50">
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-white hidden md:block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Satya World
            </h1>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg md:hidden mx-auto"></div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="group flex items-center gap-4 w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <item.icon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="hidden md:block font-medium relative z-10 transition-all duration-300">
                  {item.label}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}

            <button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-4 w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-gray-600 group-hover:border-white overflow-hidden transition-all duration-300">
                  <img
                    src={image || "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
              <span className="hidden md:block font-medium relative z-10">Profile</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

         
<div className="pt-4 border-t border-gray-800 mt-4">
  <button
    onClick={()=>{navigate('/login')}}
    className="group flex items-center gap-4 w-full p-3 rounded-xl text-red-500 hover:text-white hover:bg-red-700/30 transition-all duration-300 relative overflow-hidden"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 md:w-6 md:h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
    </svg>
    <span className="hidden md:block font-medium relative z-10">Logout</span>
    <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </button>
</div>



          </nav>
        </div>
      </div>

      {/* Panels for Search and Notification */}
      <Panels
        showSearchPanel={showSearchPanel}
        setShowSearchPanel={setShowSearchPanel}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
    </>
  );
}

export default Sidebar;
