import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants, tokens } from "@/lib/constants";
import store from "@/store";
import { homeNovelsListDataLimit } from "../../reducers/homeNovels/homeNovelsListData";

const { postGetNovelsData } = requestUrlConstants;

export const getNovelsDataAction = (id, scrollColdEnd) => {
  return function (dispatch) {
    let storeData = store.getState();
    let user = storeData.user;
    let homeNovelsListData = storeData.homeNovelsListData;
    let formData = new FormData();
    formData.append("token", tokens[0]);
    formData.append(
      "page",
      homeNovelsListData[id] ? homeNovelsListData[id].page + 1 : 1
    );
    formData.append("limit", homeNovelsListDataLimit);
    formData.append("cateid", id);
    if (user.id !== "guest") formData.append("uid", user.id);
    axiosRequest
      .post(postGetNovelsData, formData)
      .then((data) => {
        dispatch({
          type: "UPDATE_NOVELSLISTDATA",
          id,
          data,
        });

        scrollColdEnd(false);
      })
      .catch((err) => {
        console.log("Error", "[/banime/novel/lists]:", err);
      });
  };
};
