/**
 *
 *
 * @param {*} [state={}]
 * @param {*} action
 * @return {*}
 */
const vendorGameListData = function (
  state = {
    vendorList: [],
    page: 0,
    isNew: true,
    isDone: false,
  },
  action
) {
  switch (action.type) {
    case "RESET_VENDORGAMECATEGORYIDDATA":
      state = {
        vendorList: [],
        page: 0,
        isNew: true,
        isDone: false,
      };
      return { ...state };
    case "UPDATE_VENDORGAMELISTDATA":
      const set = new Set();
      let filterData = state;
      filterData.vendorList = filterData.vendorList.concat(action.data);
      filterData.vendorList = filterData.vendorList.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      filterData.page = filterData.page + 1;
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default vendorGameListData;
