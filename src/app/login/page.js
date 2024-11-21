"use client";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { padding, pageUrlConstants, REG_SET } from "@/lib/constants";

import IconInput, { input_margin } from "@/components/login/IconInputComponent";

import LinkComponent from "@/components/common/LinkComponent";
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

const { login } = pageUrlConstants;
const { alphanumericReq } = REG_SET;

const LoginMainPage = () => {
  const t = useTranslations();
  const { state } = useGlobalContext();

  const phoneNemberRef = useRef(null);
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
      userSumbit();
    }
  }

  function userSumbit() {
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
  const toSignup = () => {
    useGlobalDispatch(pushRoutes(login.pages.signup));
  };

  return (
    <LoginMainPageElement>
      <form className="input_content">
        <div className="input_content_box">
          <IconInput
            ref={phoneNemberRef}
            inputType="account"
            value={phoneNumber}
            callback={phoneNumberEvent}
            placeholder={t("Login.placeholder_account")}
            enterKeyHint="next"
            reg={alphanumericReq}
            regErrStr={t("Login.tip_error_account")}
          />
        </div>
        <div className="input_content_box">
          <IconInput
            ref={passwordRef}
            inputType="password"
            value={password}
            callback={passwordEvent}
            placeholder={t("Login.placeholder_password")}
            enterKeyHint="done"
          />
        </div>
        <div className="input_content_help">
          <LinkComponent
            className="input_content_help_link highlight"
            routes={login.pages.recoverPassword}
          >
            {t("Login.forget_password")}
          </LinkComponent>
          <LinkComponent
            className="input_content_help_link"
            routes={{
              linkurl: state.config.group_cs,
            }}
          >
            {t("Login.customer_service")}
          </LinkComponent>
        </div>
      </form>
      <div className="button_container">
        <div className="button_container_btn highlight" onClick={userSumbit}>
          {t("Login.go_login")}
        </div>
        <div className="other_container">
          <div className="other_container_title">
            <p className="other_container_title_text">
              {t("Login.select_login_mode")}
            </p>
          </div>
          <div className="other_container_buttons">
            {loginOptions.map((option, index) => (
              <div className="other_container_buttons_btn" key={index}>
                <div className="other_container_buttons_btn_content">
                  <LinkComponent
                    className="other_container_buttons_btn_content_link"
                    routes={{
                      name: login.pages.loginOhter.name + option.title,
                      path: login.pages.loginOhter.path,
                      dynamic: {
                        loginType: option.type,
                      },
                    }}
                  >
                    <div className="other_container_buttons_btn_content_link_icon">
                      <img
                        className="other_container_buttons_btn_content_link_icon_img"
                        src={option.icon}
                        alt={option.title}
                      />
                    </div>
                  </LinkComponent>
                </div>
              </div>
            ))}

            {/* REMARKS: unable to npm i react-facebook-login */}

            {/* <FacebookLogin
              disableMobileRedirect={true}
              appId={process.env.REACT_APP_KEY_THIRD_LOGIN_FB}
              fields="name,email,picture"
              state="oauth"
              callback={responseFacebook}
              render={(renderProps) => (
                <div
                  className="other_container_buttons_btn cursor"
                  onClick={renderProps.onClick}
                >
                  <div className="other_container_buttons_btn_content">
                    <div className="other_container_buttons_btn_content_link">
                      <div className="other_container_buttons_btn_content_link_icon">
                        <img
                          className="other_container_buttons_btn_content_link_icon_img"
                          src={"/images/login/icon-fb.svg"}
                          alt={"Fb Login"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            /> */}
          </div>
        </div>
        <div className="button_container_gap">
          <span className="button_container_gap_span">
            {t("Login.not_have_account")}
          </span>
        </div>
        <div className="button_container_btn" onClick={toSignup}>
          {t("Login.register")}
        </div>
      </div>
    </LoginMainPageElement>
  );
};

// LoginMainPage.propTypes = {
// newNotice: PropTypes.number.isRequired,
// clickSerch: PropTypes.func.isRequired,
// clickAvatar: PropTypes.func.isRequired,
// clickNew: PropTypes.func.isRequired,
// };

export default LoginMainPage;

export const LoginMainPageElement = styled.div`
  /*  */
  padding: ${padding}px;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);

  .input_content {
    &_box {
      margin-bottom: ${input_margin}px;
      height: 40px;
      @media (min-width: 599px) {
        min-height: 60px;
      }
    }

    &_help {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      &_link {
        cursor: pointer;
        padding: 0 4px;
        font-size: 14px;
        text-decoration: none;
        color: #a8a8a8;
        @media (min-width: 599px) {
          font-size: 16px;
          padding-left: 1em;
        }
        &.highlight {
          color: #f24c7c;
        }
      }
    }
  }

  .button_container {
    margin-top: 25px;

    &_btn {
      cursor: pointer;
      padding: 8px 0;
      text-align: center;
      color: #f24c7c;
      background-color: #ffdde7;
      border-radius: 4px;
      font-weight: 600;
      @media (min-width: 899px) {
        font-size: 17px;
        padding: 0;
        min-height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &.highlight {
        color: #fff;
        background-color: #f24c7c;
      }
    }

    &_gap {
      margin-top: 20px;
      margin-bottom: 5px;
      text-align: center;

      &_span {
        position: relative;
        display: inline-block;
        font-size: 12px;
        color: #646464;
        @media (min-width: 899px) {
          font-size: 14px;
          padding: 0 1em;
        }
        &::before,
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 0.5px;
          background-color: #979797;
          @media (min-width: 899px) {
            width: 30px;
          }
        }

        &::before {
          left: -22px;
        }

        &::after {
          right: -22px;
        }
      }
    }
  }

  .other_container {
    margin-top: 20px;
    &_title {
      &_text {
        margin-bottom: 5px;
        font-size: 12px;
        color: #646464;
        font-weight: 500;
        text-align: center;
        @media (min-width: 899px) {
          font-size: 14px;
          padding: 0 1em;
        }
      }
    }

    &_buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      &_btn {
        &_content {
          padding: 10px;
          &_link {
            display: flex;
            border-radius: 35px;
            text-decoration: none;
            align-items: center;
            justify-content: space-evenly;
            &_icon {
              &_img {
                width: 30px;
                height: 30px;
                vertical-align: middle;
                @media (min-width: 599px) {
                  width: 40px;
                  height: 40px;
                }
              }
            }
          }
        }
      }
    }
  }
`;
