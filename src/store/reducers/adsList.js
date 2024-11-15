/**
 * @description ads data
 *
 * @param {*} [state= {}]
 * @param {*} action INIT_ADS
 * @return {*} 
 */
const adsList = function (state = {}, action) {
  switch (action.type) {
    case "INIT_ADS":
      return action.data;

    default:
      return state;
  }
};

export default adsList;
