import { decryptiedData } from "@/lib/services/aes";
import { postListDataLimit } from "./postListData";

const local = typeof window !== "undefined" ? window.localStorage.getItem("contentData") : '{}';
const postTrackData = function (
  state = {
    postTrack: local
      ? JSON.parse(decryptiedData(local))?.postTrackData?.postTrack
      : [],
    page: 0,
    isNew: true,
    isDone: false,
  },
  action
) {
  switch (action.type) {
    case "INIT_POSTTRACKLIST":
      state.postTrack = [...action.data];
      state.page = 1;
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      } else {
        state.isDone = false;
      }
      return { ...state };
    case "UPDATE_POSTTRACKLIST":
      const set = new Set();
      let filterData = state;
      if (action.data.length) {
        filterData.postTrack.push(...action.data);
        filterData.postTrack = filterData.postTrack.filter((item) =>
          !set.has(item.id) && item.is_attention !== 0
            ? set.add(item.id)
            : false
        );
        state.page = state.page + 1;
      }
      if (action.data.length < postListDataLimit) {
        state.isDone = true;
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRACKLIKE":
      for (let i = 0; i < state.postTrack.length; i++) {
        if (state.postTrack[i].id === action.id) {
          state.postTrack[i].is_like = action.state;
          state.postTrack[i].total_like = action.total_like;
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRACKATTENTION":
      for (let i = 0; i < state.postTrack.length; i++) {
        if (state.postTrack[i].uid === action.id) {
          state.postTrack[i].is_attention = action.state;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRACKBUYMEDIA":
      for (let i = 0; i < state.postTrack.length; i++) {
        if (state.postTrack[i].id === action.id) {
          state.postTrack[i].lock_status = "0";
          break;
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRACKSUBSCRIBEMEDIA":
      for (let i = 0; i < state.postTrack.length; i++) {
        if (
          state.postTrack[i].uid === action.uid &&
          state.postTrack[i].on_subscribe === 1 //訂閱貼文
        ) {
          state.postTrack[i].lock_status = "0";
        }
      }

      return {
        ...state,
      };

    case "UPDATE_POSTTRACKWATCH":
      const find = state.postTrack.find((item) => item.id === action.id);
      if (find) {
        find.fake_total_view = action.fake_total_view;
      }
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default postTrackData;
