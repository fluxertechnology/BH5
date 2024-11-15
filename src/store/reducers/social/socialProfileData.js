
const socialProfileData = function (state = {}, action) {
  switch (action.type) {
    case "UPDATE_SOCIALPROFILE":

      state[action.data.id] = action.data;
      
      return {
        ...state,
      };
    
    case "UPDATE_SOCIALPROFILECOLLECT":

      state[action.id].total_like = action.data;
      state[action.id].is_like = state[action.id].is_like === "0" ? 1 : "0";

      return {
        ...state
      }

    default:
      return state;
  }
};

export default socialProfileData;
