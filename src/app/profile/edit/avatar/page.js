"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Lottie from "lottie-react";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { updateFileEventModule } from "@/store/actions/utilities";
import useMediaQuery from "@/hooks/useMediaQuery";
import ImageComponent from "@/components/common/ImageComponent";
import cameraIcon from "@public/json/profile/camera.json";
import { colors } from "@/lib/constants";
import { CSSTransition } from "react-transition-group";
import WavaButton from "@/components/layout/Header/WavaButton";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Image from "next/image";
import ProfileEditPage from "@/app/profile/edit/page";

import { updateUserAvatarAction } from "@/store/actions/pages/profileEditInfoAction";
import { setOutOfQuotaDataAction } from "@/store/actions/outOfQuotaData";
import { backRoutes } from "@/store/actions/historyActions";
import { getAvatarPrice, getPriceUnit } from "@/lib/services/price";

const ProfileEditAvatarLayout = ({
  children,
  storeUserAvatar,
  backRoutesAction,
}) => {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const nodeRef = useRef(null);

  if (!isMobile)
    return (
      <CSSTransition
        timeout={200}
        in={true}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_showCover"
        nodeRef={nodeRef}
      >
        <div className="float_cover">
          <div
            className="float_cover_container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <section className="g-flex-space-between align-items-center w-100">
              <div className="g-center fw-m gap-2">
                <Image
                  src="/images/icons/close_dark_icon.svg"
                  width={0}
                  height={0}
                  className="cursor float_cover_close"
                  alt="bh5_close_icon"
                  onClick={() => {
                    backRoutesAction();
                  }}
                />
                {t("Profile.edit.info.label.change_avatars")}
              </div>
              <WavaButton className="float_cover_store">
                <span onClick={storeUserAvatar}>{t("Post.modal_confirm")}</span>
              </WavaButton>
            </section>
            {children}
          </div>
        </div>
      </CSSTransition>
    );
  return (
    <ProfileEditAvatarLayoutElement>{children}</ProfileEditAvatarLayoutElement>
  );
};
export const ProfileEditAvatarLayoutElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    @media (max-width: 899px) {
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding-top: ${main_height}px;
        height: 100%;
        display: flex;
        justify-content: start;
        background: #f3f4f5;
    }
  `}
`;
const ProfileEditAvatar = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const animeRef = useRef();
  const { isMobile } = useMediaQuery();
  const { avatar_list = [], avatar = "" } = state.user;
  const [dynamicImg, setDynamicImg] = useState(avatar);
  const [selectImgIndex, setSelectImgIndex] = useState(-2);
  //selectImgIndex -1=自行選定 -2=沒選
  const [uploadFile, setUploadFile] = useState({});
  useEffect(() => {
    animeRef.current.goToAndStop(0, true); // (幾豪秒的動畫,要不要秀)
  }, []);
  function updateFileEvent(e) {
    let files = updateFileEventModule(e);
    if (files) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setDynamicImg(e.target.result);
      };
      reader.readAsDataURL(files[0].file);
      setUploadFile({ file: files[0].file, type: 0 });
      // updateUserAvatar(files[0].file);
    }
  }
  function onChangeImg(e) {
    const value = e.target;
    setDynamicImg(value.src);
    setSelectImgIndex(Number(value.getAttribute("index")));
    setUploadFile(avatar_list[Number(value.getAttribute("index"))]);
  }
  function pause() {
    animeRef.current.pause();
    animeRef.current.goToAndStop(0, true);
  }
  function play() {
    animeRef.current.play();
  }
  function judgeWhetherUnLock() {
    //selectImgIndex -1=自行選定 -2=沒選
    if (selectImgIndex === -1) {
      return false;
    }
    if (avatar_list[selectImgIndex])
      if (avatar_list[selectImgIndex].is_pay === 1) {
        return true;
      } else {
        return false;
      }
    return true;
  }

  /**
   * @description judging avatar price && unit
   *
   * @param { integer } adData
   * @param { integer } type
   * @param { integer } is_pay 0=lock , 1=unlock
   */
  // function judgingAvatarPiceAndUnit(amount, type, is_pay) {
  //   if (is_pay === 0 || amount !== 0) {
  //     let typeValue =
  //       type === 1
  //         ? t("Global.gold_money")
  //         : type === 2
  //         ? t("Global.money")
  //         : "";
  //     if (amount === 0) return t("Global.free");
  //     return amount + typeValue;
  //   }
  //   return t("Social.detail.info.label.unlocked");
  // }

  function userUpload() {
    setSelectImgIndex(-1);
    setDynamicImg("");
  }

  function storeUserAvatar() {
    if (selectImgIndex === -1) {
      updateUserAvatar({ file: uploadFile.file });
    } else {
      updateUserAvatar({ avatar_id: avatar_list[selectImgIndex].id });
    }
  }

  const updateUserAvatar = ({ file, avatar_id }) => {
    useGlobalDispatch(updateUserAvatarAction({ file, avatar_id, callback: backRoutesAction }));
  };
  const unClockAvatar = (
    id,
    money,
    unit,
    type = "init",
    callback = () => {}
  ) => {
    // type init =預設圖片 personal=個人上傳
    useGlobalDispatch(
      setOutOfQuotaDataAction({
        buy_id: id,
        buy_type: 5,
        gold: money,
        checkOnPage: true,
        show: true,
        showBuy: true,
        closeType: "hidden",
        unit: unit === 2 ? "diamond" : "gold",
        avatarType: type,
        callback: callback,
      })
    );
    // useGlobalDispatch(unClockAvatarAction(id));
  };

  const unClock = () => {
    const avatarList = state.user.avatar_list;
    if (avatarList[selectImgIndex]) {
      unClockAvatar(
        avatarList[selectImgIndex].id,
        avatarList[selectImgIndex].amount,
        avatarList[selectImgIndex].type,
        "init",
        () => {}
      );
    } else {
      const input = document.getElementById("upload_personal_avatar");
      //id =""
      // money= 10
      // unit 2=晶鑽
      // type="personal"
      unClockAvatar("", 10, 2, "personal", () => {
        input.click();
      });
    }
  };

  const backRoutesAction = () => {
    useGlobalDispatch(backRoutes());
  };

  return (
    <ProfileEditPage>
      <ProfileEditAvatarLayout
        storeUserAvatar={storeUserAvatar}
        backRoutesAction={backRoutesAction}
      >
        <ProfileEditAvatarElement>
          {isMobile ? (
            <TopBarContainer>
              <TopTitleBar
                title={t("Profile.edit.info.label.change_avatars")}
                showBack={true}
                show_back_color
              />
              <WavaButton className="top_title_bar_btn">
                <span onClick={storeUserAvatar}>{t("Post.modal_confirm")}</span>
              </WavaButton>
            </TopBarContainer>
          ) : (
            ""
          )}
          <section className="avatar_list_top">
            <ImageComponent
              lazyLoad={false}
              src={dynamicImg}
              alt="bh5_img"
              title={"img"}
              background_color="transparent"
              height={isMobile ? 100 : 30}
            />
          </section>
          <section className="avatar_list_body">
            <span className="fw-m">
              {t("Profile.edit.info.label.choice_avatar")}
            </span>
            <section className="avatar_list_main">
              <input
                id="upload_personal_avatar"
                className="displaynone"
                type="file"
                accept="image/gif, image/jpeg, image/png, image/jpg, image/bmp, video/mp4"
                onChange={updateFileEvent}
              />
              <label className="avatar_list_main_item cursor">
                <Lottie
                  onClick={userUpload}
                  animationData={cameraIcon}
                  onMouseLeave={pause}
                  onMouseEnter={play}
                  lottieRef={animeRef}
                  style={{
                    borderRadius: "5px",
                    border: `1px solid ${
                      selectImgIndex === -1 ? colors.back_dark_pink : "#f3f4f5"
                    }`,
                  }}
                />
                10 {getPriceUnit(t)}
              </label>
              {avatar_list.map((item, index) => {
                if (item.status === 1) {
                  return (
                    <div
                      className="avatar_list_main_item cursor"
                      key={`${item.note}-${index}`}
                    >
                      <span onClick={onChangeImg}>
                        <ImageComponent
                          background_color="transparent"
                          src={item.img}
                          alt={item.note}
                          title={item.note}
                          index={index}
                          style={{
                            border: `1px solid ${
                              selectImgIndex === index
                                ? colors.back_dark_pink
                                : "#f3f4f5"
                            }`,
                          }}
                          {...item}
                        />
                      </span>
                      {getAvatarPrice(t, item)}
                      {/* {judgingAvatarPiceAndUnit(
                        item.amount,
                        item.type,
                        item.is_pay
                      )} */}
                      {!item.is_pay && !item.is_free ? (
                        <Image
                          className="avatar_list_main_item_lock_icon"
                          src="/images/profile/lock_icon.svg"
                          width={0}
                          height={0}
                          alt="bh5_lock_icon"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  );
                } else {
                  return "";
                }
              })}
            </section>
            <section className="avatar_list_footer">
              {judgeWhetherUnLock() ? (
                <WavaButton className="avatar_list_footer_button hidden">
                  <span>隱藏</span>
                </WavaButton>
              ) : (
                <span onClick={unClock}>
                  <WavaButton className="avatar_list_footer_button">
                    {t("Profile.edit.info.label.unlock_have")}
                  </WavaButton>
                </span>
              )}
            </section>
          </section>
        </ProfileEditAvatarElement>
      </ProfileEditAvatarLayout>
    </ProfileEditPage>
  );
};
export default ProfileEditAvatar;
export const ProfileEditAvatarElement = styled.div`
  /*  */
  .displaynone {
    display: none;
  }
  @media (max-width: 899px) {
    padding: 0 0.5em;
  }
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 0.5rem;
  max-width: 550px;
  min-height: 500px;
  .avatar_list {
    &_top {
      img {
        animation: fadeIn 3s;
      }
    }
    &_body {
      @media (max-width: 899px) {
        background: #fff;
        padding: 0.5rem;
      }
    }
    &_main {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      &_item {
        @media (max-width: 899px) {
          flex: 0 0 18%;
        }

        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 0 0 15%;
        border-radius: 5px;
        margin-bottom: 0.5rem;
        text-align: center;
        color: ${colors.text_grey};
        font-size: 0.8rem;
        &_lock_icon {
          position: absolute;
          width: 1.5em;
        }
      }
    }
    &_footer {
      &_button {
        text-align: center;
        background: ${colors.back_dark_pink};
        padding: 1em 1.5em;
        color: #fff;
        border-radius: 5px;
        font-weight: bold;
        font-size: 1.2rem;
        cursor: pointer;
        &.hidden {
          opacity: 0;
          cursor: default;
        }
      }
    }
  }

  .top_title_bar_btn {
    color: #fff;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;
