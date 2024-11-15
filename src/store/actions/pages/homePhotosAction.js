import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getPhotosTabUrl } = requestUrlConstants;

/**
 * @description get tab list
 *
 * @return {*} 
 */
export const getPhotosTabAction = () => {
  return function (dispatch) {
    axiosRequest.get(getPhotosTabUrl).then(data=>{
      dispatch({
        type: "INIT_PHOTOSTAB",
        data
      })
    })
  }
}

/**
 * @description set now tab
 *
 * @param {*} id
 * @return {*}
 */
 export const setNowTabList = (id) => {
  return {
    type: "SETHOMEPHOTO_NOWTAB",
    id,
  };
};