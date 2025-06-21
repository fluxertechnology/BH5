"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import ImageComponent from "@/components/common/ImageComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";
import useIndexDBController from "@/hooks/useIndexDBController";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import { userFBLoginOutAction, userLoginOutAction } from "@/store/actions/user";
import { initPostData } from "@/store/actions/pages/postMainAction";
import { clearVipInfoAction } from "@/store/actions/pages/profileBuyVipCommonAction";
import {
  editUserDataAction,
  getAvatarListAction,
  updateUserAvatarAction,
} from "@/store/actions/pages/profileEditInfoAction";
import { backRoutes } from "@/store/actions/historyActions";
import { useCleanStateData } from "@/hooks/useSaveStateData";

const ProfileEditInfo = ({ children }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const { deleteData } = useIndexDBController();
  const { avatar, nick_name, sex } = state.user;
  useEffect(() => {
    getAvatarList();
  }, []);

  function sexEditEvent(sex) {
    editUserData({
      sex: sex,
    });
  }
  function storeUserAvatar() {
    // updateUserAvatar(object)
  }

  const clearUserData = () => {
    useGlobalDispatch(userLoginOutAction());
    useGlobalDispatch(clearVipInfoAction());
    useGlobalDispatch(backRoutes());
    useGlobalDispatch(userFBLoginOutAction());
    useGlobalDispatch(initPostData());
  };
  const updateUserAvatar = (fileData) => {
    useGlobalDispatch(updateUserAvatarAction(fileData));
  };
  const editUserData = (data) => {
    useGlobalDispatch(editUserDataAction(data));
  };
  const getAvatarList = () => {
    useGlobalDispatch(getAvatarListAction());
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={t("Profile.edit.info.label.editor_data")}
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <ProfileEditInfoElement main_height={state.navbar.mainHeight}>
      <div className="profile_from">
        <LinkComponent
          className="profile_from_item"
          routes={
            pageUrlConstants.profile.pages.profileEdit.pages.profileEditInfo
              .pages.profileEditAvatar
          }
        >
          <label className="profile_from_item cursor_pointer">
            <div className="profile_from_item_img">
              <ImageComponent
                className="profile_from_item_img_img"
                is_cover={true}
                src={avatar}
                background_color="transparent"
                alt="nick_name"
                title="nick_name"
                border_radius={"50%"}
              />
            </div>
            <div className="profile_from_item_text">
              {t("Profile.edit.info.label.change_avatars")}
            </div>
            <FontAwesomeIcon
              className="profile_from_item_arrow"
              icon={faAngleRight}
            />
          </label>
        </LinkComponent>
        <LinkComponent
          className="profile_from_item"
          routes={
            pageUrlConstants.profile.pages.profileEdit.pages.profileEditNickName
          }
        >
          <div className="profile_from_item_label">
            {t("Profile.edit.info.label.editor_nick_name")}
          </div>

          <div className="profile_from_item_input">
            <div className="profile_from_item_input_el">{nick_name}</div>
          </div>
          <FontAwesomeIcon
            className="profile_from_item_arrow"
            icon={faAngleRight}
          />
        </LinkComponent>
        <div className="profile_from_item">
          <div className="profile_from_item_label">
            {t("Profile.edit.info.label.sex")}
          </div>
          <div className="profile_from_item_radio">
            <div
              className="profile_from_item_radio_label"
              onClick={() => {
                sexEditEvent(2);
              }}
            >
              <div className="profile_from_item_radio_label_radio">
                <div
                  className={
                    "profile_from_item_radio_label_radio_dot " +
                    (sex === 2 ? "active" : "")
                  }
                />
              </div>
              {t("Profile.edit.info.label.man")}
            </div>
            <div
              className="profile_from_item_radio_label"
              onClick={() => {
                sexEditEvent(1);
              }}
            >
              <div className="profile_from_item_radio_label_radio">
                <div
                  className={
                    "profile_from_item_radio_label_radio_dot " +
                    (sex === 1 ? "active" : "")
                  }
                />
              </div>
              {t("Profile.edit.info.label.male")}
            </div>
          </div>
        </div>
      </div>
      <LinkComponent
        className="profile_from"
        routes={pageUrlConstants.login.pages.resetPassword}
      >
        <div className="profile_from_item cursor_pointer">
          <div className="profile_from_item_label">
            {t("Profile.edit.info.label.edit_password")}
          </div>
          <FontAwesomeIcon
            className="profile_from_item_arrow"
            icon={faAngleRight}
          />
        </div>
      </LinkComponent>
      <div
        className="profile_loginout"
        onClick={() => {
          window.localStorage.clear();
          useCleanStateData();
          clearUserData();
          deleteData();
        }}
      >
        <div className="profile_loginout_btn">
          {t("Profile.edit.info.label.logout")}
        </div>
      </div>
      {children}
    </ProfileEditInfoElement>
  );
};

export default ProfileEditInfo;

export const ProfileEditInfoElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    padding-top: ${main_height}px;
    box-sizing: border-box;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    background-color: ${colors.back_grey};
    .profile_from {
        display: block;
        padding: 0 ${padding}px;
        margin-bottom: 10px;
        text-decoration: none;
        background-color: #fff;

        &_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        font-size: 24px;
        color: #a8a8a8;
        border-bottom: 1px solid #a8a8a8;
        font-weight: 900;
        text-decoration: none;

        &.cursor_pointer {
            cursor: pointer;
            width: 100%;
        }

        &:last-child {
            border-bottom: none;
        }

        &_label,
        &_img {
            margin-right: auto;
            color: #646464;
        }

        &_img {
            width: 60px;
            height: 60px;
        }

        &_input {
            display: flex;
            width: 60%;
            // max-width: 200px;

            @media (max-width: 1024px) {
              width: 40%;
              max-width: 200px;
            }

            &_el {
              width: 100%;
              font-size: 22px;
              text-align: right;
              color: #a8a8a8;
              border: none;
              outline: none;
              font-weight: 900;

              @media (max-width: 1024px) {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
        }

        &_radio {
            display: flex;

            &_label {
            cursor: pointer;
            display: flex;
            align-items: center;

            &_radio {
                display: inline-block;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin: 0 5px;
                box-sizing: border-box;
                width: 24px;
                height: 24px;
                border: 2px solid #a8a8a8;
                border-radius: 50%;

                &_dot {
                width: 80%;
                height: 80%;
                border-radius: 50%;

                &.active {
                    background-color: #fa719a;
                }
                }
            }
            }
        }

        &_arrow {
            margin-left: 16px;
        }
        }
    }

    .profile_loginout {
        cursor: pointer;
        padding: 20px;
        margin-top: 50px;
        text-align: center;
        background-color: #fff;

        &_btn {
        font-weight: 900;
        font-size: 24px;
        color: #fa719a;
        }
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
        &_container {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 1rem;
        box-sizing: border-box;
        min-width: 300px;
        background-color: #fff;
        border-radius: 5px;
        }
        &_close {
        width: 25px;
        }
        &_store {
        color: ${colors.back_dark_pink};
        font-size: 12px;
        cursor: pointer;
        padding: 5px 15px;
        box-sizing: border-box;
        border-radius: 30px;
        border: 1px solid ${colors.grey};
        }
    }
    `}
`;
