import { tcg } from "@/lib/services/tcgApi";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const result = await tcg.updatePassword(username, password);

  const response = new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
}
