export const categoryDataLimit = 15;

const homeCategoryData = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_CATEGORYDATA":
      if (!state[action.category]) {
        state[action.category] = {
          list: [],
          is_free: 0,
          page: 0,
          type: 0,
          tag_gp: [],
          isEnd: false,
          select_tag_gp: [],
        };
      }
      const set = new Set();
      let filterData = state[action.category];
      filterData.list = [...filterData.list, ...action.data];
      filterData.list.filter((item) =>
        !set.has(item.id) ? set.add(item.id) : false
      );
      filterData.page = filterData.page + 1;
      if (action.data.length < categoryDataLimit) {
        filterData.isEnd = true;
      }

      filterData.type = action.kind;
      filterData.is_free = action.is_free;
      filterData.tag_gp = action.tag_gp;
      return {
        ...state,
      };
    case "UPDATE_CATEGORYDATA_SELECT_TAG_GP":
      console.log("UPDATE_CATEGORYDATA_SELECT_TAG_GP");
      if (!state[action.category]) {
        state[action.category] = {
          list: [],
          is_free: 0,
          page: 0,
          type: 0,
          tag_gp: [],
          isEnd: false,
          select_tag_gp: [],
        };
      }
      let pickCategory = state[action.category];
      pickCategory.select_tag_gp = action.tag_name;
      return { ...state };

    case "RESET_CATEGORYDATA":
      state[action.category] = {
        list: [],
        is_free: 0,
        page: 0,
        type: 0,
        tag_gp: [],
        isEnd: false,
      };

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homeCategoryData;
