/**
 * @description read photosList data
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_STREAMLIST
 * @return {*}
 */
const photosList = function (state = [], action) {
  switch (action.type) {
    case "INIT_STREAMLIST":
      return [...action.data];
    default:
      return state;
  }
};

export default photosList;
