/**
 * @description get home data
 *
 * @param {*} [state={}]
 * @param {*} action INIT_HOME_ANIME_DATA || UPDATE_HOME_ANIME_DATA
 * @return {*}
 */
const homeData = function (state = {}, action) {
  let filterItem;

  switch (action.type) {
    case "INIT_HOME_DATA":
      return { ...state, ...action.data };
    case "UPDATE_HOME_DATA":
      state[action.key] = action.data;
      return state;
    case "UPDATE_HOME_DATA_CREATION_LIST_SUBSCRIBE":
      filterItem = state["creation_list"].find(
        (item) => item.uid === action.id
      );
      if (filterItem) {
        filterItem.is_subscribe = 1;
      }
      return state;
    case "UPDATE_HOME_DATA_CREATION_LIST_FOLLOW":
      filterItem = state["creation_list"].find(
        (item) => item.uid === action.id
      );
      if (filterItem) {
        filterItem.is_follow = action.state;
      }
      return { ...state };
    // case "UPDATE_HOME_DATA_COLLECT":
    //   const findData =
    //     state.video || state.new.find((item) => item.id === action.id);
    //   findData.is_collect = Number(!findData.is_collect);
    //   // state[action.key] = action.data;
    //   return state;
    default:
      return state;
  }
};

export default homeData;
