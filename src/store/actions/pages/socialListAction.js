import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants";
import store from "@/store";
import { socialDataLimit } from "../../reducers/social/socialListData";

const { getSocialList } = requestUrlConstants;

/**
 * @description get post list data
 *
 * @param {*} data
 * @param {*} scrollColdEnd
 * @return {*}
 */
export const getSocialListAction = (citId, scrollColdEnd) => {
  return function (dispatch) {
    let socialListData = store.getState().socialListData;

    let data = {
      page: socialListData[citId] ? socialListData[citId].page + 1 : 1,
      limit: socialDataLimit
    }

    if(citId) data.city_id = citId;

    axiosRequest.get(getSocialList, data).then((data) => {
      scrollColdEnd(false);
      dispatch({
        type: "UPDATE_SOCIALLIST",
        data,
        citId
      });
    });
  };
};
