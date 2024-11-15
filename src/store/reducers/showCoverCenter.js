const showCoverCenter = function (
  state = {
    mentionAppCover: false,
    homeFloatAds: false,// 因要求從內存先把狀態改成 false 
    announcementCover: false,
  },
  action
) {
  switch (action.type) {
    case "TOGGLE_MENTIONAPPCOVER":
      state.mentionAppCover = action.state;

      return {
        ...state,
      };

    case "TOGGLE_HOMEFLOATADS":
      state.homeFloatAds = action.state;

      return {
        ...state,
      };

    case "TOGGLE_ANNOUNCEMENTCOVER":
      state.announcementCover = action.state;

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default showCoverCenter;
