import { ReactNode } from "react";

interface SliderProps {
    value: number;
    min: number;
    max: number;
    onChange: (event: any) => void;
    children?: ReactNode;
}

export default function Slider({value, min, max, children, onChange}: SliderProps) {
  return (
    <div className="w-full max-w-xs mx-auto p-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="slider-thumb appearance-none w-full h-4 rounded-lg bg-slate-50 outline-none focus:bg-blue-200 shadow"
      />
      {children ?<output className="block text-center mt-2 font-bold text-2xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">{children}</output>: null}
    </div>
  );
}