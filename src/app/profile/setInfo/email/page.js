"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styled from "styled-components";
import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { colors, pageUrlConstants } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pushRoutes } from "@/store/actions/historyActions";
import { postBindEmailAction } from "@/store/actions/pages/profileSetAction";
import { getEmailVerifyCode } from "@/store/actions/pages/loginSignupAction";
import store, { useGlobalContext, useGlobalDispatch } from "@/store";
const { login } = pageUrlConstants;

function ProfileSetEmail() {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { dispatch } = useGlobalContext();

  const postBindEmail = (email, code) => {
    if(store.getState().user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(postBindEmailAction(email, code, t));
    }
  }

  const getEmailVerificationCode = (email) => {
    useGlobalDispatch(getEmailVerifyCode(email));
  }

  const [emailValue, setEmailValue] = useState("");
  const [verification, setVerification] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [disabledSec, setDisabledSec] = useState(0);
  const getEmailVerifyCodeAction = () => {
    if (isButtonDisabled) {
      return;
    }
    setIsButtonDisabled(true);
    setDisabledSec(5);
    try {
        getEmailVerificationCode(emailValue);
    } catch (e) {
      setIsButtonDisabled(false);
    }
  };
  const confirmBindEmail = () => {
    if (emailValue) {
      postBindEmail(emailValue, verification);
    }
  };

  useEffect(() => {
    let interval;
    if (disabledSec > 0) {
      interval = setInterval(() => {
        setDisabledSec((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [disabledSec]);

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
              title={t("Profile.setting.info.label.mail")}
              showBack={true}
              show_back_color="black"
              back_color="#fff"
              color={"black"}
              />
            </TopBarContainer>
          </>
        ),
      }
    });
  }, [isMobile]);

  return (
    <ProfileSetEmailElement>
      <div className="input">
        <div className="input_body">
          <input
            className="input_body_input"
            type="text"
            value={emailValue}
            placeholder="请输入邮箱"
            onChange={(e) => {
              setEmailValue(e.target.value);
            }}
          />
          <div className="input_body_verification mt-3">
            <input
              className="input_body_input "
              type="text"
              value={verification}
              placeholder="请输入邮箱验证码"
              onChange={(e) => {
                setVerification(e.target.value);
              }}
            />
            <span
              className="input_body_verification_bottom_area"
              onClick={getEmailVerifyCodeAction}
            >
              <WavaButton
                className={`input_body_verification_button ${
                  isButtonDisabled && "disabled"
                } `}
              >
                {disabledSec > 0 ? disabledSec : "获取验证码"}
                {/* {intl.formatMessage({ id: "PROFILE.SETTING.INFO.LABEL.CONFIRM" })} */}
              </WavaButton>
            </span>
          </div>
        </div>
        <div className="description">请填写您常使用的邮箱，绑定后不可更改</div>
      </div>
      <span onClick={confirmBindEmail}>
        <WavaButton className="footer cursor">
          确认绑定
          {/* {intl.formatMessage({ id: "PROFILE.SETTING.INFO.LABEL.CONFIRM" })} */}
        </WavaButton>
      </span>
    </ProfileSetEmailElement>
  );
}

export default ProfileSetEmail;

const ProfileSetEmailElement = styled.div`
  /*  */
  box-sizing: border-box;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  padding: 0 2em;
  padding-top: ${main_height}px;
  @media (max-width: 899px) {
    padding: 0 1em;
    padding-top: ${main_height}px;
  }
  .input {
    width: 100%;
    &_body {
      margin-top: 16px;
      font-size: 1rem;
      line-height: 22px;
    }
    &_body {
      &_verification {
        display: flex;
        gap: 1em;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        &_bottom_area {
          flex: 0 0 25%;
        }
        &_button {
          text-align: center;
          display: flex;
          justify-content: center;
          font-size: 1rem;
          color: #fff !important;
          background: ${colors.back_dark_pink};
          padding: 1em 1.5em;
          cursor: pointer;
          border-radius: 0.2rem;
          @media (max-width: 899px) {
            padding: 1em 0.5em;
          }
          &.disabled {
            background: ${colors.text_grey};
            pointer-events: none;
          }
        }
      }
      &_input {
        width: 100%;
        height: 3.5rem;
        font-size: 1.2rem;
        border-radius: 0.2rem;
        border: 1px solid ${colors.text_grey};
        font-weight: 700;
        box-sizing: border-box;
        padding-left: 0.5em;
        @media (max-width: 899px) {
          font-size: 1rem;
        }
      }
    }
    .description {
      color: ${colors.text_light_grey};
      text-align: center;
      margin-top: 1em;
      font-size: 0.8rem;
    }
  }

  .footer {
    font-size: 1rem;
    color: #fff;
    text-align: center;
    background: ${colors.back_dark_pink};
    padding: 1em 1.5em;
    margin-top: 20em;
    font-weight: 700;
  }
`;
