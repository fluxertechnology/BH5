import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import { myorderDataLimit } from "../../reducers/profile/myorderData";
import store from "@/store";

const { postGetOrderListUrl } = requestUrlConstants;

export const getMyOrderListAction = (data) => {
  return function (dispatch) {
    let page = store.getState().myorderData.page;
    let formData = new FormData();
    formData.append("uid", data.uid);
    formData.append("page", page ? page : 1);
    formData.append("limit", myorderDataLimit);
    formData.append("is_user_gift", 0);
    axiosRequest.post(postGetOrderListUrl, formData).then((data) => {
      dispatch({
        type: "UPDATE_MYORDERDATA",
        data,
      });
    });
  };
};
