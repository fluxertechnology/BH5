/**
 * @description get watch history
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_MYWATCHHISTORY
 * @return {*}
 */
const myWatchHistory = function (state = [], action) {
  switch (action.type) {
    case "INIT_MYWATCHHISTORY_ANIME": {
      // const set = new Set();
      // let filterData = action.data["anime_video_list"];
      // filterData = filterData.filter((item) =>
      //   !set.has(item.id) ? set.add(item.id) : false
      // );
      // state["anime_video_list"] = filterData;
      //以上為清除重複資料 與目前架構有落差
      state["anime_video_list"] = action.data["anime_video_list"];
      return { ...state };
    }
    case "INIT_MYWATCHHISTORY_COMIC": {
      // const set = new Set();
      // let filterData = action.data["anime_comic_list"];
      // filterData = filterData.filter((item) =>
      //   !set.has(item.id) ? set.add(item.id) : false
      // );
      // state["anime_comic_list"] = filterData;
      //以上為清除重複資料 與目前架構有落差
      state["anime_comic_list"] = action.data["anime_comic_list"];
      return { ...state };
    }
    default:
      return state;
  }
};

export default myWatchHistory;
