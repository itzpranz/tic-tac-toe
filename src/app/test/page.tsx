'use client';

import Board from "@/components/board";
import Button from "@/components/button";
import { Symbol } from "@/lib/service";
import { useState } from "react";

export default function Test() {
    const [size, setSize] = useState(3);
    const [board, setBoard] = useState([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ] as Symbol[][]);
  
    const [turn, setTurn] = useState('X' as Symbol);

    const playGame = (xIndex: number, yIndex: number) => {
      console.log('playGame', xIndex, yIndex);
      board[xIndex][yIndex] = turn;
      setBoard(board);
      setTurn(turn === 'X' ? 'O' : 'X');
    }


    
    const newBoard = () => {
      console.log('newBoard',size);
      let newBoard = Array(size).fill(null).map(() => Array(size).fill(null));
      setBoard(newBoard);
      setSize(size + 1);
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="text-3xl md:text-5xl leading-loose mb-4">
          <span className="underline decoration-blue-500 decoration-4 font-semibold">Pranjal</span>
          <span className="text-xl md:text-2xl ml-2 mr-2">vs</span>
          <span className="underline decoration-green-500 decoration-4 font-semibold">Swapnil</span></div>
        <div className="text-4xl md:text-6xl mb-8 text-red-500 font-bold animate-bounce drop-shadow-md md:drop-shadow-xl"> Pranjal wins </div>
        <Board onCellClick={playGame} board={board} />
        <div className="grid grid-cols-2 gap-4 text-center mt-8">
        <Button onClick={() => newBoard()}>Restart</Button>
        <Button onClick={() => window.location.href = '/'}>New Game</Button>
        </div>
      </main>
    )
}