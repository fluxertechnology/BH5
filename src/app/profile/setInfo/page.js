"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faEnvelope,
  faQuestionCircle,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import { CSSTransition } from "react-transition-group";
import store, { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pushRoutes } from "@/store/actions/historyActions";
import { postBindEmailAction, postBindInviteAction } from "@/store/actions/pages/profileSetAction";
const { login, profile } = pageUrlConstants;

function ItemCard({ faIcon, title, callback }) {
  return (
    <div className="container_content_item" onClick={callback}>
      <WavaButton className="container_content_item_box">
        <div className="container_content_item_box_title">
          <span className="container_content_item_box_title_icon">
            <FontAwesomeIcon
              className="container_content_item_box_title_icon_img"
              icon={faIcon}
            />
          </span>
          <p className="container_content_item_box_title_text">{title}</p>
        </div>
        <div className="container_content_item_box_arrow">
          <FontAwesomeIcon
            className="container_content_item_box_arrow_icon"
            icon={faAngleRight}
          />
        </div>
      </WavaButton>
    </div>
  );
}

function CoverMaker({ show, closeEvent, children }) {
  const nodeRef = useRef();
  return (
    <CSSTransition
      timeout={200}
      in={show}
      classNames="CSSTransition_opacity"
      unmountOnExit
      key="CSSTransition_email"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="cover"
        onClick={() => {
          closeEvent(false);
        }}
      >
        <div
          className="cover_container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
}

function ProfileSetInfo() {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { dispatch } = useGlobalContext();

  const postBindEmail = (email) => {
    if(store.getState().user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(postBindEmailAction(email,t));
    }
  }
  const postBindInvite = (parentid) => {
    if(store.getState().user.id === "guest") {
      useGlobalDispatch(pushRoutes(login));
    } else {
      useGlobalDispatch(postBindInviteAction(parentid,t));
    }
  }

  const [showEmail, setShowEmail] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [inviteValue, setInviteValue] = useState("");
  

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                title={t("Profile.setting.info.index")}
                showBack={true}
                show_back_color="#ffffff"
              />
            </TopBarContainer>
          </>
        ),
      }
    });
  }, [isMobile]);

  return (
    <ProfileSetInfoElement>
      <CoverMaker show={showEmail} closeEvent={setShowEmail}>
        <div className="input">
          <div className="input_header">
            {t("Profile.setting.info.label.mail")}
          </div>
          <div className="input_body">
            <input
              className="input_body_input"
              type="text"
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value);
              }}
            />
          </div>
          <div className="input_footer">
            <div
              className="input_footer_btn"
              onClick={() => {
                postBindEmail(emailValue);
                setEmailValue("");
              }}
            >
              {t("Profile.setting.info.label.confirm")}
            </div>
          </div>
        </div>
      </CoverMaker>
      <CoverMaker show={showInvite} closeEvent={setShowInvite}>
        <div className="input">
          <div className="input_header">
            {t("Profile.setting.info.label.bind.invitation.code")}
          </div>
          <div className="input_body">
            <input
              className="input_body_input"
              type="text"
              value={inviteValue}
              onChange={(e) => {
                setInviteValue(e.target.value);
              }}
            />
          </div>
          <div className="input_footer">
            <div
              className="input_footer_btn"
              onClick={() => {
                postBindInvite(inviteValue);
                setInviteValue("");
              }}
            >
              {t("Profile.setting.info.label.confirm")}
            </div>
          </div>
        </div>
      </CoverMaker>
      <CoverMaker show={showAbout} closeEvent={setShowAbout}>
        <div className="about">
          <div className="about_header">
            {t("Profile.setting.info.label.about_us")}
          </div>
          <div className="about_body">
            {t("Profile.setting.info.label.body.description")}
          </div>
          <div className="about_footer">
            <div
              className="about_footer_btn"
              onClick={() => {
                setShowAbout(false);
              }}
            >
              {t("Profile.setting.info.label.confirm")}
            </div>
          </div>
        </div>
      </CoverMaker>

      <div className="container">
        <div className="container_content">
          <ItemCard
            faIcon={faEnvelope}
            title={t("Profile.setting.info.label.mail")}
            callback={() => {
              // setShowEmail(true);
              useGlobalDispatch(pushRoutes(profile.pages.profileSet.pages.profileSetEmail));
            }}
          />
          <ItemCard
            faIcon={faTicketAlt}
            title={t("Profile.setting.info.label.bind.invitation.code")}
            callback={() => {
              setShowInvite(true);
            }}
          />
        </div>
        <div className="container_content">
          <ItemCard
            faIcon={faQuestionCircle}
            title={t("Profile.setting.info.label.about_us")}
            callback={() => {
              setShowAbout(true);
            }}
          />
        </div>
      </div>
    </ProfileSetInfoElement>
  );
}

export default ProfileSetInfo;

const ProfileSetInfoElement = styled.div`
  /*  */
  padding-top: ${main_height}px;
  box-sizing: border-box;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-color: ${colors.back_grey};

  .cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 11;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    max-width: 599px;
    background-color: #000a;

    &_container {
      padding: ${padding}px;
      background-color: #fff;
      border-radius: 10px;
    }
  }

  .container {
    &_content {
      border-bottom: 20px solid ${colors.back_grey};

      &:first-child {
        border-top: 20px solid ${colors.back_grey};
      }

      &:last-child {
        border-bottom: none;
      }

      &_item {
        cursor: pointer;
        background-color: #fff;
        border-bottom: 1px solid ${colors.back_grey};

        &_box {
          display: flex;
          justify-content: space-between;
          padding: 20px ${padding}px;
          box-sizing: border-box;

          &:last-child {
            border-bottom: none;
          }

          &_title {
            display: flex;
            align-items: center;
            font-size: 18px;

            &_icon {
              margin-right: 10px;
              color: ${colors.dark_pink};

              &_img {
                vertical-align: bottom;
              }
            }

            &_text {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .input,
  .about {
    width: 80vw;
    max-width: 450px;

    &_header {
      font-size: 26px;
      font-weight: 600;
    }

    &_body {
      margin-top: 16px;
      font-size: 18px;
      line-height: 22px;
    }

    &_footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;

      &_btn {
        cursor: pointer;
        color: #00dede;
      }
    }
  }

  .input {
    &_body {
      &_input {
        width: 100%;
        border: none;
        border-bottom: 1px solid;
        outline: none;
      }
    }
  }
`;
