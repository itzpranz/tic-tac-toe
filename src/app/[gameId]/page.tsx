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

        const intervalId = setInterval(fetchData, 2000);
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
          setSession(session);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const invite = async () => {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      alert('Link copied to clipboard, share with your friend to play together.');
    };

    const highlightCol = (session: Session) => {
      if (!session.finished) {
        return -1;
      }

      if (session.winner === 'X') {
        return session.xColCount.indexOf(session.size);
      }

      if (session.winner === 'O') {
        return session.oColCount.indexOf(session.size);
      }
      return -1
    };

    const highlightRow = (session: Session) => {
      if (!session.finished) {
        return -1;
      }

      if (session.winner === 'X') {
        return session.xRowCount.indexOf(session.size);
      }

      if (session.winner === 'O') {
        return session.oRowCount.indexOf(session.size);
      }
      return -1
    }

    return (
        player.id && session ?
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="text-3xl md:text-5xl leading-loose mb-4 md:flex items-center">
              <div className="flex items-center justify-center">
                <div className="underline decoration-blue-500 decoration-4 font-semibold">{session.players['0']?.name || '???'}</div>
                { session.players['0']?.wins || session.players['1']?.wins ? <div className="bg-blue-500 font-bold rounded-full ml-4 text-white text-lg md:text-2xl w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">{session.players['0'].wins}</div> : null }
              </div>
              <div className="text-xl text-center md:text-2xl mx-4">vs</div>
              <div className="flex items-center justify-center">
                <div className="underline decoration-green-500 decoration-4 font-semibold">{session.players['1']?.name || '???'}</div>
                { session.players['0']?.wins || session.players['1']?.wins ? <div className="bg-green-500 font-bold rounded-full ml-4 text-white text-lg md:text-2xl w-8 h-8 md:w-12 md:h-12 flex items-center justify-center">{session.players['1'].wins}</div> : null }
              </div>
            </div>
            { !session.players['1'] ? <Button onClick={invite}>Invite your friend to Play</Button> : null }
            <div className="p-4 italic">
              {
                !session.finished ?
                (!session.started ? ' Waiting for other players to join...'
                : session.turn === player.symbol ? 'Your turn' : 'Waiting for other player to play...')
                : null
              } </div>
              { session.finished ? <div className={`text-4xl md:text-6xl mb-8 ${session.winner === 'X' ? 'text-blue-500' : 'text-green-500'} font-bold animate-bounce`}> { session.winner ? `${session.winner} wins` : 'Its a Draw!!!'} </div> : null }
            <Board
              onCellClick={play}
              board={session.board}
              disabled={!session.started || session.turn !== player.symbol || session.finished}
              highlightCol={highlightCol(session)}
              highlightRow={highlightRow(session)}
              highlightDiagonal={session.finished && (session.xDiagCount === session.size || session.oDiagCount === session.size)}
              highlightAntiDiagonal={session.finished && (session.xAntiDiagCount === session.size || session.oAntiDiagCount === session.size)}
            />
            { session.finished ? <div className="grid grid-cols-2 gap-4 text-center mt-8">
              <Button onClick={restart}>Restart</Button>
              <Button onClick={() => window.location.href = '/'}>End Session</Button>
            </div> : null }
        </main>
        :
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <Card>
            <div className="flex flex-col md:flex-row justify-between">
                <input value={name} onChange={handleChange} className="border-2 border-gray-300 bg-white h-14 px-5 rounded-lg text-md text-black focus:outline-none md:mr-4 mb-2 md:mb-0" placeholder="Enter your name"/>
                <Button onClick={join}>Join Game</Button>
            </div>
          </Card>
        </main>
    );
}