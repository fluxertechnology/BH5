"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import styled from "styled-components";

import BundleFoldrComponent, {
  BundleFoldrComponentElement,
} from "@/components/profile/bundle/BundleFoldrComponent";
import BundleCapsuleComponent from "@/components/profile/bundle/BundleCapsuleComponent";
import { colors, requestUrlConstants } from "@/lib/constants";

import { main_height, sub_height } from "@/components/layout/Header/TopBarContainer";
import axiosRequest from "@/lib/services/axios";
import store from "@/store";
import ImageComponent from "@/components/common/ImageComponent";
import CloseComponent, {
    CloseComponentElement,
  } from "@/components/common/CloseComponent";
import { CSSTransition } from "react-transition-group";
import callToast from "@/lib/services/toastCall";

const { postGetCapsuleAwardUrl, postExchangeAwardUrl } = requestUrlConstants;

const ProfileBundleReward = () => {
  const t = useTranslations();
  const [awardItem, setAwardItem] = useState([]);
  const [awardReceiveItem, setAwardReceiveItem] = useState([]);
  const [awardExpirItem, setAwardExpirItem] = useState([]);
  const [exchangeActualData, setExchangeActualData] = useState({});
  const [exchangeActualAddress, setExchangeActualAddress] = useState("");
  const [exchangeActualPhone, setExchangeActualPhone] = useState("");
  const [exchangeActualUsername, setExchangeActualUsername] = useState("");
  const [exchangeActualArea_code, setExchangeActualArea_code] = useState("");

  useEffect(() => {
    getAwardItemEvent();
  }, []);

  function getAwardItemEvent() {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    axiosRequest.post(postGetCapsuleAwardUrl, formData).then((data) => {
      let time = Date.now() / 1000;
      let awardItemArr = [];
      let awardReceiveItemArr = [];
      let awardExpirItemArr = [];
      data.forEach((myAwardItem, i) => {
        if (myAwardItem.is_receive === 0 && myAwardItem.expire_time > time) {
          myAwardItem.index = i;
          awardItemArr.push(myAwardItem);
        } else if (
          myAwardItem.is_receive === 1 &&
          myAwardItem.expire_time > time
        ) {
          myAwardItem.index = i;
          awardReceiveItemArr.push(myAwardItem);
        } else if (myAwardItem.expire_time < time) {
          myAwardItem.index = i;
          awardExpirItemArr.push(myAwardItem);
        }
      });

      setAwardItem(awardItemArr);
      setAwardReceiveItem(awardReceiveItemArr);
      setAwardExpirItem(awardExpirItemArr);
    });
  }

  function exchangeMyAwardItem(itemId, index, element) {
    let formData = new FormData();
    formData.append("uid", store.getState().user.id);
    formData.append("award_id", itemId);
    // console.log(itemId);
    axiosRequest
      .post(postExchangeAwardUrl, formData)
      .then((data) => {
        // myAwardItem[index].is_receive = 1;
        element.parentNode.parentNode.parentNode.parentNode.style.height =
          element.parentNode.parentNode.parentNode.parentNode.offsetHeight +
          "px";

        setTimeout(() => {
          element.parentNode.parentNode.parentNode.parentNode.style.height = 0;
          element.parentNode.parentNode.parentNode.parentNode.style.marginBottom = 0;
          element.parentNode.parentNode.parentNode.parentNode.style.border = 0;
          element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.padding = 0;

          setTimeout(() => {
            if (
              element.parentNode.parentNode.parentNode.parentNode.parentNode
                .childNodes.length <= 4
            ) {
              // if(!myAwardCold) {
              //   myAwardCold = true;
              //   setTimeout(() => {
              //     myAwardCold = false;
              //     myAwardPage = myAwardPage + 1;
              //     printMyAwardResultItem();
              //   }, 100);
              // }
            }
            for (let i = 0; i < awardItem.length; i++) {
              if (awardItem[i].id === itemId) {
                awardItem.splice(i, 1);
                setAwardItem([...awardItem]);
              }
            }
          }, 100);
        }, 100);
        element.innerText = t("Profile.build.effect.success");
        element.style.backgroundColor = "#73df65";
      })
      .catch((err) => {
        element.innerText = t("Profile.build.effect.unsuccess");
        element.style.backgroundColor = "#324183";
      });
  }

  function exchangeMyAwardActual() {
    let fromData = new FormData();
    fromData.append("uid", store.getState().user.id);
    fromData.append("award_id", exchangeActualData.id);
    fromData.append("address", exchangeActualAddress);
    fromData.append("phone", exchangeActualPhone);
    fromData.append("username", exchangeActualUsername);
    fromData.append("area_code", exchangeActualArea_code);
    if (
      exchangeActualAddress &&
      exchangeActualPhone &&
      exchangeActualUsername &&
      exchangeActualArea_code
    ) {
      axiosRequest
        .post(requestUrlConstants.postExchangeActualAwardUrl)
        .then(() => {
          callToast(t("Toast.tip.success.redemption"));
          setExchangeActualData({});
        });
    } else {
      callToast(t("Toast.tip.success.full_input"));
    }
  }

  function showActualInputWindow(data) {
    setExchangeActualData(data);
  }

  return (
    <ProfileBundleRewardElement>
      <CSSTransition
        timeout={200}
        in={exchangeActualData.id}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_input"
      >
        <div className="actual_window">
          <div className="actual_window_title">
            <p className="actual_window_title_text">
              {t("Profile.build.input.address")}
            </p>
            <CloseComponent
              styleType={3}
              callback={() => {
                setExchangeActualData({});
              }}
            />
          </div>
          <div className="actual_window_container">
            <div className="actual_window_container_header">
              <div className="actual_window_container_header_cover">
                <ImageComponent
                  className="actual_window_container_header_cover_img"
                  src={exchangeActualData.image}
                  alt={exchangeActualData.name}
                  title={exchangeActualData.name}
                />
              </div>
              <div className="actual_window_container_header_title">
                <p className="actual_window_container_header_title_text">
                  {exchangeActualData.name}
                </p>
              </div>
            </div>
            <div className="actual_window_container_body">
              <h3 className="actual_window_container_body_title">
                {t("Profile.build.input.receiver")}
              </h3>
              <div className="actual_window_container_body_name">
                <input
                  className="actual_window_container_body_name_input"
                  type="text"
                  placeholder={t("Profile.build.placeholder.receiver_name")}
                  value={exchangeActualUsername}
                  onChange={(e) => {
                    setExchangeActualUsername(e.target.value);
                  }}
                />
              </div>
              <div className="actual_window_container_body_phone">
                <input
                  className="actual_window_container_body_phone_input"
                  type="number"
                  placeholder={t("Profile.build.placeholder.phone")}
                  value={exchangeActualPhone}
                  onChange={(e) => {
                    setExchangeActualPhone(e.target.value);
                  }}
                />
              </div>
              <div className="actual_window_container_body_zip">
                <input
                  className="actual_window_container_body_zip_input"
                  type="number"
                  placeholder={t("Profile.build.placeholder.postal_code")}
                  value={exchangeActualArea_code}
                  onChange={(e) => {
                    setExchangeActualArea_code(e.target.value);
                  }}
                />
              </div>
              <div className="actual_window_container_body_addess">
                <input
                  className="actual_window_container_body_addess_input"
                  type="text"
                  placeholder={t("Profile.build.placeholder.complete_address")}
                  value={exchangeActualAddress}
                  onChange={(e) => {
                    setExchangeActualAddress(e.target.value);
                  }}
                />
              </div>
            </div>
            <div
              className="actual_window_container_footer"
              onClick={exchangeMyAwardActual}
            >
              <span className="actual_window_container_footer_text">
                {t("Profile.build.label.confirm_sent")}
              </span>
            </div>
          </div>
        </div>
      </CSSTransition>

      <BundleFoldrComponent
        title={t("Profile.build.effect.unuse")}
        children_length={awardItem.length}
      >
        {awardItem.map((data, index) => {
          return (
            <BundleCapsuleComponent
              id={data.id}
              title={data.name}
              expire_time={new Date(data.expire_time * 1000)}
              image={data.image}
              exchange_code={data.exchange_code}
              is_receive={data.is_receive}
              type={data.type}
              exchangeMyAwardItem={exchangeMyAwardItem}
              showActualInputWindow={showActualInputWindow}
              index={data.index}
              data={data}
              key={data.id}
            />
          );
        })}
      </BundleFoldrComponent>
      <BundleFoldrComponent
        title={t("Profile.build.effect.used")}
        children_length={awardReceiveItem.length}
      >
        {awardReceiveItem.map((data, index) => {
          return (
            <BundleCapsuleComponent
              id={data.id}
              title={data.name}
              expire_time={new Date(data.expire_time * 1000)}
              image={data.image}
              exchange_code={data.exchange_code}
              is_receive={data.is_receive}
              type={data.type}
              exchangeMyAwardItem={exchangeMyAwardItem}
              index={data.index}
              key={data.id}
            />
          );
        })}
      </BundleFoldrComponent>
      <BundleFoldrComponent
        title={t("Profile.build.effect.uneffect")}
        children_length={awardExpirItem.length}
      >
        {awardExpirItem.map((data, index) => {
          return (
            <BundleCapsuleComponent
              id={data.id}
              title={data.name}
              expire_time={new Date(data.expire_time * 1000)}
              image={data.image}
              exchange_code={data.exchange_code}
              is_receive={data.is_receive}
              is_expire={true}
              type={data.type}
              exchangeMyAwardItem={exchangeMyAwardItem}
              index={data.index}
              key={data.id}
            />
          );
        })}
      </BundleFoldrComponent>
    </ProfileBundleRewardElement>
  );
};

export default ProfileBundleReward;

export const ProfileBundleRewardElement = styled.section`
  /*  */
  padding: 0.1px 0;
  box-sizing: border-box;
  min-height: calc(var(--vh, 1vh) * 100 - ${main_height + sub_height}px);
  background-color: ${colors.back_grey};

  ${BundleFoldrComponentElement} {
    margin-top: 10px;
  }

  .actual_window {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    padding-top: ${main_height}px;
    margin: auto;
    max-width: 599px;
    background-color: ${colors.dark_pink};

    &_title {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: ${main_height}px;
      font-size: 20px;
      text-align: center;
      letter-spacing: 1px;
      color: #fff;
      font-weight: 700;
      ${CloseComponentElement} {
        position: absolute;
        left: 20px;
        width: 20px;
        height: 20px;
      }
    }

    &_container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: ${colors.back_grey};

      &_header {
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 10px 0;
        background-color: #fff;

        &_cover {
          margin-right: 10px;
          width: 200px;
        }

        &_title {
          &_text {
            font-size: 28px;
            color: #000;
            font-weight: 900;
          }
        }
      }

      &_body {
        flex-grow: 1;
        padding: 20px;
        text-align: left;
        background-color: #fff;

        &_title {
          font-size: 24px;
          font-weight: 900;
        }

        &_name,
        &_phone,
        &_zip,
        &_addess {
          &_input {
            padding: 5px 0;
            margin-top: 20px;
            width: 100%;
            font-size: 24px;
            border: none;
            border-bottom: 2px solid #a8a8a8;
            outline: name;
          }
        }
      }

      &_footer {
        cursor: pointer;
        padding: 20px 10px;
        text-align: center;
        background-image: linear-gradient(105deg, #86b7f7 48%, #5a65f2 100%);

        &_text {
          font-size: 30px;
          letter-spacing: 5px;
          color: #fff;
          font-weight: 900;
        }
      }
    }
  }
`;
