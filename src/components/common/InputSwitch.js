import React from "react";
import styled from "styled-components";
import { colors } from "@/lib/constants";

const InputSwitch = ({ state, className, callback }) => {
  return (
    <InputSwitchElement className={className} state={state} onClick={callback}>
      <div className="bar">
        <div className="bar_dot" />
      </div>
    </InputSwitchElement>
  );
};

export default InputSwitch;

export const InputSwitchElement = styled.div`
  /*  */
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 30px;
  height: 24px;
  @media (min-width: 899px) {
    width: 44px;
    height: 36px;
  }

  .bar {
    position: relative;
    width: 100%;
    height: 50%;
    background-color: ${({ state }) => (state ? colors.light_pink : "#999")};
    border-radius: 10px;
    transition: 0.3s;

    &_dot {
      position: absolute;
      top: 50%;
      left: ${({ state }) => (state ? "50%" : 0)};
      transform: translateY(-50%) scale(1.2);
      padding-bottom: 50%;
      width: 50%;
      background-color: ${({ state }) => (state ? colors.dark_pink : "#ddd")};
      border-radius: 50%;
      transition: 0.3s;
    }
  }
`;
