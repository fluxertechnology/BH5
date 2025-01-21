"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faMobileScreen, faUserCircle } from "@fortawesome/free-solid-svg-icons";
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
import { closePopup } from "@/store/actions/user";
import Image from "next/image";
import { pageUrlConstants, REG_SET } from "@/lib/constants";
const { login, home } = pageUrlConstants;
const { qqReg, emailReq, alphanumericReq } = REG_SET;

const PopupDialogLogin = () => {
  const t = useTranslations();

  const { state } = useGlobalContext();
  const { is_mobile_reg, is_email_reg, is_qq_reg } = state.config;
  // const showSignupType = [is_qq_reg, is_mobile_reg, is_email_reg];
  let defaultType = "general";
  // for (let i = 0; i < showSignupType.length; i++) {
  //   if (showSignupType[i]) {
  //     defaultSignType = i;
  //     break;
  //   }
  // }

  const [type, setType] = useState(defaultType);

  const clearFormInput = (loginType) => {
    setPhoneNumber("");
    setPassword("");
    setAccountId("");

    console.log(loginType);

    setType(loginType);
    console.log("type: " + type);

  };

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

  const [accountId, setAccountId] = useState("");

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

  function accountIdEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setAccountId(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
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

  function passwordOtherEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPassword(e.target.value);
    if (key === 13) {
      userOtherSubmit();
    }
  }

  function userOtherSubmit() {
    if (accountId && password) {
      if (judeType(type, "reg").test(accountId)) {
        useGlobalDispatch(
          userLoginAction(
            {
              username: accountId,
              passwd: password,
            },
            userOtherLoginCheck
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
      clearFormInput("general");
      closeModal();
    } else {
      setPhoneNumber("");
      setPassword("");
      phoneNumberRef.current.value = "";
      passwordRef.current.value = "";
      phoneNumberRef.current.focus();
    }
  }

  function userOtherLoginCheck(code) {
    if (code) {
      userLoginSuccess();
    } else {
      setAccountId("");
      setPassword("");
      phoneNumberRef.current.value = "";
      passwordRef.current.value = "";
      phoneNumberRef.current.focus();
    }
  }
  function judeType(type, format) {
    if (format === "icon") {
      switch (type) {
        case "email":
          return "/images/icons/mail.png";
        case "qq":
          return "/images/icons/qq.png";
        default:
          return "/images/icons/phone.png";
      }
    } else if (format === "placeholder") {
      let nowFormatId = "";
      switch (type) {
        case "email":
          nowFormatId = "Login.placeholder_mail";
          break;
        case "qq":
          nowFormatId = "Login.placeholder_qq";
          break;
        default:
          nowFormatId = "Login.placeholder_phone";
          break;
      }
      return t(nowFormatId);
    } else if (format === "regErrStr") {
      let nowFormatId = "";
      switch (type) {
        case "email":
          nowFormatId = "Login.tip_error_mail";
          break;
        case "qq":
          nowFormatId = "Login.tip_error_qq";
          break;
        default:
          nowFormatId = "Login.tip_error_phone";
          break;
      }
      return t(nowFormatId);
    } else if (format === "reg") {
      switch (type) {
        case "email":
          return emailReq;
        case "qq":
          return qqReg;
        default:
          return /s*/;
        // return alphanumericReq;
      }
    }
  }

  const closeModal = () => {
    useGlobalDispatch({
      type: "UPDATE_POPUP_TYPE",
      data: {
        popupType: "login",
      },
    });

    useGlobalDispatch(closePopup());
  };

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
    useGlobalDispatch(closePopup());
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


  return (
    <div className="card-body">
      {type === "general" && (
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
              <div className="relative">
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
                <div className="eye-cont" onClick={showPassword}>
                  <FontAwesomeIcon className="eye-icon" icon={faEye} style={{ color: "#c6c6c6" }} />
                </div>
              </div>
            </div>
            <div className="btn-wrapper" onClick={userSubmit}>
              <button className="submit-btn">{t("Login.login")}</button>
            </div>
          </div>

          <div className="fast-login">
            <div className="user-login" onClick={() => clearFormInput("phone")}>
              <div className="phone-icon-wrapper" style={{ backgroundColor: "#646464", borderRadius: "999px" }}>
                <FontAwesomeIcon className="phone-icon" icon={faMobileScreen} style={{ color: "#ffffff" }} />
              </div>
              <p>{t("Login.phone")}</p>
            </div>
            <div className="user-login" onClick={() => clearFormInput("email")}>
              <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{ color: "#434343" }} />
              <p>{t("Login.email")}</p>
            </div>
            <div className="user-login" onClick={() => clearFormInput("qq")}>
              <img className="mail-icon" src="/images/login/icon-qq.svg" />
              <p>{t("Login.qqLogin")}</p>
            </div>
          </div>

        </>
      )}
      {(type === "phone" || type === "email" || type === "qq") && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{t("Login.others")}</label>
              <div className="input_content_box">
                <IconInput
                  ref={phoneNumberRef}
                  icon={judeType(type, "icon")}
                  inputType={type === "email" ? "email" : "tel"}
                  value={accountId}
                  callback={accountIdEvent}
                  placeholder={judeType(type, "placeholder")}
                  enterKeyHint="next"
                  reg={judeType(type, "reg")}
                  regErrStr={judeType(type, "regErrStr")}
                />
              </div>
            </div>
            <div className="form-item other-type">
              <div className="form-label-cont">
                <label className="form-label">{t("Register.password")}</label>
                <label className="form-label forget" onClick={toForgetPassword}>{t("Login.forget_password")}</label>
              </div>
              <div className="input_content_box relative">
                <IconInput
                  ref={passwordRef}
                  icon={"/images/icons/lock.png"}
                  inputType="password"
                  value={password}
                  callback={passwordOtherEvent}
                  placeholder={t("Login.placeholder_password")}
                  enterKeyHint="done"
                />
                <div className="eye-cont" onClick={showPassword}>
                  <FontAwesomeIcon className="eye-icon" icon={faEye} style={{ color: "#c6c6c6" }} />
                </div>
              </div>
            </div>
            <div className="btn-wrapper" onClick={userOtherSubmit}>
              <button className="submit-btn">{t("Login.login")}</button>
            </div>
          </div>

          <div className="fast-login">
            <div className="user-login" onClick={() => clearFormInput("general")}>
              <FontAwesomeIcon className="mail-icon" icon={faUserCircle} style={{ color: "#646464" }} />
              <p>{t("Login.general")}</p>
            </div>

            {type !== "phone" && (
              <div className="user-login" onClick={() => clearFormInput("phone")}>
                <div className="phone-icon-wrapper" style={{ backgroundColor: "#646464", borderRadius: "999px" }}>
                  <FontAwesomeIcon className="phone-icon" icon={faMobileScreen} style={{ color: "#ffffff" }} />
                </div>
                <p>{t("Login.phone")}</p>
              </div>
            )
            }
            {type !== "email" && (
              <div className="user-login" onClick={() => clearFormInput("email")}>
                <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{ color: "#434343" }} />
                <p>{t("Login.email")}</p>
              </div>
            )
            }
            {type !== "qq" && (
              <div className="user-login" onClick={() => clearFormInput("qq")}>
                <img className="mail-icon" src="/images/login/icon-qq.svg" />
                <p>{t("Login.qqLogin")}</p>
              </div>
            )
            }

          </div>

        </>
      )}
    </div>
  );
};

export default PopupDialogLogin;
