import { ReactNode } from "react";

interface ButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    children: ReactNode;
}

export default function Button({
    onClick,
    isLoading,
    children
}: ButtonProps) {
    return <button onClick={onClick} className="rounded-lg text-base shadow hover:shadow-lg px-5 py-4 font-bold uppercase bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white transition-colors">
        <div className="flex items-center justify-center">
        { isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-3 fill-current" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/></svg>
        ) : null }
        { children }
        </div>

    </button>
}