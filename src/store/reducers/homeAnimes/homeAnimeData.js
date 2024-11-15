/**
 * @description get home data
 *
 * @param {*} [state={}]
 * @param {*} action INIT_HOME_ANIME_DATA || UPDATE_HOME_ANIME_DATA
 * @return {*}
 */
const homeAnimeData = function (state = {}, action) {
  switch (action.type) {
    case "INIT_HOME_ANIME_DATA":
      return action.data;
    case "UPDATE_HOME_ANIME_DATA":
      state[action.key] = action.data;
      return state;
    case "UPDATE_HOME_ANIME_DATA_COLLECT":
      // console.log(state, "aststs");
      // const findData =
      //   state.video || state.new.find((item) => item.id === action.id);
      // findData.is_collect = Number(!findData.is_collect);
      // state[action.key] = action.data;
      return state;
    default:
      return state;
  }
};

export default homeAnimeData;
