import { SessionNotFound, SessionIsFull, PlayerNotFound, NotYourTurn, PositionAlreadyPlayed } from "./errors";

export type Symbol = 'X' | 'O' | null;

export interface Player {
    id: string;
    name: string;
    symbol: Symbol;
    wins: number;
}

export type Session = {
    id: string;
    playAgainstComputer?: boolean;
    players: {[id: string]: Player};
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

export function startNewGameSession(size: number) {
    const id = Math.random().toString(36).substring(2, 8);

    sessions.set(id, {
        id,
        players: {},
        started: false,
        finished: false,
        winner: null,
        turn: 'X',
        board: Array(size).fill(null).map(() => Array(size).fill(null)),
        size,
        xRowCount: Array(size).fill(0),
        oRowCount: Array(size).fill(0),
        xColCount: Array(size).fill(0),
        oColCount: Array(size).fill(0),
        xDiagCount: 0,
        oDiagCount: 0,
        xAntiDiagCount: 0,
        oAntiDiagCount: 0
    });
    return sessions.get(id);
}

export function restartGame(id: string) {
    const session = sessions.get(id);

    if (!session) throw SessionNotFound;
    const size = session.size;
    session.started = true,
    session.finished = false,
    session.winner = null,
    session.board = Array(session.size).fill(null).map(() => Array(session.size).fill(null));
    session.xRowCount = Array(size).fill(0),
    session.oRowCount = Array(size).fill(0),
    session.xColCount = Array(size).fill(0),
    session.oColCount = Array(size).fill(0),
    session.xDiagCount = 0,
    session.oDiagCount = 0,
    session.xAntiDiagCount = 0,
    session.oAntiDiagCount = 0
    
    sessions.set(id, session);
    if (session.playAgainstComputer && session.turn === 'O') {
        playComputerTurn(id);
    }
    return sessions.get(id);
}

export function joinGameSession(sessionId: string, name: string, isComputer?: boolean) {
    const session = sessions.get(sessionId);

    if (!session) throw SessionNotFound;

    let numberOfPlayers = Object.keys(session.players).length;

    const id = numberOfPlayers.toString();

    if (numberOfPlayers >= 2) throw SessionIsFull;

    if (isComputer) {
        name = 'Computer'
        session.playAgainstComputer = true;
        sessions.set(sessionId, session);
    }
    
    const symbol = numberOfPlayers === 0 ? 'X' : 'O';
    const player: Player = {id, name, symbol, wins: 0};
    session.players[id] = player;
    
    if (session.players['0'] && session.players['1']) {
        session.started = true;
    }
    
    return {player, session};
}

export function play(sessionId: string, playerId: string, x: number, y: number) {
    const session = sessions.get(sessionId);
    if (!session) throw SessionNotFound;
    
    const player = session.players[playerId];
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
        session.players['0'].wins++;
    } else if (session.oRowCount[x] === session.size || session.oColCount[y] === session.size || session.oDiagCount === session.size || session.oAntiDiagCount === session.size) {
        session.finished = true;
        session.winner = 'O';
        session.players['1'].wins++;
    } else if (session.board.every(row => row.every(cell => cell !== null))) {
        session.finished = true;
    }

    if (session.playAgainstComputer && session.turn === 'O' && !session.finished) {
        setTimeout(() => playComputerTurn(sessionId), 1000);
    }
    
    return session;
}

function playComputerTurn(sessionId: string) {
    const session = sessions.get(sessionId);
    if (!session) throw SessionNotFound;

    const bestMove = findBestMove(session.board);

    play(sessionId, '1', bestMove.row, bestMove.col);
}

function isBoardFull(board: Symbol[][]) {
    return board.every(row => row.every(cell => cell !== null));
}

function isWinner(board: Symbol[][], player: Symbol) {
    const size = board.length;
    
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === player) || board.every(row => row[i] === player)) {
            return true;
        }
    }
    
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < size; i++) {
        if (board[i][i] !== player) {
            diag1 = false;
        }
        if (board[i][size - 1 - i] !== player) {
            diag2 = false;
        }
    }
    return diag1 || diag2;
}

function evaluate(board: Symbol[][]) {
    if (isWinner(board, 'O')) {
        return 10;
    } else if (isWinner(board, 'X')) {
        return -10;
    } else {
        return 0;
    }
}

function minimax(board: Symbol[][], depth: number, isMaximizing: boolean) {
    const score = evaluate(board);

    if (score === 10 || score === -10 || isBoardFull(board) || depth === 0) {
        return score;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = 'O';
                    bestScore = Math.max(bestScore, minimax(board, depth - 1, false));
                    board[i][j] = null;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j] === null) {
                    board[i][j] = 'X';
                    bestScore = Math.min(bestScore, minimax(board, depth - 1, true));
                    board[i][j] = null;
                }
            }
        }
        return bestScore;
    }
}

function findBestMove(board: Symbol[][]) {
    let bestMove = { row: -1, col: -1 };
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === null) {
                board[i][j] = 'O';
                let score = minimax(board, 5, false);
                board[i][j] = null;
                if (score > bestScore) {
                    bestScore = score;
                    bestMove.row = i;
                    bestMove.col = j;
                }
            }
        }
    }

    return bestMove;
}

export function get(sessionId: string) {
    const session = sessions.get(sessionId);

    if (!session) throw SessionNotFound;
    
    return session;
}