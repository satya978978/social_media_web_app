import { useEffect, useState } from "react";
import axios from "axios";
import { X, Search } from "lucide-react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function Panels({ showSearchPanel, setShowSearchPanel, showNotifications, setShowNotifications }) {
  const [Search_input, setSearch_input] = useState("");
  const [searched_user, set_searched_user] = useState([]);
  const [notification_S, setnotification_S] = useState([]);

  useEffect(() => {
    if (Search_input.trim() === "") {
      set_searched_user([]);
      return;
    }

    const searchUsers = async () => {
      const res = await axios.post("http://localhost:3000/search_data", { Search_input }, { withCredentials: true });
      set_searched_user(res.data);
    };
    searchUsers();
  }, [Search_input]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.post("http://localhost:3000/ntfs_data", {}, { withCredentials: true });
      setnotification_S(res.data);
    };
    fetchNotifications();
  }, []);

  return (
    <>
      {showSearchPanel && (
  <div className="fixed top-0 left-20 md:left-64 w-80 h-screen bg-[#101010] border-r border-gray-800 p-6 z-50 transition-all duration-500 ease-out transform animate-slide-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Search</h2>
            <button onClick={() => setShowSearchPanel(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl">
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-4">
            <input
              onChange={(e) => setSearch_input(e.target.value)}
              type="text"
              placeholder="Search users..."
              className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {searched_user.map((user, idx) => (
            <div key={idx} className="space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar mb-1.5">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800 hover:bg-gray-800 transition">
                <img
                  src={user.dp || "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  alt="user"
                />
                <div>
                  <p className="text-white font-medium text-sm">{user.username}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNotifications && (
  <div className="fixed top-0 left-20 md:left-64 w-80 h-screen bg-[#101010] border-r border-gray-800 p-6 z-50 transition-all duration-500 ease-out transform animate-slide-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Notifications</h2>
            <button onClick={() => setShowNotifications(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {notification_S.map((ntf, idx) => (
              <div key={idx} className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:bg-gray-800/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={ntf.pp} alt="profile" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <span className="font-medium">{ntf.from}</span>
                    {ntf.like && ' liked your post'}
                    {ntf.comment && ' commented on your post'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{dayjs(ntf.date).fromNow()}</p>
                </div>
                <div className="w-14 h-14 rounded-md overflow-hidden">
                  <img
                    src={ntf.post || "https://static.vecteezy.com/system/resources/thumbnails/027/894/172/small/video-streaming-icon-design-illustration-vector.jpg"}
                    alt="post preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Panels;



