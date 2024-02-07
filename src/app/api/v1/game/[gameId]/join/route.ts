import { joinGameSession } from "@/lib/service";

interface PlayRequest {
    name: string;
    isComputer: boolean
} 

export async function POST(req: Request, {params}: {params: {gameId: string}}) {
    const reqBody = await req.json();
    const {name, isComputer} = reqBody as PlayRequest;

    try {
      const session = joinGameSession(params.gameId, name, isComputer);

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