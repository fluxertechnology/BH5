class GameManager {
  constructor() {
    this.storageKey = "activeGameSession";
  }

  getUserId(state) {
    return state.user.uid || state.user.nick_name || "guest";
  }

  async checkActiveSession(state) {
    try {
      const response = await fetch("/api/tcg/game-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.getUserId(state),
          action: "check",
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking game session:", error);
      return { success: false };
    }
  }

  async startGame(state, gameId) {
    const existingSession = localStorage.getItem(this.storageKey);
    if (existingSession) {
      return {
        success: false,
        message: "遊戲已在另一個分頁中運行",
      };
    }

    const sessionStatus = await this.checkActiveSession(state);
    if (sessionStatus.hasActiveGame) {
      return {
        success: false,
        message: "遊戲已在另一個瀏覽器中運行",
      };
    }

    // Start new session
    try {
      await fetch("/api/tcg/game-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.getUserId(state),
          gameId,
          action: "start",
        }),
      });

      localStorage.setItem(this.storageKey, gameId);
      return { success: true };
    } catch (error) {
      console.error("Error starting game session:", error);
      return { success: false, message: "無法啟動遊戲" };
    }
  }

  async endGame(state, gameId) {
    const crrGameId = gameId || localStorage.getItem(this.storageKey);
    try {
      await fetch("/api/tcg/game-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.getUserId(state),
          gameId: crrGameId,
          action: "end",
        }),
      });
    } catch (error) {
      console.error("Error ending game session:", error);
    }
    localStorage.removeItem(this.storageKey);
  }

  isGameOpen() {
    return !!localStorage.getItem(this.storageKey);
  }
}

export default new GameManager();
