import { startNewGameSession } from "../service";

export async function POST() {
  let session = startNewGameSession();
  
  return new Response(JSON.stringify(session), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}