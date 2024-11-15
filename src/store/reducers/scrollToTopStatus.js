/**
 * @description 
 *
 * @param {*} [state={}]
 * @param {*} action
 * @return {*}
 */
const scrollToTopStatus = function (state = false, action) {
  switch (action.type) {
    case "UPDATE_SCROLLTOTOP":
      return action.status;
    default:
      return state;
  }
};

export default scrollToTopStatus;
