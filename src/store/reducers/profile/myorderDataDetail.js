export const myorderDataLimit = 10;

const myorderDataDetail = function (state = {}, action) {
  switch (action.type) {
    case "INIT_MYORDERDATADETAIL":

      state[action.data.oderid] = action.data;
      
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default myorderDataDetail;
