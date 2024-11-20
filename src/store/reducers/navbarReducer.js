const navbarReducer = function (state = {}, action) {
  switch (action.type) {
    case "INIT_NAVBAR":
      return {
        ...state,
        ...action.data,
      };

    case "UPDATE_NAVBAR":
      state[action.key] = action.data;
      return state;

    case "RESET_NAVBAR":
      return {
        isPlaceholder: false,
        clickSearch: (e) => e.stopPropagation(),
        clickAvatar: () => {},
        clickNew: () => {},
        newNotice: 0,
        clickHome: () => {},
        toPaymentPage: () => {},
        mainHeight: 72,
        subHeight: 42,
        subFontSize: 20,
        bottomNavHeight: 62,
        fixed: false,
        customComponent: () => <></>,
        prependComponent: () => <></>,
        appendComponent: () => <></>,
      };
    default:
      return state;
  }
};

export default navbarReducer;
