import {
  dismissPreventPageScroll,
  preventPageScroll,
} from "@/store/actions/utilities";

const outOfQuotaData = (
  state = {
    show: false,
    buy_id: 0,
    buy_type: 0, // 0 小說 1 插圖吧? 2 漫畫 3 動畫 4 影片
    gold: 0,
    episode: 0,
    checkOnPage: false,
    showBuy: false,
    closeType: "back", //關閉方式 back hidden
    unit: "gold",
    avatarType: "init",
    callback: () => {},
  },
  action
) => {
  switch (action.type) {
    case "CLOSE_OUTOFQUOTAPORTAL":
      state.show = false;
      state.checkOnPage = false;
      dismissPreventPageScroll();
      return {
        ...state,
      };
    case "SET_OUTOFQUOTADATA":
      state.buy_id = action.buy_id;
      state.buy_type = action.buy_type;
      state.gold = action.gold;
      state.episode = action.episode;
      state.checkOnPage = action.checkOnPage;
      state.show = action.show;
      state.showBuy = action.showBuy || false;
      state.closeType = action.closeType || "back";
      state.unit = action.unit || "gold";
      state.avatarType = action.avatarType;
      state.callback = action.callback;
      preventPageScroll();
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default outOfQuotaData;
