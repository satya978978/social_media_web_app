import { Outlet } from 'react-router-dom'
import Sidebar from './Header'

function Layout() {
  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <div className="relative z-10 ml-20 md:ml-64 w-full">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout