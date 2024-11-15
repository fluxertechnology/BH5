/**
 * @description home photo data
 *
 * @param {*} [state={ nowTab: 9}]
 * @param {*} action INIT_HOMEPHOTO
 * @return {*}
 */
const homePhoto = function (state = { nowTab: 9 }, action) {
  switch (action.type) {
    case "SETHOMEPHOTO_NOWTAB":
      state.nowTab = action.id;
      return state;
    default:
      return state;
  }
};

export default homePhoto;
