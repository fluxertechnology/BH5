/**
 * @description home video list data
 *
 * @param {*} [state=[{ cateid: 0, title: "推荐", vidoolist: [] , page: 0}]]
 * @param {*} action INIT_HOMEVIDEODATA
 * @return {*}
 */
const homeVideoList = function (
  state = {
    0: {
      cateid: 0,
      title: "推荐",
      videolist: [],
      page: 0,
      isNew: true,
      isDone: false,
      sort: 0,
    },
  },
  action
) {
  switch (action.type) {
    case "INIT_HOMEVIDEOLISTDATA":
      let object = {};
      for (let i = 0; i < action.data.length; i++) {
        object[action.data[i].cateid] = {
          ...action.data[i],
          page: 0,
          videolist: [],
          isNew: true,
          isDone: false,
          sort: 1 + i,
        };
      }
      return {
        ...state,
        ...object,
      };
    case "UPDATE_VIDEOLIST":
      // 永久保存資料用，目前用不到
      if (state[action.cateid].isNew) {
        const set = new Set();
        let filterData = state[action.cateid];
        filterData.videolist = filterData.videolist.concat(action.data);
        filterData.videolist = filterData.videolist.filter((item) =>
          !set.has(item.id) ? set.add(item.id) : false
        );
        filterData.page = filterData.page + 1;
      } else if (!state[action.cateid].isDone) {
        for (let i = 0; i < action.data.length; i++) {
          if (
            action.data[i].id ===
            state[action.cateid].videolist[
              state[action.cateid].videolist.length - 1
            ].id
          ) {
            state[action.cateid].videolist.push(
              ...action.data.splice(i + 1, action.data.length)
            );
            state[action.cateid].page = state[action.cateid].page + 1;
            state[action.cateid].isDone = true;
            return {
              ...state,
            };
          }
        }
      }

      return {
        ...state,
      };

    case "TOGGLE_VIDEOLISTCOLLECT":
      if (state[action.nowTab]) {
        const findData = state[action.nowTab].videolist.find(
          (data) => data.id === action.id
        );
        findData.is_collect = Number(!findData.is_collect);
      }
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default homeVideoList;
