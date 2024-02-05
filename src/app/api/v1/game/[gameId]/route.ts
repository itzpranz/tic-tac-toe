import { get } from "../../../../../lib/service";

interface PlayRequest {
    gameId: string;
    playerId: string;
    x: number;
    y: number;
} 

export async function GET(req: Request, {params}: {params: {gameId: string}}) {
    try {
        const session = get(params.gameId);
        return new Response(JSON.stringify(session), {
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({
            error_code: e.errorCode,
            message: e.message,
        }), {
            status: e.httpStatusCode,
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
        });
    }
}