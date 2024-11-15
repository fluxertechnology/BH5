/**
 * @description home novel data
 *
 * @param {*} [state={ nowTab: 0}]
 * @param {*} action INIT_HOMENOVELDATA
 * @return {*}
 */
const homeNovel = function (state = { nowTab: 4 }, action) {
  switch (action.type) {
    case "SETHOMENOVEL_NOWTAB":
      state.nowTab = action.id;
      return state;
    default:
      return state;
  }
};

export default homeNovel;
