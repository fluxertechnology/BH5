import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import { updateUserDataAction } from "@/store/actions/user";
import store from "@/store";
const { postMissionList, postAddCheckIn, postGetReward } = requestUrlConstants;
export const getMissionListAction = (intl) => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest.post(postMissionList, formData).then((data) => {
      dispatch({ type: "INIT_PROFILEMISSION", data: data });
    });
  };
};

export const postAddCheckInAction = (index, callback) => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest.post(postAddCheckIn, formData).then(() => {
      callback();
      if (index < 6) {
        //第七天簽到不會改變內存狀態
        dispatch({ type: "CHECK_IN_PROFILEMISSION", index: index });
      }
      dispatch(updateUserDataAction());
    });
  };
};

export const postGetRewardAction = (missionId,name, callback) => {
  return function (dispatch) {
    const formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("mission_id", missionId);
    axiosRequest.post(postGetReward, formData).then(() => {
      callback();
      dispatch({ type: "RECEIVE_PROFILEMISSION", missionId: missionId,name:name });
      dispatch(updateUserDataAction());
    });
  };
};
