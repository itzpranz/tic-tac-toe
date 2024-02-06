import { ReactNode } from "react";

interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
}

export default function Button({
    onClick,
    children
}: ButtonProps) {
    return <button onClick={onClick} className="rounded-lg text-base shadow hover:shadow-lg px-5 py-4 font-bold uppercase bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-500 hover:to-blue-500 text-white transition-colors">{ children }</button>
}