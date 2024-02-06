import { Symbol } from "@/lib/service";
import Card from "./card";

interface BoardProps {
    onCellClick: (xIndex: number, yIndex: number) => void;
    board: Symbol[][];
    disabled?: boolean;
    highlightRow?: number;
    highlightCol?: number;
    highlightDiagonal?: boolean;
    highlightAntiDiagonal?: boolean;
}

const gapClass: {[size: number]: string} = {
    3: "gap-1",
    4: "gap-1",
    5: "gap-1",
    6: "gap-1",
    7: "gap-1",
    8: "gap-1",
    9: "gap-1",
    10: "gap-0.5",
    11: "gap-0.5",
    12: "gap-0.5",
}
const gridColsClass: {[size: number]: string} = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
    9: "grid-cols-9",
    10: "grid-cols-10",
    11: "grid-cols-11",
    12: "grid-cols-12",
}

const cellSizeClass: {[size: number]: string} = {
    3: "h-12 w-12 md:h-16 md:w-16",
    4: "h-12 w-12 md:h-16 md:w-16",
    5: "h-12 w-12 md:h-16 md:w-16",
    6: "h-10 w-10 md:h-16 md:w-16",
    7: "h-10 w-10 md:h-16 md:w-16",
    8: "h-8 w-8 md:h-14 md:w-14",
    9: "h-8 w-8 md:h-14 md:w-14",
    10: "h-6 w-6 md:h-12 md:w-12",
    11: "h-6 w-6 md:h-12 md:w-12",
    12: "h-6 w-6 md:h-12 md:w-12",
}


export default function Board({onCellClick, board, disabled, highlightRow, highlightCol, highlightDiagonal, highlightAntiDiagonal}: BoardProps) {
    const size = board.length;
    return (
        <Card>
            <div className={`grid ${gridColsClass[size]} ${gapClass[size]} bg-slate-900`}>
                {board.map((value, xIndex) => {
                    return value.map((value, yIndex) => {
                        return <button disabled={disabled || value != null}
                        onClick={() => onCellClick(xIndex, yIndex)} key={`${xIndex}-${yIndex}`}
                        className={`bg-slate-50 ${cellSizeClass[size]} p-2 md:p-4 flex flex-col items-center justify-center ${ highlightCol === yIndex || highlightRow === xIndex || (highlightDiagonal && xIndex === yIndex) || (highlightAntiDiagonal && (xIndex + yIndex === size-1)) ? "bg-yellow-400" : "bg-inherit"}`}>
                            <div className={value && value === 'X' ? "text-blue-500" : "text-green-500"}>
                                {value && value === 'X' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height="100%" width="100%" fill="none"><path fill="currentColor" d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg> : null}
                                {value && value === 'O' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="100%" width="100%" fill="none"><path fill="currentColor" d="M224 96a160 160 0 1 0 0 320 160 160 0 1 0 0-320zM448 256A224 224 0 1 1 0 256a224 224 0 1 1 448 0z"/></svg> : null}
                            </div>
                        </button>
                    })
                })}
            </div>
        </Card>
    )
}