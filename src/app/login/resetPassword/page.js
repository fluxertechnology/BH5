"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { padding } from "@/lib/constants";

import toastCall from "@/lib/services/toastCall";

import IconInput, { input_margin } from "@/components/login/IconInputComponent";
import lockIcon from "@public/images/icons/lock.png";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const LoginResetPasswordPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const oldPasswordRef = useRef(null);
  const passwordRef = useRef(null);
  const newPasswordRef = useRef(null);

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  function oldPasswordEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setOldPassword(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
    }
  }

  function passwordEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPassword(e.target.value);
    if (key === 13) {
      newPasswordRef.current.focus();
    }
  }
  function newPasswordEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setNewPassword(e.target.value);
    if (key === 13) {
      submitPassword();
    }
  }

  function submitPassword() {
    if (password && newPassword) {
      if (password === newPassword) {
        let data = {
          password: password,
        };
        if (state.user.id !== "guest") {
          data.old_password = oldPassword;
        }
        resetPasswordSubmit(data);
      } else {
        toastCall(t("Login.tip_norepeat_password"));
      }
    } else {
      toastCall(t("Login.tip_error_must"));
    }
  }

  const resetPasswordSubmit = (data) => {
    const user = state.user;
    const temporaryData = user.temporaryData;
    let dataQuery = {
      username: user.username || temporaryData.username,
      password: data.password,
    };
    if (user.id !== "guest") {
      dataQuery.old_password = data.old_password;
    }
    useGlobalDispatch(
      toResetPassword(dataQuery, (check) => {
        if (check) {
          if (user.id === "guest") {
            dispatch(replaceRoutes(login));
          } else {
            dispatch(backRoutes());
          }
          toastCall("请牢记您的新密码!请退出账号再重新登陆防止忘记哦~~！！");
        }
      })
    );
  };

  return (
    <LoginResetPasswordPageElement>
      <form className="input_content">
        {state.user.id !== "guest" ? (
          <div className="input_content_box">
            <IconInput
              className="input_content_box_input"
              ref={oldPasswordRef}
              icon={lockIcon}
              inputType="text"
              value={oldPassword}
              callback={oldPasswordEvent}
              placeholder={t("Login.placeholder_again_password")}
              enterKeyHint="next"
            />
          </div>
        ) : (
          ""
        )}
        <div className="input_content_box">
          <IconInput
            className="input_content_box_input"
            ref={passwordRef}
            icon={lockIcon}
            inputType="text"
            value={password}
            callback={passwordEvent}
            placeholder={t("Login.placeholder_new_password")}
            enterKeyHint="next"
          />
        </div>
        <div className="input_content_box">
          <IconInput
            className="input_content_box_input"
            ref={newPasswordRef}
            icon={lockIcon}
            inputType="text"
            value={newPassword}
            callback={newPasswordEvent}
            placeholder={t("Login.placeholder_again_password")}
            enterKeyHint="done"
          />
        </div>
      </form>
      <div className="input_submit" onClick={submitPassword}>
        <p className="input_submit_text">{t("Login.reset_password")}</p>
      </div>
    </LoginResetPasswordPageElement>
  );
};

export default LoginResetPasswordPage;

export const LoginResetPasswordPageElement = styled.div`
  /*  */
  padding: ${padding}px;

  .input_content {
    &_box {
      display: flex;
      margin-bottom: ${input_margin}px;
      height: 40px;

      &_input {
        width: 100%;
      }
    }
  }

  .input_submit {
    cursor: pointer;
    margin-top: 20px;

    &_text {
      padding: 8px 0;
      width: 100%;
      text-align: center;
      color: #fff;
      background-color: #f24c7c;
      border-radius: 4px;
    }
  }
`;
