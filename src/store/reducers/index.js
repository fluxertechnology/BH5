import adsList from "@/store/reducers/adsList";
import noticeList from "@/store/reducers/noticeList";
import noticeListRead from "@/store/reducers/noticeListRead";
import user from "@/store/reducers/user";
import config from "@/store/reducers/config";
import breadcrumbs from "@/store/reducers/breadcrumbs";
import areaCode from "@/store/reducers/areaCode";

import routesGuard from "@/store/reducers/routesGuard";

import outOfQuotaData from "@/store/reducers/outOfQuotaData"; // dynamic import

// home
import homeData from "@/store/reducers/homeMain/homeData";
import homeAnimeData from "@/store/reducers/homeAnimes/homeAnimeData";
import homeCategory from "@/store/reducers/homeAnimes/homeCategory";

// homeAnimes
import homeAnimesViewData from "@/store/reducers/homeAnimes/homeAnimesViewData";
import homeAnimesContentData from "@/store/reducers/homeAnimes/homeAnimesContentData";

// homeComic
import homeComicViewData from "@/store/reducers/homeComic/homeComicViewData";
import homeComicContentData from "@/store/reducers/homeComic/homeComicContentData";

// homeLeaderBoard
import homeLeaderBoard from "@/store/reducers/homeLeaderBoard/homeLeaderBoard";

// homeCategoryData
import homeTagData from "@/store/reducers/homeCategory/homeTagData";
import homeCategoryData from "@/store/reducers/homeCategory/homeCategoryData";
import homeCategoryTabList from "@/store/reducers/homeCategory/homeCategoryTabList";

// homeSearch
import homeSearchTabList from "@/store/reducers/homeSearch/homeSearchTabList";
import homeSearchResultData from "@/store/reducers/homeSearch/homeSearchResultData";

//homevideo
import homeVideo from "@/store/reducers/homeVideo/homeVideo";
import homeVideoList from "@/store/reducers/homeVideo/homeVideoList";
import homeVideoContent from "@/store/reducers/homeVideo/homeVideoContent";

// homeNovels
import homeNovel from "@/store/reducers/homeNovels/homeNovels";
import homeNovelsList from "@/store/reducers/homeNovelsList";
import homeNovelsListData from "@/store/reducers/homeNovels/homeNovelsListData";
import homeNovelsContentData from "@/store/reducers/homeNovels/homeNovelsContentData";

// homePhotos
import homePhoto from "@/store/reducers/homePhotos/homePhoto";
import homePhotosList from "@/store/reducers/homePhotosList";
import homePhotosListData from "@/store/reducers/homePhotos/homePhotosListData";
import homePhotosContentData from "@/store/reducers/homePhotos/homePhotosContentData";

// hoemStream
import homeStreamList from "@/store/reducers/homeStreamList";

// post
import postData from "@/store/reducers/post/postData";
import postSameTagList from "@/store/reducers/post/postSameTagList"; // dynamic import
import postProfile from "@/store/reducers/post/postProfile"; // dynamic import
import postTags from "@/store/reducers/post/postTags";
import postListData from "@/store/reducers/post/postListData"; // dynamic import
import postTrackData from "@/store/reducers/post/postTrackData"; // dynamic import
import postRecommend from "@/store/reducers/post/postRecommend"; // dynamic import
import postRecommendFriendList from "@/store/reducers/post/postRecommendFriendList"; // dynamic import
import postNotice from "@/store/reducers/post/postNotice";
import postRecommendList from "@/store/reducers/post/postRecommendList"; // dynamic import

// social
import socialListData from "@/store/reducers/social/socialListData";
import socialProfileData from "@/store/reducers/social/socialProfileData";

// vender
import vendorCategory from "@/store/reducers/vender/vendorCategory";
import vendorListData from "@/store/reducers/vender/vendorListData";
import vendorGameListData from "@/store/reducers/vender/vendorGameListData";
import vendorData from "@/store/reducers/vender/vendorData";

// profile
import vipInfoData from "@/store/reducers/profile/vipInfoData";
import myorderData from "@/store/reducers/profile/myorderData";
import myorderDataDetail from "@/store/reducers/profile/myorderDataDetail";
import profileDirectBuy from "@/store/reducers/profile/profileDirectBuy";
import myWatchHistory from "@/store/reducers/profile/myWatchHistory";
import getTransferMoney from "@/store/reducers/profile/getTransferMoney";
import profileMission from "@/store/reducers/profile/profileMission";

import myCollectList from "@/store/reducers/myCollectList";
import myBuyList from "@/store/reducers/myBuyList";

import showCoverCenter from "@/store/reducers/showCoverCenter";

// game
import gameListData from "@/store/reducers/games/gameListData";

//pc footer

//scroll to top
import scrollToTopStatus from "@/store/reducers/scrollToTopStatus";

import routerReducer from "@/store/reducers/routerReducer";
import navbarReducer from "@/store/reducers/navbarReducer";
import serviceWorkerReducer from "@/store/reducers/serviceWorkerReducer";

const rootReducer = combineReducers({
  adsList,
  noticeList,
  noticeListRead,
  user,
  config,
  breadcrumbs,
  areaCode,
  routesGuard,
  outOfQuotaData,
  homeData,
  homeAnimeData,
  homeCategory,
  homeAnimesViewData,
  homeAnimesContentData,
  homeComicViewData,
  homeComicContentData,
  homeLeaderBoard,
  homeTagData,
  homeCategoryData,
  homeCategoryTabList,
  homeSearchTabList,
  homeSearchResultData,
  homeVideo,
  homeVideoList,
  homeVideoContent,
  homeNovel,
  homeNovelsList,
  homeNovelsListData,
  homeNovelsContentData,
  homePhoto,
  homePhotosList,
  homePhotosListData,
  homePhotosContentData,
  homeStreamList,
  postData,
  postSameTagList,
  postProfile,
  postTags,
  postListData,
  postTrackData,
  postRecommend,
  postRecommendFriendList,
  postNotice,
  postRecommendList,
  socialListData,
  socialProfileData,
  vendorCategory,
  vendorListData,
  vendorGameListData,
  vendorData,
  vipInfoData,
  myorderData,
  myorderDataDetail,
  profileDirectBuy,
  myWatchHistory,
  getTransferMoney,
  profileMission,
  myCollectList,
  myBuyList,
  showCoverCenter,
  gameListData,
  homeCategoryData,
  scrollToTopStatus,

  router: routerReducer,
  navbar: navbarReducer,
  serviceWorker: serviceWorkerReducer,
});

// const clientOnlyRootReducer = combineReducers({
//   outOfQuotaData,
//   postSameTagList,
//   postProfile,
//   postListData,
//   postTrackData,
//   postRecommend,
//   postRecommendFriendList,
//   postRecommendList,
// });

function combineReducers(reducers) {
  return function (state, action) {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}

export default rootReducer;
