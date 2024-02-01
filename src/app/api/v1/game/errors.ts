export class CustomError extends Error {
    code: string;
    httpStatusCode: number;
    constructor(httpStatusCode: number, code: string, message: string) {
        super(message);
        this.code = code;
        this.httpStatusCode = httpStatusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const SessionNotFound = new CustomError(404, 'SESSION_NOT_FOUND', 'Session not found');
export const SessionIsFull = new CustomError(400, 'SESSION_IS_FULL', 'Session is full');
export const PlayerNotFound = new CustomError(404, 'PLAYER_NOT_FOUND', 'Player not found');
export const NotYourTurn = new CustomError(400, 'INVALID_MOVE', 'Not your turn');
export const PositionAlreadyPlayed = new CustomError(400, 'INVALID_MOVE', 'Position already played');
