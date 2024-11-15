/**
 * @description read notice data
 *
 * @param {*} [state=[]]
 * @param {*} action READ_NOTICE
 * @return {*} 
 */
const noticeListRead = function (state = [], action) {
  switch (action.type) {
    case "READ_NOTICE":
      if(state.indexOf(action.noticeId )=== -1) {
        state.push(action.noticeId);
      }
      return [...state]
    default:
      return state;
  }
};

export default noticeListRead;
