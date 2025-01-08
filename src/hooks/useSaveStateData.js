import { encryptionData } from "@/lib/services/aes";

function saveUserDate(storeData) {
  const data = JSON.stringify({
    user: storeData.user,
    vipInfoData: storeData.vipInfoData,
  });
  window.localStorage.setItem("userData", encryptionData(data));
  if (process.env.NODE_ENV === "development") {
    window.localStorage.setItem("userDataOriginal", data);
  }
}

function saveSystem(storeData) {
  window.localStorage.setItem(
    "systemData",
    encryptionData(
      JSON.stringify({
        config: storeData.config,
        areaCode: storeData.areaCode,
        homeCategory: storeData.homeCategory,
        myWatchHistory: storeData.myWatchHistory,
        homeTagData: storeData.homeTagData,
        noticeListRead: storeData.noticeListRead,
        homeCategoryTabList: storeData.homeCategoryTabList,
        homeStreamList: storeData.homeStreamList,
        vendorCategory: storeData.vendorCategory,
      })
    )
  );
}

function saveCatchData(storeData) {
  window.localStorage.setItem(
    "catchData",
    encryptionData(
      JSON.stringify({
        adsList: storeData.adsList,
        noticeList: storeData.noticeList,
        homeSearchTabList: storeData.homeSearchTabList,
        showCoverCenter: {
          ...storeData.showCoverCenter,
          homeFloatAds: false, // 因要求從內存先把狀態改成 false
        },
      })
    )
  );
}

function saveContentData(storeData) {
  console.log('save content data')
  const data = JSON.stringify({
    homeData: storeData.homeData,
    homeAnimeData: storeData.homeAnimeData,
    homeTagData: storeData.homeTagData,
    homeCategoryData: storeData.homeCategoryData,
    homeComicViewData: storeData.homeComicViewData,
    homeComicContentData: storeData.homeComicContentData,
    homeAnimesViewData: storeData.homeAnimesViewData,
    homeAnimesContentData: storeData.homeAnimesContentData,
    //homeSearchResultData: storeData.homeSearchResultData,
    homeVideo: storeData.homeVideo,
    homeLeaderBoard: storeData.homeLeaderBoard,
    homeVideoList: storeData.homeVideoList,
    homeVideoContent: storeData.homeVideoContent,
    homeNovelsList: storeData.homeNovelsList,
    homeNovelsListData: storeData.homeNovelsListData,
    homeNovelsContentData: storeData.homeNovelsContentData,
    homePhotosList: storeData.homePhotosList,
    homePhotosListData: storeData.homePhotosListData,
    homePhotosContentData: storeData.homePhotosContentData,
    postData: storeData.postData,
    postSameTagList: storeData.postSameTagList,
    postProfile: storeData.postProfile,
    postTags: storeData.postTags,
    postListData: storeData.postListData,
    postTrackData: storeData.postTrackData,
    postRecommend: storeData.postRecommend,
    postRecommendList: storeData.postRecommendList,
    postRecommendFriendList: storeData.postRecommendFriendList,
    postNotice: storeData.postNotice,
    socialListData: storeData.socialListData,
    socialProfileData: storeData.socialProfileData,
    vendorData: storeData.vendorData,
    vendorListData: storeData.vendorListData,
    vendorGameListData: storeData.vendorGameListData,
    myCollectList: storeData.myCollectList,
    myBuyList: storeData.myBuyList,
    transferMoney: storeData.getTransferMoney,
    profileDirectBuy: storeData.profileDirectBuy,
    profileMission: storeData.profileMission,
  });
  window.localStorage.setItem("contentData", encryptionData(data));
  if (process.env.NODE_ENV === "development") {
    window.localStorage.setItem("contentDataOriginal", data);
  }
}

const useSaveStateData = (state) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    // 快取目前資料，用來快速顯示畫面並過度獲取資料前的短暫空白狀態
    var isOnIOS =
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i);
    window.localStorage.setItem("lastTime", Date.now());
    saveUserDate(state);
    saveContentData(state);
  } else {
    var isOnIOS =
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i);
    window.localStorage.setItem("lastTime", Date.now());
    saveUserDate(state);
    saveSystem(state);
    saveCatchData(state);
    saveContentData(state);
  }
};

export default useSaveStateData;
