import axiosRequest from "@/lib/services/axios"
import { requestUrlConstants } from "@/lib/constants"

const { postGetRankListData } = requestUrlConstants;

export const getHomeLeaderBoardDataAction = (type, range = 0) => {
  return function(dispatch) {
    let formData = new FormData();
    formData.append("type", type);
    formData.append("page", 1);
    formData.append("range", range);
    axiosRequest.post(postGetRankListData, formData).then(data=>{
      if (typeof data === "string") {
        data = data.replace(/(1|0)RANK_MONTH[1-9][1-9]/g, "");
        data = JSON.parse(data).data;
      }
      
      dispatch({
        type: "INIT_HOMELEADERBOARD",
        key: ["anime", "comic"][type],
        data
      })
    })
  }
}
