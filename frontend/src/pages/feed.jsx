import Header from '../components/Header'
import CreatePost from '../components/CreatePost'
import Post from '../components/Post'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setposts] = useState([])
  
  const fetchpost = () => {
    axios.post('http://localhost:3000/post_data', {}, { withCredentials: true })
      .then((res) => {
        setposts(res.data)
      })
  }

  useEffect(() => {
    fetchpost()
  }, [])

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
        <CreatePost refresh={fetchpost} />
        <div className="space-y-6">
          {posts.map(post => (
            <Post
              key={post._id}
              username={post.userid}
              caption={post.caption}
              time={post.date}
              media={post.images}
              dp={post.dp}
              postid={post._id}
              comments={post.comments}
              likes={post.likes}
              likedbyuser={post.likedByUser}
             savedbyuser={post.savedbyuser}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Feed