import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import Feed from './pages/feed'
import Profile from './pages/profile'
import Login from './pages/login'
import Signup from './pages/signup'
import Saved from './pages/saved'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Navigate to="/login" />} />
        
       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
     
        <Route path="/" element={<Layout />}>
          <Route path="feed" element={<Feed />} />
          <Route path="profile" element={<Profile />} />
          <Route path="saved" element={<Saved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
