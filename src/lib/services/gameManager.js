class GameManager {
  constructor() {
    this.storageKey = "activeGameSession";
    this.tabIdKey = "tabId";
    this.isOpeningGameKey = "isOpeningGame";
    this.tabId = this.getTabId();
  }

  // set is current tab is opening game
  setIsCurrentTabOpeningGame(isOpen) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.isOpeningGameKey, isOpen);
    }
  }

  getIsCurrentTabOpeningGame() {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(this.isOpeningGameKey) == "1";
    }
    return false;
  }

  getTabId() {
    if (typeof window !== "undefined") {
      let tabId = sessionStorage.getItem(this.tabIdKey);
      if (!tabId) {
        tabId = `tab-${crypto.randomUUID()}`;
        sessionStorage.setItem(this.tabIdKey, tabId);
      }
      return tabId;
    }
    return null;
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
    const existing = localStorage.getItem(this.storageKey);
    // if (existing) {
    //   const { tabId: storedTabId } = JSON.parse(existing);
    //   if (storedTabId !== this.tabId) {
    //     return {
    //       success: false,
    //       message: "遊戲已在另一個分頁中運行",
    //     };
    //   }
    // }

    const sessionStatus = await this.checkActiveSession(state);

    if (sessionStatus.hasActiveGame) {
      if (existing) {
        return {
          success: false,
          message: "遊戲已在另一個分頁中運行",
        };
      }
      return {
        success: false,
        message: "遊戲已在另一個瀏覽器中運行",
      };
    }

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

      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          gameId,
          tabId: this.tabId,
        }),
      );

      return { success: true };
    } catch (error) {
      console.error("Error starting game session:", error);
      return { success: false, message: "無法啟動遊戲" };
    }
  }

  async endGame(state, gameId) {
    const session = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    const crrGameId = gameId || session.gameId;

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

    if (this.getIsCurrentTabOpeningGame()) {
      sessionStorage.removeItem(this.isOpeningGameKey);
      localStorage.removeItem(this.storageKey);
    }
  }

  isGameOpen() {
    return !!localStorage.getItem(this.storageKey);
  }
}

export default new GameManager();
