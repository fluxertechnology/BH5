import { pageUrlConstants } from "@/lib/constants";
import store from "@/store";
import { updateRechargeStateAction } from "./config";
import { setVipInfoAction } from "@/store/actions/pages/profileBuyVipCommonAction";
import { encryptionData } from "@/lib/services/aes";
import * as utilitiesRequest from "@/store/reducers/cruds/userCRUD";
import { replaceRoutes } from "./historyActions";
const { home } = pageUrlConstants;
/**
 * @description user llogin event
 *
 * @return {*}
 */
export const userLoginAction =
  (params, callback = () => {}) =>
  (dispatch) => {
    return utilitiesRequest.getLoginAction(params).then((data) => {
      if (data.id) {
        window.localStorage.setItem(
          "catchHash",
          encryptionData(JSON.stringify(params))
        );
        dispatch({
          type: "INIT_USER",
          data: {
            ...data,
            new_coupon_notification: data.new_coupon_notification,
            is_video_card_opened: data.is_video_card_opened,
          },
        });
        dispatch(updateRechargeStateAction(false));
        dispatch(
          updateUserDataAction((check) => {
            callback(check);
            if (check) {
              dispatch(setVipInfoAction());
            }
          }, data.id)
        );
        // dispatch(replaceRoutes(home.pages.homeMain));
      } else {
        callback(false);
      }
    });
  };

export const userFBLoginAction =
  (props, callback = () => {}) =>
  async (dispatch) => {
    const { id, accessToken } = props;
    let response = await utilitiesRequest.postFBLoginAction(accessToken);
    if (!response.code) return;
    let params = { username: id, passwd: id };
    await dispatch(userLoginAction(params, callback));
  };

export const updateUserDataAction =
  (callback = () => {}, id = null) =>
  (dispatch) => {
    const userId = id ? id : store.getState().user.id;
    return utilitiesRequest
      .postUpdateUserAction(userId)
      .then((infoData) => {
        dispatch({
          type: "INIT_USER",
          data: {
            ...infoData,
            id: userId,
            avatar: infoData.avatar,
            username: infoData.username,
            nick_name: infoData.nick_name,
            sex: infoData.sex,
            time: infoData.time,
            rank: infoData.rank,
            day_usedviewcount: infoData.day_usedviewcount,
            day_maxviewcount: infoData.day_maxviewcount,
            day_share: infoData.day_share,
            sign: infoData.sign,
            money: infoData.money,
            share_ma: infoData.share_ma,
            free_gashapon: infoData.free_gashapon,
            // ...infoData,
            // ...data,
          },
        });
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  };

export const userLoginOutAction = () => {
  return {
    type: "ClEAR_USER",
  };
};

export const userFBLoginOutAction = () => {
  return function () {
    if (window.FB) {
      window.FB.getLoginStatus(function (response) {
        // 檢查登入狀態
        if (response.status === "connected") {
          // 移除授權
          window.FB.api("/me/permissions", "DELETE", function (res) {
            // 用戶登出
            window.FB.logout();
          });
        } else {
          // do something
        }
      });
    }
  };
};

// export const getUserVideoFavorListAction = () => {
//   return function(dispatch) {
//     axiosRequest.get(getUserVideoFavoriteList, {
//       user_id: store.getState().user.id
//     }).then(data=>{
//       dispatch({
//         type: "INIT_USERVIDEOFAVOR",
//         data
//       })
//     })
//   }
// }
