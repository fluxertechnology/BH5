import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";

const IconSelect = React.forwardRef(
  (
    {
      className,
      icon,
      callback,
      value,
      placeholder,
      optionsPreFix = "",
      options = [],
    },
    ref
  ) => {
    const [show_option, setShowOption] = useState(false);

    return (
      <IconSelectElement className={className}>
        <div
          className="select_container"
          onClick={() => {
            setShowOption(true);
          }}
        >
          <Image width={0} height={0} className="select_container_icon" src={icon} alt="icon" />
          <p
            className="select_container_text"
            style={{
              color: value ? "#000" : "",
            }}
          >
            {value || placeholder}
          </p>
        </div>
        {show_option ? (
          <div
            className="select_cover"
            onClick={() => {
              setShowOption(false);
            }}
          />
        ) : (
          ""
        )}
        <div
          className="select_options"
          style={{
            height: (show_option ? 200 : 0) + "px",
          }}
        >
          {options.map((value) => {
            return (
              <div
                className="select_options_option"
                data-value={value}
                onClick={(e) => {
                  setShowOption(false);
                  callback(e);
                }}
                key={value}
              >
                {optionsPreFix} {value}
              </div>
            );
          })}
        </div>
      </IconSelectElement>
    );
  }
);

export default IconSelect;

export const IconSelectElement = styled.div`
  /*  */
  position: relative;
  height: 100%;

  .select_container {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 1px;
    box-sizing: border-box;
    height: 100%;
    border: 1px solid #646464;
    border-radius: 5px;
    height: 2.083vw;

    &_icon {
      height: 80%;
      vertical-align: middle;
      min-width: 30px;
      min-height: 30px;
    }

    &_text {
      flex-grow: 1;
      padding: 1px 2px;
      width: 0;
      font-size: 14px;
      color: #757575;
      background: none;
      border: none;
      outline: none;
    }
  }

  .select_cover {
    position: absolute;
    top: -50vh;
    right: -50vw;
    bottom: -50vh;
    left: -50vw;
  }

  .select_options {
    cursor: pointer;
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 1;
    overflow: auto;
    max-height: 200px;
    background-color: #fff;
    box-shadow: 0 12px 23px #0004;
    transition: 0.2s;

    &_option {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      height: 35px;

      &::after {
        content: "";
        position: absolute;
        right: 5vw;
        bottom: 0;
        left: 5vw;
        height: 1px;
        background-color: #eee;
      }
    }
  }
`;
