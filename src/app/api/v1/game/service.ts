import { SessionNotFound, SessionIsFull, PlayerNotFound, NotYourTurn, PositionAlreadyPlayed } from "./errors";

export type Symbol = 'X' | 'O' | null;

export interface Player {
    id: string;
    name: string;
    symbol: Symbol;
}

export type Session = {
    id: string;
    players: Map<string, Player>;
    started: boolean;
    finished: boolean;
    winner: string | null;
    turn: string | null;
    board: Symbol[][];
    size: number;
    xRowCount: number[];
    oRowCount: number[];
    xColCount: number[];
    oColCount: number[];
    xDiagCount: number;
    oDiagCount: number;
    xAntiDiagCount: number;
    oAntiDiagCount: number;
}

const sessions: Map<string, Session> = new Map();

export {sessions};

export function startNewGameSession() {
    const id = Math.random().toString(36).substring(2, 6);
    sessions.set(id, {
        id,
        players: new Map(),
        started: false,
        finished: false,
        winner: null,
        turn: 'X',
        board: [
        [null, null, null],
        [null, null, null],
        [null, null, null]
        ],
        size: 3,
        xRowCount: [0, 0, 0],
        oRowCount: [0, 0, 0],
        xColCount: [0, 0, 0],
        oColCount: [0, 0, 0],
        xDiagCount: 0,
        oDiagCount: 0,
        xAntiDiagCount: 0,
        oAntiDiagCount: 0
    });
    return sessions.get(id);
}

export function joinGameSession(sessionId: string, name: string) {
    const session = sessions.get(sessionId);

    if (!session) throw SessionNotFound;

    const id = Math.random().toString(36).substring(2, 9);

    if (session.players.size >= 2) throw SessionIsFull;
    
    const symbol = session.players.size === 0 ? 'X' : 'O';
    const player: Player = {id, name, symbol};
    session.players.set(id, player);
    
    if (session.players.size == 2) {
        session.started = true;
    }
    
    return {player, session};
}

export function play(sessionId: string, playerId: string, x: number, y: number) {
    const session = sessions.get(sessionId);
    if (!session) throw SessionNotFound;
    
    const player = session.players.get(playerId);
    if (!player) throw PlayerNotFound;
    
    if (session.turn != player.symbol) throw NotYourTurn;
    
    if (session.board[x][y] != null)  throw PositionAlreadyPlayed;

    session.board[x][y] = player.symbol;
    session.turn = player.symbol === 'X' ? 'O' : 'X';

    if (player.symbol === 'X') {
        session.xRowCount[x]++;
        session.xColCount[y]++;
        if (x === y) session.xDiagCount++;
        if (x + y === session.size - 1) session.xAntiDiagCount++;
    } else {
        session.oRowCount[x]++;
        session.oColCount[y]++;
        if (x === y) session.oDiagCount++;
        if (x + y === session.size - 1) session.oAntiDiagCount++;
    }

    if (session.xRowCount[x] === session.size || session.xColCount[y] === session.size || session.xDiagCount === session.size || session.xAntiDiagCount === session.size) {
        session.finished = true;
        session.winner = 'X';
    } else if (session.oRowCount[x] === session.size || session.oColCount[y] === session.size || session.oDiagCount === session.size || session.oAntiDiagCount === session.size) {
        session.finished = true;
        session.winner = 'O';
    } else if (session.board.every(row => row.every(cell => cell !== null))) {
        session.finished = true;
    }
    
    return session;
}

export function get(sessionId: string) {
    const session = sessions.get(sessionId);

    if (!session) throw SessionNotFound;
    
    return session;
}