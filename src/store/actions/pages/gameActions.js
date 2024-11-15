import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import { gameListDataLimit } from "../../reducers/games/gameListData";

const { getGameListUrl } = requestUrlConstants;

export const getGameListAction = (type, scrollColdEnd = () => {}) => {
  return function (dispatch) {
    let storeData = store.getState();
    let gameListData = storeData.gameListData;

    if (!gameListData.isDone) {
      let formData = new FormData();
      formData.append("page", gameListData.page + 1);
      formData.append("limit", gameListDataLimit);
      formData.append("device", type);

      axiosRequest.post(getGameListUrl, formData).then((data) => {
        scrollColdEnd(false);
        dispatch({
          type: "UPDATE_GAMELIST",
          data,
        });
      });
    }
  };
};
