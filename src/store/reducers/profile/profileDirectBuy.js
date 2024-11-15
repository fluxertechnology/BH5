const profileDirectBuy = function (
  state = {
    pay_channel_list: [],
    item_list: [{ outside_display_name: "", pay_price: 0 }],
  },
  action
) {
  switch (action.type) {
    case "INIT_PROFILE_DIRECT_BUY":
      state = action.data;
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default profileDirectBuy;
