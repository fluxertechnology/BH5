let scrollColdDown = false;
let scrollColdDownTimer;
function scrollBottomCallEvent(callback) {
  if(!scrollColdDown) {

    const windowBottom = document.documentElement.getBoundingClientRect().bottom;
    const windowHeight = document.documentElement.clientHeight;
    // 換頁時如果scroll和螢幕同高就不觸發
    if(windowBottom - windowHeight < 2000 && windowBottom !== document.body.scrollHeight) {

      scrollColdDown = true;
      callback(scrollCold);
      // 以免未來有什麼情況導致 scroll 冷卻沒有被正確恢復
      scrollColdDownTimer = setTimeout(() => {
        scrollCold(false);
      }, 10000);
    }
  }
}

function scrollCold(state) {
  scrollColdDown = state;
}

export default scrollBottomCallEvent;