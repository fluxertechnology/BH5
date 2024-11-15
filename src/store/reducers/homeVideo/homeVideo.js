/**
 * @description home video data
 *
 * @param {*} [state={ nowTab: 0}]
 * @param {*} action INIT_HOMEVIDEODATA
 * @return {*} 
 */
const homeVideo = function (state = { nowTab: 0}, action) {
  switch (action.type) {
    case "SETHOMEVIDEO_NOWTAB":
      state.nowTab = action.cateid;
      return state;
    default:
      return state;
  }
};

export default homeVideo;
