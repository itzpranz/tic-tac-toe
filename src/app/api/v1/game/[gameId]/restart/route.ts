import { restartGame } from "@/lib/service";

export async function POST(req: Request, {params}: {params: {gameId: string}}) {

    try {
      const session = restartGame(params.gameId);

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