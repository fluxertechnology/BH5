import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";

const { postGetDirectOrderListUrl, postGetDirectOrderUrl } =
  requestUrlConstants;

export const postDirectPurchaseList = (data) => {
  return function (dispatch) {
    let uid = store.getState().user.id;
    let formData = new FormData();
    formData.append("uid", uid);
    console.log(uid, "uid");
    axiosRequest.post(postGetDirectOrderListUrl, formData).then((data) =>
      dispatch({
        type: "INIT_PROFILE_DIRECT_BUY",
        data: data,
      })
    );
  };
};

export const postDirectPurchase = (data, callback) => {
  return function (dispatch) {
    let uid = store.getState().user.id;
    let formData = new FormData();
    formData.append("uid", uid);
    formData.append("channel_id", data.channel_id);
    formData.append("item_id", data.item_id);

    axiosRequest
      .post(postGetDirectOrderUrl, formData)
      .then((data) => callback(data));
  };
};
