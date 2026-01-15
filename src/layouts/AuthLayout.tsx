import { Outlet } from 'react-router-dom'
//import { Header } from '@/components/Header'
//import { Sidebar } from '@/components/Sidebar'

export function AuthLayout() {
  return (
    <div className="flex h-screen">
     {/*  <Sidebar /> */}

      <div className="flex flex-col flex-1">
    {/*     <Header /> */}

        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
