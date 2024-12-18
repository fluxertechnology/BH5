"use client";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faX } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { userLoginAction } from "@/store/actions/user";
import { backRoutes, pushRoutes, replaceRoutes } from "@/store/actions/historyActions";
import IconInput from "@/components/login/IconInputComponent";
import callToast from "@/lib/services/toastCall.js";
import { callCaptcha, CALL_CAPTCHA_TYPE } from "@/lib/services/callCaptcha";
import { toggleMentionAppCoverAction } from "@/store/actions/showCoverCenter";
import { utmTrack, checkDataExpired } from "@/store/actions/utilities";
import { handleRegisterAccount } from "@/lib/services/gtmEventHandle";
import {
  getEmailVerifyCode as getEmailVerifyCodeAction,
  signupUser,
  postVerifyEmailCodeAction,
  postCheckUserEmailAction,
} from "@/store/actions/pages/loginSignupAction";

import gt4 from "@/lib/services/gt4";
import { pageUrlConstants, REG_SET } from "@/lib/constants";
const { login, home } = pageUrlConstants;
const { qqReg, emailReq, emailVerifyReq, alphanumericReq } = REG_SET;

let captcha = {};
let interval = "";

const PopupDialog = () => {
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

  const toLogin = () => {
    useGlobalDispatch(pushRoutes(login));
  };

  const closePopup = () => {
    document.getElementById("popup-dialog").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };
  
  const showPassword = () => {
    var passwordInput = passwordRef.current;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  };

  const accountRef = useRef(null);
  const qqAccRef = useRef(null);
  const emailRef = useRef(null);
  const emailVerifyRef = useRef(null);
  const passwordRef = useRef(null);

  const [account, setAccount] = useState("");
  const [emailVerify, setEmailVerify] = useState("");
  const [verifyTimer, setVerifyTimer] = useState(0);
  const [qqAcc, setQqAcc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginTypeList = [
    {
      name: t("Register.qq"),
    },
    {
      name: t("Register.general"),
    },
    {
      name: t("Register.email"),
    },
  ];
  function emailVerifyEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setEmailVerify(e.target.value);
    if (key === 13) {
      signupUserSubmit();
    }
  }

  function accountEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setAccount(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
    }
  }
  function qqAccEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setQqAcc(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
    }
  }
  function emailEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setEmail(e.target.value);
    if (key === 13) {
      passwordRef.current.focus();
    }
  }
  function passwordEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPassword(e.target.value);
    if (key === 13) {
      signupUserSubmit();
    }
  }

  function signupUserSubmit() {
    switch (loginType) {
      case 0:
        if (qqAcc && password) {
          if (qqReg.test(qqAcc)) {
            callCaptcha(CALL_CAPTCHA_TYPE.REGISTER, (validate) => {
              userSignup(
                {
                  qq: qqAcc,
                  name: qqAcc,
                  password: password,
                  reg_type: ["qq", "mobile", "email"][loginType],
                  ...validate,
                },
                signupCheck
              );
            });
          }
        } else {
          callToast(t("Login.tip_error_must"));
        }

        break;
      case 1:
        if (account && password) {
          if (alphanumericReq.test(account)) {
            callCaptcha(CALL_CAPTCHA_TYPE.REGISTER, (validate) => {
              userSignup(
                {
                  name: account,
                  password: password,
                  reg_type: ["qq", "email", "mobile", "fast"][3],
                  ...validate,
                },
                signupCheck
              );
            });
          }
        } else {
          callToast(t("Login.tip_error_must"));
        }
        break;
      case 2:
        if (email && password) {
          if (emailReq.test(email)) {
            callCaptcha(CALL_CAPTCHA_TYPE.REGISTER, (validate) => {
              checkEmailUnique(email, (request) => request && setLoginType(3));
              captcha = validate;
            });
          }
        } else {
          callToast(t("Login.tip_error_must"));
        }
        break;
      case 3:
        if (emailVerify && password && emailVerifyReq.test(emailVerify)) {
          emailCodeVerify({ email, code: emailVerify }, (callback) => {
            if (callback) {
              userSignup(
                {
                  email,
                  name: email,
                  password: password,
                  reg_type: ["qq", "mobile", "email"][2],
                  ...captcha,
                },
                signupCheck
              );
            }
          });
        }
        break;
      default:
        break;
    }
  }

  function signupCheck(code) {
    if (code) {
      signupUserSuccess();
      setAccount("");
      setPassword("");
      accountRef.current.value = "";
      passwordRef.current.value = "";
      accountRef.current.focus();
    }
  }
  useEffect(() => {
    if (verifyTimer === 60) {
      clearInterval(interval);
      interval = setInterval(() => {
        if (verifyTimer > 0) setVerifyTimer((pre) => pre - 1);
      }, 1000);
    } else {
    }
  }, [verifyTimer]);

  function getEmailVerifyCode() {
    if (verifyTimer === 0) {
      callCaptcha(CALL_CAPTCHA_TYPE.REGISTER, (result) => {
        setVerifyTimer(60);
        getEmailVerify({
          ...result,
          email,
        });
      });
    }
  }

  const userSignup = (data, callback) => {
    const utm_source = localStorage.getItem("origin");
    let shareMa = undefined;
    let utc_data = localStorage.getItem("utmMark")
      ? JSON.parse(localStorage.getItem("utmMark"))
      : "";
    if (utc_data && utc_data.shareMa) {
      shareMa = utc_data.shareMa;
    }
    useGlobalDispatch(
      signupUser(
        {
          ...data,
          deviceModel: "H5",
          type: "H5",
          share_ma: shareMa,
          utm_source: utm_source,
          dianka: undefined,
          // 下面是要判斷用來 CTA 的先不處理
          // share_ma:
          // utm_source: null
        },
        (check) => {
          if (check) {
            useGlobalDispatch(
              userLoginAction(
                {
                  username: data.name,
                  passwd: data.password,
                  deviceModel: "h5",
                },
                callback
              )
            );
            useGlobalDispatch(replaceRoutes(home.pages.homeMain));
            handleRegisterAccount();
            useGlobalDispatch(toggleMentionAppCoverAction(true));
            if (
              !checkDataExpired("urlParameterTimestamp", 1000 * 60 * 60 * 24)
            ) {
              utmTrack();
            }
          } else {
            callback(check);
          }
        }
      )
    );
  };
  const signupUserSuccess = () => {
    const breadcrumbsData = [state.breadcrumbs];
    breadcrumbsData.reverse();
    for (let i = 0; i < breadcrumbsData.length; i++) {
      if (breadcrumbsData[i].path.indexOf("login") === -1) {
        useGlobalDispatch(replaceRoutes(breadcrumbsData[i]));
        return;
      }
    }
    useGlobalDispatch(backRoutes(-2));
  };
  const getEmailVerify = (email) => {
    useGlobalDispatch(getEmailVerifyCodeAction(email));
  };
  const emailCodeVerify = (data, callback) => {
    useGlobalDispatch(postVerifyEmailCodeAction(data, callback));
  };
  const checkEmailUnique = (email, callback) => {
    useGlobalDispatch(postCheckUserEmailAction(email, callback));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      gt4();
    }
  }, []);
  
  return (
    <PopupDialogWrapper>
      <div className="card-container">
        <div className="close-cont" onClick={closePopup}>
          <FontAwesomeIcon className="close-icon" icon={faX} style={{color: "#434343"}} />
        </div>
        <div className="card-header">
          <h3 className="title-text">注册</h3>
          <p className="subtitle-text">已有B次元账号？<span className="green cursor-pointer" onClick={toLogin} >{t("Login.login")}</span></p>
        </div>
        <div className="card-body">
          <div>
            <div className="form-item">
              <label className="form-label">一般账号注册</label>
              <IconInput
                required
                className="input_content_box_input"
                ref={accountRef}
                value={account}
                callback={accountEvent}
                placeholder={t("Login.placeholder_account")}
                enterKeyHint="next"
                reg={alphanumericReq}
                regErrStr={t("Login.tip_error_account")}
              />
            </div>
            <div className="form-item">
              <label className="form-label">密码</label>
              <div className="eye-cont" onClick={showPassword}>
                <FontAwesomeIcon className="eye-icon" icon={faEye} style={{color: "#c6c6c6"}} />
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
            <div className="btn-wrapper" onClick={signupUserSubmit}>
              <button className="submit-btn">注册</button>
            </div>
          </div>

          <div className="fast-register">
            <div className="title-wrapper">
              <h3>一秒快速注册</h3>
              <p>享受海量优质作品</p>
            </div>
            <div className="email-register">
              <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{color: "#434343"}} />
              <p>以 Email 注册</p>
            </div>
          </div>
        </div>
      </div>
    </PopupDialogWrapper>
  );
};

export default PopupDialog;

export const PopupDialogWrapper = styled.div`
  /*  */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .card-container{
    width: 16.667vw;
    height: 25.458vw;
    overflow: auto;
    background-color: #fff;
    padding: 2.042vw 1.25vw 1.25vw;
    position: relative;

    .close-cont{
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.7vw 0.5vw;
      cursor: pointer;
   
      .close-icon{
        width: 18px;
        height: 18px;
      }
    }

    .card-header{
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title-text{
      margin-bottom: 0.417vw;
      line-height: 1;
      font-size: 1.25vw;
      color: #464656;
      font-weight: 700 !important;
    }

    .subtitle-text{
      margin-bottom: 1.042vw;
      line-height: 1;
      font-size: 0.729vw;
      color: #464656;
    }
    
    .form-item{
      position: relative;
      margin-bottom: 16px;
    }

    .form-label{
      line-height: 1;
      font-size: 12px;
      color: #464656;
      font-weight: 700 !important;
      display: inline-block;
      margin-bottom: 5px;
    }

    label{
      border: none;
    }

    .form-item input{
      height: 40px;
      min-height: 40px;
      margin-top: 16px;
      padding: 8px;
      border: 1px solid #d6d6d6;
      border-radius: 4px;
      outline: none;
      width: 100%;
      margin: 0;
      font-size: 16px;
      color: #060616;
      position: relative;
    }

    .green{
      color: #56c676;
      font-weight: 700;
    }

    .eye-cont{
      position: absolute;
      right: 0;
      bottom: 0;
      line-height: 0;
      margin: 11px;
      z-index: 6;
      cursor: pointer;
    }

    .eye-icon{
      display: flex;
      width: 24px;
      height: 18px;
    }

    .submit-btn{
      width: 100%;
      margin-bottom: 12px;
      line-height: 40px;
      height: 40px;
      border-radius: 2px !important;
      background-color: #c6c6c6;
      text-transform: none;
      display: inline-flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700 !important;
      padding: 0;
      color: #fff;
      transition: background-color .2s linear;

      &:hover{
        background-color: #8b8b8b;
      }
    }
  }

  .fast-register{

    margin-top: 2vw;
    
    .title-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;

      h3{
        font-size: 48px;
        margin-bottom: 5px;
      }

      p{
        font-size: 16px;
      }
    }

    .email-register{
      border: 0.104vw solid #f2f2f2;
      width: 100%;
      height: 0.99vw;
      padding: 0.66vw 0.817vw;
      display: flex;
      align-items: center;
      margin-top: 2vw;
      cursor: pointer;
      transition: background-color .2s linear;
  
      .mail-icon{
        width: 0.625vw;
        height: 0.625vw;
        margin-right: 3.875vw;
      }

      p{
        font-size: 14px;
      }

      &:hover{
        background-color: #f2f2f2;
      }
    }
  }
  

}
`;
