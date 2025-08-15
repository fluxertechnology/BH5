/**
 *
 *
 * @param {*} [state={}]
 * @param {*} action
 * @return {*}
 */
const vendorListData = function (state = { list: [], adverse: [] }, action) {
  switch (action.type) {
    case "INIT_VENDORCATEGORYIDDATA":
      return {
        ...state,
        list: action.data.list || [],
        count: action.data.count ?? 0,
      };

    case "APPEND_VENDORCATEGORYIDDATA":
      return {
        ...state,
        list: action.data.list || [],
        count: action.data.count ?? 0,
      };

    case "INIT_VENDORCATEGORYIDDATA_ADVERTISE":
      return {
        ...state,
        adverse: action.data.list[0] || {},
      };

    default:
      return state;
  }
};

export default vendorListData;
