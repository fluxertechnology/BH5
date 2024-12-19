"use client";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faX, faCircleUser } from "@fortawesome/free-solid-svg-icons";
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
import WavaButton from "@/components/layout/Header/WavaButton";
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
  console.log(loginType)

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
          {loginType === 1 && (
            <>
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
                <div className="email-register" onClick={() => setLoginType(2)}>
                  <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{color: "#434343"}} />
                  <p>以 Email 注册</p>
                </div>
              </div>
            
            </>
          )}
          {(loginType === 2 || loginType == 3) && (
            <>
              <div>
                <div className="form-item">
                  <label className="form-label">邮箱注册</label>
                  <IconInput
                    required
                    className="input_content_box_input"
                    ref={emailRef}
                    inputType="email"
                    value={email}
                    callback={emailEvent}
                    placeholder={t("Login.placeholder_mail")}
                    enterKeyHint="next"
                    reg={emailReq}
                    regErrStr={t("Login.tip_error_mail")}
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

                <div className="input_content_box email-verify-box">
                  <label className="form-label">验证码</label>
                  <IconInput
                    className="input_content_box_input email-verify"
                    ref={emailVerifyRef}
                    value={emailVerify}
                    type="number"
                    callback={emailVerifyEvent}
                    placeholder={t("Login.placeholder_mail_verify")}
                    enterKeyHint="done"
                    reg={emailVerifyReq}
                    regErrStr={t("Login.placeholder_mail_verify_tip")}
                    required
                  />
                  <div onClick={getEmailVerifyCode}>
                    <WavaButton
                      className={`verify-btn ${
                        verifyTimer > 0 && "disabled"
                      }`}
                    >
                      {verifyTimer > 0
                        ? verifyTimer + t("Login.after_second_sent")
                        : t("Login.placeholder_get_letter")}
                    </WavaButton>
                  </div>
                </div>

                <div className="btn-wrapper" onClick={signupUserSubmit}>
                  <button className="submit-btn">
                    <p className={` ${loginType === 3 && emailVerify === "" && "disabled"}`}>
                      {loginType !== 3 || emailVerify !== ""
                        ? t("Login.register")
                        : t("Login.write_verity_code")}
                    </p>
                    </button>
                </div>
                <p className="t-and-c">繼續即表示您同意我們的服務條款和隱私政策</p>

                <div className="fast-register">
                  <div className="title-wrapper">
                    <h3>一秒快速注册</h3>
                    <p>享受海量优质作品</p>
                  </div>
                  <div className="email-register" onClick={() => setLoginType(1)}>
                    <FontAwesomeIcon className="mail-icon" icon={faCircleUser} style={{color: "#434343"}} />
                    <p>一般账号注册</p>
                  </div>
                </div>
              </div>
            
            </>
          )}
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
    width: 17.667vw;
    max-height: 34.458vw;
    overflow: auto;
    background-color: #fff;
    padding: 2.042vw 1.25vw 2.042vw;
    position: relative;

    .close-cont{
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.7vw 0.5vw;
      cursor: pointer;
   
      .close-icon{
        width: 0.938vw;
        height: 0.938vw;
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
      margin-bottom: 0.833vw;
    }

    .form-label{
      line-height: 1;
      font-size: 0.625vw;
      color: #464656;
      font-weight: 700 !important;
      display: inline-block;
      margin-bottom: 0.26vw;
      min-width: 2vw;
    }

    label{
      border: none;
    }

    .form-item input{
      height: 2.083vw;
      min-height: 2.083vw;
      margin-top: 0.833vw;
      padding: 0.417vw;
      border: 0.052vw solid #d6d6d6;
      border-radius: 0.208vw;
      outline: none;
      width: 100%;
      margin: 0;
      font-size: 0.833vw;
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
      margin: 0.573vw;
      z-index: 6;
      cursor: pointer;
    }

    .eye-icon{
      display: flex;
      width: 1.25vw;
      height: 0.938vw;
    }

    .submit-btn{
      width: 100%;
      margin-bottom: 0.625vw;
      line-height: 2.083vw;
      height: 2.083vw;
      border-radius: 0.104vw !important;
      background-color: #c6c6c6;
      text-transform: none;
      display: inline-flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 0.833vw;
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
        font-size: 2.5vw;
        margin-bottom: 0.26vw;
      }

      p{
        font-size: 0.833vw;
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
        font-size: 0.729vw;
      }

      &:hover{
        background-color: #f2f2f2;
      }
    }
  }

  .email-verify-box {
    display: flex;
    align-items: center;
    margin-bottom: 1vw !important;
    
    label{
      margin-bottom: 0 !important;
      margin-right: 1vw;
    }
  }

  .email-verify input{
    font-size: 0.729vw;
  }
  
  .verify-btn{
    width:  5vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #ffc44b;
    font-size: 0.729vw;
  }

  .t-and-c{
    margin-bottom: 0;
    font-size: 0.625vw;
    color: #666676;
    line-height: 1;
    text-align: center;
  }
}
`;
