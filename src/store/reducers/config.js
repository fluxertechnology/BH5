/**
 * @description config data
 *
 * @param {*} [state={}]
 * @param {*} action INIT_CONFIG
 * @return {*}
 */
const config = function (state={}, action) {
  switch (action.type) {
    case "INIT_CONFIG":
      return action.data;

    case "UPDATE_RECHARGE":
      return {
        ...state,
        highlightRechargeState: action.state,
      };
    default:
      return state;
  }
};

export default config;
