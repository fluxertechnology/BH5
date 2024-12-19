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

const PopupDialogRegister = () => {
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

  // const loginTypeList = [
  //   {
  //     name: t("Register.qq"),
  //   },
  //   {
  //     name: t("Register.general"),
  //   },
  //   {
  //     name: t("Register.email"),
  //   },
  // ];
  
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

  const clearFormInput = (loginType) => {
    setAccount("");
    setPassword("");
    setEmail("");
    setLoginType(loginType);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      gt4();
    }
  }, []);
  
  return (
    <div className="card-body">
      {loginType === 1 && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{ t("Register.general") }</label>
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
              <label className="form-label">{ t("Register.password") }</label>
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
              <button className="submit-btn">{ t("Login.register") }</button>
            </div>
          </div>
          <p className="t-and-c">{ t("Register.t_and_c_1") } <br /> <strong>{ t("Register.t_and_c_2") }</strong>{ t("Register.t_and_c_3") }<strong>{ t("Register.t_and_c_4") }</strong> </p>

          <div className="fast-register">
            {/* <div className="title-wrapper">
              <h3>{ t("Register.fast_register_title") }</h3>
              <p>{ t("Register.fast_register_subtitle") }</p>
            </div> */}
            <div className="user-register" onClick={() => clearFormInput(2)}>
              <FontAwesomeIcon className="mail-icon" icon={faEnvelope} style={{color: "#434343"}} />
              <p>{ t("Register.fast_register_email") }</p>
            </div>
          </div>
        
        </>
      )}
      {(loginType === 2 || loginType == 3) && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{ t("Register.email") }</label>
              <IconInput
                required
                disabled={loginType == 3}
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
              <label className="form-label">{ t("Register.password") }</label>
              <div className="eye-cont" onClick={showPassword}>
                <FontAwesomeIcon className="eye-icon" icon={faEye} style={{color: "#c6c6c6"}} />
              </div>
              <IconInput
                required
                disabled={loginType == 3}
                className="input_content_box_input"
                ref={passwordRef}
                inputType="password"
                value={password}
                callback={passwordEvent}
                placeholder={t("Login.placeholder_password")}
                enterKeyHint="done"
              />
            </div>

            {loginType == 3 && <div className="input_content_box email-verify-box">
              <label className="form-label">{ t("Register.verifyCode") }</label>
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
            }

            <div className="btn-wrapper" onClick={signupUserSubmit}>
              <button className="submit-btn">
                <p className={` ${loginType === 3 && emailVerify === "" && "disabled"}`}>
                  {loginType !== 3 || emailVerify !== ""
                    ? t("Login.register")
                    : t("Login.write_verity_code")}
                </p>
                </button>
              {loginType == 3 && (
                <button className="edit-btn" onClick={() => setLoginType(2)}>
                  <p>{ t("Register.editDetails") }</p>
                </button>
              )}
            </div>
            <p className="t-and-c">{ t("Register.t_and_c_1") } <br /> <strong>{ t("Register.t_and_c_2") }</strong>{ t("Register.t_and_c_3") }<strong>{ t("Register.t_and_c_4") }</strong> </p>

            <div className="fast-register">
              {/* <div className="title-wrapper">
                <h3>{ t("Register.fast_register_title") }</h3>
                <p>{ t("Register.fast_register_subtitle") }</p>
              </div> */}
              <div className="user-register" onClick={() => clearFormInput(1)}>
                <FontAwesomeIcon className="mail-icon" icon={faCircleUser} style={{color: "#434343"}} />
                <p>{ t("Register.general") }</p>
              </div>
            </div>
          </div>
        
        </>
      )}
    </div>
  );
};

export default PopupDialogRegister;