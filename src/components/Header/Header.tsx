import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { Sidebar } from 'primereact/sidebar'
import { PanelMenu } from 'primereact/panelmenu'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function Header() {
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()
    const logout = useAuthStore((s) => s.logout)

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/'),
        },
        {
            label: 'Usuários',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'Listar',
                    icon: 'pi pi-list',
                    command: () => navigate('/users'),
                },
            ],
        },
    ]

    return (
        <>
            <div className='flex justify-between items-center px-5 py-2'>
                <Button
                    icon="pi pi-bars"
                    text
                    onClick={() => setVisible(true)}
                />
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
