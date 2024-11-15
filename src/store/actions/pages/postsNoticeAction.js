import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";

const { postGetPostNoticeUrl } = requestUrlConstants;

/**
 * @description get post notice data
 *
 * @param {*} data
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const postGetNotice = () => {
  return function (dispatch) {
    const storeData = store.getState();
    const formData = new FormData();
    formData.append("uid", storeData.user.id);
    axiosRequest.post(postGetPostNoticeUrl, formData).then((data) => {
      dispatch({
        type: "INIT_POSTNOTICE",
        data: data.length > 0 ? data : [],
      });
    });
  };
};
