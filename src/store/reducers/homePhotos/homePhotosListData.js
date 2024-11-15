const homePhotosListData = function (state = {}, action) {
  switch (action.type) {
    case "UPDATE_PHOTOSLISTDATA":
      if (!state[action.cateId]) {
        state[action.cateId] = {
          list: [],
          page: 0,
          isEnd: false,
        };
      }
      const set = new Set();
      let filterData = state[action.cateId];
      filterData.list.push(...action.data);
      filterData.list = filterData.list.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      filterData.page = filterData.page + 1;
      if (action.data.length < homePhotosListDataLimit) {
        filterData.isDone = true;
      }
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homePhotosListData;

export const homePhotosListDataLimit = 12;
