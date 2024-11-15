const homeSearchResultData = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_SEARCHRESULT":
      if(!state[action.search]) {
        state[action.search] = {
          SAC: {
            list: [],
            page: 0,
            isEnd: false
          },
          SAV: {
            list: [],
            page: 0,
            isEnd: false
          },
          SV: {
            list: [],
            page: 0,
            isEnd: false
          },
          SX: {
            list: [],
            page: 0,
            isEnd: false
          },
          ST: {
            list: [],
            page: 0,
            isEnd: false
          },
        }
      }
      if(action.data.length < 15) {
        state[action.search][action.kind].isEnd = true;
      }
      state[action.search][action.kind].list.push(...action.data);
      state[action.search][action.kind].page = state[action.search][action.kind].page + 1;
      return {
        ...state
      };
  
    default:
      return state;
  }
}

export default homeSearchResultData;