import axios from "axios";
import { useState, useEffect } from "react";
import { Bookmark, Calendar, User, Sparkles } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)


function SavedPosts() {
 

  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await axios.post("http://localhost:3000/saved_posts", {}, { withCredentials: true });
        setSavedPosts(res.data);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading saved posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-6">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
              <Bookmark className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Saved Posts
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {savedPosts.length} saved for later
          </p>
        </div>
      </div>

      {savedPosts.length > 0 ? (
        <div className="max-w-6xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {savedPosts.map((post, index) => (
              <div
                key={index}
                className="break-inside-avoid bg-[#101010] border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm hover:border-gray-700 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <img
                        src={post.dp || "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"}
                        alt="user dp"
                        className="w-10 h-10 rounded-full border-2 border-gray-700 object-cover group-hover:border-gray-600 transition-colors duration-300"
                      />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{post.username}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">

                        <span>{dayjs(post.date).fromNow()}</span>
                      </div>
                    </div>
              

                    
                  </div>

                  {/* Caption */}
                  {post.caption && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.caption}
                    </p>
                  )}

                  {/* Media */}
                  <div className="space-y-3">
                    {post.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} className="relative group/media">
                        {media.content_type?.startsWith("video/") ? (
                          <video
                            src={media.data}
                            className="w-full rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300"
                            controls
                          />
                        ) : (
                          <img
                            src={media.data}
                            alt="saved media"
                            className="w-full rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300 object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-xl opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center">
          <div className="bg-[#101010] border border-gray-800 rounded-2xl p-12">
            <div className="text-gray-500 mb-6">
              <Bookmark className="w-20 h-20 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-3">No saved posts</h3>
            <p className="text-gray-500 leading-relaxed">
              Start saving posts you love by tapping the bookmark icon on any post.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedPosts;