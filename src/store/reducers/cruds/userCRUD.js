import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";

const { getUserLogin, postGetUserInfoUrl, getFBUserLogin } =
  requestUrlConstants;

export const getLoginAction = (params) => {
  //新增觀看紀錄
  return axiosRequest.get(
    getUserLogin,
    { ...params, deviceModel: "h5" },
    "帐号或密码不正确"
  );
};

export const postFBLoginAction = (accessToken) => {
  //FB登入
  const formData = new FormData();
  formData.append("deviceModel", "H5");
  formData.append("type", "H5");
  formData.append("access_token", accessToken);
  return axiosRequest.post(getFBUserLogin, formData, "登陸失敗");
};

export const postUpdateUserAction = (userId) => {
  //更新使用者資料
  const formData = new FormData();
  formData.append("user_id", userId);
  return axiosRequest.post(postGetUserInfoUrl, formData);
};
