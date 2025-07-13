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
  const { isMobile } = useMediaQuery();
  const [badge, setBadge] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [expirationTip, setExpirationTip] = useState(false);
  const [expiringSoon,setExpiringSoon] = useState(false);

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
    if ( time && time > 0){
      const now = Date.now();
      const differenceInMilliseconds = (time* 1000) - now; 
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24); 
  
      if (rank !== '普通会员' && differenceInDays > 0 && differenceInDays <= 3) {
        setExpiringSoon(true);
      }
    }
    

  }, [time]);

  const clickProfile = () => {
    const userData = store.getState().user;
    if (userData.id !== "guest") {
      useGlobalDispatch(pushRoutes(profile.pages.profileEdit.pages.profileEditInfo));
    } else {
      // useGlobalDispatch(pushRoutes(login));
      useGlobalDispatch(openPopup("login"));
    }
  };

  function formatDate(date) {
    const formattedDate = new Date(date * 1000);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
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
  }

  const getReadSource = () => {
    return state.breadcrumbs
      .slice()
      .reverse()
      .find(item => item.path.startsWith('/home') && item.path !== '/home/main');
  }

  const continueReadSource = (e) => {
    e.stopPropagation();
    const matchedPaths = state.breadcrumbs
    .slice()
    .reverse()
    .filter(item => item.path.startsWith('/home') && item.path !== '/home/main');
    useGlobalDispatch(pushRoutes(matchedPaths[0]));
  }
  return (
    <ProfileMainHeaderElement isMobile={isMobile}>
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
        <div className="profile_header_info_avatar ml-3 mt-5">
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
        <div className="profile_header_info_detill mt-5">
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
              {time === "-1" || Date.now() < time * 1000 ? (
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
                  <button className="p-2 text-sm border border-[#FA719A]" onClick={openVipCommonPage}>查看VIP权益</button>
                {
                  getReadSource() ? (
                    <button className="p-2 text-sm border border-[#FA719A]" onClick={continueReadSource}>繼續閱讀漫畫</button>
                  ) :
                  <></>
                }
                </div>
                </>
              ) : (
                <span className="profile_header_info_detill_time_text fw-m">
                  {membershipDate} {expiringSoon&&`(${t("Profile.main.label.member_expiring_soon")})`}
                </span>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="profile_header_info_arrow mt-5 mr-2">
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
            width={58}
            height={75}
            className="profile_header_daily_vendor_icon"
            src="/images/profile/buy_bag.svg"
            alt="buy bag"
          />
          <span className="profile_header_daily_vendor_text fw-m">
            {t("Profile.main.label.go_mall")}
            <FontAwesomeIcon
              className="profile_header_daily_vendor_text_arrow"
              icon={faAngleRight}
            />
          </span>
        </LinkComponent>
      </div>
      <LinkComponent
        className="profile_header_vip g-center"
        routes={
          pageUrlConstants.profile.pages.profileBuyVip.pages.profileBuyVipCommon
        }
      >
        <Lottie
          animationData={openVip}
          loop={true}
          className="profile_header_vip_img"
          alt="open vip"
        />
      </LinkComponent>
      {
        expiringSoon && (
          <PostsAddModalPage
            initStatus={expirationTip}
            title={t("Profile.main.label.member_benefit_tip")}
            buttonProps={{
              text: t("Profile.main.label.continue_buy"),
              onButtonClick: () => redirectBuy(),
              localStorageName: "member_expired_float_show",
            }}
          > {state.vipInfoData.length}
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
                    <div className="profile_main_cover_power_item" key={`${item.text}-${index}`}>
                      <Image src={item.icon} width={0} height={0} alt={item.text} />
                      {item.text}
                    </div>
                  ))}
                </div>
                <div className="profile_main_cover_power_description">
                  {t("Profile.main.label.member_description_1")}
                </div>
              </div>
            </div>
          </PostsAddModalPage>)
      }
    </ProfileMainHeaderElement>
  );
};

export default ProfileMainHeader;

const ProfileMainHeaderElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isMobile"].includes(prop),
})`
  /*  */
  position: relative;
  color: #fff;
  background-position: center;
  background-size: cover;
  background-image: url(/images/profile/banner_bg.jpg);

  .profile_gear {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 15px;
    padding: 5px;

    &_img {
      width: 27px;
      height: 27px;
      vertical-align: middle;

      @media (max-width: 599px) {
        width: 20px;
        height: 20px;
      }
    }
  }

  .profile_header {
    &_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px ${padding}px 10px;
      font-size: ${({ isMobile }) => (isMobile ? "20px" : "22px")};
      text-decoration: none;
      color: #fff;
      @media (max-width: 599px) {
        padding: 0px ${padding}px 10px 0;
      }
      &_avatar {
        flex-shrink: 0;
        position: relative;
        margin-right: 30px;
        width: 80px;
        height: 80px;
        border-radius: 50%;

        &_sex {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 20px;
          height: 20px;
        }
      }

      &_detill {
        flex-grow: 1;

        &_title {
          &_badge {
            padding-top: 7px;
            padding-left: 24px;
            text-align: center;
            max-width: 80px;
            height: 28px;
            font-size: ${({ isMobile }) => (isMobile ? "14px" : "16px")};
            line-height: 11px;
            background-repeat: no-repeat;
            background-size: cover;
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
            font-size: ${({ isMobile }) => (isMobile ? "14px" : "16px")};
          }
        }
      }
    }

    &_daily {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 10px;

      &_view,
      &_share {
        &_amount {
          margin-top: 10px;
          margin-bottom: 10px;
          font-size: ${({ isMobile }) => (isMobile ? "14px" : "20px")};
          text-align: center;
        }

        &_text {
          margin-top: 10px;
          font-size: ${({ isMobile }) => (isMobile ? "14px" : "20px")};
        }
      }

      &_vendor {
        display: flex;
        margin-top: 35px;
        cursor: pointer;
        padding: 6px 6px 6px 55px;
        text-decoration: none;
        color: #fff;
        border: 1px solid #39b3fd;
        border-radius: 5px;

        @media (max-width: 599px) {
          margin-top: 20px;
        }

        &_icon {
          margin: -50px 2px -42px -60px;
          max-width: 58px;
          @media (max-width: 599px) {
            max-width: 40px;
          }
        }

        &_text {
          font-size: ${({ isMobile }) => (isMobile ? "18px" : "20px")};

          &_arrow {
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
        font-size:${({ isMobile }) => (isMobile ? "14px" : "16px")};
      }
    } */
    }

    &_vip {
      &_img {
        cursor: pointer;
        width: ${({ isMobile }) => (isMobile ? "90%" : "30%")};
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
      font-size: 18px;
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
`;
