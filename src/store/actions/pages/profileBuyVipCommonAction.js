import axiosRequest from "@/lib/services/axios";
import store from "@/store";
import { requestUrlConstants } from "@/lib/constants";
import { updateUserDataAction } from "@/store/actions/user";
import callToast from "@/lib/services/toastCall";

const { getVipInfoDataUrl, getVipExchangeCodeUrl, postBuyVipMemberUrl } =
  requestUrlConstants;

export const setVipInfoAction = (callback = () => {}) => {
  return function (dispatch) {
    axiosRequest
      .get(getVipInfoDataUrl, {
        uid: store.getState().user.id,
      })
      .then((data) => {
        dispatch({
          type: "INIT_VIPINFODATA",
          data,
        });
        callback();
      });
  };
};

export const exchangeVipCodeAction = (exchangeCode) => {
  return function (dispatch) {
    axiosRequest
      .get(getVipExchangeCodeUrl, {
        uid: store.getState().user.id,
        dianka: exchangeCode,
      })
      .then((data) => {
        dispatch(updateUserDataAction());
      });
  };
};

export const buyVipMemberAction = (vipInfo, t) => {
  return function (dispatch) {
    const user = store.getState().user;
    let fromData = new FormData();

    fromData.append("fee", vipInfo.pay_price);
    fromData.append("name", vipInfo.outside_display_name);
    fromData.append("type_id", vipInfo.id);
    fromData.append("user_id", user.id);

    axiosRequest
      .post(postBuyVipMemberUrl, fromData)
      .then((data) => {
        dispatch(setVipInfoAction());
        dispatch(updateUserDataAction());

        callToast(t("Toast.buy_success_1"));
      })
      .catch(() => {
        callToast("Toast.buy_unsuccess");
      });
  };
};

export const clearVipInfoAction = () => {
  return function (dispatch) {
    dispatch({
      type: "CLEAR_VIPINFODATA",
    });
  };
};
