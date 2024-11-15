export const tabDataLimit = 15;

const homeTagData = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_TAGDATA":
      if (!state[action.tag_gp]) {
        state[action.tag_gp] = {
          list: [],
          is_free: 0,
          page: 0,
          type: 0,
          isEnd: false,
        };
      }

      // state[action.tag_gp].list = [
      //   ...state[action.tag_gp].list,
      //   ...action.data,
      // ];
      for (let i = 0; i < action.data.length; i++) {
        let check = true;
        for (let j = 0; j < state[action.tag_gp].list.length; j++) {
          if (state[action.tag_gp].list[j].id === action.data[i].id) {
            check = false;
            break;
          }
        }
        if (check) {
          const set = new Set();
          let filterData = state[action.tag_gp];
          filterData.list.push(action.data[i]);
          filterData.list = filterData.list.filter((item) =>
            !set.has(item.id) ? set.add(item.id) : false
          );
          // state[action.tag_gp].list = filterData.list;
          // state[action.tag_gp].list.push(action.data[i]);
        }
      }
      state[action.tag_gp].page = state[action.tag_gp].page + 1;
      if (action.data.length < tabDataLimit) {
        state[action.tag_gp].isEnd = true;
      }

      state[action.tag_gp].type = action.kind;
      state[action.tag_gp].is_free = action.is_free;

      return {
        ...state,
      };

    case "RESET_TABDATA":
      state[action.tag_gp] = {
        list: [],
        is_free: 0,
        page: 0,
        type: 0,
        isEnd: false,
      };

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homeTagData;
