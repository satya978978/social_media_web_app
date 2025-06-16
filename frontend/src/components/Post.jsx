import { useEffect, useState } from "react"
import { Heart, Bookmark, MessageCircle, Send,  } from "lucide-react"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import axios from "axios"

function Post({ username, caption, media, time, dp, postid, comments, likes, likedbyuser,savedbyuser }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const [commentlist, setcommentlist] = useState(comments)
  const [likecount, setlikecount] = useState(likes)
  
  const sending_comment = async () => {
    if (comment.trim() == "") {
      console.log("empty")
      return
    }

    try{
      const response = await axios.post(`http://localhost:3000/post/${postid}`, { comment }, { withCredentials: true })  
      const newComment = response.data
      setComment("");
      setcommentlist(prev => [newComment, ...prev])
      console.log("okkokoko")
    }
    catch(err){
      console.log(err)
    }  
  }

  useEffect(() => {
    setSaved(savedbyuser)
    setLiked(likedbyuser);
  }, [likedbyuser]);

  const likeing = async () => {
    const response = await axios.post(`http://localhost:3000/like_data/${postid}`, {}, {withCredentials:true})
    setlikecount(response.data.likes)
    setLiked(response.data.liked)
  }

  const saving = async () => {
    const reponse = await axios.post(`http://localhost:3000/save_data/${postid}`, {}, {withCredentials:true})
    const saved_res = reponse.data.saved
    setSaved(saved_res)
  }

  return (
    <div className="bg-[#101010] border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-gray-700">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={dp || "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"}
              className="rounded-full w-12 h-12 border-2 border-gray-700 object-cover"
              alt="user"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <div>
            <p className="font-semibold text-white text-base">{username}</p>
            <p className="text-sm text-gray-400">{dayjs(time).fromNow()}</p>
          </div>
        </div>
        <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200">
         
        </button>
      </div>

      {caption && (
        <p className="text-white text-base leading-relaxed mb-4">
          {caption}
        </p>
      )}

      <div className="space-y-3 mb-4">
        {media.map((file, index) => {
          if (file.content_type.startsWith("image/")) {
            return (
              <img
                key={index}
                src={file.data}
                alt="Post media"
                className="w-full rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
              />
            );
          } else if (file.content_type.startsWith("video/")) {
            return (
              <video
                key={index}
                src={file.data}
                controls
                className="w-full rounded-xl border border-gray-700"
              />
            );
          } else {
            return null;
          }
        })}
      </div>

      <div className="flex items-center justify-between py-4 border-t border-gray-800">
        <div className="flex gap-6">
          <button
            onClick={likeing}
            className={`group flex items-center gap-2 transition-all duration-300 ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <div className="p-2 rounded-xl hover:bg-gray-800 transition-colors duration-200">
              <Heart 
                fill={liked ? "currentColor" : "none"} 
                size={22} 
                className="transition-transform duration-200 group-hover:scale-110" 
              />
            </div>
            <span className="text-sm font-medium">{likecount.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300"
          >
            <div className="p-2 rounded-xl hover:bg-gray-800 transition-colors duration-200">
              <MessageCircle 
                size={22} 
                className="transition-transform duration-200 group-hover:scale-110" 
              />
            </div>
            <span className="text-sm font-medium">{commentlist.length}</span>
          </button>
        </div>

        <button
          onClick={saving}
          className={`group transition-all duration-300 ${
            saved ? "text-yellow-500" : "text-gray-400 hover:text-yellow-400"
          }`}
        >
          <div className="p-2 rounded-xl hover:bg-gray-800 transition-colors duration-200">
            <Bookmark 
              fill={saved ? "currentColor" : "none"} 
              size={22} 
              className="transition-transform duration-200 group-hover:scale-110" 
            />
          </div>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 space-y-4 border-t border-gray-800 pt-6">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
            />
            <button
              onClick={sending_comment}
              className="p-3 bg-white text-[#101010] rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {commentlist.map((c, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-900/30 border border-gray-800 rounded-xl hover:bg-gray-800/30 transition-all duration-200"
              >
                <img
                  src={c.dp || "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"}
                  alt="user dp"
                  className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-white">{c.username}</p>
                    <p className="text-xs text-gray-500">{dayjs(c.date).fromNow()}</p>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Post