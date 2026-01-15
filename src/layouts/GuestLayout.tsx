import { Outlet } from 'react-router-dom'

export function GuestLayout() {
    return (
        <div className='surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden'>
            <div className="flex flex-col items-center justify-center">
                <Outlet />
            </div>
        </div>
    )
}
