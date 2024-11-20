import React from "react";
import styled from "styled-components";

let closeStyle = [
  {
    rootBC: "#000a",
    rootBorder: "none",
    width: "50%",
    height: "15%",
    bg: "#fff",
  },
  {
    rootBC: "transparent",
    rootBorder: "1px solid #fff",
    width: "70%",
    height: "2px",
    bg: "#fff",
  },
  {
    rootBC: "transparent",
    rootBorder: "none",
    width: "100%",
    height: "4px",
    bg: "#646464",
  },
  {
    rootBC: "transparent",
    rootBorder: "none",
    width: "100%",
    height: "4px",
    bg: "#ffffff",
  },
];

/**
 * @description close icon component need size seting
 *
 * @param {*} { callback }
 * @return {*}
 */
const CloseComponent = ({ callback, styleType = 0 }) => {
  return (
    <CloseComponentElement
      root_bc={closeStyle[styleType].rootBC}
      root_border={closeStyle[styleType].rootBorder}
      width={closeStyle[styleType].width}
      height={closeStyle[styleType].height}
      bg={closeStyle[styleType].bg}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        callback();
      }}
    />
  );
};


export default CloseComponent;

const CloseComponentElement = styled.div`
  /*  */
  cursor: pointer;
  background-color: ${({ root_bc }) => root_bc};
  border: ${({ root_border }) => root_border};
  border-radius: 50%;
  z-index: 999;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    background-color: ${({ bg }) => bg};
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

export { CloseComponentElement };
