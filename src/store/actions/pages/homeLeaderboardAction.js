import axiosRequest from "@/lib/services/axios"
import { requestUrlConstants } from "@/lib/constants"

const { postGetRankListData } = requestUrlConstants;

export const getHomeLeaderBoardDataAction = (type) => {
  return function(dispatch) {
    let formData = new FormData();
    formData.append("type", type);
    formData.append("page", 1);
    axiosRequest.post(postGetRankListData, formData).then(data=>{
      dispatch({
        type: "INIT_HOMELEADERBOARD",
        key: ["anime", "comic"][type],
        data
      })
    })
  }
}