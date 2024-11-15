/**
 * @description area code
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_AREACODE
 * @return {*}
 */
const areaCode = function (state = [], action) {
  switch (action.type) {
    case "INIT_AREACODE":
      return action.data;
    default:
      return [...state];
  }
};

export default areaCode;
