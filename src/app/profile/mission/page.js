"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import {
  apiUrl,
  colors,
  pageUrlConstants,
  requestUrlConstants,
  vendorUrl,
} from "@/lib/constants";
import ImageComponent from "@/components/common/ImageComponent";
import WavaButton from "@/components/layout/Header/WavaButton";
import Image from "next/image";
import { pushRoutes } from "@/store/actions/historyActions";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import Cookies from "js-cookie"; // Make sure to import Cookies
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  preventPageScroll,
  dismissPreventPageScroll,
} from "@/store/actions/utilities";
import { dailyLoginAction } from "@/store/actions/pages/profileMainAction";
import {
  getMissionListAction,
  postAddCheckInAction,
  postGetRewardAction,
} from "@/store/actions/pages/profileMissionAction";
const { profile } = pageUrlConstants;

const moneyIcon = "/images/icons/money.svg";
const successIcon = "/images/icons/success.svg";
const giftIcon = "/images/profile/icon_my_gift.svg";
const background_blue = "/images/profile/mission/bg-blue.svg";
const background_purple = "/images/profile/mission/bg-purple.svg";
const background_red = "/images/profile/mission/bg-red.svg";
const diamondIcon = "/images/profile/mission/icon-diamond.svg";
const buyGameIcon = "/images/profile/mission/icn-buygame.svg";
const clickAdsIcon = "/images/profile/mission/icn-clickads.svg";
const watchVideosIcon = "/images/profile/mission/icn-videos.svg";
const booksIcon = "/images/profile/mission/icn-books.svg";
const savedIcon = "/images/profile/mission/icn-save.svg";
const postIcon = "/images/profile/mission/icn-post.svg";
const followIcon = "/images/profile/mission/icn-follow.svg";
const subsIcon = "/images/profile/mission/icn-subs.svg";
const unlockIcon = "/images/profile/mission/icn-unlock.svg";
const likeIcon = "/images/profile/mission/icn-like.svg";
const taskIcon = "/images/profile/mission/icn-taskking.svg";
const completeIcon = "/images/profile/mission/complete.png";

const ProfileMissionLayout = ({ children, backRoutesAction }) => {
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const nodeRef = useRef(null);
  if (!isMobile)
    return (
      <ProfileMissionLayoutElement>
        <CSSTransition
          timeout={200}
          in={true}
          classNames="CSSTransition_opacity"
          unmountOnExit
          key="CSSTransition_showCover"
          nodeRef={nodeRef}
        >
          <div className="float_cover" onClick={backRoutesAction}>
            <div
              className="float_cover_container"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </CSSTransition>
      </ProfileMissionLayoutElement>
    );
  return <ProfileMissionLayoutElement>{children}</ProfileMissionLayoutElement>;
};
export const ProfileMissionLayoutElement = styled.div`
  @media (max-width: 899px) {
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #f3f4f5;
    z-index: 2;
  }
  @media (min-width: 899px) {
    .float_cover {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 11;
      display: flex;
      flex-direction: column;
      background-color: #000c;
      align-items: flex-end;
      margin: auto;
      width: 100%;
      height: 100%;
      overflow: auto;
    }

    .float_cover {
      &_container {
        display: flex;
        flex-direction: column;
        align-items: start;
        box-sizing: border-box;
        min-width: 300px;
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
  }
`;
const weekListIcons = [
  diamondIcon,
  buyGameIcon,
  clickAdsIcon,
  watchVideosIcon,
  booksIcon,
  savedIcon,
  postIcon,
  followIcon,
  subsIcon,
  unlockIcon,
  likeIcon,
  taskIcon,
];

function ProfileMission() {
  const t = useTranslations();
  const lang = Cookies.get("NEXT_LOCALE");
  const { isMobile } = useMediaQuery();
  const { state } = useGlobalContext();
  const user = state.user;
  const data = { ...state.profileMission } || {};
  const config = state.config;

  const dailyEvent = () => {
    useGlobalDispatch(dailyLoginAction(t));
  };

  const goSharef = () => {
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profileInviteMission)
    );
  };

  const goHomeGame = () => {
    useGlobalDispatch(pushRoutes(pageUrlConstants.home.pages.homeGame));
  };

  const getMissionList = () => {
    useGlobalDispatch(getMissionListAction());
  };

  const postAddCheckIn = (index, callback) => {
    useGlobalDispatch(postAddCheckInAction(index, callback));
  };

  const postGetReward = (missionId, name, callback) => {
    useGlobalDispatch(postGetRewardAction(missionId, name, callback));
  };

  const backRoutesAction = () => {
    useGlobalDispatch(pushRoutes(profile));
  };

  const [floatStatus, setFloatStatus] = useState({
    show: false,
    amount: 0,
    type: 0,
  });

  const { checkin, weekly, newbie } = data;
  const directList = [
    {
      title: "邀请好友注册",
      subTitle: "拿福利",
      value: "去领取",
      url: "",
    },
    {
      title: "绅士游戏软件",
      subTitle: "资讯站",
      value: "去看看",
      url: "",
    },
    {
      title: "潮爽情趣精品",
      subTitle: "最齐全",
      value: "去逛逛",
      url: "",
    },
  ];

  useEffect(() => {
    getMissionList();
  }, []);
  useEffect(() => {
    setTimeout(
      () =>
        (document.documentElement.scrollTop = window.sessionStorage.getItem(
          "scroll:" + pageUrlConstants.profile.path
        )),
      150
    );
    if (!isMobile) {
      preventPageScroll();
    }
    return () => dismissPreventPageScroll();
  }, []);

  const onClickCheckInEvent = (index, isShow, sign, type) => {
    if (isShow) {
      postAddCheckIn(index, () =>
        setFloatStatus(() => ({ amount: sign, type: type, show: true }))
      );
    }
  };

  const onClickEvent = (e) => {
    const completionStatus = Number(e.target.getAttribute("is_completion"));
    const id = Number(e.target.getAttribute("id"));
    const name = e.target.getAttribute("name");
    const sign = Number(e.target.getAttribute("sign"));
    const type = Number(e.target.getAttribute("type"));
    if (completionStatus === 1) {
      return postGetReward(id, name, () =>
        setFloatStatus(() => ({ amount: sign, type: type, show: true }))
      );
    }
    if (completionStatus === 0) {
      const index = Number(e.target.getAttribute("index"));
      if (name === "weekly") {
        switch (index) {
          case 0:
            return window.open(
              apiUrl +
                requestUrlConstants.toPaymentPageUrl +
                `?uid=${user.id}&ctype=1&content-language=${lang}`
            );
          case 1:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.home.pages.homeGame)
            );
          case 3:
          case 4:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.home.pages.homeMain)
            );
          case 5:
          case 6:
          case 7:
          case 10:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.post.pages.postMain)
            );
          case 8:
          case 9:
            return useGlobalDispatch(
              pushRoutes(
                pageUrlConstants.post.pages.postMain.pages.postMainRecommend
              )
            );
          default:
            break;
        }
      } else {
        switch (index) {
          case 0:
          case 1:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.profile.pages.profileEdit)
            );
          case 2:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.home.pages.homeMain.pages.homeVideos)
            );
          case 3:
            return useGlobalDispatch(
              pushRoutes(pageUrlConstants.profile.pages.profilePayment)
            );
          case 4:
            return useGlobalDispatch(
              pushRoutes(
                pageUrlConstants.profile.pages.profileSet.pages.profileSetEmail
              )
            );
          default:
            break;
        }
      }
    }
  };
  const onCloseFloat = () => {
    setFloatStatus((pre) => ({ ...pre, show: false }));
  };
  const clickCardEvents = [
    () => goSharef(),
    () => goHomeGame(),
    () => window.open(vendorUrl),
  ];

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            {isMobile ? (
              <TopBarContainer show_shadow={false}>
                <TopTitleBar
                  title={t("Profile.main.option.task.")}
                  show_back_color="#ffffff"
                  showBack={true}
                />
              </TopBarContainer>
            ) : (
              ""
            )}
          </>
        ),
      },
    });
  }, [isMobile]);

  const nodeRef = useRef(null);
  return (
    <ProfileMissionLayout backRoutesAction={backRoutesAction}>
      <ProfileMissionElement main_height={state.navbar.mainHeight}>
        <CSSTransition
          timeout={200}
          in={floatStatus.show}
          classNames="CSSTransition_opacity"
          unmountOnExit
          key="CSSTransition_show_donate"
          nodeRef={nodeRef}
        >
          <div className="float_cover">
            <div className="float_cover_container">
              <img src={completeIcon} alt="" width={120} />
              <div className="title">签到成功</div>
              <div className="content">
                获得
                <label className="content_money">
                  {floatStatus.amount}
                  {floatStatus.type && t(judgeRewardType(floatStatus.type))}
                </label>
              </div>
              <WavaButton className="button">
                <span onClick={onCloseFloat}>领取奖励</span>
              </WavaButton>
            </div>
          </div>
        </CSSTransition>
        <article className="profile_mission_section banner">
          <section className="banner_card banner g-flex-column p-3 gap-2">
            <section className="banner_card_title">
              每日签到 <span>连续签到可获得额外奖励</span>
            </section>
            <section className="banner_card_items g-flex-space-around gap-2 my-2">
              {checkin[0].signin.map((item, index) => (
                <section
                  key={index}
                  className={`banner_card_item ${
                    item.is_show && " dark"
                  } g-flex-column-center align-items-center gap-1`}
                  onClick={() =>
                    onClickCheckInEvent(
                      index,
                      item.is_show,
                      item.sign,
                      checkin[0].reward_type
                    )
                  }
                >
                  <span>第{item.day}天</span>
                  <ImageComponent
                    lazyLoad={false}
                    background_color="transparent"
                    src={item.completion ? successIcon : moneyIcon}
                    alt={"第" + item.day + "天"}
                    title={"第" + item.day + "天"}
                    height={35}
                  />
                  <label>
                    {item.completion ? "签到成功" : item.sign + "金币"}
                  </label>
                </section>
              ))}
              <section
                className={`banner_card_item final g-center align-items-center gap-1 ${
                  checkin[0].is_show && "cursor"
                }`}
                onClick={() =>
                  onClickCheckInEvent(
                    6,
                    checkin[0].is_show,
                    checkin[0].reward_quantity,
                    checkin[0].reward_type
                  )
                }
              >
                <section
                  style={{ flex: "0 0 40%" }}
                  className="g-flex-column-center justify-content-center"
                >
                  <span>第7天</span>
                  <label>随机神祕 大礼包</label>
                </section>
                <section style={{ flex: "0 0 50%" }} />
                <Image
                  src={giftIcon}
                  alt={"gift"}
                  title={"gift"}
                  height={90}
                  width={90}
                  className="banner_card_item_gift"
                />
              </section>
            </section>
          </section>
        </article>
        <article className="profile_mission_section g-flex-space-around gap-2 py-2">
          {directList.map((item, index) => {
            return (
              <Card
                key={index}
                index={index}
                {...item}
                onClick={clickCardEvents[index]}
              />
            );
          })}
        </article>
        <article className="profile_mission_section ">
          <section className="banner_card g-flex-column p-3 gap-2">
            <div className="banner_card_subtitle">日常任务</div>
            <div className="g-flex-column  gap-3">
              {weekly.map((item, index) => {
                return (
                  <WeekList
                    index={index}
                    onClick={onClickEvent}
                    {...item}
                    key={index}
                  />
                );
              })}
            </div>
          </section>
        </article>
        <article className="profile_mission_section ">
          <section className="banner_card g-flex-column p-2 gap-2">
            <section className="banner_card_subtitle">新手限定</section>
            <div className="g-flex-space-between  flex-wrap gap-2">
              {newbie.map((item, index) => {
                return (
                  <NewBieList
                    index={index}
                    onClick={onClickEvent}
                    {...item}
                    key={index}
                  />
                );
              })}
            </div>
          </section>
        </article>
      </ProfileMissionElement>
    </ProfileMissionLayout>
  );
}

export default ProfileMission;

export const ProfileMissionElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    background-color: ${colors.back_grey};
    height: 100%;
    min-height: 100vh;
    .profile_mission_section {
      max-width: 20vw;
      padding: 2px 0.6em;
      @media (max-width: 899px) {
        padding: 2px 0.8em;
        max-width: 100%;
      }
      .banner {
        &_card {
          background: #fff;
          border-radius: 0.5em;
          height: 100%;
          margin-bottom: 0.5em;

          &.banner {
            margin-bottom: -100px;
          }
          &_title {
            font-weight: 900;
            font-size: 1.2rem;
            span {
              color: ${colors.text_light_grey};
              font-size: 0.8rem;
              font-weight: 500;
            }
          }
          &_subtitle {
            font-weight: 900;
            font-size: 1rem;
          }
        }
      }
      &.banner {
        padding-top: ${main_height / 2}px;
        margin-bottom: 100px;
        background: ${colors.dark_pink};
        @media (max-width: 899px) {
          padding-top: ${main_height}px;
        }
      }
    }

    .banner {
      &_card {
        &_items {
          flex-wrap: wrap;
        }
        &_item {
          cursor: default;
          position: relative;
          padding: 0.5em 0;
          flex: 0 1 22%;
          background: ${colors.grey};
          border-radius: 0.5em;
          font-size: 0.8rem;
          color: ${colors.text_light_grey};
          &.final {
            color: #fff;
            flex: 0 1 46%;
            background-image: linear-gradient(150deg, #db9c2b 20%, #ffe57f 84%);
            span {
              color: #fff;
            }
          }
          &.dark {
            cursor: pointer;
            background-image: linear-gradient(
              337deg,
              #fa719a 0%,
              #fa97ab 50%,
              #fbc6c0 100%
            );
            color: #fff;
            span {
              color: #fff;
            }
          }
          span {
            color: black;
            font-weight: bolder;
          }
          label {
            font-size: 0.6rem;
          }
          &_gift {
            position: absolute;
            top: -10;
            right: 0;
            bottom: 0;
          }
        }
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
      &_container {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        align-items: center;
        padding: 15px 10px;
        box-sizing: border-box;
        width: 300px;
        background-color: #fff;
        border-radius: 5px;
        @media (max-width: 899px) {
          gap: 0.8rem;
        }
        .title {
          font-weight: 900;
          font-size: 1.2rem;
        }
        .content {
          color: ${colors.text_light_grey};
          &_money {
            color: ${colors.back_dark_pink};
          }
        }
        .button {
          cursor: pointer;
          padding: 10px 0;
          margin: auto;
          margin-top: 5px;
          width: 80%;
          text-align: center;
          text-decoration: none;
          color: #fff;
          background-color: ${colors.dark_pink};
          border-radius: 30px;
        }
      }
    }
  `}
`;

const Card = ({ title, subTitle, value, index, onClick }) => {
  function switchBackground() {
    switch (index) {
      case 0:
        return background_blue;
      case 1:
        return background_purple;
      case 2:
        return background_red;
      default:
        break;
    }
  }
  function switchColor() {
    switch (index) {
      case 0:
        return "#5a65f2";
      case 1:
        return "#a841ff";
      case 2:
        return "#ff4848";
      default:
        break;
    }
  }
  return (
    <CardElement
      color={switchColor(index)}
      background={switchBackground(index)}
      className="g-flex-column-center  gap-2"
      onClick={onClick}
    >
      <section className="vip_card_title">{title}</section>
      <section className="vip_card_subTitle">{subTitle}</section>
      <section className="vip_card_button">{value}</section>
    </CardElement>
  );
};
const CardElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["background"].includes(prop),
})`
  /*  */
  background: ${({ background }) => "url(" + background + ")"}no-repeat;
  background-size: contain;
  background-position: center;
  font-size: 1rem;
  white-space: nowrap;
  padding: 0.5em;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  color: #fff;
  opacity: 1;
  transition: 1;
  &:hover {
    opacity: 0.95;
  }
  .vip_card {
    &_title {
      font-size: 0.8rem;
      @media (max-width: 899px) {
        font-size: 1rem;
      }
    }
    &_subTitle {
      font-size: 1rem;
      @media (max-width: 899px) {
        font-size: 1.2rem;
      }
    }
    &_button {
      background: #fff;
      width: 70%;
      text-align: center;
      padding: 0.1em 0;
      color: ${({ color }) => color};
      font-size: 0.8rem;
    }
  }
`;
const judgeCompletionName = (has_completion, completion_count) => {
  if (completion_count > 1) {
    return `(${has_completion}/${completion_count})`;
  }
  return "";
};
const judgeCompletionStatus = (type) => {
  switch (type) {
    case 0:
      return "去完成";
    case 1:
      return "领奖励";
    case 2:
      return "已完成";
    default:
      break;
  }
};
const judgeRewardType = (type) => {
  //1金幣 2精鑽 3 vip天數 4 商城優惠卷 5 個人頭像
  switch (type) {
    case 1:
      return "Global.gold_money";
    case 2:
      return "Global.money";
    case 3:
      return "Profile.permission.vip_day";
    case 4:
      return "Profile.permission.shop_coupon";
    case 5:
      return "Profile.permission.personal_avatar";
    default:
      break;
  }
};
const WeekList = ({
  id,
  name,
  description,
  reward_quantity,
  is_completion,
  has_completion_count,
  completion_count,
  reward_type,
  index,
  onClick,
}) => {
  const t = useTranslations();
  const judgeStatus = () => {
    if (is_completion === 2) {
      return "received";
    } else if (is_completion === 1) {
      return "completion";
    } else {
      return "";
    }
  };
  return (
    <WeekListElement>
      <Image
        src={weekListIcons[index]}
        alt=""
        width={30}
        height={30}
        className="mr-3"
      />
      <section className="g-flex-column align-items-start week_list_content ">
        <div className="week_list_name">
          {name + judgeCompletionName(has_completion_count, completion_count)}
        </div>
        <div className="week_list_description">{description}</div>
        <div className="week_list_award">
          +{reward_quantity}
          {t(judgeRewardType(reward_type))}
        </div>
      </section>
      <WavaButton className={`week_list_button ${judgeStatus()} cursor`}>
        <span
          id={id}
          name={"weekly"}
          index={index}
          is_completion={is_completion}
          onClick={onClick}
          sign={reward_quantity}
          type={reward_type}
        >
          {judgeCompletionStatus(is_completion)}
        </span>
      </WavaButton>
    </WeekListElement>
  );
};
const WeekListElement = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  .week_list {
    &_content {
      flex-grow: 1;
    }
    &_name {
      font-size: 0.8rem;
      font-weight: 600;
    }
    &_description {
      color: ${colors.text_light_grey};
      font-size: 0.6rem;
      min-height: 0.6rem;
    }
    &_award {
      color: #fac500;
      font-size: 0.6rem;
    }
    &_button {
      white-space: nowrap;
      text-align: center;
      font-size: 0.6rem;
      border-radius: 1.2em;
      padding: 2px 10px;
      color: ${colors.back_dark_pink};
      border: 1px solid ${colors.back_dark_pink};
      &.completion {
        color: #fff;
        background: ${colors.back_dark_pink};
      }
      &.received {
        color: ${colors.text_light_grey};
        background: #fff;
        border: 1px solid ${colors.grey};
        pointer-events: none;
      }
    }
  }
`;

const NewBieList = ({
  id,
  name,
  reward_quantity,
  reward_type,
  is_completion,
  onClick,
  index,
}) => {
  const t = useTranslations();
  const completionStatus = (() => {
    switch (is_completion) {
      //任務完成狀態  0:未完成  1:已完成 2: 可領獎勵
      case 0:
        return "uncompleted";
      case 1:
        return "reward";
      case 2:
        return "complete";
      default:
        break;
    }
  })();
  return (
    <NewBieListElement>
      <div className="bie_list_title">{name}</div>
      <div className="bie_list_award">
        +{reward_quantity}
        &nbsp;
        {t(judgeRewardType(reward_type))}
      </div>
      <WavaButton className={`bie_list_button ${completionStatus} cursor`}>
        <span
          id={id}
          name={"newbie"}
          index={index}
          is_completion={is_completion}
          onClick={onClick}
          sign={reward_quantity}
          type={reward_type}
        >
          {judgeCompletionStatus(is_completion)}
        </span>
      </WavaButton>
    </NewBieListElement>
  );
};
const NewBieListElement = styled.section`
  /*  */
  flex: 0 1 46%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(250, 113, 154, 0.08);
  border-radius: 0.6em;
  gap: 0.5em;
  padding: 10px 0px;
  .bie_list {
    &_title {
      font-weight: 600;
      font-size: 0.8rem;
    }
    &_award {
      color: #fac500;
      font-weight: 600;
      font-size: 0.8rem;
    }
    &_button {
      white-space: nowrap;
      text-align: center;
      font-size: 0.6rem;
      border-radius: 1.2em;
      padding: 4px 10px;
      color: ${colors.back_dark_pink};
      border: 1px solid ${colors.back_dark_pink};
      &.completion {
        border: 1px solid ${colors.grey};
        color: ${colors.text_light_grey};
        background: #fff;
      }
      &.reward {
        color: #fff;
        background: ${colors.back_dark_pink};
      }
    }
  }
`;
