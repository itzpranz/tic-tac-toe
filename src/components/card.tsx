import { ReactNode } from "react";

export default function Card({
    children
}: { children: ReactNode}) {
    return (
        <div className="shadow-lg p-2 md:p-4 bg-slate-50 rounded-md">
            { children }
        </div>
    )
}