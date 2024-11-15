const vipInfoData = function (state = {}, action) {
  switch (action.type) {
    case "INIT_VIPINFODATA":
      return action.data;

    case "CLEAR_VIPINFODATA":
      return {};

    default:
      return state;
  }
};

export default vipInfoData;
