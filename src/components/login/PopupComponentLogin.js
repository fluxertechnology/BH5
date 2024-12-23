"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faX, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import IconInput from "@/components/login/IconInputComponent";
import callToast from "@/lib/services/toastCall.js";
import {
  userLoginAction,
  userFBLoginAction,
  userFBLoginOutAction,
} from "@/store/actions/user";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  backRoutes,
  pushRoutes,
  replaceRoutes,
} from "@/store/actions/historyActions";
import Image from "next/image";
import { pageUrlConstants, REG_SET } from "@/lib/constants";
const { login, home } = pageUrlConstants;
const { alphanumericReq } = REG_SET;

const PopupDialogLogin = () => {
  const t = useTranslations();

  const { state } = useGlobalContext();
  const { is_mobile_reg, is_email_reg, is_qq_reg } = state.config;
  // const showSignupType = [is_qq_reg, is_mobile_reg, is_email_reg];
  let defaultSignType = 1;
  // for (let i = 0; i < showSignupType.length; i++) {
  //   if (showSignupType[i]) {
  //     defaultSignType = i;
  //     break;
  //   }
  // }

  const [loginType, setLoginType] = useState(defaultSignType);

  const showPassword = () => {
    var passwordInput = passwordRef.current;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  const toForgetPassword = () => {
    // useGlobalDispatch(pushRoutes(login));
    useGlobalDispatch({
      type: "UPDATE_POPUP_TYPE",
      data: {
        popupType: "forget",
      },
    });
  };

  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    useGlobalDispatch(userFBLoginOutAction());
  }, []);
  function phoneNumberEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPhoneNumber(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
    }
  }

  function passwordEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPassword(e.target.value);
    if (key === 13) {
      userSubmit();
    }
  }

  function userSubmit() {
    if (phoneNumber && password) {
      if (alphanumericReq.test(phoneNumber)) {
        useGlobalDispatch(
          userLoginAction(
            {
              username: phoneNumber,
              passwd: password,
            },
            userLoginCheck
          )
        );
      }
    } else {
      callToast(t("Login.tip_error"));
    }
  }

  function userLoginCheck(code) {
    if (code) {
      userLoginSuccess();
    } else {
      setPhoneNumber("");
      setPassword("");
      phoneNemberRef.current.value = "";
      passwordRef.current.value = "";
      phoneNemberRef.current.focus();
    }
  }
  const loginOptions = [
    {
      type: "phone",
      icon: "/images/login/icon-phone.svg",
    },
    {
      type: "email",
      icon: "/images/login/icon-mail.svg",
    },
    {
      type: "qq",
      icon: "/images/login/icon-qq.svg",
    },
  ];
  const OtherLoginType = [
    // {
    //   type: "twitter",
    //   icon: '/images/login/icon-twitter.svg',
    // },
    // {
    //   type: "google",
    //   icon: '/images/login/icon-google.svg',
    // },
  ];
  const responseFacebook = useCallback((props) => {
    const { accessToken } = props;
    if (accessToken) {
      userFBLogin(props, userLoginCheck);
    }
  }, []);

  const userLogin = (data, callback) => {
    useGlobalDispatch(userLoginAction(data, callback));
  };
  const userFBLogin = (props, callback) => {
    useGlobalDispatch(userFBLoginAction(props, callback));
  };
  const userLoginSuccess = () => {
    const breadcrumbsData = [...state.breadcrumbs];
    breadcrumbsData.reverse();
    for (let i = 0; i < breadcrumbsData.length; i++) {
      if (breadcrumbsData[i].path.indexOf("login") === -1) {
        useGlobalDispatch(replaceRoutes(breadcrumbsData[i]));
        return;
      }
    }
    useGlobalDispatch(backRoutes());
  };

  const clearFormInput = (loginType) => {
    setPhoneNumber("");
    setPassword("");
    setLoginType(loginType);
  };

  return (
    <div className="card-body">
      {loginType === 1 && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{t("Login.general")}</label>
              <IconInput
                ref={phoneNumberRef}
                inputType="account"
                value={phoneNumber}
                callback={phoneNumberEvent}
                placeholder={t("Login.placeholder_account")}
                enterKeyHint="next"
                reg={alphanumericReq}
                regErrStr={t("Login.tip_error_account")}
              />
            </div>
            <div className="form-item">
              <div className="form-label-cont">
                <label className="form-label">{t("Register.password")}</label>
                <label className="form-label forget" onClick={toForgetPassword}>{t("Login.forget_password")}</label>
              </div>
              <div className="eye-cont" onClick={showPassword}>
                <FontAwesomeIcon className="eye-icon" icon={faEye} style={{ color: "#c6c6c6" }} />
              </div>
              <IconInput
                required
                className="input_content_box_input"
                ref={passwordRef}
                inputType="password"
                value={password}
                callback={passwordEvent}
                placeholder={t("Login.placeholder_password")}
                enterKeyHint="done"
              />
            </div>
            <div className="btn-wrapper" onClick={userSubmit}>
              <button className="submit-btn">{t("Login.login")}</button>
            </div>
          </div>

          <div className="fast-login">
            <div className="user-login" onClick={() => clearFormInput(2)}>
              <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{ color: "#434343" }} />
              <p>{t("Login.email")}</p>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default PopupDialogLogin;
