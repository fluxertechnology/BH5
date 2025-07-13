const activeGames = new Map();

export async function POST(req) {
  const body = await req.json();
  const { userId, gameId, action } = body;

  // console.log(activeGames);
  console.log("Received request:", body);
  console.log("Active games:", activeGames);

  if (userId === "guest") {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Guest user, no game session management needed",
      }),
      { status: 200 },
    );
  }

  if (!userId || !action) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Missing userId or action",
      }),
      { status: 400 },
    );
  }

  if (action === "start") {
    if (activeGames.has(userId)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already has an active game session",
        }),
        { status: 409 },
      );
    }

    activeGames.set(userId, gameId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (action === "end") {
    activeGames.delete(userId);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  if (action === "check") {
    const hasActiveGame = activeGames.has(userId);
    return new Response(
      JSON.stringify({
        success: true,
        hasActiveGame,
        gameId: hasActiveGame ? activeGames.get(userId) : null,
      }),
      { status: 200 },
    );
  }

  return new Response(
    JSON.stringify({ success: false, message: "Invalid action" }),
    { status: 400 },
  );
}
