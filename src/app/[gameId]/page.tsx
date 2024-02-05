'use client';

import { useEffect, useState } from "react";
import { Session, Player, Symbol } from "@/lib/service";
import Board from "@/components/board";
import Card from "@/components/card";
import Button from "@/components/button";

export default function Game({
    params,
} : {
    params: { gameId: string }
}) {
    const [player, setPlayer] = useState({} as Player);
    const [name, setName] = useState();
    const [session, setSession] = useState({} as Session);

    useEffect(() => {
        // Define a function to fetch data from the API
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/v1/game/${params.gameId}`);
            if (response.ok) {
              const jsonData = await response.json();
              setSession(jsonData);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        // Set up a timer to fetch data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);
    
        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, [params.gameId]);

    const handleChange = (event: any) => {
        setName(event.target.value);
    };

    const join = async () => {
        try {
            const response = await fetch(`/api/v1/game/${params.gameId}/join`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name })
            });
            if (response.ok) {
              const jsonData = await response.json();
              console.log('join', jsonData.session);
              setName(name);
              setPlayer(jsonData.player);
              setSession(jsonData.session);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    };

    const play = async (x: number, y: number) => {
        try {
            const response = await fetch(`/api/v1/game/${params.gameId}/play`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ playerId: player.id, x, y })
            });
            if (response.ok) {
              const session = await response.json();
              console.log('play', session);
              setSession(session);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    };

    const restart = async () => {
      try {
        const response = await fetch(`/api/v1/game/${params.gameId}/restart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        if (response.ok) {
          const session = await response.json();
          console.log('restart', session);
          setSession(session);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

      const shareUrl = () => {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          })
            .then(() => console.log('Shared successfully'))
            .catch((error) => console.error('Error sharing:', error));
        } else {
          console.log('Web Share API is not supported in this browser');
        }
      };
    

    return (
        player.id && session ?
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="text-3xl md:text-5xl leading-loose mb-4">
              <span className="underline decoration-blue-500 decoration-4 font-semibold">{session.players['0']?.name || '??'}</span>
              <span className="text-xl md:text-2xl ml-2 mr-2">vs</span>
              <span className="underline decoration-green-500 decoration-4 font-semibold">{session.players['1']?.name || '??'}</span></div>
            <div className="p-4 italic">
              {
                !session.finished ?
                (!session.started ? ' Waiting for other players to join...'
                : session.turn === player.symbol ? 'Your turn' : 'Waiting for other play to play...')
                : null
              } </div>
              { session.finished ? <div className={`text-4xl md:text-6xl mb-8 ${session.winner === 'X' ? 'text-blue-500' : 'text-green-500'} font-bold animate-bounce`}> { session.winner ? `${session.winner} wins` : 'Its a Draw!!!'} </div> : null }
            <Board onCellClick={play} board={session.board} disabled={!session.started || session.turn !== player.symbol || session.finished} />
            <div className="grid grid-cols-2 gap-4 text-center mt-8">
              <Button onClick={restart}>Restart</Button>
              <Button onClick={() => window.location.href = '/'}>New Game</Button>
            </div>
        </main>
        :
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <button onClick={shareUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Share URL
      </button>
          <Card>
            <div className="flex justify-between">
                <input value={name} onChange={handleChange} className="border-2 border-gray-300 bg-white h-14 px-5 rounded-lg text-md text-black focus:outline-none mr-4" placeholder="Enter your name"/>
                <Button onClick={join}>Join Game</Button>
            </div>
          </Card>
        </main>
    );
}