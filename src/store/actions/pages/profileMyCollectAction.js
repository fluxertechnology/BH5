import { requestUrlConstants } from "@/lib/constants"
import axiosRequest from "@/lib/services/axios";
import { myCollectListLimit } from "../../reducers/myCollectList";
import store from "@/store";

const { postGetUserCollectListUrl } = requestUrlConstants;

export const getUserCollectAction = (type) => {
  return function (dispatch) {
    let storeData = store.getState();
    let formData = new FormData();
    formData.append("uid", storeData.user.id);
    formData.append("type", type);
    formData.append("limit", myCollectListLimit);
    axiosRequest.post(postGetUserCollectListUrl, formData).then(data => {
      console.log(data,'datadatadatadata')
      dispatch({
        type: "INIT_MYCOLLECTLIST",
        kind: type,
        data
      })
    })
  }
}