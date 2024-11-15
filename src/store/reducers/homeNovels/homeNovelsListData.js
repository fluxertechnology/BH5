const homeNovelsListData = function (state = {}, action) {
  switch (action.type) {
    case "UPDATE_NOVELSLISTDATA":
      if (!state[action.id]) {
        state[action.id] = {
          list: [],
          page: 0,
          isEnd: false,
        };
      }
      const set = new Set();
      let filterData = state[action.id];
      filterData.list = filterData.list.concat(action.data);
      filterData.list = filterData.list.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      filterData.page = filterData.page + 1;
      if (action.data.length < homeNovelsListDataLimit) {
        state[action.id].end = false;
      }

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homeNovelsListData;

export const homeNovelsListDataLimit = 12;
