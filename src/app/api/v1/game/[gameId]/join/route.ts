import { joinGameSession } from "../../service";

interface PlayRequest {
    gameId: string;
    name: string;
} 

export async function POST(req: Request, {params}: {params: {gameId: string}}) {
    const reqBody = await req.json();
    const {name} = reqBody as PlayRequest;

    try {
      const session = joinGameSession(params.gameId, name);

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