"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import styled from "styled-components";

import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { colors, pageUrlConstants } from "@/lib/constants";
import WavaButton from "@/components/layout/Header/WavaButton";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { pushRoutes } from "@/store/actions/historyActions";
import { dailyLoginAction } from "@/store/actions/pages/profileMainAction";
import useMediaQuery from "@/hooks/useMediaQuery";

const badge_lv_1 = "/images/profile/badge_bg_lv_1.png";
const badge_lv_3 = "/images/profile/badge_lv_3.png";
const badge_lv_4 = "/images/profile/badge_lv_4.png";
const badge_lv_5 = "/images/profile/badge_lv_5.png";
const badge_lv_6 = "/images/profile/badge_lv_6.png";
const badge_lv_7 = "/images/profile/badge_lv_7.png";
const letterIcon = "/images/profile/icon_letter.svg";
const pencilIcon = "/images/profile/icon_pencil.svg";
const badgeList = [
  badge_lv_1,
  badge_lv_3,
  badge_lv_4,
  badge_lv_5,
  badge_lv_6,
  badge_lv_7,
];

const ProfileShareMission = () => {
  const t = useTranslations();
  const { state, dispatch } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const user = state.user;
  const config = state.config;
  const dailyEvent = () => {
    useGlobalDispatch(dailyLoginAction(t));
  }
  const gosharef = () => {
    useGlobalDispatch(pushRoutes(pageUrlConstants.profile.pages.profileShare));
  }

  const [questInfoList, setQuestInfoList] = useState({});

  useEffect(() => {
    let promote = [];
    for (let i = 1; i <= 5; i++) {
      promote.push({
        badge: badgeList[i],
        title: config["gradename" + i],
        rewardDay: config["sharereg" + i],
        conditionMan: config["renshu" + i],
      });
    }
    let daily = [
      {
        icon: letterIcon,
        title: t("Profile.permission.signin.everyday"),
        gold:
          config.signinbegin +
          "-" +
          config.signinend +
          t("Global.gold_money"),
        description: t("Profile.permission.signin.click.award"),
        button: t("Profile.permission.signin.now"),
        buttonEvent: dailyEvent,
      },
      {
        icon: pencilIcon,
        title: t("Profile.permission.invite_friend"),
        gold: config.sharefjb + t("Global.gold_money"),
        description: ("Profile.permission.invite_friend_signin"),
        button: ("Profile.permission.invite.now"),
        buttonEvent: gosharef,
      },
    ];
    setQuestInfoList({
      promote,
      daily,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer>
              <TopTitleBar
                back_color={"#fff"}
                title={t("Profile.permission.invite_friend")}
                showBack={true}
                color={"black"}
              />
            </TopBarContainer>
          </>
        ),
      }
    });
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      let Element = document.getElementsByClassName("PCFooterElement");
      if(Element.length){
        Element[0].style.setProperty("display", "none");
      }
    }else{
      let Element = document.getElementsByClassName("BottomNavBarElement");
      if(Element.length){
        Element[0].style.setProperty("display", "none");
      }
    }
    return () => {
      if (!isMobile) {
        let Element = document.getElementsByClassName("PCFooterElement");
        if(Element.length){
          Element[0].style.setProperty("display", "block");
        }
      }else{
        let Element = document.getElementsByClassName("BottomNavBarElement");
        if(Element.length){
          Element[0].style.setProperty("display", "block");
        }
      }
    }
  }, [isMobile])

  return (
    <ProfileShareMissionElement>
      <section className="profile_mission_section board">
        当前会员等级<label>{user.rank}</label>
      </section>
      <section className="profile_mission_section board">
        <div className="board_front">
          {t("Profile.permission.task.promote")}
        </div>
        <div className="board_container">
          {questInfoList.promote?.map((data, index) => {
            return (
              <div className="board_container_item" key={index}>
                <div className="board_container_item_header">
                  <Image
                    width={50}
                    height={50}
                    className="board_container_item_header_img badgeBGI"
                    src={data.badge}
                    alt={data.title ? data.title : "badge"}
                  />
                </div>
                <div className="board_container_item_body">
                  <div className="board_container_item_body_header title_item">
                    {data.title}
                  </div>
                  <div className="board_container_item_body_body">
                    {t("Global.action.share")}
                    <span className="board_container_item_body_body_red">
                      {data.conditionMan}
                    </span>
                    {t("Profile.permission.board_description")}
                    <span className="board_container_item_body_body_red">
                      {data.rewardDay === 999
                        ? t("Profile.main.label.infinite")
                        : data.rewardDay}
                    </span>
                    {t("Global.label.day")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="board_back"></div> */}
        <span onClick={gosharef}>
          <WavaButton className="profile_mission_button">
            {t("Post.share")}
          </WavaButton>
        </span>
      </section>
    </ProfileShareMissionElement>
  );
};

export default ProfileShareMission;

export const ProfileShareMissionElement = styled.div`
  /*  */
  padding-top: ${main_height}px;
  background-color: ${colors.back_grey};

  .profile_mission_section {
    padding: 10px;
    background-color: #fff;

    .banner {
      &_img {
        width: 100%;
        vertical-align: middle;
      }
    }

    &.board {
      position: relative;
      color: #010001;
      font-weight: bold;
      font-size: 1.2rem;
      label {
        margin-left: 10px;
        color: ${colors.text_light_grey};
        font-size: 0.8rem;
      }
    }

    .board {
      &_front,
      &_back {
        position: absolute;
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        box-sizing: content-box;
        text-align: center;
        background-image: linear-gradient(
          to bottom,
          #fa83b3,
          #f45c8c 55%,
          ${colors.dark_pink}
        );
        border-radius: 10px;
      }

      &_front {
        z-index: 2;
        width: 200px;
        color: #fff;
      }

      &_container {
        position: relative;
        z-index: 1;
        padding: 15px;
        font-size: 14px;
        background-color: #fff;
        border: 2px solid #ff547c;
        border-radius: 15px;

        .title_item {
          display: inline-block;
          padding: 2px 12px;
          color: ${colors.dark_pink};
          background-color: rgb(250 113 154 / 20%);
          border: solid 1px ${colors.dark_pink};
          border-radius: 12px;
          font-weight: 500;

          &.gold {
            margin-left: 15px;
          }
        }

        &_item {
          display: flex;
          padding: 10px 0;
          color: ${colors.text_light_grey};

          &:first-of-type {
            margin-top: 20px;
          }

          &:last-of-type {
            margin-bottom: 20px;
          }

          &_header {
            &_img {
              padding: 2px;
              width: 50px;
              vertical-align: middle;
              border-radius: 10px;
              box-sizing: content-box;

              &.badgeBGI {
                background-image: linear-gradient(
                  -45deg,
                  #313e61 0%,
                  #313e61 60%,
                  #1a2950 60.001%,
                  #1a2950 100%
                );
              }
            }
          }

          &_body {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: flex-start;
            margin-left: 10px;

            &_header {
              font-weight: 900;
            }

            &_body {
              &_red {
                color: ${colors.dark_pink};
              }
            }
          }

          &_footer {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: auto;

            &_button {
              cursor: pointer;
              padding: 5px 8px;
              font-size: 12px;
              word-break: keep-all;
              color: ${colors.dark_pink};
              border: solid 1px ${colors.dark_pink};
              border-radius: 16px;
            }
          }
        }
      }

      &_back {
        z-index: 0;
        display: flex;
        overflow: hidden;
        padding: 0 0 10px;
        width: 220px;

        &::after,
        &::before {
          content: "";
          border-top: 15px solid ${colors.dark_pink};
        }

        &::before {
          margin-right: auto;
          border-right: 10px solid ${colors.dark_pink};
          border-radius: 0 19px 0 0;
        }

        &::after {
          border-left: 10px solid ${colors.dark_pink};
          border-radius: 19px 0 0;
        }
      }
    }

    &:first-of-type {
      margin-top: 0;
    }
  }
  .profile_mission_button {
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    background: ${colors.back_dark_pink};
    color: #fff;
    width: 100%;
    padding: 15px 0;
  }
`;
