/**
 * @description read novelsList data
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_NOVELSTAB
 * @return {*}
 */
const novelsList = function (state = [], action) {
  switch (action.type) {
    case "INIT_NOVELSTAB":
      return [...action.data];
    default:
      return state;
  }
};

export default novelsList;
