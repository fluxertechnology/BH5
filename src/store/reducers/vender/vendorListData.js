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
      state.list = action.data.list;
      return {
        ...state,
      };

    case "INIT_VENDORCATEGORYIDDATA_ADVERTISE":
      state.adverse = action.data.list[0];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default vendorListData;
