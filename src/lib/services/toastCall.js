import { toast } from "react-toastify";
import { toastAutoCloseDuring } from "../constants";

let toastMsg = [];

const callToast = (msg) => {
  for(let i = 0 ; i < toastMsg.length ; i++) {
    if(toastMsg[i] === msg) {
      return;
    }
  }
  toast(msg);
  toastMsg.push(msg);
  setTimeout(() => {
    toastMsg.splice(0, 1);
  }, toastAutoCloseDuring + 350);
}

export default callToast;