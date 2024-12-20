const defaultState = {
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
  fixed: true,
  show: true,
  isShowFooter: true,
  dialogType: null,
  customComponent: () => false,
  prependComponent: () => <></>,
  appendComponent: () => <></>,
};

const navbarReducer = function (state = {}, action) {
  switch (action.type) {
    case "INIT_NAVBAR":
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      return {
        ...defaultState,
        mainHeight: isMobile ? 50 : 72,
        subHeight: isMobile ? 38 : 42,
        subFontSize: isMobile ? 16 : 20,
        ...action.data,
      };

    case "UPDATE_NAVBAR":
      state[action.key] = action.data;
      return state;

    case "SWITCH_NAVBAR":
      if (action.data.isMobile) {
        return {
          ...state,
          mainHeight: 50,
          subHeight: 38,
          subFontSize: 16,
        };
      }
      return {
        ...state,
        mainHeight: 72,
        subHeight: 42,
        subFontSize: 20,
      };

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
        fixed: true,
        show: true,
        isShowFooter: true,
        customComponent: () => false,
        prependComponent: () => <></>,
        appendComponent: () => <></>,
      };

    case "UPDATE_POPUP_TYPE":
      return {
        ...state,
        dialogType: action.data.popupType,
      }
      
    default:
      return state;
  }
};

export default navbarReducer;
