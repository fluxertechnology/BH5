const homeAnimesContentData = (state = {}, action) => {
  switch (action.type) {
    case "INIT_ANIMESVIEW":
      if (!state[action.id]) state[action.id] = {};
      state[action.id][action.ep] = action.data.anime
        ? action.data.anime[0]
        : undefined;
      state[action.id]["recommend"] = action.data.recommend;
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default homeAnimesContentData;
