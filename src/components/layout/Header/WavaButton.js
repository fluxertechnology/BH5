/**
 * 算法參考套件的寫法，目前看起來正常運作
 * https://github.com/fians/Waves
 */
import React, { useRef } from "react";
import styled from "styled-components";

let sec = 750;
// function isWindow(obj) {
//   return obj !== null && obj === obj.window;
// }
// function getWindow(elem) {
//   return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
// }
function getOffset(elem) {
  var docElem,
    // var docElem, win,
    box = { top: 0, left: 0 },
    doc = elem && elem.ownerDocument;
  docElem = doc.documentElement;
  if (typeof elem.getBoundingClientRect !== typeof undefined) {
    box = elem.getBoundingClientRect();
  }
  // win = getWindow(doc);
  return {
    top: box.top - docElem.clientTop,
    left: box.left - docElem.clientLeft,
    // top: box.top + win.pageYOffset - docElem.clientTop,
    // left: box.left + win.pageXOffset - docElem.clientLeft
  };
}

/**
 * @description a wava buttom
 *
 * @param {*} { className= "", children }
 * @return {*}
 */
const WavaButton = ({ className = "", type = 0, children }) => {
  const wavaRef = useRef(null);
  function WavaEffect(e) {
    let offset = getOffset(wavaRef.current);
    // for(let i = 0 ; i < currentRefs.length; i++) {
    //   offTop = offTop + currentRefs[i].current.offsetTop;
    // }
    const wave = document.createElement("div");
    wave.className = "wava";
    wave.style.top = e.clientY - offset.top + "px";
    wave.style.left = e.clientX - offset.left + "px";
    wavaRef.current.appendChild(wave);
    setTimeout(() => {
      wave.remove();
    }, sec);
  }
  return (
    <WavaButtonElement
      ref={wavaRef}
      className={className}
      type={type}
      onClick={WavaEffect}
    >
      {children}
    </WavaButtonElement>
  );
};

export default WavaButton;

export const WavaButtonElement = styled.div`
  /*  */
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  .wava {
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, -50%) scale(0);
    width: 100px;
    height: 100px;
    background-color: ${({ type }) => (type ? "#fff" : "#000")};
    border-radius: 50%;
    opacity: 30%;
    animation: wava-animation ${sec / 1000}s;
  }

  @keyframes wava-animation {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 30%;
    }

    100% {
      transform: translate(-50%, -50%) scale(3);
      opacity: 0%;
    }
  }
`;
