import axios from "axios";
import { useState } from "react";
import { Image, Video, Sparkles, Send, X } from "lucide-react";

function CreatePost({ refresh }) {
  const [posting, setPosting] = useState({ file: [], caption: "" });
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPosting({ ...posting, file: files });

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleCaptionChange = (e) => {
    setPosting({ ...posting, caption: e.target.value });
  };

  const aiCaption = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();
      form.append("ai_caption", posting.caption);
      posting.file.forEach((file) => {
        form.append("cap_image", file);
      });

      const response = await axios.post("http://localhost:3000/ai_caption", form, {
        withCredentials: true,
      });
      const aiCaption = response.data.caption;
      setPosting({ ...posting, caption: aiCaption });
    } catch (err) {
      console.error("AI Caption Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("caption", posting.caption);
      posting.file.forEach((file) => {
        form.append("image", file);
      });

      await axios.post("http://localhost:3000/creat_post", form, {
        withCredentials: true,
      });

      console.log("Post submitted successfully.");
      setPosting({ file: [], caption: "" });
      setPreviews([]);
      refresh();
    } catch (err) {
      console.error("Post Submit Error:", err);
    }
  };

  const removePreview = (indexToRemove) => {
    const newFiles = posting.file.filter((_, index) => index !== indexToRemove);
    const newPreviews = previews.filter((_, index) => index !== indexToRemove);
    setPosting({ ...posting, file: newFiles });
    setPreviews(newPreviews);
  };

  return (
    <div className="bg-[#101010] border border-gray-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <form onSubmit={submitPost} className="space-y-6">
        <div className="relative">
          <textarea
            onChange={handleCaptionChange}
            value={posting.caption}
            rows="4"
            placeholder="Share your thoughts..."
            className="w-full resize-none bg-gray-900/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 text-base leading-relaxed"
          />
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={posting.file.length === 0 ? undefined : aiCaption}
            disabled={loading || posting.file.length === 0}
            className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? "animate-pulse" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={18} className={loading ? "animate-spin" : "animate-pulse"} />
              <span>{loading ? "Generating..." : "AI Caption"}</span>
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
              <div className="absolute -left-full top-0 w-full h-full bg-white/10 transform -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out" />
            </div>
          </button>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((src, i) => (
              <div key={i} className="relative group">
                {posting.file[i].type.startsWith("video/") ? (
                  <video
                    src={src}
                    className="w-full h-32 object-cover rounded-xl border border-gray-700"
                    controls
                  />
                ) : (
                  <img
                    src={src}
                    className="w-full h-32 object-cover rounded-xl border border-gray-700"
                    alt="preview"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <div className="flex gap-6">
            <label className="group cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
              <div className="p-2 rounded-xl bg-gray-800 group-hover:bg-gray-700 transition-colors duration-200">
                <Image size={20} />
              </div>
              <span className="font-medium">Photo</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <label className="group cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
              <div className="p-2 rounded-xl bg-gray-800 group-hover:bg-gray-700 transition-colors duration-200">
                <Video size={20} />
              </div>
              <span className="font-medium">Video</span>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="group bg-white text-[#101010] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Send size={18} />
            <span>Share</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
