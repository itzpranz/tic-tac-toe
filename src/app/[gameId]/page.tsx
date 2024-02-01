'use client';

import { useEffect, useState } from "react";
import { Session, Player } from "./../api/v1/game/service";

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
              setSession(session);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    };

    return (
        player.id && session ?
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="shadow-md p-4 mb-8"> Welcome {name} </div>
            { !session.started ? <div className="shadow-md p-4 mb-8"> Waiting for other players to join... </div> : session.turn === player.symbol ? <div className="shadow-md p-4 mb-8"> Your turn </div> : <div className="shadow-md p-4 mb-8"> Waiting for other players to play... </div>}
            { session.winner ? <div className="shadow-md p-4 mb-8"> {session.winner} wins! </div> : null }
            { session.finished && !session.winner ? <div className="shadow-md p-4 mb-8"> Draw! </div> : null}
            <div className="shadow-md p-4 bg-slate-50">
                <div className="grid grid-cols-3 gap-2 bg-slate-900">
                    {session.board.map((value, xIndex) => {
                        return value.map((value, yIndex) => {
                            return <button disabled={!session.started || value != null} onClick={() => play(xIndex, yIndex)} key={`${xIndex}-${yIndex}`} className="bg-slate-50 h-16 w-16 p-2 flex flex-col items-center justify-center">
                                <div className=" text-black font-medium text-4xl">{value}</div>
                            </button>
                        })
                    })}
                </div>
            </div>
        </main>
        :
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="shadow-md p-4 bg-slate-50 flex justify-between">
                <input value={name} onChange={handleChange} className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm text-black focus:outline-none mr-4" placeholder="Enter your name"/>
                <button onClick={join} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Join Game
                </button>
            </div>
        </main>
    );
}