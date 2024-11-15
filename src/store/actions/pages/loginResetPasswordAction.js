import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getResetPassword } = requestUrlConstants;

/**
 * @description to reset password
 *
 * @return {*} 
 */
export const toResetPassword = (data, callback) => {
  return function (dispatch) {
    axiosRequest.get(getResetPassword, data).then(data => {
      callback(true);
    }).catch(()=>{
      callback(false);
    })
  }
}
