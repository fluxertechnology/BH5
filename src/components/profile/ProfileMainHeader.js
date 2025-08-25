import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Lottie from "lottie-react";
import styled from "styled-components";

import ImageComponent from "@/components/common/ImageComponent";

import openVip from "@public/json/profile/open_vip.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { colors, padding, pageUrlConstants, userRank } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";
import useMediaQuery from "@/hooks/useMediaQuery";
import PostsAddModalPage from "@/components/common/ModalRender";
import Image from "next/image";
import store, { useGlobalContext, useGlobalDispatch } from "@/store";
import { openPopup } from "@/store/actions/user";
import { backRoutes, pushRoutes } from "@/store/actions/historyActions";
import Divider from "@mui/material/Divider";

const { profile, login } = pageUrlConstants;

const ProfileMainHeader = ({
  id,
  time,
  avatar,
  username,
  nick_name,
  sex,
  rank,
  day_usedviewcount,
  day_maxviewcount,
  day_share,
  dailyLogin,
  redirectBuy,
}) => {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const { isMobile, isDesktop } = useMediaQuery();
  const [badge, setBadge] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [expirationTip, setExpirationTip] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState(false);
  const [isVIP, setIsVIP] = useState(false);

  const currentDate = new Date();

  useEffect(() => {
    const variable =
      time === "-1"
        ? t("Profile.buy.watch.forever_1")
        : Date.now() > time * 1000
        ? t("Profile.main.vip.maturity")
        : new Date(time * 1000).toLocaleDateString().toString();
    setMembershipDate(variable);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // Check Vip is expiring soon
    if (time && time > 0) {
      const now = Date.now();
      const differenceInMilliseconds = time * 1000 - now;
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

      if (
        rank !== "普通会员" &&
        differenceInDays > 0 &&
        differenceInDays <= 3
      ) {
        setExpiringSoon(true);
      }
    }

    setIsVIP(rank !== "普通会员" || Date.now() < time * 1000);
  }, [time]);

  const clickProfile = () => {
    const userData = store.getState().user;
    if (userData.id !== "guest") {
      useGlobalDispatch(
        pushRoutes(profile.pages.profileEdit.pages.profileEditInfo)
      );
    } else {
      // useGlobalDispatch(pushRoutes(login));
      useGlobalDispatch(openPopup("login"));
    }
  };

  function formatDate(date) {
    const formattedDate = new Date(date * 1000);
    const day = String(formattedDate.getDate()).padStart(2, "0");
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function judgeMembershipExpiration() {
    if (id !== "guest") {
      if (time !== "-1" || Date.now() > time * 1000) {
        setExpirationTip(true);
      } else {
        setExpirationTip(false);
      }
    }
  }
  useEffect(() => {
    //判斷是否要跳出會員權益提醒
    const storedData = window.localStorage.getItem("member_expired_float_show");
    if (storedData) {
      const expirationTime = JSON.parse(storedData);
      // 檢查值是否已過期
      if (new Date().getTime() > expirationTime) {
        // 值已過期，執行相應的處理
        judgeMembershipExpiration();
      } else {
        // 值尚未過期，可以繼續使用
        setExpirationTip(false);
      }
    } else {
      judgeMembershipExpiration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const getBadge = useCallback(
    (rank) => {
      switch (rank) {
        case userRank[0]:
          return "/images/profile/badge_bg_lv_1.png";
        case userRank[1]:
          return "/images/profile/badge_bg_lv_2.png";
        case userRank[2]:
          return "/images/profile/badge_bg_lv_3.png";
        case userRank[3]:
          return "/images/profile/badge_bg_lv_4.png";
        default:
          return "/images/profile/badge_bg_lv_5.png";
      }
    },
    [rank]
  );

  useEffect(() => {
    setBadge(getBadge(rank));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rank]);

  const memberPowerItem = [
    {
      icon: "/images/profile/power_free.svg",
      text: t("Profile.buy.label.free"),
    },
    {
      icon: "/images/profile/power-watch.svg",
      text: t("Profile.buy.label.watch.forever"),
    },
    {
      icon: "/images/profile/power-service.svg",
      text: t("Profile.buy.label.exclusive"),
    },
    {
      icon: "/images/profile/power_sign.svg",
      text: t("Profile.buy.label.premium_icon"),
    },
  ];

  const openVipCommonPage = (e) => {
    e.stopPropagation();
    useGlobalDispatch(
      pushRoutes(
        pageUrlConstants.profile.pages.profileBuyVip.pages.profileBuyVipCommon
      )
    );
  };

  const getReadSource = () => {
    return state.breadcrumbs
      .slice()
      .reverse()
      .find(
        (item) => item.path.startsWith("/home") && item.path !== "/home/main"
      );
  };

  const continueReadSource = (e) => {
    e.stopPropagation();
    const matchedPaths = state.breadcrumbs
      .slice()
      .reverse()
      .filter(
        (item) => item.path.startsWith("/home") && item.path !== "/home/main"
      );
    useGlobalDispatch(pushRoutes(matchedPaths[0]));
  };
  return (
    <ProfileMainHeaderElement isBrowser={isDesktop}>
      <div className="profile-cont">
        <LinkComponent
          className="profile_gear "
          routes={profile.pages.profileSet.pages.profileSetInfo}
        >
          <Image
            className="profile_gear_img "
            src="/images/profile/gear.png"
            width={0}
            height={0}
            alt="gear iicon"
          />
        </LinkComponent>
        <div
          className="profile_header_info cursor-pointer"
          onClick={clickProfile}
        >
          <div className="g-flex profile_header_container">
            <div className="profile_header_info_avatar">
              <ImageComponent
                is_cover={true}
                src={avatar}
                placeholderImg={avatar}
                alt={nick_name}
                title={nick_name}
                border_radius={"50%"}
                background_color="transparent"
              />
              <Image
                className="profile_header_info_avatar_sex"
                src={
                  sex === 1
                    ? "/images/icons/female_alt.svg"
                    : "/images/icons/male_alt.svg"
                }
                width={0}
                height={0}
                alt="sex"
              />
            </div>
            <div className="profile_header_info_detill">
              <div className="profile_header_info_detill_title">
                {id === "guest"
                  ? t("Profile.main.click_login")
                  : nick_name || username}
              </div>
              {rank ? (
                <div
                  className="profile_header_info_detill_title_badge my-2 fw-m"
                  style={{
                    backgroundImage: "url(" + badge + ")",
                  }}
                >
                  {/* {rank.replace(
                intl.formatMessage({ id: "PROFILE.MAIN.LABEL.MEMBER" }),
                ""
              )} */}
                  {rank.replace("会员", "")}
                </div>
              ) : (
                ""
              )}
              {id !== "guest" ? (
                <div className="profile_header_info_detill_time flex-col !items-start">
                  {isVIP ? (
                    <>
                      <div className="flex">
                        <Image
                          className="profile_header_info_detill_time_crown"
                          src="/images/icons/crown.png"
                          width={0}
                          height={0}
                          alt="crown"
                        />
                        <span className="profile_header_info_detill_time_text fw-m">
                          {formatDate(time)}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="p-2 text-sm border border-[#FA719A]"
                          onClick={openVipCommonPage}
                        >
                          查看VIP权益
                        </button>
                        {getReadSource() ? (
                          <button
                            className="p-2 text-sm border border-[#FA719A]"
                            onClick={continueReadSource}
                          >
                            繼續閱讀漫畫
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="profile_header_info_detill_time_text fw-m">
                      {membershipDate}{" "}
                      {expiringSoon &&
                        `(${t("Profile.main.label.member_expiring_soon")})`}
                    </span>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              className={`profile_header_info_arrow ${isDesktop && "hidden"}`}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>
          <div className="profile_header_daily">
            <div className="profile_header_daily_view">
              <p className="profile_header_daily_view_amount fw-m">
                {id !== "guest" ? (
                  time === "-1" || Date.now() < time * 1000 ? (
                    t("Profile.main.label.infinite")
                  ) : (
                    day_usedviewcount + "/" + day_maxviewcount
                  )
                ) : (
                  <>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                  </>
                )}
              </p>
              <p className="profile_header_daily_view_text">
                {t("Profile.main.watch.mount.today")}
              </p>
            </div>
            <div className="profile_header_daily_share">
              <p className="profile_header_daily_share_amount fw-m">
                {id !== "guest" ? (
                  day_share
                ) : (
                  <>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                  </>
                )}
              </p>
              <p className="profile_header_daily_share_text ">
                {t("Profile.main.heap.share.account")}
              </p>
            </div>
            <LinkComponent
              className="profile_header_daily_vendor"
              routes={pageUrlConstants.vendor}
            >
              <Image
                width={28}
                height={28}
                className="profile_header_daily_vendor_icon"
                src="/images/profile/buy_bag.png"
                alt="buy bag"
              />
              <span className="profile_header_daily_vendor_text">
                {t("Profile.main.label.go_mall")}
                <FontAwesomeIcon
                  className="profile_header_daily_vendor_text_arrow"
                  icon={faAngleRight}
                />
              </span>
            </LinkComponent>
          </div>
          <div
            className={`profile_header_info_arrow ${!isDesktop && "hidden"}`}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </div>
        <Divider className="profile_container_divider" />
        <LinkComponent
          className="profile_header_vip g-center"
          routes={
            pageUrlConstants.profile.pages.profileBuyVip.pages
              .profileBuyVipCommon
          }
        >
          <Lottie
            animationData={openVip}
            loop={true}
            className="profile_header_vip_img"
            alt="open vip"
          />
        </LinkComponent>
        {expiringSoon && (
          <PostsAddModalPage
            initStatus={expirationTip}
            title={t("Profile.main.label.member_benefit_tip")}
            buttonProps={{
              text: t("Profile.main.label.continue_buy"),
              onButtonClick: () => redirectBuy(),
              localStorageName: "member_expired_float_show",
            }}
          >
            {" "}
            {state.vipInfoData.length}
            <div className="profile_main_cover">
              <div className="profile_main_cover_tip">
                {t("Profile.main.label.member_description")}
              </div>
              <div className="profile_main_cover_power">
                <div className="profile_main_cover_power_subtitle">
                  {t("Profile.direct_buy_vip.member_permissions")}
                </div>
                <div className="profile_main_cover_power_items">
                  {memberPowerItem.map((item, index) => (
                    <div
                      className="profile_main_cover_power_item"
                      key={`${item.text}-${index}`}
                    >
                      <Image
                        src={item.icon}
                        width={0}
                        height={0}
                        alt={item.text}
                      />
                      {item.text}
                    </div>
                  ))}
                </div>
                <div className="profile_main_cover_power_description">
                  {t("Profile.main.label.member_description_1")}
                </div>
              </div>
            </div>
          </PostsAddModalPage>
        )}
      </div>
    </ProfileMainHeaderElement>
  );
};

export default ProfileMainHeader;

const ProfileMainHeaderElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isBrowser"].includes(prop),
})`
  ${({ isBrowser }) => `
    /*  */
    position: relative;
    color: #fff;
    background-position: center;
    background-size: cover;
    background-image: url(/images/profile/banner_bg.jpg);

    .profile-cont {
      width: ${isBrowser ? "62.5rem" : "100%"};
      // width: 63%;
      margin: 0 auto;
    }

    .profile_gear {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 15px;
      padding: 5px;

      &_img {
        width: ${isBrowser ? "27px" : "2.67vw"};
        height: ${isBrowser ? "27px" : "2.67vw"};
        vertical-align: middle;

      }
    }

    .profile_header {
      &_info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px ${padding}px 10px;
        font-size: ${!isBrowser ? "20px" : "22px"};
        text-decoration: none;
        color: #fff;
        padding: ${!isBrowser && `0px ${padding}px 10px 4vw`};
        flex-wrap: ${!isBrowser && "wrap"};

        .g-flex {
          margin: ${isBrowser ? "2.05vw 0 0" : "10vw auto 0"};
        }

        &_avatar {
          // display: flex;
          flex-shrink: 0;
          position: relative;
          // margin-right: 30px;
          width: ${isBrowser ? "80px" : " 16.5vw"};
          height: ${isBrowser ? "80px" : " 16.5vw"};
          border-radius: 50%;

          &_sex {
            position: absolute;
            right: 0;
            bottom: 0;
            width: ${isBrowser ? "20px" : "4vw"};
            height: ${isBrowser ? "20px" : "4vw"}
            right: ${!isBrowser && "0.5vw"};
          }
        }

        &_detill {
          width: ${isBrowser ? "12.375rem" : " 68.27vw"};
          margin-left: ${isBrowser ? "16px" : " 3.33vw"};

          // flex-grow: 1;

          &_title {
            font-size: ${!isBrowser && "4vw"};
            &_badge {
              padding-top: ${isBrowser ? "7px" : "1.8vw"};
              padding-left: 24px;
              text-align: center;
              height: ${isBrowser ? "28px" : "5.41vw"};
              font-size: ${!isBrowser ? "3.2vw" : "16px"};
              line-height: 11px;
              background-repeat: no-repeat;
              background-size: contain;
              max-width: ${isBrowser && "80px"};
              width: ${!isBrowser && "16.69vw"};
            }
          }

          &_time {
            display: flex;
            align-items: center;
            margin-top: 5px;

            &_crown {
              margin-right: 10px;
              width: 30px;
            }

            &_text {
              font-size: ${!isBrowser ? "2.4vw" : "16px"};
            }
          }
        }

        &_arrow {
          margin-top: ${isBrowser ? "25px" : "5vw"};
          margin-left: ${isBrowser ? "5px" : "0vw"};
          font-size: ${isBrowser ? "32px" : "6.8vw"};
        }
      }

      &_daily {
        display: flex;
        // justify-content: space-evenly;
        gap: ${isBrowser ? "5.8125rem" : "10.75vw"};
        align-items: center;
        padding-bottom: 10px;
        margin: ${!isBrowser && "0 auto 2.5vw"};

        &_view,
        &_share {
          margin-top: ${isBrowser ? "35px" : "6.4vw"};
          // padding: 6px 6px 6px 55px;

          &_amount {
            margin-top: ${!isBrowser ? "2.67vw" : "10px"};
            margin-bottom: ${!isBrowser ? "1.33vw" : "10px"};
            font-size: ${!isBrowser ? "4vw" : "24px"};
            text-align: center;
          }

          &_text {
            margin-top: 10px;
            color: #b5b5b5;
            font-size: ${!isBrowser ? "2.4vw" : "14px"};
          }
        }

        &_vendor {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: ${isBrowser ? "35px" : "5.6vw"};
          cursor: pointer;
          // padding: 6px 6px 6px 55px;
          text-decoration: none;
          color: #b5b5b5;
          // border: 1px solid #39b3fd;
          // border-radius: 5px;

          &_icon {
            max-width: ${isBrowser && "58px"};
            margin-top: ${isBrowser ? "13px" : "4.5vw"};
            margin-bottom: ${isBrowser ? "10px" : "1.33vw"};
            height: ${isBrowser ? "28px" : "4.13v"};
            width: auto;
            object-fit: contain;
          }

          &_text {
            display: flex;
            align-items: center;
            font-size: ${!isBrowser ? "2.4vw" : "14px"};

            &_arrow {
              margin-top: 5px;
              margin-left: 5px;
              vertical-align: bottom;
            }
          }
        }

        /* &_check {
        cursor: pointer;
        padding: 3px 7px;
        width: auto;
        border: 1px solid white;
        border-radius: 20px;

        &_text {
          font-size: ${!isBrowser ? "14px" : "16px"};
        }
      } */
      }

      &_vip {
        &_img {
          cursor: pointer;
          width: ${!isBrowser ? "81%" : "auto"};
          vertical-align: middle;
        }
      }
    }
    .profile_main_cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 15px;
      &_tip {
        color: ${colors.text_grey};
        padding: 0 2em;
        font-size: ${!isBrowser ? "2.4vw" : "18px"};
      }
      &_power {
        &_subtitle {
          position: relative;
          color: #000;
          font-weight: 700;

          &::before,
          &::after {
            content: "";
            position: absolute;
            top: 50%;
            width: 20%;
            border: solid 1px ${colors.text_light_grey};
          }

          &::before {
            right: 10%;
          }

          &::after {
            left: 10%;
          }
        }

        &_items {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }
        &_item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          color: ${colors.text_light_grey};
          font-size: 14px;
          img {
            width: 40px;
          }
        }

        &_description {
          color: ${colors.text_light_grey};
          margin-top: 5px;
          font-size: 16px;
        }
      }
    }

    .profile_container_divider {
      margin: 1vw 1% 4.05vw;
      border-width: 1px;
      border-color: #303030;
      display: ${!isBrowser && "none"};
    }

    .mobile {
      display: none;
      @media (max-width: 767px) {
        display: block;
      }
    }

    .desktop {
      display: block;
      @media (max-width: 767px) {
        display: none;
      }
    }
  `}
`;
