import { startNewGameSession } from "@/lib/service";

interface StartRequest {
  size: string;
} 

export async function POST(req: Request) {
  const reqBody = await req.json();
  const { size } = reqBody as StartRequest;

  let session = startNewGameSession(parseInt(size));
  
  return new Response(JSON.stringify(session), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
}