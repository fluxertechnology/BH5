"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Image from "next/image";
import { apiUrl } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import { getPremiumDiamond } from "@/lib/services/price";
import { updateUserDataAction } from "@/store/actions/user";
import toastCall from "@/lib/services/toastCall";
import { nowLang } from "@/i18n/Metronici18n";
import gameTypes from "@/lib/tcg/game_types";

const UserPanel = ({ className = "" }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isDesktop,isMobile } = useMediaQuery();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(10);
  const [isLoadingTransferOutAll, setIsLoadingTransferOutAll] = useState(false);
  const [tcgGameType, setTcgGameType] = useState("HOT");
  const defaultFeatures = [
    {
      title: t("Tcg.feature.deposit"),
      icon: "user-panel-saving",
      url: pageUrlConstants.profile.pages.profilePayment,
    },
    {
      title: t("Tcg.feature.withdraw"),
      icon: "user-panel-withdraw",
      url: pageUrlConstants.profile.pages.profileWithdraw,
    },
    {
      title: t("Tcg.feature.offer"),
      icon: "user-panel-offer",
      url: pageUrlConstants.promotions,
    },
    {
      title: t("Tcg.feature.record"),
      icon: "user-panel-record",
      url: pageUrlConstants.profile.pages.profileWithdraw
        .profileWithdrawHistory,
    },
  ];

  const lang = ["sc", "tc", "zh"].includes(nowLang) ? "zh" : "en";

  const handleTransferOutAll = async (e) => {
    e.stopPropagation();
    if (state.user.id === "guest") {
      return;
    }

    setIsLoadingTransferOutAll(true);
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/transfer_out_by_all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify({
          uid: state.user.id,
          type: "all",
        }),
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "转出失败，请稍后再试");
        return;
      }
      toastCall("转出成功");

      useGlobalDispatch(
        updateUserDataAction(() => {
          window.location.reload();
        })
      );
    } catch (error) {
      console.error("转出失败:", error);
      toastCall("转出失败，请稍后再试");
    } finally {
      setIsLoadingTransferOutAll(false);
    }
  };

  const handleFeatureClick = (item, index) => {
    setActiveFeatureIndex(index);
    useGlobalDispatch(pushRoutes(item.url));
  };

  const handleGameTypeChange = (key) => {
    setTcgGameType(key);
    window.location.href = `/home/tcg/${key}`;
  };

  return (
    <UserPanelElement className={className}>
      <>
        {!isMobile && Object.keys(gameTypes).length > 0 && (
          <div className={`user-panel ${lang}`}>
            {/* Game Type List for Desktop */}
            <div className="w-auto">
              <div className="flex type-list">
                {Object.entries(gameTypes).map(
                  ([key, { label, icon }], index) => (
                    <div
                      key={index}
                      className={`inline-block m-1 rounded-lg border ${
                        tcgGameType === key
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <button
                        className={`flex flex-col items-center rounded-lg justify-center gap-1 p-2 md:p-3 w-full type-item ${
                          tcgGameType === key ? "active" : ""
                        }`}
                        onClick={() => handleGameTypeChange(key)}
                      >
                        <Image
                          src={`/images/tcg/${icon}.png`}
                          alt={label}
                          width={128}
                          height={128}
                          className="inline-block type-item--image"
                        />
                        <span className="whitespace-nowrap">{label}</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="user-info">
              <div className="user-name truncate">
                {state.user.id === "guest" ? "guest" : state.user.nick_name}
              </div>
              <div className="user-money">
                {t("Common.balance")} :{" "}
                {getPremiumDiamond(t, state.user.money, false)}
                <Image
                  src="/images/icons/refresh.png"
                  alt="refresh"
                  width={24}
                  height={24}
                  className={`inline-block cursor-pointer refresh-icon ${
                    state.user.id === "guest" || isLoadingTransferOutAll
                      ? "hidden"
                      : ""
                  }`}
                  onClick={handleTransferOutAll}
                />
              </div>
            </div>

            {/* Feature List */}
            <div className="feature-list">
              {defaultFeatures.map((item, index) => (
                <div
                  key={index}
                  className={`feature-item ${
                    activeFeatureIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleFeatureClick(item, index)}
                >
                  <Image
                    src={`/images/tcg/${item.icon}.png`}
                    alt={item.title}
                    width={128}
                    height={128}
                    className="feature-item--image"
                  />
                  <div className="title">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {isMobile && Object.keys(gameTypes).length > 0 && (
          <div className="mobile-panel">
            <div className="game-list">
              {Object.entries(gameTypes).map(
                ([key, { label, icon }], index) => (
                  <div
                    key={key}
                    className={`game-item ${
                      index === 0 ? "game-item--large" : "game-item--small"
                    } ${tcgGameType === key ? "active" : ""}`}
                  >
                    <button
                      className={` ${tcgGameType === key ? "active" : ""}`}
                      onClick={() => handleGameTypeChange(key)}
                    >
                      <Image
                        src={`/images/tcg/${icon}.png`}
                        alt={label}
                        width={128}
                        height={128}
                        className="inline-block type-item--image"
                      />
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  </div>
                )
              )}
            </div>
            <div className="notification-bar">
              <div className="icon">
                <Image
                  src={`/images/tcg/type-mobile-speaker.png`}
                  alt="speaker"
                  width={128}
                  height={128}
                  className="speacker-icon"
                />
              </div>
              <div className="message">
                去年十月份的事情了。这个少妇是我在陌陌上加的。
              </div>
            </div>
          </div>
        )}
      </>
    </UserPanelElement>
  );
};

export default UserPanel;

const UserPanelElement = styled.div`
  .user-panel {
    z-index: 1000;
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 5vw !important;
    padding-right: 5vw !important;

    @media (max-width: 1024px) {
      padding-right: 1vw !important;
      padding-left: 1vw !important;
    }
    @media (min-width: 1400px) {
      padding-right: 11.927vw !important;
      padding-left: 11.927vw !important;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      font-family: "Microsoft YaHei";
      color: rgb(255, 255, 255);
      font-size: 18px;

      .user-name {
        font-weight: bold;
      }

      .user-money {
        filter: brightness(0) invert(1);
        margin-top: 0.26vw;
      }
    }

    .feature-list {
      display: flex;
      gap: 12px;
      // flex-wrap: wrap;

      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px;
        border: 2px solid transparent;
        border-radius: 10px;
        background-color: #f3f3f3;
        cursor: pointer;
        transition: all 0.3s;

        .icon {
          font-size: 24px;
        }
        .title {
          font-family: "Microsoft YaHei";
          color: rgb(51, 51, 51);
          line-height: 1;
          text-align: center;
        }

        &.active {
          border-color: #ff9900;
          background-color: #fff7e6;
        }
      }
    }
  }

  .mobile-game-types {
    margin-top: 20px;
  }

  @media (min-width: 1024px) {
    .user-panel {
      justify-content: space-between !important;
      background: linear-gradient(to right, #ffffff, #d18fd7, #873fdb);
      width: 100%;
      padding: 0.63vw 11.98vw;
    }

    .user-info {
      .user-name {
      }

      .user-money {
        margin-top: 5px;
        font-size: 0.83vw;

        .refresh-icon {
          height: 0.78vw;
          width: 0.78vw;
          margin-left: 0.63vw;
        }
      }
    }

    .type-list {
      .type-item {
        height: 2.08vw;
        min-width: 6.77vw;
        border-radius: 0.26vw;
        font-size: 0.83vw;
        font-weight: 700;
        font-family: "Microsoft YaHei";
        color: #333333;
        background: #f3f3f3;
        flex-direction: row;

        &.active {
          background: linear-gradient(to right, #335fc2, #863fdb);
          color: rgb(255, 255, 255);
        }

        .type-item--image {
          height: 1.56vw;
          width: auto;
        }
      }
    }

    .feature-list {
      gap: 0.36vw !important;
      flex-wrap: no-wrap !important;

      .feature-item {
        width: 3.65vw;
        height: 4.38vw;
        padding: 0 !important;

        .feature-item--image {
          height: 2.4vw;
          width: auto;
        }

        .title {
          font-size: 0.83vw;
          margin-top: 0.13vw;
        }
      }
    }

    .mobile-game-types {
      display: none;
    }

    .user-panel.en {
      .user-info {
        .user-money {
          font-size: clamp(10px, 0.75vw, 100px);
        }
      }
      .feature-list {
        .title {
          font-size: 0.7vw;
          margin-top: 0.13vw;
        }
      }
    }
  }

  @media (max-width: 1023px) {
    .user-panel {
      padding: 2vw 1vw 1.6vw !important;
      background: linear-gradient(to bottom right, #ee51ab, #873fdb);
      background: url("/images/tcg/user-panel-bg.png") no-repeat center center !important;
      background-size: cover !important;
      border-radius: 0.67vw;
      justify-content: space-between;
      width: 100%;

      .user-info {
        line-height: 0.917;
        margin: auto;
        .user-name {
          font-size: 3.2vw;
          margin-bottom: 1.2vw;
        }
        .user-money {
          font-size: 3.2vw;
          display: flex;
          align-items: center;
          width: max-content;

          .refresh-icon {
            height: 3.2vw;
            width: 3.2vw;
            margin-left: 1.6vw;
          }
        }
      }

      .feature-list {
        justify-content: space-between;
        flex-wrap: nowrap !important;
        gap: 1.5vw !important;

        .feature-item {
          width: 13.25vw !important;
          height: 16.93vw !important;
          padding: 0 !important;

          .feature-item--image {
            height: 8vw;
            width: auto;
          }

          .title {
            font-size: 2.93vw !important;
            margin-top: 1.13vw !important;
          }
        }
      }
    }

    .type-list {
      width: 20.67vw;
      .type-item {
        height: 20.67vw;
        width: 20.67vw;
        margin-bottom: 1.07vw;

        button {
          height: 100%;
          width: 100%;
          background: url("/images/tcg/type-inactive.png") no-repeat center
            center !important;
          background-size: cover !important;

          &.active {
            background: url("/images/tcg/type-active.png") no-repeat center
              center !important;
            background-size: cover !important;
          }
        }

        .type-item--image {
          height: 11.47vw;
          width: auto;
        }
      }
    }
  }

  .mobile-panel {
    padding: 3.33vw 2.67vw 1vw;
    background-color: #fff;

    .game-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 1.73vw;
      grid-row-gap: 1.73vw;
      height: 17.6vw;

      .game-item {
        position: relative;
        border-radius: 1.6vw;
        overflow: hidden;
        text-align: center;

        button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          padding: 0 0.8vw 0 2.13vw;
        }

        .type-item--image {
          width: auto;
          height: 5.33vw;
          // margin-right: 2.93vw;
          object-fit: contain;
        }

        span {
          font-size: 3.2vw;
          font-weight: 600;
          color: #fff;
          width: 100%;
          text-align: center;
        }
      }

      .game-item--large {
        grid-column: span 1;
        grid-row: span 2;
        // aspect-ratio: 1 / 1;
        background: url("/images/tcg/type-mobile-small.png") no-repeat
          center/cover;
      }

      .game-item--small {
        grid-column: span 1;
        // aspect-ratio: 2 / 1;
        background: url("/images/tcg/type-mobile-large.png") no-repeat
          center/cover;
      }
    }

    .notification-bar {
      border-radius: 1.33vw;
      background-color: rgb(255, 237, 246);
      height: 5.2vw;
      display: flex;
      margin-top: 2.8vw;

      .icon {
        background-color: rgb(251, 111, 159);
        padding: 1.2vw;
        border-radius: 1.33vw 0 0 1.33vw;
        margin-right: 2.4vw;

        .speacker-icon {
          width: 3.6vw;
          height: 3.2vw;
          object-fit: contain;
        }
      }

      .message {
        font-size: 2.4vw;
        font-family: "Microsoft YaHei";
        color: rgb(51, 51, 51);
        display: flex;
        align-items: center;
      }
    }
  }
`;
