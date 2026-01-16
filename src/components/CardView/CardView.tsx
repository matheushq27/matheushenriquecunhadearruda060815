import { Avatar } from "primereact/avatar"
import type { ReactNode } from "react"
export function CardView({ avatar, title, subtitle, content }: { avatar: string, title: string, subtitle: string, content?: ReactNode }) {
    return (
        <div className="p-4 bg-white shadow-sm rounded-md">
            <div className="flex gap-5">
                <Avatar image={avatar} size="large" shape="circle" />
                <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
            </div>
            {content && (
                <div className="mt-4">{content}</div>
            )}
        </div>
    )
}