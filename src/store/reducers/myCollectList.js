export const myCollectListLimit = 100;

const myCollectList = function (state = {
  CAC: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  CAV: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  CV: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  CX: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  CT: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
}, action) {
  switch (action.type) {
    case "INIT_MYCOLLECTLIST":
      {
        const set = new Set();
        let filterData = state[action.kind];
        filterData.list = action.data
        filterData.list = filterData.list.filter(item => !set.has(item.cid) ? set.add(item.cid) : false)
        filterData.page = filterData.page + 1;
        if (action.data.length < myCollectListLimit) {
          filterData.isDone = true;
        }
        return {
          ...state
        };
      }
    default:
      return state;
  }
};

export default myCollectList;
