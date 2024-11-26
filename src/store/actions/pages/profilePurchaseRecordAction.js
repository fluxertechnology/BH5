import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import axiosRequest from "@/lib/services/axios";
import { myBuyListLimit } from "@/store/reducers/myBuyList";

const { postGetUserBuyListtUrl } = requestUrlConstants;

export const getUserBuyAction = (type, scrollColdEnd = () => {}) => {
  return function (dispatch) {
    let storeData = store.getState();
    if (!storeData.myBuyList[type].idDone) {
      let formData = new FormData();
      formData.append("uid", storeData.user.id);
      formData.append("type", type);
      formData.append("page", storeData.myBuyList[type].page + 1);
      formData.append("limit", myBuyListLimit);
      axiosRequest.post(postGetUserBuyListtUrl, formData).then((data) => {
        dispatch({
          type: "INIT_MYBUYLIST",
          kind: type,
          data,
        });
        scrollColdEnd(false);
      });
    }
  };
};
