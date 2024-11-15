/**
 *
 *
 * @param {*} state
 * @param {*} action
 * @return {*} 
 */
const vendorCategory = function(state= [], action) {
  switch (action.type) {
    case "INIT_VENDERCATEGORY":
      
      return action.data
    default:
      return state;
  }
}

export default vendorCategory;