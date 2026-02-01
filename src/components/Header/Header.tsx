import { Button } from 'primereact/button'
import { useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { PanelMenu } from 'primereact/panelmenu'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { PawPrint, Users } from 'lucide-react';

export function Header() {
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const logout = useAuthStore((s) => s.logout)

    const items = [
        {
            label: 'Tutores',
            icon: <Users  size={18} className='mr-1'/>,
            command: () => navigate('/tutors'),
            className: location.pathname === '/tutors' ? 'bg-gray-100' : ''
        },
        {
            label: 'Pets',
            icon: <PawPrint  size={18} className='mr-1'/>,
            command: () => navigate('/pets'),
            className: location.pathname === '/pets' ? 'bg-gray-100' : ''
        },
    ]

    return (
        <>
            <div className='flex justify-between items-center px-5 py-2'>
                <Button
                    icon="pi pi-bars"
                    text
                    onClick={() => setVisible(true)}
                    className="lg:invisible"
                />
                <div className="flex-1"></div>
                <Button
                    label="Sair"
                    icon="pi pi-sign-out"
                    text
                    onClick={logout}
                />
            </div>

            <Sidebar visible={visible} onHide={() => setVisible(false)} className="w-64">
                <PanelMenu model={items} />
            </Sidebar>
        </>
    )
}
