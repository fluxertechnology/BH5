import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
const {
  postUserSignup,
  postGetEmailVerify,
  postVerifyEmailCode,
  postCheckUserEmail,
} = requestUrlConstants;

/**
 * @description sign up user
 *
 * @return {*}
 */
export const signupUser = (data, callback) => {
  return function (dispatch) {
    let formData = new FormData();

    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value || "");
    }

    axiosRequest
      .post(postUserSignup, formData)
      .then((data) => {
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  };
};

/**
 * @description get email verify code
 *
 * @return {*}
 */
export const getEmailVerifyCode = (data) => {
  return function (dispatch) {
    let formData = new FormData();

    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value || "");
    }

    axiosRequest
      .post(postGetEmailVerify, formData)
      .then((data) => {
        callToast(data);
      })
      .catch(() => {});
  };
};

/**
 * @description  verify  email  code
 *
 * @return {*}
 */
export const postVerifyEmailCodeAction = (data, callback) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("email", data.email);
    formData.append("code", data.code);
    axiosRequest
      .post(postVerifyEmailCode, formData)
      .then((data) => {
        console.log(data, "data");
        callback(true);
      })
      .catch(() => {
        // callback(false);
      });
  };
};

/**
 * @description  check user email unique
 *
 * @return {*}
 */
export const postCheckUserEmailAction = (email, callback) => {
  return function (dispatch) {
    let formData = new FormData();
    formData.append("email", email);
    axiosRequest
      .post(postCheckUserEmail, formData, "", true)
      .then((data) => {
        //郵箱已註冊
        if (data !== "此邮箱已注册") {
          callback(true);
        } else {
          callback(false);
          callToast(data);
        }
      })
      .catch(() => {});
  };
};
