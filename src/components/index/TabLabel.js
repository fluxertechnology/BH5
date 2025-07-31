import React from "react";
import styled from "styled-components";
import { colors } from "@/lib/constants";

const TabLabel = ({ text, onClick, active }) => {
  return (
    <TabLabelElement
      onClick={onClick}
      className={active ? "active" : ""}
    >
      {text}
    </TabLabelElement>
  );
};

export default TabLabel;

export const TabLabelElement = styled.div`
  /*  */
  cursor: pointer;
  display: inline-block;
  padding: 10px 5px;
  margin: 4px 7px 4px 0;
  font-size: 16px;
  line-height: 16px;
  word-break: keep-all;
  transition: 0.1s;
  // font-weight: 700;
  background-color: #f3f3f3;
  border-radius: 5px;
  width: 5.9375rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.active {
    color: #fff;
    background-color: #ff367a;
  }

  @media (max-width: 898px){
    width: 14.47vw;
    padding: 1.33vw 0.67vw;
    font-size: max(14px, 3.2vw);
    margin: 4px 1.13vw 4px 0;
  }
`;
