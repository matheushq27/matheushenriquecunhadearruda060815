import { Avatar } from "primereact/avatar"
import { useRef, useState } from "react"
import { Button } from "primereact/button"

interface AvatarEditProps {
    onImageUpload?: (file: File) => void
    currentImageUrl?: string
    size?: "large" | "xlarge" | "normal"
}

export default function AvatarEdit({ onImageUpload, currentImageUrl, size = "xlarge" }: AvatarEditProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreviewUrl(imageUrl)

            if (onImageUpload) {
                onImageUpload(file)
            }
        }
    }

    const handleRemoveImage = (event: React.MouseEvent) => {
        event.stopPropagation()
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="relative cursor-pointer" onClick={handleClick}>
                    <Avatar
                        shape="circle"
                        className="p-overlay-badge border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                        icon={previewUrl ? undefined : "pi pi-user"}
                        size={size}
                        image={previewUrl || undefined}
                    />

                    {!previewUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                            <i className="pi pi-camera text-white text-xl"></i>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            {previewUrl && (
                <div className="text-center">
                    <Button
                        icon="pi pi-times"
                        label="Remover Imagem"
                        onClick={handleRemoveImage}
                        aria-label="Remover imagem"
                        text
                        size="small"
                    />
                </div>
            )}
        </>
    )
}