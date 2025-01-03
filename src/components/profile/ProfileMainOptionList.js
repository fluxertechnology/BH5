import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { adsKeys, colors } from "@/lib/constants";
import ImageCarousel from "@/components/common/ImageCarousel";

import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext } from "@/store";
import Image from "next/image";

const ProfileMainOptionList = ({ optionEvent, buyDiscount }) => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const t = useTranslations();
  const optionListMiddle = [
    // {
    //   id: "app",
    //   icon: optionAppIcon,
    //   name: intl.formatMessage({ id: "PROFILE.MAIN.OPTION.APPLICATION" }),
    // },
    {
      id: "socialGroup",
      icon: "/images/profile/option_social.svg",
      name: t("Profile.main.option.official_friend_group"),
    },
    {
      id: "buyDiscount",
      icon: "/images/profile/buy_discount.svg",
      name: t("Profile.main.option.buy_discount"),
    },
  ];

  const optionListBottom = [
    {
      id: "service",
      icon: "/images/profile/option_service.svg",
      name: t("Profile.main.option.common_problem"),
    },
    {
      id: "feedback",
      icon: "/images/profile/option_feedback.svg",
      name: t("Profile.main.option.feeback"),
    },
  ];
  let [optionListTop, setOptionListTop] = useState([
    {
      id: "collect",
      icon: "/images/profile/option_collect.svg",
      name: t("Profile.main.option.own.collect"),
    },
    {
      id: "bundle",
      icon: "/images/profile/option_gift.svg",
      name: t("Profile.main.option.own.gift"),
      decoration: {
        show: false,
        type: 0,
        text: t("Profile.main.option.news_discount"),
      },
    },
    {
      id: "purchase",
      icon: "/images/profile/option_purchase.svg",
      name: t("Profile.main.option.history.buy"),
    },
    {
      id: "watchHistory",
      icon: "/images/profile/buy_history.svg",
      name: t("Profile.main.option.history.watch"),
    },
    {
      id: "notification",
      icon: "/images/profile/option_notification.svg",
      name: t("Profile.main.option.news"),
    },
    {
      id: "myorder",
      icon: "/images/profile/option_myorder.svg",
      name: t("Profile.main.option.mall_order"),
    },
    {
      id: "mission",
      icon: "/images/profile/option_mission.svg",
      name: t("Profile.main.option.task."),
    },
    {
      id: "switchLanguage",
      icon: "/images/profile/option_swtich.svg",
      name: t("Profile.main.option.switch_language"),
    },
    // {
    //   id: "manualRecharge",
    //   icon: optionManualRechargeIcon,
    //   name: "人工代充",
    // },
    // {
    //   id: "share",
    //   icon: optionShareIcon,
    //   name: "推广看片",
    // },
  ]);

  useEffect(() => {
    optionListTop[1].decoration.show = state.user.new_coupon_notification;
    setOptionListTop(optionListTop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProfileMainOptionListElement>
      <div className="list_container fw-m">
        <h3 className="list_container_title fw-l">
          {t("Profile.main.option.common_effect")}
        </h3>
        {optionListTop.map((data) => {
          return (
            <div
              className="list_container_item"
              key={data.id}
              onClick={() => {
                optionEvent[data.id]();
              }}
            >
              <div className="list_container_item_icon">
                <Image
                  width={34}
                  height={34}
                  className="list_container_item_icon_img"
                  src={data.icon}
                  alt="mission"
                />
              </div>
              <div className="list_container_item_title">
                <span className="list_container_item_title_text">
                  {data.name}
                </span>
              </div>
              {data.decoration?.show ? (
                data.decoration.type === 0 ? (
                  <div className="list_container_item_decoration">
                    {data.decoration.text}
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <div className="list_container_item_arrow">
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
            </div>
          );
        })}
      </div>
      <ImageCarousel
        adsKey={adsKeys.profile_interval}
        threeInOneBanner={!isMobile}
        size={isMobile ? "22.667vw" : "7.578vw"}
        is_cover
      />
      <div className="list_container fw-m">
        <h3 className="list_container_title">
          {t("Profile.main.option.godd_stuff")}
        </h3>
        {optionListMiddle.map((data) => {
          return (
            <div
              className="list_container_item"
              key={data.id}
              onClick={() => {
                if (data.id === "buyDiscount") {
                  buyDiscount();
                } else {
                  optionEvent[data.id]();
                }
              }}
            >
              <div className="list_container_item_icon">
                <Image
                  width={34}
                  height={34}
                  className="list_container_item_icon_img"
                  src={data.icon}
                  alt="mission"
                />
              </div>
              <div className="list_container_item_title">
                <span className="list_container_item_title_text">
                  {data.name}
                </span>
              </div>
              <div className="list_container_item_arrow">
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="list_container fw-m">
        <h3 className="list_container_title">
          {t("Profile.main.option.call_us")}
        </h3>
        {optionListBottom.map((data) => {
          return (
            <div
              className="list_container_item"
              key={data.id}
              onClick={() => {
                optionEvent[data.id]();
              }}
            >
              <div className="list_container_item_icon">
                <Image
                  width={34}
                  height={34}
                  className="list_container_item_icon_img"
                  src={data.icon}
                  alt="mission"
                />
              </div>
              <div className="list_container_item_title">
                <span className="list_container_item_title_text">
                  {data.name}
                </span>
              </div>
              <div className="list_container_item_arrow">
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
            </div>
          );
        })}
      </div>
    </ProfileMainOptionListElement>
  );
};

export default ProfileMainOptionList;

export const ProfileMainOptionListElement = styled.div`
  /*  */
  padding: 2% 1% 1% 1%;
  background-color: ${colors.back_grey};

  .list_container {
    padding: 1%;
    background-color: #fff;
    font-size: 14px;

    @media (min-width: 599px) {
      font-size: 20px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &_title {
      font-size: 16px;
      padding-top: 14px;
      font-weight: 900;
      @media (min-width: 599px) {
        font-size: 24px;
      }
    }

    &_item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      margin-top: 5px;
      border-bottom: 1px solid #aaa;

      &:last-child {
        border-bottom: none;
      }

      &_icon {
        margin-right: 5px;

        &_img {
          width: 34px;
          height: 34px;
          vertical-align: middle;
        }
      }

      &_title {
        margin-right: auto;
      }

      &_decoration {
        padding: 5px;
        margin-right: 10px;
        color: ${colors.dark_pink};
        background-color: ${colors.light_pink};
      }
    }
  }
`;
