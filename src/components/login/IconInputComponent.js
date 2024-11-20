import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "@/lib/constants";
import Image from "next/image";

/**
 * @description input with icon
 *
 * @param {*} { className, icon, inputType, placeholder, callback, value }
 * @return {*}
 */
const IconInput = React.forwardRef(
  (
    {
      className,
      icon = null,
      inputType = "text",
      placeholder,
      callback,
      value = null,
      enterKeyHint,
      reg = null,
      regErrStr = null,
      required,
    },
    ref
  ) => {
    const [regErr, setRegErr] = useState(false);

    function inputRegEvent(e) {
      if (reg && !reg.test(value) && value?.length > 0) {
        setRegErr(true);
      }
    }
    return (
      <IconInputElement className={className} have_icon={icon}>
        {icon && <Image width={0} height={0} className="icon" src={icon} alt="icon" />}
        <input
          required={required}
          ref={ref}
          className="input"
          type={inputType}
          placeholder={placeholder}
          onBlur={inputRegEvent}
          onFocus={() => {
            setRegErr(false);
          }}
          onChange={callback}
          onKeyDown={callback}
          value={value}
          enterKeyHint={enterKeyHint}
        ></input>
        {regErr && <span className="error">{regErrStr}</span>}
      </IconInputElement>
    );
  }
);

export default IconInput;

export const input_margin = 5;

export const IconInputElement = styled.label.withConfig({
  shouldForwardProp: (prop) =>
    !["have_icon"].includes(prop),
})`
  /*  */
  position: relative;
  display: flex;
  align-items: center;
  padding: 1px;
  box-sizing: border-box;
  height: 100%;
  border: 1px solid #646464;
  border-radius: 5px;
  .error {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 5px;
    font-weight: 700;
    color: #f00;
    font-size: 14px;
  }
  .icon {
    height: 30px;
    width: 30px;
    vertical-align: middle;
    padding-left: ${({ have_icon }) => have_icon && "0.2em"};
  }

  .input {
    flex-grow: 1;
    width: 0;
    font-size: 14px;
    background: none;
    border: none;
    outline: none;
    @media (min-width: 599px) {
      color: ${colors.text_grey};
      font-size: 18px;
      padding-left: ${({ have_icon }) => have_icon && "0 em"};
    }
    &::placeholder {
      color: #6f6f6f;
    }
  }
`;
