import {
  pageUrlConstants,
  // requestUrlConstants,
  webVersion,
} from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
import store from "@/store";
import { pushRoutes, replaceRoutes } from "./historyActions";
import { buyContentAction, setOutOfQuotaDataAction } from "./outOfQuotaData";
import { blockStateAction } from "./routesGuard";
import { updateUserDataAction } from "./user";
import * as utilitiesRequest from "@/store/reducers/cruds/utilitiesCRUD";

import { getVideoContentRecommendAction } from "@/store/reducers/homeVideo/homeVideoContent";
import { handleDevToolCheckReport } from "@/lib/services/gtmEventHandle";
import { getContinueWatchData } from "@/store/actions/pages/homeMainAction";

const { login, home } = pageUrlConstants;

import { useGlobalDispatch } from "@/store";
export const postAddWatchHistory = (id, episode, watchSecond) => {
  //新增觀看紀錄
  return () => utilitiesRequest.postAddWatchHistory(id, episode, watchSecond);
};

export const postSearchWatchHistory = ({ type }) => {
  //查詢觀看紀錄
  return () => utilitiesRequest.postSearchWatchHistory(type);
};

/**
 *
 *
 * @export
 * @param {*} type 0 小說 1 美圖 2 漫畫 3 動畫 4 影片
 * @param {*} id
 * @return {*}
 */
export function getPagePath(type, id, ep) {
  const storeData = store.getState();
  const {
    homeComicContentData,
    homeAnimesContentData,
    homePhotosContentData,
    homeNovelsContentData,
  } = storeData;

  switch (type) {
    case 0:
      return {
        name:
          home.pages.homeNovelsContent.name + homeNovelsContentData[id].title,
        path: home.pages.homeNovelsContent.path,
        dynamic: {
          novelId: id,
        },
      };

    case 1:
      return {
        name:
          home.pages.homePhotosContent.name + homePhotosContentData[id].title,
        path: home.pages.homePhotosContent.path,
        dynamic: {
          photoId: id,
        },
      };

    case 2:
      return {
        name:
          home.pages.homeComicList.pages.homeComicListSwitch.pages
            .homeComicListContentView.name +
          homeComicContentData[id].title +
          "-" +
          ep,
        path: home.pages.homeComicList.pages.homeComicListSwitch.pages
          .homeComicListContentView.path,
        dynamic: {
          comicId: id,
          ep: ep,
        },
      };

    case 3:
      return {
        name:
          home.pages.homeAnimesSwitch.pages.homeAnimesContent.name +
          homeAnimesContentData[id].title +
          "-" +
          ep,
        path: home.pages.homeAnimesSwitch.pages.homeAnimesContent.path,
        dynamic: {
          animeId: id,
          animeEp: ep,
        },
      };

    default:
      return;
  }
}

export const checkinPageConditioncheckAction =
  ({
    itemId,
    itemType,
    needGold,
    episode = null,
    checkOnPage = false,
    animeLastWatchTime,
  }) =>
  (dispatch) => {
    const storeData = store.getState();
    const {
      user,
      homeComicContentData,
      homeAnimesContentData,
      homeVideoContent,
      homePhotosContentData,
      homeNovelsContentData,
      breadcrumbs,
      router,
    } = storeData;
    if (user.id === "guest" && itemType !== 3 && itemType !== 4) {
      //影片先註掉
      if (checkOnPage) {
        dispatch(blockStateAction(true));
      }
      useGlobalDispatch(pushRoutes(login));
    } else {
      // 差距在 500 豪秒以內就不重覆扣除
      let nowTime = Date.now();
      let oldTime = window.sessionStorage.getItem("saveTime") || 0;
      if (nowTime - 1000 > parseInt(oldTime)) {
        if (itemType === 4) {
          utilitiesRequest
            .postVerifyThenGetVideo(user.id, itemId)
            .then((data) => {
              dispatch({
                type: "INIT_VIDEOCONTENT",
                id: itemId,
                data,
              });
              if (data.status === 0) {
                dispatch(
                  setOutOfQuotaDataAction({
                    buy_id: itemId,
                    buy_type: itemType,
                    episode: episode,
                    gold: data.video.need_jinbi,
                    checkOnPage: true,
                    show: false,
                  })
                );
                useGlobalDispatch(buyContentAction());
              } else {
                if (!homeVideoContent[itemId]?.recommend) {
                  useGlobalDispatch(getVideoContentRecommendAction(itemId));
                }
                window.sessionStorage.setItem("saveTime", nowTime);
              }
              // 有買就要存影片資料
            });
        } else if (itemType === 2 || itemType === 3) {
          utilitiesRequest
            .postVerifyThenGetAnime(user.id, itemId, episode)
            .then(async (data) => {
              dispatch({
                type: itemType === 2 ? "INIT_COMICVIEW" : "INIT_ANIMESVIEW",
                id: itemId,
                ep: episode,
                data,
              });
              if (data.status === 0) {
                dispatch(
                  setOutOfQuotaDataAction({
                    buy_id: itemId,
                    buy_type: itemType,
                    episode: episode,
                    gold:
                      itemType === 2
                        ? homeComicContentData[itemId].jinbi
                        : homeAnimesContentData[itemId].jinbi,
                    checkOnPage,
                    show: true,
                  })
                );
              } else {
                if (!checkOnPage) {
                  if (itemType === 2) {
                    const comicPath = {
                      name:
                        home.pages.homeComicList.pages.homeComicListSwitch.pages
                          .homeComicListContentView.name +
                        homeComicContentData[itemId].title +
                        "-" +
                        episode,
                      path: home.pages.homeComicList.pages.homeComicListSwitch
                        .pages.homeComicListContentView.path,
                      dynamic: {
                        comicId: itemId,
                        ep: episode,
                      },
                    };
                    if (
                      breadcrumbs[breadcrumbs.length - 1] &&
                      breadcrumbs[breadcrumbs.length - 1].path.split("/")
                        .length !== 4
                    ) {
                      useGlobalDispatch(replaceRoutes(comicPath));
                    } else {
                      useGlobalDispatch(pushRoutes(comicPath));
                    }
                  } else {
                    useGlobalDispatch(
                      pushRoutes({
                        name:
                          home.pages.homeAnimesSwitch.pages.homeAnimesContent
                            .name +
                          homeAnimesContentData[itemId].title +
                          "-" +
                          episode,
                        path: home.pages.homeAnimesSwitch.pages
                          .homeAnimesContent.path,
                        dynamic: {
                          animeId: itemId,
                          animeEp: episode,
                        },
                      })
                    );
                  }
                } else {
                  await useGlobalDispatch(
                    postAddWatchHistory(itemId, episode, animeLastWatchTime)
                  );
                  useGlobalDispatch(getContinueWatchData());
                }
                window.sessionStorage.setItem("saveTime", nowTime);
              }
            });
        } else if (itemType === 1) {
          utilitiesRequest
            .postVerifyThenGetPhoto(user.id, itemId)
            .then((data) => {
              dispatch({
                type: "INIT_PHOTOSCONTENT",
                id: itemId,
                data,
              });
              if (data.status === 0) {
                dispatch(
                  setOutOfQuotaDataAction({
                    buy_id: itemId,
                    buy_type: itemType,
                    gold: data.photo.need_jinbi,
                    checkOnPage,
                    show: true,
                  })
                );
              } else {
                if (!checkOnPage) {
                  useGlobalDispatch(
                    pushRoutes({
                      name:
                        home.pages.homePhotosContent.name +
                        homePhotosContentData[itemId].title,
                      path: home.pages.homePhotosContent.path,
                      dynamic: {
                        photoId: itemId,
                      },
                    })
                  );
                }
                window.sessionStorage.setItem("saveTime", nowTime);
              }
            });
        } else if (itemType === 0) {
          utilitiesRequest
            .postVerifyThenGetNovel(user.id, itemId)
            .then((data) => {
              dispatch({
                type: "INIT_NOVELCONTENT",
                id: itemId,
                data,
              });
              if (data.status === 0) {
                dispatch(
                  setOutOfQuotaDataAction({
                    buy_id: itemId,
                    buy_type: itemType,
                    gold: data.novel.need_jinbi,
                    checkOnPage,
                    show: true,
                  })
                );
              } else {
                if (!checkOnPage) {
                  useGlobalDispatch(
                    pushRoutes({
                      name:
                        home.pages.homeNovelsContent.name +
                        data.novel.title,
                      path: home.pages.homeNovelsContent.path,
                      dynamic: {
                        novelId: itemId,
                      },
                    })
                  );
                }
                window.sessionStorage.setItem("saveTime", nowTime);
              }
            });
        } else {
          utilitiesRequest
            .postGetBuyWithRecord(user.id, itemId, itemType)
            .then((data) => {
              if (data === "2") {
                // 在這邊儲存扣除時間點
                window.sessionStorage.setItem("saveTime", nowTime);
                if (!checkOnPage) {
                  useGlobalDispatch(
                    pushRoutes(getPagePath(itemType, itemId, episode))
                  );
                }
              } else {
                utilitiesRequest
                  .getUserDailyWithView(user.id)
                  .then(() => {
                    // 在這邊儲存扣除時間點
                    window.sessionStorage.setItem("saveTime", nowTime);
                    useGlobalDispatch(updateUserDataAction());
                    if (!checkOnPage) {
                      useGlobalDispatch(
                        pushRoutes(getPagePath(itemType, itemId, episode))
                      );
                    }
                  })
                  .catch(() => {
                    dispatch(
                      setOutOfQuotaDataAction({
                        buy_id: itemId,
                        buy_type: itemType,
                        gold: needGold,
                        checkOnPage,
                        show: true,
                      })
                    );
                  });
              }
            });
        }
      } else {
        if (!checkOnPage)
          useGlobalDispatch(pushRoutes(getPagePath(itemType, itemId, episode)));
      }
    }
  };

/**
 * @description 上傳檔案的事件
 *
 * @param { Event } e e.target的那個 e 指 input本體
 */
export const updateFileEventModule = function (event) {
  let files = Object.values(event.target.files);
  let fileArray = false;
  if (files && files[0]) {
    // 檔案大小限制 50MB
    if (files.filter((data) => data.size >= 10 * 1024 * 1024).length <= 0) {
      return files.map((data) => {
        return {
          file: data,
          url: null,
          progress: 0,
          delete: false,
          key: Math.floor(Math.random() * 999999999),
        };
      });
    } else {
      callToast("档案不能超过 10MB (＞x＜) ");
    }
  }
  event.target.value = null;
  return fileArray;
};

export const getUtmSource = function () {
  let urlParameter = false;
  if (!checkDataExpired("urlParameterTimestamp", 1000 * 60 * 60 * 24)) {
    urlParameter = localStorage.getItem("utmMark")
      ? JSON.parse(localStorage.getItem("utmMark"))
      : {};
  }
  return urlParameter;
};

/**
 * @description to check daily data need update
 *
 * @param {string} [localStorageKey='test'] localStorage key
 * @param {number} [time=1000] 1000 * 60 * 60 * 24 as one day
 * @return {*} boolean true data out date, false data in date
 */
export const checkDataExpired = function (
  localStorageKey = "test",
  time = 1000
) {
  const timestamp = localStorage.getItem(localStorageKey)
    ? JSON.parse(localStorage.getItem(localStorageKey))
    : 0;
  const nowTime = Date.now();
  if (nowTime >= timestamp + time) {
    return true;
  } else {
    return false;
  }
};

/**
 * @description 註冊成功如果是引流過來的就打 api
 *
 */
export const utmTrack = () => {
  let urlParameter = localStorage.getItem("utmMark")
    ? JSON.parse(localStorage.getItem("utmMark"))
    : {};
  if (urlParameter.utm_source === "stars") {
    utilitiesRequest.utmTrackStars(urlParameter);
  } else if (urlParameter.utm_source === "juicyads") {
    utilitiesRequest.utmTrackJuicyads(urlParameter);
  }
};

/**
 * @description 阻止用戶 scroll
 *
 */
export const preventPageScroll = () => {
  document.body.style.height = "calc(var(--vh, 1vh) * 100)";
  setTimeout(() => {
    document.body.style.overflow = "hidden";
  }, 0);
  document.ontouchmove = function (e) {
    e.preventDefault();
  };
};

/**
 * @description 停止阻止用戶 scroll
 *
 */
export const dismissPreventPageScroll = () => {
  document.body.style.overflow = "unset";
  document.body.style.height = "unset";
  document.ontouchmove = undefined;
};

/**
 * @description 自動傳送用戶開啟檢查工具行為
 *
 */
export const zzzzz = () => {
  utilitiesRequest.postAddFeedback(webVersion, handleDevToolCheckReport);
};

/**
 *
 * @description 統一控制分享功能
 * @param shareObj object about the share.
 * @param { string } shareObj.title The title of the share.
 * @param { string } shareObj.text The content of the share.
 * @param { string } shareObj.url The url of the share.
 * @param { Array } shareObj.files The files blob array of the share.
 */
export async function navigatorShare(shareObj) {
  if (navigator.share) {
    await navigator
      .share({
        title:
          "【绅士向B次元】" + (shareObj.title ? " - " + shareObj.title : ""),
        text: shareObj.text,
        url: shareObj.url,
        files: shareObj.files,
      })
      .then(() => callToast("分享成功(´;ω;`)"))
      .catch(() => {
        navigator.clipboard
          .writeText(shareObj.url)
          .then((data) => {
            callToast("已复制链接(´;ω;`)");
          })
          .catch((err) => {
            callToast("怪怪的(´;ω;`)");
          });
      });
  }
}

/**
 *
 * @description 閒置頁 - 隨機顯示資料
 *
 */
export const getIdleHomeData = () => {
  //新增觀看紀錄
  return () => utilitiesRequest.getIdleHomeData();
};

/**
 *
 * @description 單位判斷
 *
 */
export function judeTotalViewUnit(fake_total_view) {
  switch (true) {
    case fake_total_view >= 1000 && fake_total_view < 1000000:
      return ~~(fake_total_view / 1000) + "k";
    case fake_total_view >= 1000000 && fake_total_view < 100000000:
      return ~~(fake_total_view / 1000000) + "m";
    case fake_total_view >= 100000000:
      return ~~(fake_total_view / 100000000) + "g";
    default:
      return fake_total_view;
  }
}
