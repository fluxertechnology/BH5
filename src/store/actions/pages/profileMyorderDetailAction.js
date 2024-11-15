import { requestUrlConstants } from "@/lib/constants"
import axiosRequest from "@/lib/services/axios"

const { postGetOrderDetailUrl } = requestUrlConstants;

export const getMyorderDetailAction = (data) => {
  return function(dispatch) {
    let formData = new FormData();
    formData.append("uid", data.uid);
    formData.append("orderid", data.oderid);
    // formData.append("is_user_gift", 0);
    axiosRequest.post(postGetOrderDetailUrl, formData).then(data=> {
      dispatch({
        type: "INIT_MYORDERDATADETAIL",
        data
      })
    })
  }
}