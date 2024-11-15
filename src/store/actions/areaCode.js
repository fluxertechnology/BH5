import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getAreaCode } = requestUrlConstants;

/**
 * @description getAreaCodeData
 *
 * @return {*} 
 */
export const initAreaCode = () => {
  return function (dispatch) {
    axiosRequest.get(getAreaCode).then(data => {
      dispatch({
        type: "INIT_AREACODE",
        data
      })
    })
  }
}