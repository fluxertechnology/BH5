export const postListDataLimit = 20;

const postNotice = (state = [], action) => {
  switch (action.type) {
    case "INIT_POSTNOTICE":
      state = [...action.data];
      return state;
    default:
      return state;
  }
};

export default postNotice;
