"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import ImageComponent from "@/components/common/ImageComponent";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import callToast from "@/lib/services/toastCall";
import { pushRoutes } from "@/store/actions/historyActions";
import {
  buyVipMemberAction,
  exchangeVipCodeAction,
  setVipInfoAction,
} from "@/store/actions/pages/profileBuyVipCommonAction";

const ProfileBuyVipCommon = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const [selectOption, setSelectOption] = useState(0);

  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (!state.vipInfoData.vip) {
      setVipInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buyMemberEvent() {
    if (
      parseInt(state.user.money) >=
      state.vipInfoData.vip[selectOption].pay_price
    ) {
      buyVipMember(state.vipInfoData.vip[selectOption]);
    } else {
      toBuyGoldPage();
    }
  }

  const setVipInfo = () => {
    useGlobalDispatch(setVipInfoAction());
  };
  const exchangeVipCode = (exchangeCode) => {
    if (exchangeCode.length === 0) {
      callToast(t("Toast.unsuccess_unactivie_code"));
    } else {
      useGlobalDispatch(exchangeVipCodeAction(exchangeCode));
    }
  };
  const buyVipMember = (vipInfo) => {
    useGlobalDispatch(buyVipMemberAction(vipInfo, t));
  };
  const toBuyGoldPage = () => {
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profilePayment)
    );
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        isShowFooter: false,
      },
    });
  }, []);
  return (
    <ProfileBuyVipCommonElement>
      <div className="container">
        <div className="container_header">
          <div className="container_header_info">
            <div className="container_header_info_avatar">
              <ImageComponent
                is_cover={true}
                src={state.user.avatar}
                background_color="transparent"
                placeholderImg={state.user.avatar}
                border_radius="50%"
              />
            </div>
            <div className="container_header_info_detail">
              <div className="container_header_info_detail_title">
                <p className="container_header_info_detail_title_text">
                  {t("Profile.buy.respect")}：
                  {state.user.nick_name
                    ? state.user.nick_name
                    : state.user.username}
                </p>
                {state.user.time === "-1" ||
                Date.now() < state.user.time * 1000 ? (
                  <span className="container_header_info_detail_title_text_hight">
                    {state.user.time === "-1"
                      ? t("Profile.buy.watch.forever")
                      : t("Profile.buy.watch.limit")}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="container_header_info_detail_time">
                <p className="container_header_info_detail_time_text">
                  {state.user.time === "-1"
                    ? t("Profile.buy.watch.forever_1")
                    : Date.now() < state.user.time * 1000
                    ? t("Profile.buy.label.will_be") +
                      new Date(state.user.time * 1000)
                        .toLocaleDateString()
                        .toString() +
                      t("Profile.buy.label.maturity.")
                    : t("Profile.buy.label.maturity.vip")}
                </p>
              </div>
            </div>
          </div>
          <div className="container_header_input">
            <div className="container_header_input_container">
              <div className="container_header_input_container_title">
                <span className="container_header_input_container_title_icon">
                  <Image
                    className="container_header_input_container_title_icon_img"
                    src="/images/profile/diamond.svg"
                    width={0}
                    height={0}
                    alt="diamond"
                  />
                </span>
                <span className="container_header_input_container_title_text">
                  {t("Profile.buy.label.vip.redemption_code")}
                </span>
              </div>
              <div className="container_header_input_container_box">
                <input
                  className="container_header_input_container_box_input"
                  type="text"
                  placeholder={t("Profile.buy.placeholder.vip.redemption_code")}
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                  }}
                />
                <div
                  className="container_header_input_container_box_submit fw-m"
                  onClick={() => {
                    exchangeVipCode(verificationCode);
                  }}
                >
                  {t('Profile.buy.label.redeem_now')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container_body">
        <div className="container_body_title mb-3">
          <Image
            className="container_body_title_icon"
            src="/images/icons/crown.png"
            width={0}
            height={0}
            alt="crown"
          />
          <span className="container_body_title_text fw-l ">
            {t("Profile.buy.label.buy.member")}
          </span>
        </div>
        <div className="container_body_content">
          {state.vipInfoData.vip
            ? state.vipInfoData.vip.map((data, index) => {
                return (
                  <div
                    className={
                      "container_body_content_item fw-m " +
                      (selectOption === index ? "active" : "")
                    }
                    key={data.id}
                    onClick={() => {
                      setSelectOption(index);
                    }}
                  >
                    <div className="container_body_content_item_title">
                      <span className="container_body_content_item_title_text">
                        {data.outside_display_name}
                        <span className="container_body_content_item_discount ml-2">
                          原价¥{data.pay_price + data.pay_price * (index + 1)}
                        </span>
                      </span>
                      {/* {data.orig_price} */}
                    </div>
                    <div className="container_body_content_item_price">
                      <span className="container_body_content_item_price_text">
                        <span
                          className={
                            "container_body_content_item_price_text_discount mr-2 " +
                            (selectOption === index && "active")
                          }
                        >
                          特惠
                        </span>
                        ¥ {data.pay_price}
                      </span>
                    </div>
                  </div>
                );
              })
            : ""}
          <div className="container_body_content_info">
            <Image
              className="container_body_content_info_icon"
              src="/images/profile/exclamation.png"
              width={0}
              height={0}
              alt="exclamation"
            />
            <span className="container_body_content_info_text">
              {t("Profile.buy.label.info.member_description")}
            </span>
          </div>
        </div>
      </div>
      <div className="container_footer">
        <div className="container_footer_title">
          <p className="container_footer_title_text">
            {t("Profile.buy.label.benefit_introduce")}
          </p>
        </div>
        <div className="container_footer_highlight">
          <HighlightItem
            icon="/images/profile/buyvip_free.svg"
            text={t("Profile.buy.label.free")}
          />
          <HighlightItem
            icon="/images/profile/buyvip_infinite.svg"
            text={t("Profile.buy.label.watch.forever")}
          />
          <HighlightItem
            icon="/images/profile/buyvip_server.svg"
            text={t("Profile.buy.label.exclusive")}
          />
          <HighlightItem
            icon="/images/profile/buyvip_card.svg"
            text={t("Profile.buy.label.premium_icon")}
          />
        </div>
        <div className="container_more_info">
          <p className="mb-5">
            {t("Profile.buy.label.info.description_1")}
            {t("Profile.buy.label.info.description_2")}
          </p>
        </div>
        <div className="container_footer_btn" onClick={buyMemberEvent}>
          <span className="container_footer_btn_text">
            {t("Profile.buy.label.buy.money")}
            <FontAwesomeIcon className="ml-2" icon={faAngleRight} />
          </span>
        </div>
      </div>
    </ProfileBuyVipCommonElement>
  );
};

export default ProfileBuyVipCommon;

const ProfileBuyVipCommonElement = styled.div`
  /*  */
  .container {
    &_header {
      position: sticky;
      top: 0;
      padding: 10px 0;
      margin-bottom: 20px;
      background-color: #000;
      @media (min-width: 599px) {
        padding: 20px ${padding}px 1px;
      }

      &_info {
        display: flex;
        padding: 0 ${padding}px;
        color: #fff;
        &_avatar {
          width: 60px;
          height: 60px;
        }

        &_detail {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: flex-start;
          margin-left: 10px;
          font-size: 12px;
          &_title {
            &_text {
              font-size: 16px;
              &_hight {
                margin-top: 2%;
                font-size: 12px;
                display: inline-block;
                padding: 2px 5px;
                vertical-align: middle;
                background-color: #daad75;
                border-radius: 10px;
              }
            }
          }

          &_time {
            display: inline-block;
            padding: 3px 5px;
            background-color: #daad75;
            border-radius: 20px;
          }
        }
      }

      &_input {
        padding: 0 20px;
        margin: 3% 1% -18%;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 0 10px #aaa;
        @media (min-width: 599px) {
          margin: 1% 4%;
        }

        &_container {
          padding: 20px;

          &_title {
            text-align: center;

            &_icon {
              &_img {
                width: 20px;
                height: 20px;
                vertical-align: middle;
              }
            }

            &_text {
              margin-left: 10px;
              font-weight: 700;
            }
          }

          &_box {
            display: flex;
            margin-top: 10px;

            &_input {
              flex-grow: 1;
              padding: 7px 7px 7px 25px;
              width: 0;
              border: 1px solid #aaa;
              border-right: none;
              border-radius: 20px 0 0 20px;
              outline: none;
            }

            &_submit {
              cursor: pointer;
              flex-shrink: 0;
              padding: 2%;
              font-size: 20px;
              line-height: 22px;
              text-align: center;
              color: #fff;
              background-image: linear-gradient(
                to Right,
                #fbc6c0 0%,
                #fa97ab 45%,
                #fa719a 100%
              );
              border-radius: 0 20px 20px 0;
              @media (min-width: 599px) {
                padding: 0.762vw 9.171vw;
              }
            }
          }
        }
      }
    }

    &_body {
      padding: ${padding}px;
      padding-top: 15%;
      @media (min-width: 599px) {
        padding: ${padding}px;
      }
      &_title {
        display: flex;
        &_icon {
          width: 20px;
          height: 20px;
          vertical-align: bottom;
        }

        &_text {
          margin-left: 10px;
          font-size: 18px;
        }
      }

      &_content {
        &_item {
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          padding: 20px 1%;
          margin-top: 10px;
          font-size: 20px;
          color: #a8a8a8;
          border: 1px solid #000;
          border-radius: 5px;
          transition: 0.2s;
          @media (max-width: 599px) {
            font-size: 16px;
          }

          &.active {
            color: #000;
            background-color: rgb(239 215 173 / 20%);
            border-color: #daad75;
          }

          &_discount {
            color: #a8a8a8;
            text-decoration: line-through;
          }

          &_price_text {
            padding: 20px;

            &_discount {
              color: white;
              padding: 2px 10px;
              font-size: 16px;
              background-color: #a8a8a8;
              &.active {
                background-color: ${colors.dark_pink};
              }
            }
          }
        }

        &_info {
          margin-top: 10px;

          &_icon {
            margin-right: 5px;
            width: 20px;
            height: 20px;
            vertical-align: middle;
            display: inline;
          }

          &_text {
            font-size: 12px;
            color: #daad75;
          }
        }
      }
    }

    &_more_info {
      text-align: center;
      color: ${colors.text_light_grey};
      > p {
        padding: 8px;
        &:first-child {
          padding-bottom: 0;
        }
      }
    }

    &_footer {
      padding: ${padding}px;

      &_title {
        font-size: 22px;
        font-weight: 900;
      }

      &_highlight {
        display: flex;
      }

      &_btn {
        cursor: pointer;
        font-size: 20px;
        display: block;
        padding: 20px;
        margin: auto;
        text-align: center;
        color: #fff;
        background-image: linear-gradient(97deg, #efd7ad, #daad75);
        border-radius: 35px;
      }
    }
  }
`;

const HighlightItem = ({ icon, text }) => {
  return (
    <HighlightElementItem>
      <Image
        className="icon"
        src={icon}
        width={0}
        height={0}
        alt={text}
        title={text}
      />
      <p className="text">{text}</p>
    </HighlightElementItem>
  );
};

const HighlightElementItem = styled.div`
  /*  */

  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 8%;
  @media (max-width: 599px) {
    padding: 20px 1%;
  }
  .icon {
    width: 53%;
  }

  .text {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #885f2c;
  }
`;
