"use client";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { colors, padding, REG_SET, pageUrlConstants } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import IconInput, { input_margin } from "@/components/login/IconInputComponent";

import callToast from "@/lib/services/toastCall.js";
import { callCaptcha, CALL_CAPTCHA_TYPE } from "@/lib/services/callCaptcha";
import WavaButton from "@/components/layout/Header/WavaButton";
import { userLoginAction } from "@/store/actions/user";
import { backRoutes, replaceRoutes } from "@/store/actions/historyActions";
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
import PopupDialog from "@/components/login/PopupComponent";

const { qqReg, emailReq, emailVerifyReq, alphanumericReq } = REG_SET;

const { home } = pageUrlConstants;

let captcha = {};
let interval = "";
const LoginSignupPage = () => {
  const t = useTranslations();

  const { state } = useGlobalContext();
  const { is_mobile_reg, is_email_reg, is_qq_reg } = state.config;  
  const showSignupType = [is_qq_reg, is_mobile_reg, is_email_reg];
  let defaultSignType = showSignupType.length - 1;
  for (let i = 0; i < showSignupType.length; i++) {
    if (showSignupType[i]) {
      defaultSignType = i;
      break;
    }
  }

  const [loginType, setLoginType] = useState(defaultSignType);
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
    let utm_source = localStorage.getItem("origin");
    let shareMa = undefined;
    let utc_data = localStorage.getItem("utmMark")
      ? JSON.parse(localStorage.getItem("utmMark"))
      : "";
    if (utc_data && utc_data.shareMa) {
      shareMa = utc_data.shareMa;
    }
    if (utc_data && utc_data.utm_source) {
      utm_source = utc_data.utm_source;
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
    <LoginSignupPageElement>
      <div id="aaaa" />
      <div className="login_type">
        {loginType !== 3 &&
          loginTypeList.map(
            (data, index) =>
              !!showSignupType[index] && (
                <div
                  className={
                    "login_type_box " + (index === loginType && "active")
                  }
                  onClick={() => {
                    setLoginType(index);
                  }}
                  key={data.name}
                >
                  {data.name}
                </div>
              )
          )}
      </div>
      <form className="input_content">
        {loginType === 2 && (
          <>
            <div className="input_content_box">
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
          </>
        )}
        {loginType === 0 && (
          <>
            <div className="input_content_box">
              <IconInput
                required
                className="input_content_box_input"
                ref={qqAccRef}
                inputType="number"
                value={qqAcc}
                callback={qqAccEvent}
                placeholder={t("Login.placeholder_qq")}
                enterKeyHint="next"
                reg={qqReg}
                regErrStr={t("Login.tip_error_qq")}
              />
            </div>
          </>
        )}
        {loginType === 1 && (
          <>
            <div className="input_content_box">
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
          </>
        )}
        {loginType === 3 && (
          <>
            <div className="input_content_box">
              <IconInput
                className="input_content_box_input"
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
                  className={`input_content_box_btn ${
                    verifyTimer > 0 && "disabled"
                  }`}
                >
                  {verifyTimer > 0
                    ? verifyTimer + t("Login.after_second_sent")
                    : t("Login.placeholder_get_letter")}
                </WavaButton>
              </div>
            </div>
            <div className="input_content_box"></div>
          </>
        )}
        {loginType !== 3 && (
          <>
            <div className="input_content_box">
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
          </>
        )}
      </form>
      <div className="input_submit" onClick={signupUserSubmit}>
        <p
          className={`input_submit_text ${
            loginType === 3 && emailVerify === "" && "disabled"
          }`}
        >
          {loginType !== 3 || emailVerify !== ""
            ? t("Login.register")
            : t("Login.write_verity_code")}
        </p>
      </div>
    </LoginSignupPageElement>
  );
};

export default LoginSignupPage;

export const LoginSignupPageElement = styled.div`
  /*  */
  padding: ${padding}px;

  .login_type {
    display: flex;
    margin-bottom: 10px;
    &_box {
      cursor: pointer;
      font-size: 12px;
      margin-right: 5px;
      padding: 4px 10px;
      border-radius: 6px;
      border: solid 1px #fa719a;
      color: #fa719a;
      &.active {
        color: #fff;
        background-color: #f24c7c;
      }
    }
  }

  .input_content {
    &_box {
      display: flex;
      margin-bottom: ${input_margin}px;
      height: 60px;
      @media (max-width: 899px) {
        height: 40px;
      }
      &_input {
        width: 100%;
      }
      &_btn {
        display: flex;
        align-items: center;
        cursor: pointer;
        flex-shrink: 0;
        flex-grow: 1;
        margin-left: 10px;
        box-sizing: border-box;
        min-width: 300px;
        height: 100%;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background-color: #f24c7c;
        border-radius: 4px;
        place-content: center;
        @media (max-width: 899px) {
          min-width: 100px;
          font-size: 14px;
        }
        &.disabled {
          color: #fff;
          background-color: ${colors.text_light_grey};
        }
      }
    }
  }

  .input_submit {
    cursor: pointer;
    margin-top: 6rem;

    &_text {
      padding: 16px 0;
      font-size: 18px;
      width: 100%;
      text-align: center;
      color: #fff;
      background-color: #f24c7c;
      border-radius: 4px;
      font-weight: 700;
      &.disabled {
        background-color: #d8d8d8;
        color: ${colors.text_grey};
      }
      @media (max-width: 899px) {
        padding: 10px 0;
        font-size: 14px;
      }
    }
  }
`;
