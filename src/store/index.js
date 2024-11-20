"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import rootReducer from "@/store/reducers";
import { useRouter } from "next/navigation";

const GlobalContext = createContext();

let context = null;

export function GlobalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const quertObj = Object.fromEntries(searchParams.entries());
  const url = `${pathname}?${searchParams}`;
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
    router: {
      action: "", // TODO(ZY): get router action
      location: {
        hash: url.split("#")[1] || "",
        key: "",
        pathname,
        query: { ...quertObj },
        search: searchParams.toString(),
        state: null,
      },
      useRouter: useRouter(),
    },
    navbar: {
      isPlaceholder: false,
      clickSearch: (e) => e.stopPropagation(),
      clickAvatar: () => {},
      clickNew: () => {},
      newNotice: 0,
      clickHome: () => {},
      toPaymentPage: () => {},
      appendComponent: () => <></>,
      mainHeight: 72,
      subHeight: 42,
      subFontSize: 20,
      bottomNavHeight: 62,
    },
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
