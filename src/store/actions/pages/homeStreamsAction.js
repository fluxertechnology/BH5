import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getStreamListUrl } = requestUrlConstants;

/**
 * @description get stream list
 *
 * @return {*} 
 */
export const getStreamListAction = () => {
  return function (dispatch) {
    axiosRequest.get(getStreamListUrl).then(data=>{
      dispatch({
        type: "INIT_STREAMLIST",
        data
      })
    })
  }
}