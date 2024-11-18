"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import rootReducer from "@/store/reducers";

const GlobalContext = createContext();

let context = null;

export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, {
    adsList: {},
    noticeList: [],
    noticeListRead: [],
    user: { id: "guest" },
    config: {},
    breadcrumbs: [],
    areaCode: [],
    routesGuard: {},
    outOfQuotaData: {},
    homeData: {},
    homeAnimeData: {},
    homeCategory: [],
    homeAnimesViewData: {},
    homeAnimesContentData: {},
    homeComicViewData: {},
    homeComicContentData: {},
    homeLeaderBoard: {},
    homeTagData: {},
    homeCategoryData: {},
    homeCategoryTabList: [],
    homeSearchTabList: {},
    homeSearchResultData: {},
    homeVideo: {},
    homeVideoList: {},
    homeVideoContent: {},
    homeNovel: {},
    homeNovelsList: [],
    homeNovelsListData: {},
    homeNovelsContentData: {},
    homePhoto: {},
    homePhotosList: [],
    homePhotosListData: {},
    homePhotosContentData: {},
    homeStreamList: [],
    postData: {},
    postSameTagList: {},
    postProfile: {},
    postTags: {},
    postListData: {},
    postTrackData: {},
    postRecommend: [],
    postRecommendFriendList: {},
    postNotice: [],
    postRecommendList: [],
    socialListData: {},
    socialProfileData: {},
    vendorCategory: {},
    vendorListData: {},
    vendorGameListData: {},
    vendorData: {},
    vipInfoData: {},
    myorderData: {},
    myorderDataDetail: {},
    profileDirectBuy: {},
    myWatchHistory: [],
    getTransferMoney: [],
    profileMission: {},
    myCollectList: {},
    myBuyList: {},
    showCoverCenter: {},
    gameListData: {},
    scrollToTopStatus: {},
    router: {},
  });

  // FORTEST: on state change
  useEffect(() => {
    console.log("state changed", state);
  }, [state]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  context = useContext(GlobalContext);
  return context;
}

export function useGlobalDispatch(callback) {
  if (!context) useContext(GlobalContext);
  return callback(context.dispatch);
}

const Store = {
  getState: () => {
    if (!context) useContext(GlobalContext);
    return context.state;
  },
};

export default Store;
