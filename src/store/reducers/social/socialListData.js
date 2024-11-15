import { checkIsMobile } from "@/lib/constants";

export const socialDataLimit = checkIsMobile() ? 10 : 12;

/**
 * @description social data
 *
 * @param {*} [state={}]
 * @param {*} action UPDATE_SOCIALLIST
 * @return {*}
 */
const socialListData = function (state = {}, action) {
  switch (action.type) {
    case "UPDATE_SOCIALLIST":
      if (!state[action.citId]) {
        state[action.citId] = {
          socialList: [],
          page: 0,
          isNew: true,
          isDone: false,
        };
      }
      state[action.citId].socialList.push(...action.data);
      state[action.citId].page = state[action.citId].page + 1;

      if (action.data.length < socialDataLimit) {
        state[action.citId].isDone = true;
      }

      return {
        ...state,
      };
    default:
      return state;
  }
};

export default socialListData;
