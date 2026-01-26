import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'primereact/menu';
import Logo from '@/assets/logo.svg'
import { PawPrint, Users } from 'lucide-react';

export function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const items = [
        {
            template: () => {
                return (
                    <span className="inline-flex align-items-center gap-1 px-2 py-2">
                        <img src={Logo} alt="logo" className="w-10 h-10" />
                        <span className="font-medium text-xl font-semibold">
                            TUTOR<span className="text-primary">PET</span>
                        </span>
                    </span>
                );
            }
        },
        {
            separator: true
        },
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
        }
    ]

    return (
        <aside className="card flex justify-content-center rounded-none hidden lg:block" >
            <Menu model={items} className="w-full md:w-15rem !rounded-none" />
        </aside>
    )
}
