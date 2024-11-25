import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import { colors } from "@/lib/constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";

const ProfileMainMissionCenter = ({
  optionEvent,
  config,
  dailyEvent,
  gosharef,
}) => {
  const { isMobile } = useMediaQuery();
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
        icon: "/images/profile/icon_letter.svg",
        title: t("Profile.permission.signin.everyday"),
        gold:
          config.signinbegin + "-" + config.signinend + t("Global.gold_money"),
        description: t("Profile.permission.signin.click.award"),
        button: t("Profile.permission.signin.now"),
        buttonEvent: dailyEvent,
      },
      {
        icon: "/images/profile/icon_pencil.svg",
        title: t("Profile.permission.invite_friend"),
        gold: config.sharefjb + t("Global.gold_money"),
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
    <ProfileMainMissionElement isBrowser={!isMobile}>
      <div className="profile_container">
        <div className="profile_container_header">
          <div className="profile_container_header_title">
            <span className="profile_container_header_title_text">
              <Image
                className="profile_container_header_title_icon "
                src="/images/profile/account_mission.svg"
                width={0}
                height={0}
                alt="account mission icon"
              />
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
      <section className="profile_mission_section board pb-3">
        <div className="board_container">
          {questInfoList.daily?.map((data) => {
            return (
              <div className="board_container_item mb-1" key={data.title}>
                <div className="board_container_item_header">
                  <Image
                    className="board_container_item_header_img"
                    src={data.icon}
                    width={0}
                    height={0}
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
                          data.title === t("Profile.permission.signin.everyday")
                            ? "#f4eb0b"
                            : "purple",
                      }}
                    >
                      <Image
                        className="title_item gold_icon mr-2"
                        src={
                          data.title === t("Profile.permission.signin.everyday")
                            ? "/images/profile/icon_coin.svg"
                            : "/images/profile/icon_discount.svg"
                        }
                        width={0}
                        height={0}
                        alt={"discount"}
                      />
                      {data.gold}
                    </span>
                  </div>
                  <div className="board_container_item_body_body pl-1">
                    {data.description}
                  </div>
                </div>
                <div className="board_container_item_footer">
                  <div
                    className="board_container_item_footer_button fw-m"
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
    padding: 0% 1%;
    background-color: ${colors.back_grey};

    .profile_container {
        padding: 20px 20px 15px 20px;
        background-color: #fff;

        &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: ${isBrowser && "20px"};

        &_title {
            &_text {
            padding-top: 0px;
            font-weight: 1000;
            font-size: ${isBrowser && "28px"};
            }

            &_icon {
            vertical-align: middle;
            margin-right: 5px;
            width: 35px;
            height: 35px;
            }
        }

        &_all_permission {
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
        padding: 0 20px;
        background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        &.board {
        position: relative;
        }

        .board {
        &_front {
            z-index: 2;
            width: 20px;
            color: #fff;
        }

        &_container {
            .title_item {
            &.gold {
                margin-left: 15px;
                display: flex;
                font-size: ${isBrowser ? "18px" : "14px"};

                &_icon {
                width: 24px;
                height: 24px;

                @media (max-width: 599px) {
                    width: 20px;
                    height: 20px;
                }
                }
            }
            }

            &_item {
            display: flex;
            padding: 10px 0;

            &_header {
                &_img {
                width: ${isBrowser ? "45px" : "35px"};
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
                font-size: ${isBrowser ? "20px" : "16px"};
                display: -webkit-inline-flex;
                justify-content: center;
                }

                &_body {
                font-size: ${isBrowser ? "14px" : "12px"};
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

                &_button {
                cursor: pointer;
                padding: 4px;
                font-size: ${isBrowser && "14px"};
                word-break: keep-all;
                color: ${colors.dark_pink};
                border: solid 1px ${colors.dark_pink};
                border-radius: 100px;
                @media (min-width: 599px) {
                    padding: 10px 14px;
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
  `}
`;
