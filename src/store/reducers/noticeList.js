/**
 * @description notice data
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_NOTICE
 * @return {*} 
 */
const noticeList = function (state = [], action) {
  switch (action.type) {
    case "INIT_NOTICE":
      return action.data;

    default:
      return state;
  }
};

export default noticeList;
