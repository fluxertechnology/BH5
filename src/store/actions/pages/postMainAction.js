import { requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";

export const getRecommendList = () => (dispatch) => {
  axiosRequest
    .post(requestUrlConstants.postGetRecommendListUrl)
    .then((data) => {
      if (data) {
        dispatch({
          type: "INIT_POSTRECOMMEND",
          data,
        });
      }
    });
};

export const initPostData = () => (dispatch) => {
  ["INIT_POST_PROFILE"].map((item) =>
    dispatch({
      type: item,
      data: {},
    })
  );
  [
    "INIT_POSTDATA",
    "INIT_POSTLIST",
    "INIT_POSTNOTICE",
    "INIT_POSTRECOMMEND",
    "INIT_POSTRECOMMEND_FRIEND_LIST",
    "INIT_POSTRECOMMENDLIST",
    "INIT_POST_SAME_TAG_LIST",
    "INIT_POSTTAGS",
    "INIT_POSTTRACKLIST",
  ].map((item) =>
    dispatch({
      type: item,
      data: [],
    })
  );
};
