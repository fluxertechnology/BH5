"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import rootReducer from "@/store/reducers";
import { useRouter } from "next/navigation";
import { decryptiedData } from "@/lib/services/aes";

const GlobalContext = createContext();

let context = null;

export function GlobalProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const quertObj = Object.fromEntries(searchParams.entries());
  const url = `${pathname}?${searchParams}`;

  let localData = {};
  if (typeof window !== "undefined") {
    localData = window.localStorage.getItem("contentData")
      ? JSON.parse(decryptiedData(window.localStorage.getItem("contentData")))
      : {};
  }

  const [state, dispatch] = useReducer(rootReducer, {
    adsList: {},
    noticeList: [],
    noticeListRead: [],
    user: { id: "guest" },
    config: {},
    breadcrumbs: [],
    areaCode: [],
    routesGuard: {},
    outOfQuotaData: {
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
    homeData: {},
    homeAnimeData: {},
    homeCategory: [],
    homeAnimesViewData: {},
    homeAnimesContentData: {},
    homeComicViewData: {},
    homeComicContentData: {},
    homeLeaderBoard: {
      comic: [],
      anime: [],
    },
    homeTagData: {},
    homeCategoryData: {},
    homeCategoryTabList: [],
    homeSearchTabList: {
      hotTab: [],
      historyTab: [],
    },
    homeSearchResultData: {},
    homeVideo: { nowTab: 0 },
    homeVideoList: [
      {
        cateid: 0,
        title: "推荐",
        videolist: [],
        page: 0,
        isNew: true,
        isDone: false,
        sort: 0,
      },
    ],
    homeVideoContent: {},
    homeNovel: { nowTab: 4 },
    homeNovelsList: [],
    homeNovelsListData: {},
    homeNovelsContentData: {},
    homePhoto: { nowTab: 9 },
    homePhotosList: [],
    homePhotosListData: {},
    homePhotosContentData: {},
    homeStreamList: [],
    postData: {},
    postSameTagList: { list: [], page: 0, isDone: false },
    postProfile: {
      profile: {},
      postList: [],
      page: 0,
      isDone: false,
    },
    postTags: { postTags: [], selectTags: [] },
    postListData: {
      postList: localData.postListData?.postList ?? [],
      page: 0,
      isNew: true,
      isDone: false,
    },
    postTrackData: {
      postTrack: localData.postTrackData?.postTrack ?? [],
      page: 0,
      isNew: true,
      isDone: false,
    },
    postRecommend: localData.postRecommend ?? [],
    postRecommendFriendList: {
      ...(localData.postRecommendFriendList ?? {
        list: [],
        page: 0,
        isDone: false,
      }),
    },
    postNotice: [],
    postRecommendList: {
      list: localData.postRecommendList?.list ?? [],
      page: 0,
      isDone: false,
    },
    socialListData: {},
    socialProfileData: {},
    vendorCategory: [],
    vendorListData: { list: [], adverse: [] },
    vendorGameListData: {
      vendorList: [],
      page: 0,
      isNew: true,
      isDone: false,
    },
    vendorData: {},
    vipInfoData: {},
    myorderData: { list: [], page: 0, isDone: false },
    myorderDataDetail: {},
    profileDirectBuy: {
      pay_channel_list: [],
      item_list: [{ outside_display_name: "", pay_price: 0 }],
    },
    myWatchHistory: [],
    getTransferMoney: [],
    profileMission: {
      checkin: [
        {
          id: 1,
          name: "連續簽到",
          category: 1,
          description: "0-0-0-0-0-0",
          reward_type: 1,
          reward_quantity: 1,
          completion_count: 1,
          time_limit: 0,
          create_time: "2023-07-28 18:23:30",
          is_completion: 0,
          has_completion_count: 0,
          signin: [
            {
              day: 1,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
            {
              day: 2,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
            {
              day: 3,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
            {
              day: 4,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
            {
              day: 5,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
            {
              day: 6,
              sign: "0",
              completion: 0,
              is_show: 0,
            },
          ],
        },
      ],
      weekly: [],
      newbie: [],
    },
    myCollectList: {
      CAC: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      CAV: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      CV: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      CX: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      CT: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
    },
    myBuyList: {
      BAC: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      BAV: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      BV: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      BX: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      BT: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
      BO: {
        list: [],
        page: 0,
        isNew: true,
        isDone: false,
      },
    },
    showCoverCenter: {
      mentionAppCover: false,
      homeFloatAds: false, // 因要求從內存先把狀態改成 false
      announcementCover: false,
    },
    gameListData: { vendorList: [], page: 0, isNew: true, isDone: false },
    scrollToTopStatus: false,
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
      mainHeight: 72,
      subHeight: 42,
      subFontSize: 20,
      fixed: true,
      bottomNavHeight: 62,
      customComponent: () => false,
      prependComponent: () => <></>,
      appendComponent: () => <></>,
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
  if (typeof callback !== "function" && !!callback.type) {
    return context.dispatch(callback);
  }
  return callback(context.dispatch);
}

const Store = {
  getState: () => {
    if (!context) useContext(GlobalContext);
    return context.state;
  },
};

export default Store;
