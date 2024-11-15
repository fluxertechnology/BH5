/**
 * @description read photosList data
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_PHOTOSTAB
 * @return {*}
 */
const photosList = function (state = [], action) {
  switch (action.type) {
    case "INIT_PHOTOSTAB":
      return [...action.data];
    default:
      return state;
  }
};

export default photosList;
