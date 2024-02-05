'use client'
import Button from "@/components/button";
import Slider from "@/components/slider";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { useState } from "react";

export default function Home() {
  const [size, setSize] = useState(3);

  const router = useRouter()
  
  const startGame = async () => {
    try {
      const response = await fetch('/api/v1/game/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          size: size
        })
      });
      if (response.ok) {
        const jsonData = await response.json();
        router.push(`/${jsonData.id}`);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 dark:text-gray-100 p-8">Welcome to</h1>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/tic-tac-toe.svg"
            alt="Tic Tac Toe Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-italic text-center text-gray-900 dark:text-gray-100 p-8">Tic Tac Toe</h1>
      </div>
     
      <div className="flex flex-col min-w-full justify-center text-center">
        <Slider value={size} min={3} max={12} onChange={(event) => {setSize(event.target.value)}}>{`${size} x ${size}`}</Slider>
        <div>
        <Button onClick={startGame}>Start Game</Button>
        </div>
        
      </div>
    </main>
  );
}
