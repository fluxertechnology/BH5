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
import Divider from "@mui/material/Divider";

const ProfileMainOptionList = ({ optionEvent, buyDiscount }) => {
  const { state } = useGlobalContext();
  const { isMobile, isDesktop } = useMediaQuery();
  const t = useTranslations();
  const optionListMiddle = [
    // {
    //   id: "app",
    //   icon: optionAppIcon,
    //   name: intl.formatMessage({ id: "PROFILE.MAIN.OPTION.APPLICATION" }),
    // },
    {
      id: "socialGroup",
      icon: "/images/profile/option_social.png",
      name: t("Profile.main.option.official_friend_group"),
    },
    {
      id: "buyDiscount",
      icon: "/images/profile/buy_discount.png",
      name: t("Profile.main.option.buy_discount"),
    },
  ];

  const optionListBottom = [
    {
      id: "service",
      icon: "/images/profile/option_service.png",
      name: t("Profile.main.option.common_problem"),
    },
    {
      id: "feedback",
      icon: "/images/profile/option_feedback.png",
      name: t("Profile.main.option.feeback"),
    },
  ];
  let [optionListTop, setOptionListTop] = useState([
    {
      id: "collect",
      icon: "/images/profile/option_collect.png",
      name: t("Profile.main.option.own.collect"),
    },
    {
      id: "bundle",
      icon: "/images/profile/option_gift.png",
      name: t("Profile.main.option.own.gift"),
      decoration: {
        show: false,
        type: 0,
        text: t("Profile.main.option.news_discount"),
      },
    },
    {
      id: "purchase",
      icon: "/images/profile/option_purchase.png",
      name: t("Profile.main.option.history.buy"),
    },
    {
      id: "watchHistory",
      icon: "/images/profile/buy_history.png",
      name: t("Profile.main.option.history.watch"),
    },
    {
      id: "notification",
      icon: "/images/profile/option_notification.png",
      name: t("Profile.main.option.news"),
    },
    {
      id: "myorder",
      icon: "/images/profile/option_myorder.png",
      name: t("Profile.main.option.mall_order"),
    },
    {
      id: "mission",
      icon: "/images/profile/option_mission.png",
      name: t("Profile.main.option.task."),
    },
    {
      id: "switchLanguage",
      icon: "/images/profile/option_switch.png",
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
    <ProfileMainOptionListElement isBrowser={isDesktop}>
      <div className="list_container fw-m">
        <h3 className="list_container_title fw-l">
          {t("Profile.main.option.common_effect")}
        </h3>
        <Divider className="profile_container_divider" />
        <div className="options-wrapper">
          <div className="options-cont">
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
                      width={100}
                      height={100}
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
                  {/* {data.decoration?.show ? (
                    data.decoration.type === 0 ? (
                      <div className="list_container_item_decoration">
                        {data.decoration.text}
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )} */}
                  <div className="list_container_item_arrow">
                    <FontAwesomeIcon icon={faAngleRight} color="#f04c7e" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="carousel-container">
        <ImageCarousel
          adsKey={adsKeys.profile_interval}
          threeInOneBanner={isDesktop}
          size={!isDesktop ? "22.667vw" : "7.578vw"}
          is_cover
          customSlidesPerView={!isDesktop ? 1 : 2}
        />
      </div>
      <div className={`list_container fw-m ${isDesktop && "no_top_border"}`}>
        <h3 className="list_container_title">
          {t("Profile.main.option.godd_stuff")}
        </h3>
        <Divider className="profile_container_divider" />
        <div className="options-wrapper">
          <div className="options-cont small">
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
                      width={100}
                      height={100}
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
                    <FontAwesomeIcon icon={faAngleRight} color="#f04c7e" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`list_container fw-m ${isDesktop && "no_top_border"}`}>
        <h3 className="list_container_title">
          {t("Profile.main.option.call_us")}
        </h3>
        <Divider className="profile_container_divider" />
        <div className="options-wrapper">
          <div className="options-cont small contact">
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
                      width={100}
                      height={100}
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
                    <FontAwesomeIcon icon={faAngleRight} color="#f04c7e" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProfileMainOptionListElement>
  );
};

export default ProfileMainOptionList;

export const ProfileMainOptionListElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isBrowser"].includes(prop),
})`
  ${({ isBrowser }) => `
    /*  */
    padding: ${isBrowser ? "0 0 4.65vw" : "4.5vw 2.67vw 30vw"};
    @media (min-width: 768px) and (max-width: 1439px) {
      padding: ${isBrowser ? "0 0 4.65vw" : "4.5vw 2.67vw 10vw"};
    }
    width: ${isBrowser ? "1000px" : "auto"};
    margin: auto;
    background-color: ${colors.back_grey};

    .list_container {
      padding: 0;
      background-color: #fff;
      font-size: ${isBrowser ? "18px" : "3.47vw"};
      border-radius: ${isBrowser ? "0" : "1.33vw"};

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0.45vw;
      }

      &_title {
        padding: ${
          isBrowser ? "2.5rem 2.41rem 0.7vw" : "5.2vw 1.8vw 1.0625rem"
        } ;
        font-size: ${isBrowser ? "22px" : "4vw"};
        padding-top: ${isBrowser ? "14px" : "4vw"};
        font-weight: 900;
        border-bottom: ${isBrowser ? "1px solid #e7e7e7" : "none"};
      }

      &_item {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        // padding: 0 1.875rem;
        // margin-top: 5px;
        // background-color: #fdfbf6;

        &:last-child {
          border-bottom: none;
        }

        &_icon {
          margin-right: ${isBrowser ? "16px" : "2.0vw"};

          &_img {
            width: ${isBrowser ? "22px" : "4.8vw"};
            height: auto;
            vertical-align: middle;
            object-fit: contain;
            margin-right: {isBrowser ? "0.5vw" : "0"};
          }
        }

        &_title {
          margin-right: ${isBrowser ? "0.83vw" : "0"};
          width: ${isBrowser ? "auto" : "17.9vw"};
        }

        &_decoration {
          padding: 5px;
          margin-right: 10px;
          color: ${colors.dark_pink};
          background-color: ${colors.light_pink};
        }
      }
    }

    .contact .list_container_item_title{
      width: auto;
      padding-right: 2.667vw;
    }

    .profile_container_divider {
      margin: 0 0;
      border-width: 0px;
    }

    .options-wrapper {
      padding: ${isBrowser ? "2.4375rem 2.25rem 2.2375rem" : "none"};
      background-color: #fff;
    }

    .options-cont {
      display: grid;
      grid-template-columns: ${isBrowser ? "repeat(4, 1fr)" : "repeat(2, 1fr)"};
      background-color: ${isBrowser ? "#fdfbf6" : "transparent"};
      padding: ${isBrowser ? "1.65vw 1.56vw 1.95vw" : "1.65vw 2vw 7.3vw 10vw"};
      gap: ${isBrowser ? "1.15vw 3vw" : "5.1vw 8.2vw"};
    }

    .options-cont.small {
      padding: ${isBrowser ? "1vw 1.56vw 1.35vw" : "1.65vw 2vw 7.3vw 10vw"};
      grid-template-columns: ${
        isBrowser ? "0.725fr 1fr 1fr" : "repeat(2, 1fr)"
      };
      gap: ${isBrowser ? "1.15vw 1vw" : "5.1vw 8.2vw"};
    }

    .options-cont.small.contact {
      padding: ${isBrowser ? "1vw 1.56vw 1.35vw" : "1.65vw 2vw 7.3vw 10vw"};
      grid-template-columns: ${
        isBrowser ? "0.725fr 1fr 1fr" : "repeat(1, 1fr)"
      };
      gap: ${isBrowser ? "1.15vw 1vw" : "5.1vw 8.2vw"};
    }

    .carousel-container {
      padding: ${isBrowser ? "0 2.4375rem" : "0 2.67vw"};
      width: ${isBrowser ? "100%" : "auto"};
      margin: ${isBrowser && "0 0"};
      background-color: #fff;

    }

    .no_top_border {
        border-radius: ${
          isBrowser ? "0 0 10px 10px" : "0 0 1.33vw 1.33vw"
        };
    }

    .banner-padding {
      width: 100%;
    }
  `}
`;
