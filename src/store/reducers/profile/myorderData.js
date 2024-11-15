export const myorderDataLimit = 10;

const myorderData = function (state = { 
  list: [], 
  page: 0 , 
  isDone: false
}, action) {
  switch (action.type) {
    case "UPDATE_MYORDERDATA":
      state.list = [
        ...state.list,
        ...action.data,
      ];
      state.page = state.page + 1;
      
      if (action.data.length < myorderDataLimit) {
        state.end = true;
      }

      return {
        ...state,
      };

    default:
      return state;
  }
};

export default myorderData;
