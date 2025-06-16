
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

function Post({ username, caption, media, time, dp }) {
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

      {/* Post Caption */}
      {caption && (
        <p className="text-white text-base leading-relaxed mb-4">
          {caption}
        </p>
      )}

      {/* Post Media */}
      {media && (
        <div className="mb-4">
          {media.startsWith("data:video") ? (
            <video 
              controls 
              className="w-full rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
            >
              <source src={media} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={media}
              alt="Post media"
              className="w-full rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
            />
          )}
        </div>
      )}

     
    </div>
  )
}

export default Post
