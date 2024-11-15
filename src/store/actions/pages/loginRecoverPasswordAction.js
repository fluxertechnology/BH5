import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
const { getResetPassword, postUsernameExist } = requestUrlConstants;

/**
 * @description get verify code
 *
 * @return {*} 
 */
export const verifyResetPassword = (data, callback) => {
  return function (dispatch) {
    axiosRequest.get(getResetPassword, data).then(data => {
      callback(true);
    }).catch(()=>{
      callback(false);
    })
  }
}

export const checkUsernameExist = (data, callback) => {
  return function (dispatch) {

    const formData = new FormData();
    formData.append('username', data.username);

    axiosRequest.post(postUsernameExist, formData).then(check => {
      callback(check);
    }).catch(()=>{
      callback(false);
    })
  }
}

