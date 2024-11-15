/**
 * @description get home category
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_HOMECATEGORY
 * @return {*} 
 */
const homeCategory = function (state = [], action) {
  switch (action.type) {
    case "INIT_HOMECATEGORY":
      return action.data;
    default:
      return state;
  }
};

export default homeCategory;
