'use client';

import { useEffect, useState } from "react";
import { Session, Player, Symbol } from "@/lib/service";
import Board from "@/components/board";
import Card from "@/components/card";
import Button from "@/components/button";
import Dialog from "@/components/dialog";

export default function Game({
    params,
} : {
    params: { gameId: string }
}) {
    const [player, setPlayer] = useState({} as Player);
    const [name, setName] = useState();
    const [session, setSession] = useState({} as Session);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const [isDialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
      setDialogOpen(true);
    };

    const closeDialog = () => {
      setDialogOpen(false);
    };

    useEffect(() => {
      const playerFromSessionStorage = sessionStorage.getItem('player_'+params.gameId);

      if (playerFromSessionStorage) {
        setPlayer(JSON.parse(playerFromSessionStorage));
      }

      const fetchData = async () => {
        try {
          const response = await fetch(`/api/v1/game/${params.gameId}`);
          if (response.ok) {
            const jsonData = await response.json();
            setSession(jsonData);
          } else if (response.status === 404) {
            goToHome();
          } else {
            console.error('Failed to fetch data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 2000);
      return () => clearInterval(intervalId);
    }, [params.gameId]);

    const handleChange = (event: any) => {
        setName(event.target.value);
    };

    const join = async () => {
      setIsJoining(true);
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
              sessionStorage.setItem('player_' + params.gameId, JSON.stringify(jsonData.player));
              setPlayer(jsonData.player);
              setSession(jsonData.session);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsJoining(false);
          }
    };

    const play = async (x: number, y: number) => {
      const board = session.board;
      board[x][y] = player.symbol;
      setSession({ ...session, board });
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
      setIsRestarting(true);
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
      } finally {
        setIsRestarting(false);
      }
    };

    const invite = async () => {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      openDialog();
    };

    const playWithComputer = async () => {
      setIsJoining(true);
      try {
          const response = await fetch(`/api/v1/game/${params.gameId}/join`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isComputer: true })
          });
          if (response.ok) {
            const jsonData = await response.json();
            setSession(jsonData.session);
          } else {
            console.error('Failed to fetch data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsJoining(false);
        }
    }

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
    const getWinner = (session: Session) => {
      if (session.winner === 'X') {
        return session.players['0']?.name + ' wins';
      }
      if (session.winner === 'O') {
        return session.players['1']?.name + ' wins';
      }
      return 'Its a Draw!!!';
    }
    const getWinnerClass = (session: Session) => {
      if (session.winner === 'X') {
        return 'text-blue-500';
      }
      if (session.winner === 'O') {
        return 'text-green-500';
      }
      return 'text-yellow-500';
    }

    const goToHome = () => {
      window.location.href = '/';
    }

    return (
        player.id && session.id ?
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
            { !session.players['1'] ?
            <div className="flex">
              <Button onClick={invite}>Invite your friend to Play</Button>
              <Button className="ml-4" isLoading={isJoining} onClick={playWithComputer}>Play against computer</Button> 
            </div> 
            : null }
            <div className="p-4 italic">
              {
                !session.finished ?
                (!session.started ? ' Waiting for other players to join...'
                : session.turn === player.symbol ? 'Your turn' : 'Waiting for other player to play...')
                : null
              } </div>
              { session.finished ? <div className={`text-4xl md:text-6xl mb-8 ${getWinnerClass(session)} font-bold animate-bounce`}> { getWinner(session) } </div> : null }
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
              <Button isLoading={isRestarting} onClick={restart}>Restart</Button>
              <Button onClick={goToHome}>End Session</Button>
            </div> : null }
            <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
              <h2 className="text-xl font-bold text-black mb-4">URL Copied</h2>
              <p className="text-black">The URL has been copied to the clipboard and can be shared with your friend to play.</p>
              <div className="flex justify-cente mt-4">
                <Button onClick={closeDialog}>Okay</Button>
              </div>
            </Dialog>
        </main>
        :
        !player.id ?
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
          <Card>
            <div className="flex flex-col md:flex-row justify-between">
                <input value={name} onChange={handleChange} className="border-2 border-gray-300 bg-white h-14 px-5 rounded-lg text-md text-black focus:outline-none md:mr-4 mb-2 md:mb-0" placeholder="Enter your name"/>
                <Button isLoading={isJoining} onClick={join}>Join Game</Button>
            </div>
          </Card>
        </main>
        : <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
          Loading...
        </main>
    );
}