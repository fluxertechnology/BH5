import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { colors } from "@/lib/constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { getProfileMissionPrice } from "@/lib/services/price";
import Divider from "@mui/material/Divider";

const ProfileMainMissionCenter = ({
  optionEvent,
  config,
  dailyEvent,
  gosharef,
}) => {
  const { isMobile,isDesktop } = useMediaQuery();
  const t = useTranslations();
  const [questInfoList, setQuestInfoList] = useState({});

  useEffect(() => {
    let promote = [];
    for (let i = 1; i <= 5; i++) {
      promote.push({
        title: config["gradename" + i],
        rewardDay: config["sharereg" + i],
        conditionMan: config["renshu" + i],
      });
    }
    let daily = [
      {
        icon: "/images/profile/icon_letter.png",
        title: t("Profile.permission.signin.everyday"),
        gold: getProfileMissionPrice(t, "signin_everyday", config),
        description: t("Profile.permission.signin.click.award"),
        button: t("Profile.permission.signin.now"),
        buttonEvent: dailyEvent,
      },
      {
        icon: "/images/profile/icon_pencil.png",
        title: t("Profile.permission.invite_friend"),
        gold: getProfileMissionPrice(t, "invite_friend", config),
        description: t("Profile.permission.invite_friend_signin"),
        button: t("Profile.permission.invite_now"),
        buttonEvent: gosharef,
      },
    ];
    setQuestInfoList({
      promote,
      daily,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return (
    <ProfileMainMissionElement isBrowser={isDesktop}>
      <div className="profile_container">
        <div className="profile_container_header">
          <div className="profile_container_header_title">
            <span className="profile_container_header_title_text">
              {/* <Image
                className="profile_container_header_title_icon "
                src="/images/profile/account_mission.svg"
                width={0}
                height={0}
                alt="account mission icon"
              /> */}
              {t("Profile.main.option.task.")}
            </span>
          </div>
          <div
            className="profile_container_header_all_permission cursor"
            onClick={() => {
              optionEvent["mission"]();
            }}
          >
            {t("Profile.main.mission.label.all_permission")}

            <FontAwesomeIcon
              className="profile_container_header_all_permission_icon"
              icon={faAngleRight}
            />
          </div>
        </div>
      </div>
      {/* <Divider className="profile_container_divider" /> */}
      <section className="profile_mission_section board">
        <div className="board_container g-flex">
          {questInfoList.daily?.map((data) => {
            return (
              <div className="board_container_div">
                <div className="board_container_item" key={data.title}>
                  <div className="board_container_item_header">
                    <Image
                      className="board_container_item_header_img"
                      src={data.icon}
                      width={45}
                      height={45}
                      alt={data.title}
                    />
                  </div>
                  <div className="board_container_item_body">
                    <div className="board_container_item_body_header">
                      {data.title}
                      <span
                        className="title_item gold "
                        style={{
                          color:
                            data.title ===
                            t("Profile.permission.signin.everyday")
                              ? "#f24c7c"
                              : "#f24c7c",
                        }}
                      >
                        <Image
                          className="title_item gold_icon mr-2"
                          src={
                            data.title ===
                            t("Profile.permission.signin.everyday")
                              ? "/images/profile/icon_diamond.png"
                              : "/images/profile/icon_discount.png"
                          }
                          width={100}
                          height={100}
                          alt={"discount"}
                        />
                        {data.gold}
                      </span>
                    </div>
                    <div className="board_container_item_body_body pl-1">
                      {data.description}
                    </div>
                  </div>
                </div>
                <div className="board_container_item_footer">
                  <div
                    className="board_container_item_footer_button"
                    onClick={data.buttonEvent}
                  >
                    {data.button}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="board_back"></div>
      </section>
    </ProfileMainMissionElement>
  );
};

export default ProfileMainMissionCenter;

const ProfileMainMissionElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isBrowser"].includes(prop),
})`
  ${({ isBrowser }) => `
    /*  */
    padding: ${isBrowser ? "0" : "0 2.67vw "};
    width: ${isBrowser ? "1000px" : "auto"};
    margin: auto;
    background-color: ${colors.back_grey};

    .profile_container {
        background-color: #fff;
        // border-radius: ${isBrowser ? "0" : "1.33vw"};

        &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: ${isBrowser && "0px"};
        border-bottom: ${isBrowser && "1px solid #e7e7e7"};
        padding-top: ${!isBrowser && "0.85vw"};
        &_title {
            &_text {
            padding: ${isBrowser ? "2.5rem 2.41rem 0.7vw" : "4vw 1.8vw 3.8vw"};
            font-weight: 1000;
            display: flex;
            align-items: center;
            font-size: ${isBrowser ? "22px" : "4vw"};
            }

            &_icon {
            vertical-align: middle;
            margin-right: 5px;
            width: 35px ;
            height: 35px;
            }
        }

        &_all_permission {
            display: ${!isBrowser && "none"};
            font-size: 1em;
            text-decoration: none;
            color: ${colors.text_light_grey};

            &_icon {
            margin-left: 5px;
            margin-top: 5px;
            vertical-align: bottom;
            }
        }
        }
    }
    .profile_mission_section {
        padding: ${isBrowser ? "2.2rem 2.4375rem 2.1vw" : "0vw 2vw 4.3vw"};
        background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        &.board {
          position: relative;
          display: flex;
        }

        .board {
        &_front {
            z-index: 2;
            width: 20px;
            color: #fff;
        }

        &_container {
            justify-content: ${isBrowser ? "space-between" : "center"};
            width: 100%;
            gap: ${isBrowser ? "1.04vw" : "3vw"};
            flex-wrap: ${isBrowser ? "nowrap" : "wrap"};

            &_div {
              width: ${isBrowser ? "100%" : "100%"};
              background-color: #fdfbf6;
              font-size: ${isBrowser ? "1.2vw 0 1.4vw" : "0"};
              padding:  ${isBrowser ? "0" : "5vw 0"};
            }

            .title_item {
                &.gold {
                    margin-left: 15px;
                    display: flex;
                    font-size: ${isBrowser ? "18px" : "3.2vw"};

                    &_icon {
                    width: 22px;
                    height: 22px;
                    object-fit:contain;
                    margin:auto;

                    @media (max-width: 599px) {
                        width: 20px;
                        height: 20px;
                    }
                  }
              }
            }

            &_item {
            display: flex;
            justify-content: center;
            margin-bottom: ${isBrowser ? "0.8vw" : "3.5vw"};

            &_header {
                &_img {
                  width: ${isBrowser ? "45px" : "9.07vw"};
                  object-fit: contain;
                  vertical-align: middle;
                  border-radius: 10px;
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
                font-size: ${isBrowser ? "18px" : "3.47vw"};
                display: -webkit-inline-flex;
                justify-content: center;
                }

                &_body {
                font-size: ${isBrowser ? "14px" : "2.67vw"};
                color: ${colors.text_light_grey};
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
                background-color: #fdfbf6;

                &_button {
                text-align: center;
                cursor: pointer;
                padding: ${isBrowser ? "4px" : "1.35vw 6.53vw"} ;
                font-size: ${isBrowser ? "14px" : "2.93vw"};
                word-break: keep-all;
                color: ${colors.dark_pink};
                border: solid 1px ${colors.dark_pink};
                border-radius: 100px;
                @media (min-width: 768px) {
                    padding: 7px 2.75rem;
                }
                }
            }
            }
        }
        }

        &:first-of-type {
        margin-top: 0;
        }
    }
    .profile_container_divider{
      margin: 0 0;
      border-width: 1px;
    }
  `}
`;
