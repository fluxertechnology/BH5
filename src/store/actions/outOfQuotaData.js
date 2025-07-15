import { pageUrlConstants, requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { unClockAvatarAction } from "@/store/actions/pages/profileEditAvatarAction";
import store, { useGlobalDispatch } from "@/store";
import { backRoutes, pushRoutes } from "./historyActions";
import { updateUserDataAction } from "./user";
import { checkinPageConditioncheckAction, getPagePath } from "./utilities";

const { home, profile } = pageUrlConstants;

const { postGoldBuy, postGoldPay, postGoldBuyComic, postUnClockAvatarUrl } =
  requestUrlConstants;

export const setOutOfQuotaDataAction = (data) => {
  return {
    type: "SET_OUTOFQUOTADATA",
    buy_id: data.buy_id,
    buy_type: data.buy_type,
    gold: data.gold,
    episode: data.episode,
    checkOnPage: data.checkOnPage,
    show: data.show,
    showBuy: data.showBuy,
    closeType: data.closeType,
    unit: data.unit,
    avatarType: data.avatarType,
    callback: data.callback,
  };
};

export const closeOutOfQuotaPortalAction = (data) => {
  return function (dispatch) {
    dispatch(backRoutes(-1));
    dispatch({
      type: "CLOSE_OUTOFQUOTAPORTAL",
    });
  };
};

export const hideOutOfQuotaPortalAction = () => {
  return {
    type: "CLOSE_OUTOFQUOTAPORTAL",
  };
};

export const buyContentAction = (callback = () => {}) => {
  return function (dispatch) {
    useGlobalDispatch(
      updateUserDataAction((check) => {
        callback();
        if (check) {
          let storeData = store.getState();
          let { user, outOfQuotaData, homeVideoContent } = storeData;
          const id = outOfQuotaData.buy_id;
          useGlobalDispatch(hideOutOfQuotaPortalAction());
          let money = user.sign - outOfQuotaData.gold;
          if (money >= 0) {
            if (outOfQuotaData.buy_type === 5) {
              const avatarType = outOfQuotaData.avatarType;
              const callback = outOfQuotaData.callback;
              useGlobalDispatch(
                unClockAvatarAction({
                  id: id,
                  type: avatarType,
                  callback: callback,
                })
              );
              useGlobalDispatch(hideOutOfQuotaPortalAction());
            } else if (outOfQuotaData.buy_type === 4) {
              let formData = new FormData();
              formData.append("user_id", user.id);
              formData.append("video_id", id);
              formData.append("type", 0);
              formData.append("video_name", homeVideoContent[id].title);
              formData.append("video_url", homeVideoContent[id].url);
              formData.append("update_jinbi", money);
              formData.append(
                "expiration_time",
                homeVideoContent[id].expiration
              );
              formData.append("video_pic", homeVideoContent[id].img);
              axiosRequest.post(postGoldPay, formData).then((data) => {
                if (user.id !== "guest") {
                  callToast(data);
                }
                useGlobalDispatch(
                  updateUserDataAction(() => {
                    useGlobalDispatch(
                      checkinPageConditioncheckAction({
                        itemId: id,
                        itemType: outOfQuotaData.buy_type,
                        needGold: outOfQuotaData.gold,
                        checkOnPage: outOfQuotaData.checkOnPage,
                      })
                    );
                    useGlobalDispatch(hideOutOfQuotaPortalAction());
                  })
                );
              });
            } else if (
              outOfQuotaData.buy_type === 2 ||
              outOfQuotaData.buy_type === 3
            ) {
              let formData = new FormData();
              formData.append("uid", user.id);
              formData.append("buy_id", id);
              formData.append("buy_sign", outOfQuotaData.gold);
              formData.append("episode", outOfQuotaData.episode);
              axiosRequest
                .post(postGoldBuyComic, formData)
                .then((data) => {
                  useGlobalDispatch(
                    updateUserDataAction(() => {
                      useGlobalDispatch({
                        type:
                          outOfQuotaData.buy_type === 2
                            ? "ADD_BUYCOMIC"
                            : "ADD_BUYANIMES",
                        id: id,
                        ep: parseInt(outOfQuotaData.episode),
                      });
                      useGlobalDispatch(
                        checkinPageConditioncheckAction({
                          itemId: id,
                          itemType: outOfQuotaData.buy_type,
                          needGold: outOfQuotaData.gold,
                          episode: outOfQuotaData.episode,
                          checkOnPage: outOfQuotaData.checkOnPage,
                        })
                      );
                    })
                  );
                })
                .catch(() => {
                  callToast("重整试试，如持续发生通知管理人员");
                });
            } else if (
              outOfQuotaData.buy_type === 0 ||
              outOfQuotaData.buy_type === 1
            ) {
              let formData = new FormData();
              formData.append("user_id", user.id);
              formData.append("buy_id", id);
              formData.append("buy_type", outOfQuotaData.buy_type);
              formData.append("update_jinbi", money);
              axiosRequest.post(postGoldBuy, formData).then((data) => {
                useGlobalDispatch(
                  updateUserDataAction(() => {
                    useGlobalDispatch(
                      checkinPageConditioncheckAction({
                        itemId: id,
                        itemType: outOfQuotaData.buy_type,
                        needGold: outOfQuotaData.gold,
                        checkOnPage: outOfQuotaData.checkOnPage,
                      })
                    );
                    useGlobalDispatch(hideOutOfQuotaPortalAction());
                  })
                );
              });
            } else {
              let formData = new FormData();
              formData.append("user_id", user.id);
              formData.append("buy_id", id);
              formData.append("buy_type", outOfQuotaData.buy_type);
              formData.append("update_jinbi", money);
              axiosRequest.post(postGoldBuy, formData).then((data) => {
                useGlobalDispatch(
                  updateUserDataAction(() => {
                    const checkOnPage =
                      store.getState().outOfQuotaData.checkOnPage;
                    if (!checkOnPage) {
                      useGlobalDispatch(
                        pushRoutes(getPagePath(outOfQuotaData.buy_type, id))
                      );
                    }
                    useGlobalDispatch(hideOutOfQuotaPortalAction());
                  })
                );
              });
            }
          } else {
            useGlobalDispatch({
              type: "CLOSE_OUTOFQUOTAPORTAL",
            });
            const isGold = outOfQuotaData.unit === "gold";
            const priceUnit = isGold  ? '金币' : '精钻';
            callToast(`${priceUnit}不足，前往充值`);
            useGlobalDispatch(pushRoutes(profile.pages.profilePayment));
          }
        } else {
          callToast("请重登入或通知管理员");
        }
      })
    );
  };
};
