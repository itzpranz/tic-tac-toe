import { play } from "@/lib/service";

interface PlayRequest {
    gameId: string;
    playerId: string;
    x: number;
    y: number;
} 

export async function POST(req: Request, {params}: {params: {gameId: string}}) {
    const reqBody = await req.json();
    const {playerId, x, y} = reqBody as PlayRequest;

    try {
      const session = play(params.gameId, playerId, x, y);

      return new Response(JSON.stringify(session), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({
          error_code: e.error_code,
          message: e.message,
      }), {
          status: e.httpStatusCode,
          headers: {
              "content-type": "application/json;charset=UTF-8",
          },
      });
    }
}