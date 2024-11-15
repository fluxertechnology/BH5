export const myBuyListLimit = 10;

const myBuyList = function (state = {
  BAC: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  BAV: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  BV: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  BX: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  BT: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
  BO: {
    list: [],
    page: 0,
    isNew: true,
    isDone: false
  },
}, action) {
  switch (action.type) {
    case "INIT_MYBUYLIST":
      const set = new Set();
      let filterData = state[action.kind];
      filterData.list.push(...action.data) 
      filterData.list = filterData.list.filter(item => !set.has(item.bid) ? set.add(item.bid) : false)
      filterData.page = filterData.page + 1;
      if (action.data.length < myBuyListLimit) {
        filterData.isDone = true;
      }

      return {
        ...state
      };

    default:
      return state;
  }
};

export default myBuyList;
