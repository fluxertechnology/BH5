import axiosRequest from "@/lib/services/axios";
import { requestUrlConstants } from "@/lib/constants/index.js";
import store from "@/store";
import { updateUserDataAction } from "@/store/actions/user";

const {
    postPostLikeUrl,
    postPostAttentionUrl,
    postPostPayUrl,
    postScribeOriginal,
    postAddWatchMount,
} = requestUrlConstants;

export const postCardLikeEventAction = (data) => {
    return function (dispatch) {
        const formData = new FormData();
        formData.append("uid", store.getState().user.id);
        formData.append("dynamic_id", data.id);
        formData.append("status", data.is_like === 0 ? 1 : 0);
        if (data.id) {
            axiosRequest.post(postPostLikeUrl, formData).then((resData) => {
                [
                    "UPDATE_POSTDATA",
                    "UPDATE_POSTLIKE",
                    "UPDATE_POSTTRACKLIKE",
                    "UPDATE_POSTRECOMMEND_FRIEND_LIKE",
                    "UPDATE_POSTRECOMMENDLIST_LIKE",
                    "UPDATE_POST_PROFILE_LIKE",
                    "UPDATE_POST_SAME_TAG_LIST_LIKE",
                ].map((item) =>
                    dispatch({
                        type: item,
                        id: data.id,
                        state: data.is_like === 0 ? 1 : 0,
                        total_like: resData.total,
                    })
                );
            });
        }
    };
};

export const postAttentionEventAction = (data) => {
    return function (dispatch) {
        const formData = new FormData();
        formData.append("uid", store.getState().user.id);
        formData.append("attention_uid", data.uid);
        formData.append("status", data.is_attention === 1 ? 0 : 1);
        axiosRequest.post(postPostAttentionUrl, formData).then((res) => {
            [
                "UPDATE_POSTATTENTION",
                "UPDATE_POSTDATA_ATTENTION",
                "UPDATE_POSTTRACKATTENTION",
                "UPDATE_POSTRECOMMENDLIST_ATTENTION",
                "UPDATE_POST_PROFILE_ATTENTION",
                "UPDATE_POST_SAME_TAG_LIST_ATTENTION",
                "UPDATE_POST_FRIEND_ATTENTION",
                "UPDATE_HOME_DATA_CREATION_LIST_FOLLOW",
            ].map((item) =>
                dispatch({
                    type: item,
                    id: data.uid,
                    state: data.is_attention === 1 ? 0 : 1,
                })
            );
        });
    };
};

export const postPayEventAction = (
    data,
    gold,
    callback,
    action = 0, //3打賞 0預設解鎖
    pay_type = 1 //0金幣 1晶鑽
) => {
    return function (dispatch) {
        const formData = new FormData();
        formData.append("uid", store.getState().user.id);
        if (data) {
            //有針對特定資料的話傳ID
            formData.append("dynamic_id", data.id);
        } else {
            //沒有的話就是對特定實況主打賞
            formData.append("to_uid", window.location.pathname.split("/")[4]);
        }
        formData.append("coin", gold);
        formData.append("pay_type", pay_type);
        formData.append("action", action);
        axiosRequest.post(postPostPayUrl, formData).then(() => {
            callback();
            if (!action) {
                [
                    "UPDATE_POSTDATA",
                    "UPDATE_POSTBUYMEDIA",
                    "UPDATE_POST_PROFILE_BUYMEDIA",
                    "UPDATE_POSTTRACKBUYMEDIA",
                    "UPDATE_POST_SAME_TAG_LIST_BUYMEDIA",
                    "UPDATE_POSRECOMMEND_FRIEND_BUYMEDIA",
                ].map((item) =>
                    dispatch({
                        type: item,
                        id: data.id,
                    })
                );
                dispatch(updateUserDataAction());
            }
        });
    };
};

export const postScribeEventAction = (data, type) => {
    return function (dispatch) {
        const formData = new FormData();
        formData.append("uid", store.getState().user.id);
        formData.append("to_uid", data.uid); //被訂閱者id
        formData.append("type", type); //1 月訂閱 2年訂閱
        axiosRequest.post(postScribeOriginal, formData).then((request) => {
            // if (request.msg === "付款完成") {
            [
                "UPDATE_POSTDATA",
                "UPDATE_POST_SUBSCRIBE_MEDIA",
                "UPDATE_POSTTRACKSUBSCRIBEMEDIA",
                "UPDATE_POST_PROFILE_SUBSCRIBEMEDIA",
                "UPDATE_POST_SAME_TAG_LIST_SUBSCRIBEMEDIA",
                "UPDATE_POSTRECOMMEND_FRIEND_SUBSCRIBE_MEDIA",
            ].map((item) =>
                dispatch({
                    type: item,
                    uid: data.uid,
                })
            );
            dispatch(updateUserDataAction());
            // }
        });
    };
};

/**
 * @description 用來新增觀看數
 *
 * @param { string } uid 使用者的token id
 * @param { int } dynamic_id 動態貼文id
 * @return {*}
 */
export const postAddWatchMountEvent = (data) => {
    return function (dispatch) {
        const formData = new FormData();
        formData.append("uid", store.getState().user.id);
        formData.append("dynamic_id", data.id);
        axiosRequest.post(postAddWatchMount, formData).then((request) => {
            if (request.total > 0) {
                [
                    "UPDATE_POSTLISTDATAWATCH",
                    "UPDATE_POSTTRACKWATCH",
                    "UPDATE_POST_SAME_TAG_LIST_WATCH",
                    "UPDATE_POSTDATA_WATCH",
                    "UPDATE_POSTTRECOMMENDLIST_WATCH",
                    "UPDATE_POSTRECOMMEND_FRIEND_WATCH",
                    "UPDATE_POST_PROFILE_WATCH",
                ].map((item) =>
                    dispatch({
                        type: item,
                        fake_total_view: request.total,
                        id: data.id,
                    })
                );
            }
        });
    };
};
