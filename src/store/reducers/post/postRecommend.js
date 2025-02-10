import { decryptiedData } from "@/lib/services/aes";
const local = [];
const postRecommend = (state = local.postRecommend || [], action) => {
  switch (action.type) {
    case "INIT_POSTRECOMMEND":
      return [...action.data];
    default:
      return state;
  }
};

export default postRecommend;
