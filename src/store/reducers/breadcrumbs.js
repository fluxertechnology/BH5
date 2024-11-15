/**
 * @description breadcrumbs road
 *
 * @param {*} [state=[]]
 * @param {*} action CRUMBS_PUSH || CRUMBS_BACK
 * @return {*}
 */
const breadcrumbs = function (state = [], action) {
  switch (action.type) {
    case "CRUMBS_PUSH":
      return [...state, action.data];

    case "CRUMBS_BACK":
      state.pop();
      return [...state];

    default:
      return [...state];
  }
};

export default breadcrumbs;
