import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, tokens } from "@/lib/constants";
const { getXiaoxilist } = requestUrlConstants;

/**
 * @description set notice data
 *
 * @return {*} 
 */
export const getNoticeData = () => {
  return function (dispatch) {
    let data = new FormData();
    data.append('token', tokens[1]);
    axiosRequest.post(getXiaoxilist, data).then(data => {
      dispatch({
        type: "INIT_NOTICE",
        data
      })
    })
  }
}