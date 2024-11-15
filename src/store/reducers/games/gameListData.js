export const gameListDataLimit = 10;
/**
 * @description game data
 *
 * @param {*} [state=null]
 * @param {*} action UPDATE_gameLIST
 * @return {*}
 */
const gameListData = function (
  state = {
    list: [],
    page: 0,
    isNew: true,
    isDone: false,
  },
  action
) {
  switch (action.type) {
    case "UPDATE_GAMELIST":
      if (action.data) {
        state.list.push(...action.data);
        state.page = state.page + 1;
        if (action.data.length <= gameListDataLimit) {
          state.isDone = true;
        }
      }

      return {
        ...state,
      };
    case "RESET_GAMELIST":
      state = {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      };
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default gameListData;
