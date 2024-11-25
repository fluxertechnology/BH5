"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { REG_SET, colors } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import WavaButton from "@/components/layout/Header/WavaButton";
import { CSSTransition } from "react-transition-group";
import callToast from "@/lib/services/toastCall";

import {
  editUserDataAction,
  updateUserAvatarAction,
} from "@/store/actions/pages/profileEditNickNameAction";

import { pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const { editNickNameReq: reg } = REG_SET;
const ProfileEditInfo = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { nick_name, nickname_update_count } = state.user;
  const [tipMsg, setTipMsg] = useState("");
  const [regErr, setRegErr] = useState(false);
  const [showView, setShowView] = useState(false);
  const [newNickName, setNewNickName] = useState("");
  useEffect(() => {
    let Element = document.getElementsByClassName("PCFooterElement");
    setTimeout(() => Element[0].style.setProperty("display", "none"), 100);
  }, []);

  useEffect(() => {
    if (tipMsg === "暱称已存在") {
      setRegErr(true);
    } else if (tipMsg === "更新成功") {
      callToast(tipMsg);
      editSuccesssToProile();
      setTipMsg("");
    } else if (tipMsg === "精鑽不足") {
      callToast(tipMsg);
      setTipMsg("");
    }
  }, [tipMsg]);

  function onChangeValue(e) {
    setNewNickName(e.target.value);
  }

  function onSubmit() {
    if (reg && !reg.test(newNickName)) {
      setRegErr(true);
      setTipMsg(t("Profile.edit.info.label.nick_name_not_comply_rules"));
    } else {
      editUserData(
        {
          nick_name: newNickName,
        },
        setTipMsg
      );
    }
  }
  function onOpenModal() {
    setShowView(true);
  }

  const updateUserAvatar = (fileData) => {
    useGlobalDispatch(updateUserAvatarAction(fileData));
  };
  const editUserData = (data, callback) => {
    useGlobalDispatch(editUserDataAction(data, callback));
  };
  const editSuccesssToProile = () => {
    useGlobalDispatch(pushRoutes(pageUrlConstants.profile));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={t("Profile.edit.info.label.editor_nick_name")}
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);
  const nodeRef = useRef(null);
  return (
    <ProfileEditInfoElement
      not_input={newNickName === ""}
      main_height={state.navbar.mainHeight}
    >
      <CSSTransition
        timeout={200}
        in={showView}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_view"
        nodeRef={nodeRef}
      >
        <div className="float_cover" onClick={() => setShowView(false)}>
          <div
            className="float_cover_container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="float_cover_container_title">
              <p className="float_cover_container_title_text">
                {t("Profile.edit.info.label.editor_nick_name")}
              </p>
            </div>
            <div className="float_cover_container_content">
              {t("Profile.edit.info.label.confirm_use_nick_name")}
            </div>
            <div className="float_cover_container_btn">
              <div
                className="float_cover_container_btn_button heightlight"
                onClick={() => {
                  setShowView(false);
                  onSubmit();
                }}
              >
                <span className="float_cover_container_btn_button_text">
                  {t("Profile.edit.info.label.confirm_edit")}
                </span>
              </div>
              <div
                className="float_cover_container_btn_button "
                onClick={() => {
                  setShowView(false);
                }}
              >
                <span className="float_cover_container_btn_button_text">
                  {t("Post.reject")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
      <article className="profile_edit_container">
        <span className="profile_edit_title">
          {t("Profile.edit.info.label.nick_name")}
        </span>
        <div className="profile_edit_input_container">
          <input
            type="text"
            value={newNickName}
            onFocus={() => setRegErr(false)}
            onChange={onChangeValue}
            placeholder={t("Profile.edit.info.label.nick_name_now") + nick_name}
          />
          <div style={{ display: "none" }}>{nick_name}</div>
          {/* {regErr && <span className="error">昵称不符规则限制</span>} */}
          {regErr && <span className="error">{tipMsg}</span>}
        </div>
        <p className="profile_edit_subtitle">
          {t(
            nickname_update_count > 0
              ? "Profile.edit.info.label.tip_need_pay"
              : "Profile.edit.info.label.tip"
          )}
        </p>
      </article>
      <footer>
        <ol>
          <li className="footer_title">
            {t("Profile.edit.info.label.nick_name_rules")}
          </li>
          <li>
            1.
            {t("Profile.edit.info.label.tip1")}
          </li>
          <li>
            2.
            {t("Profile.edit.info.label.tip2")}
          </li>
          <li>
            3.
            {t("Profile.edit.info.label.tip3")}
          </li>
        </ol>
      </footer>
      <div
        onClick={onOpenModal}
        style={{
          pointerEvents: newNickName === "" ? "none" : "auto",
        }}
      >
        <WavaButton className="float_cover_button">
          {t("Profile.feeback.label.submit")}
        </WavaButton>
      </div>
    </ProfileEditInfoElement>
  );
};

export default ProfileEditInfo;

export const ProfileEditInfoElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height", "not_input"].includes(prop),
})`
  ${({ main_height, not_input }) => `
    /*  */
    padding-top: ${main_height}px;
    box-sizing: border-box;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    background-color: ${colors.back_grey};

    .profile_edit {
        &_container {
        background: #fff;
        display: flex;
        flex-direction: column;
        padding: 20px 15px;
        gap: 5px;
        input {
            border: 0;
            font-size: 18px;
            border-bottom: inset;
            padding: 15px 2px;
            color: ${colors.text_grey};
            width: 100%;
            @media (max-width: 899px) {
            font-size: 16px;
            }
            &:focus {
            outline: none;
            }
        }
        }
        &_title {
        font-size: 18px;
        @media (max-width: 899px) {
            font-size: 16px;
        }
        }
        &_subtitle {
        font-size: 16px;
        color: ${colors.text_light_grey};
        @media (max-width: 899px) {
            font-size: 12px;
        }
        }

        &_input_container {
        position: relative;
        display: flex;
        align-items: center;
        padding: 1px;
        height: 100%;
        }
    }
    footer {
        padding: 20px 15px;
        color: ${colors.text_light_grey};
        .footer_title {
        color: ${colors.text_grey};
        }
        li {
        margin: 5px 0;
        }
    }

    .float_cover_button {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        cursor: pointer;
        padding: 20px;
        box-sizing: border-box;
        font-weight: 700;
        text-align: center;
        color: #fff;
        background-color: ${
          not_input ? colors.text_light_grey : colors.back_dark_pink
        };
        font-size: 1.4rem;
        @media (max-width: 899px) {
        font-size: 1rem;
        padding: 15px;
        }
    }
    .error {
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        right: 5px;
        font-weight: 700;
        color: #f00;
        font-size: 14px;
    }
    @media (max-width: 899px) {
        font-size: 12px;
    }

    .float_cover {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 11;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto;
        background-color: #000c;
    }
    .float_cover {
        &_subscribe_container,
        &_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        width: 300px;
        background-color: #fff;
        border-radius: 5px;

        &_title {
            margin-top: 20px;
            font-weight: 600;
            &_text {
            font-size: 18px;
            }
        }

        &_content {
            margin-top: 15px;
            width: 80%;
            text-align: center;
            color: ${colors.text_grey};

            &_input {
            width: 100%;
            text-align: center;
            border: none;
            border-bottom: 1px solid;
            outline: none;
            border-radius: 0;
            }
        }

        &_btn {
            display: flex;
            flex-direction: column;
            margin-top: 15px;
            width: 80%;

            &_button {
            cursor: pointer;
            padding: 10px;
            margin: 5px 0;
            box-sizing: border-box;
            width: 100%;
            font-size: 14px;
            text-align: center;
            border-radius: 20px;

            &_text {
                color: ${colors.text_light_grey};
            }

            &.heightlight {
                background-color: ${colors.back_dark_pink};

                .float_cover_container_btn_button_text {
                color: #fff;
                }
            }
            }
        }
        }
    }
  `}
`;
