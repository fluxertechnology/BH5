/**
 * @description routes event data
 *
 * @param {*} [state={}]
 * @param {*} action LOGIN_CHECK
 * @return {*}
 */
const routesGuard = function (state = {
  blockIn: false
}, action) {
  switch (action.type) {
    case "LOGIN_CHECK":
      return {
        ...state,
        blockIn: action.blockIn
      };
    default:
      return state;
  }
};

export default routesGuard;
