import { Avatar } from "primereact/avatar"
import { Button } from "primereact/button"
import type { ReactNode } from "react"
import { PawPrint } from 'lucide-react';

interface CardViewProps {
    avatar: string
    title: string
    subtitle: string
    content?: ReactNode
    onEdit?: () => void
    onDelete?: () => void
    onPetLink?: () => void
    loadingDelete?: boolean
    showPetLinkButton?: boolean
}

export function CardView({ 
    avatar, 
    title, 
    subtitle, 
    content, 
    onEdit, 
    onDelete, 
    onPetLink, 
    loadingDelete, 
    showPetLinkButton = false 
}: CardViewProps) {

    const handleEdit = () => {
        onEdit?.()
    }

    const handleDelete = () => {
        onDelete?.()
    }

    const handlePetLink = () => {
        onPetLink?.()
    }

    return (
        <div className="bg-white shadow-sm rounded-md flex flex-col justify-between">
            <div className="p-4">
                <div className="flex gap-5">
                    <Avatar icon="pi pi-user" image={avatar} size="large" shape="circle" />
                    <div className="min-w-0">
                        <h2 className="font-bold break-words">{title}</h2>
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                {content && (
                    <div className="mt-4">{content}</div>
                )}
            </div>
            <div className="flex justify-end gap-2 p-2">
                {showPetLinkButton && (
                    <Button onClick={handlePetLink} tooltip="Vincular Pet" severity="info" size="small" text disabled={loadingDelete} >
                        <PawPrint size={18} />
                    </Button>
                )}

                <Button onClick={handleEdit} icon="pi pi-pencil" tooltip="Editar" className="w-full" severity="info" size="small" text disabled={loadingDelete} />
                <Button onClick={handleDelete} icon="pi pi-trash" tooltip="Excluir" className="w-full" severity="danger" size="small" text loading={loadingDelete} />
            </div>
        </div>
    )
}