export const openGame = (gameId) => {
  localStorage.setItem("game_manager_gameId", gameId);
};

export const endGame = () => {
  localStorage.removeItem("game_manager_gameId");
};

export const isGameOpen = () => {
  return localStorage.getItem("game_manager_gameId") !== null;
};

export default {
  openGame,
  endGame,
  isGameOpen,
};
