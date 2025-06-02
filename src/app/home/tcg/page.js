"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Image from "next/image";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys, side_padding, apiUrl } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import tcgAxios from "@/lib/services/tcgAxios";
import productTypes from "@/lib/tcg/product_types";
import gameTypes from "@/lib/tcg/game_types";
import getLanguageCode from "@/lib/tcg/language_code";
import toastCall from "@/lib/services/toastCall";
import { PopupDialogWrapper } from "@/components/login/PopupComponent";
import IconInput from "@/components/login/IconInputComponent";
import { openPopup } from "@/store/actions/user";
import { nowLang } from "@/i18n/Metronici18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";

const HomeTcgMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // 当前选中的类别
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(10); // 当前选中的功能按钮

  // 假数据
  const userInfo = { name: "用户姓名", money: "¥1000" }; // 用户信息
  const features = [
    {
      title: "存款",
      icon: "💰",
      url: pageUrlConstants.profile.pages.profilePayment,
    },
    {
      title: "提现",
      icon: "💵",
      url: pageUrlConstants.profile.pages.profileWithdraw,
    },
    { title: "优惠", icon: "🎁", url: pageUrlConstants.promotions },
    { title: "记录", icon: "📜", url: pageUrlConstants.transactionHistory },
  ];

  const lang = ["sc", "tc"].includes(nowLang) ? "zh" : "en";
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [tcgUserName, setTcgUserName] = useState("");
  const [tcgUserBalance, setTcgUserBalance] = useState(0);
  const [tcgProductTypes, setTcgProductTypes] = useState(4);
  const [tcgGameType, setTcgGameType] = useState("RNG");
  const [tcgGameList, setTcgGameList] = useState([]);
  const [tcgGameCurrentPage, setTcgCurrentPage] = useState(1);
  const [tcgTotalGames, setTcgTotalGames] = useState(0);
  const tcgGamePageSize = 100;

  const tcgGetUserName = async () => {
    setTcgUserName("test123");
    return;
    const userId = state.user.id;
    if (!userId || userId === "guest") {
      return;
    }
    const payload = {
      bh5_user_id: userId,
    };
    try {
      const response = await tcgAxios.post(`/get_user`, payload);
      if (response.data.status !== 0) {
        console.log(
          response.data.error_desc ||
            response.data.message ||
            "获取TCG用户名失败，请稍后再试"
        );
        return;
      }
      setTcgUserName(response.data.tcg_username);
    } catch (error) {
      console.error("获取TCG用户名失败:", error);
    }
  };

  const tcgUserGetBalance = async () => {
    if (!tcgUserName) {
      return;
    }
    const payload = {
      username: tcgUserName,
      product_type: tcgProductTypes,
    };
    try {
      const response = await tcgAxios.post(`/get_balance`, payload);
      if (response.data.status !== 0) {
        toastCall(response.data.error_desc || "获取用户余额失败，请稍后再试");
        return;
      }
      setTcgUserBalance(response.data.balance);
      console.log("用户余额:", response.data);
    } catch (error) {
      console.error("获取用户余额失败:", error);
    }
  };

  const tcgGetGameList = async (page = 1) => {
    const payload = {
      game_type: tcgGameType,
      page,
      page_size: tcgGamePageSize,
    };

    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/get_game_list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.code === 0) {
        toastCall(data.msg || "获取游戏列表失败，请稍后再试");
        return;
      }

      setTcgTotalGames(data.data.total || 0);
      setTcgGameList(data.data.value || []);
    } catch (error) {
      console.error("获取游戏列表失败:", error);
    }
  };

  const tcgGetGameUrl = async (gameId) => {
    console.log("获取游戏链接，游戏ID:", gameId);
    if (!gameId) {
      return;
    }
    const payload = {
      uid: state.user.id,
      game_id: gameId,
      platform: isMobile ? "html5" : "html5-desktop",
    };

    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/launch_game_by_auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "获取游戏链接失败，请稍后再试");
        return;
      }
      window.open(data.data.url, "_blank");
    } catch (error) {
      console.error("获取游戏链接失败:", error);
      toastCall("获取游戏链接失败，请稍后再试");
    }
  };

  const tcgTransferOutAll = async (e, gameId) => {
    e.stopPropagation();
    console.log("转出游戏ID:", gameId);
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/transfer_out_by_all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify({
          uid: state.user.id,
          game_id: gameId,
        }),
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "转出失败，请稍后再试");
        return;
      }
      toastCall("转出成功");
      console.log("转出成功:", data);
    } catch (error) {
      console.error("转出失败:", error);
      toastCall("转出失败，请稍后再试");
    }
  };

  const handleTcgSignup = () => {
    if (!state.user.id || state.user.id === "guest") {
      toastCall("请先登录或注册账号");
      useGlobalDispatch(openPopup("login"));
      return;
    }
    setIsOpenLogin(true);
  };

  useEffect(() => {
    setTcgCurrentPage(1);
  }, [tcgProductTypes, tcgGameType]);

  useEffect(() => {
    tcgGetGameList(tcgGameCurrentPage);
  }, [tcgGameCurrentPage]);

  useEffect(() => {
    tcgUserGetBalance();
    tcgGetGameList();
  }, [tcgUserName, tcgProductTypes, tcgGameType]);

  useEffect(() => {
    tcgGetUserName();
  }, []);

  return (
    <HomeTcgMainPageElement>
      {/* 顶部轮播图 */}
      <div className="carousel">
        <ImageCarousel
          adsKey={adsKeys.search_interval}
          threeInOneBanner={!isMobile}
        />
      </div>

      {/* 主体内容 */}
      <div className="content-grid">
        {/* 左侧用户信息和功能列表 */}
        <div className="sidebar">
          <div className="user-feature-header">
            <div className="user-panel w-full md:w-auto flex justify-center">
              <div className="user-info m-2">
                {!tcgUserName ? (
                  <>
                    <div className="user-name">游客</div>
                    <button
                      className="border border-1 p-2"
                      onClick={handleTcgSignup}
                    >
                      注册
                    </button>
                  </>
                ) : (
                  <>
                    <div className="user-name">{tcgUserName}</div>
                    <div className="user-money">余额: ¥{tcgUserBalance}</div>
                  </>
                )}
              </div>
              <div className="feature-list">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className={`feature-item ${
                      activeFeatureIndex === index ? "active" : ""
                    }`}
                    onClick={() => {
                      // setActiveFeatureIndex(index);
                      useGlobalDispatch(pushRoutes(item.url));
                    }}
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="title">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full gap-2 mb-6">
              <div className="w-auto md:w-[15%]">
                <div className="flex flex-col overflow-x-auto overflow-visible whitespace-nowrap">
                  {Object.entries(gameTypes).map(
                    ([key, { label, icon }], index) => (
                      <div
                        key={index}
                        className={`inline-block md:block m-1 rounded-lg border ${
                          tcgGameType === key
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        <button
                          className={`flex flex-col md:flex-row items-center rounded-lg justify-center gap-1 md:gap-2 p-2 md:p-3 w-full ${
                            tcgGameType === key
                              ? "bg-blue-500 text-white"
                              : "bg-white"
                          }`}
                          onClick={() => setTcgGameType(key)}
                        >
                          <span className="text-xl">{icon}</span>
                          <span className="text-sm md:text-base whitespace-nowrap">
                            {label}
                          </span>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {tcgGameList && tcgGameList.length > 0 ? (
                <div className="w-[85%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 p-2">
                  {tcgGameList.map((game, index) => (
                    <div
                      key={index}
                      className="relative game-item p-2 border rounded-lg shadow hover:shadow-lg cursor-pointer text-center"
                      onClick={() => tcgGetGameUrl(game.id)}
                    >
                      <div
                        className="absolute z-[100] right-[10] border"
                        onClick={(e) => tcgTransferOutAll(e, game.id)}
                      >
                        <FontAwesomeIcon
                          className="list_container_card_footer_icon"
                          icon={faArrowRightArrowLeft}
                        />
                      </div>
                      <div className="icon text-2xl">
                        <div className="relative rounded-md overflow-hidden icon flex justify-center">
                          <Image
                            className="object-contain"
                            src={game.img.replace("/zh/", "/EN/")}
                            height={64}
                            width={64}
                            alt="collect"
                            onError={(e) => {
                              e.currentTarget.src = "";
                            }}
                          />
                        </div>
                      </div>
                      <div className="title text-sm font-medium mt-2">
                        {game.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">暂无游戏</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TcgRegisterPopupModal
        open={isOpenLogin}
        onRegisterSuccess={() => {
          tcgGetUserName();
          setIsOpenLogin(false);
        }}
      />
    </HomeTcgMainPageElement>
  );
};

export default HomeTcgMainPage;

export const HomeTcgMainPageElement = styled.div`
  padding: 0 ${side_padding}px;

  .carousel {
    margin-top: 16px;
    margin-bottom: 20px;
  }

  .content-grid {
    display: flex;
    justify-content: center;
    gap: 16px;
    width: 100%;
    margin: 1vw 0;
    flex-wrap: wrap;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .user-feature-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 10px;
    padding: 10px;
    gap: 20px;
    width: 100%;

    .user-panel {
      display: flex;
      align-items: center;
      border-radius: 0.5rem;
      padding: 1rem;
      background: linear-gradient(to bottom right, #dbd3de, #dadfde);

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        border-right: 1px solid #ccc7cd;
        padding-right: 2rem;
        margin-right: 2rem;

        .user-name {
          font-size: 18px;
          font-weight: bold;
        }

        .user-money {
          margin-top: 5px;
          font-size: 16px;
          color: #ff9900;
        }
      }

      .feature-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 2px solid transparent;
          border-radius: 10px;
          background-color: #fff;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 60px;

          .icon {
            font-size: 24px;
          }
          .title {
            margin-top: 6px;
            font-size: 14px;
          }

          &.active {
            border-color: #ff9900;
            background-color: #fff7e6;
          }
        }
      }
    }
  }

  .category-game-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 200px;

    @media (max-width: 768px) {
      flex-direction: row;
      width: 100%;
      overflow-x: auto;
      padding-bottom: 10px;
    }

    .category-item {
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
      transition: background-color 0.3s;
      flex-shrink: 0;
      min-width: 100px;

      &.active {
        background-color: #fff7e6;
      }

      .category-title {
        font-size: 16px;
      }
    }
  }

  .game-list {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 16px;
    justify-content: center;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;

    .game-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      background: #fafafa;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .icon {
        font-size: 30px;
      }

      .title {
        margin-top: 8px;
        font-size: 16px;
      }
    }
  }

  @media (max-width: 768px) {
    .content-grid {
      flex-direction: column;
    }

    .category-game-list {
      flex-direction: column;
    }

    .user-panel {
      padding: 2vw 1vw !important;

      .user-info {
        padding-right: 2vw !important;
        margin-right: 2vw !important;
      }

      .feature-list {
        justify-content: space-between;
        flex-wrap: nowrap !important;
        gap:1.5vw !important;

        .feature-item {
          padding: 2vw !important;
          min-width: 12vw !important;
          width: inherit;
        }
      }
    }
  }
`;

export const TcgRegisterPopupModal = ({ open, onRegisterSuccess }) => {
  const { state } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(open);
  const [usernameRef] = useState(null);
  const [userpasswordRef] = useState(null);
  const [tcgUserName, setTcgUserName] = useState("");
  const [tcgUserPassword, setTcgUserPassword] = useState("");

  const closeModal = () => {
    setTcgUserName("");
    setTcgUserPassword("");
    setIsOpen(false);
  };

  const handleUserNameChange = (e) => {
    setTcgUserName(e.target.value);
  };

  const tcgUserSignup = async () => {
    const userId = state.user.id;
    if (userId === "guest") {
      useGlobalDispatch(openPopup("login"));
      return;
    }
    const payload = {
      bh5_user_id: userId,
      username: tcgUserName,
      password: tcgUserPassword,
    };
    try {
      const response = await tcgAxios.post(`/create_user`, payload);
      if (response.data.status !== 0) {
        toastCall(
          response.data.error_desc ||
            response.data.message ||
            "注册失败，请稍后再试"
        );
        return;
      }
      console.log("注册成功:", response.data);
      onRegisterSuccess();
    } catch (error) {
      console.error("注册失败:", error);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <PopupDialogWrapper>
        <div className="card-container">
          <div className="close-cont" onClick={closeModal}>
            <FontAwesomeIcon
              className="close-icon"
              icon={faX}
              style={{ color: "#434343" }}
            />
          </div>
          <div className="card-header">
            <h3 className="title-text">注册</h3>
            <p className="subtitle-text hidden">
              have account?
              <span className="green cursor-pointer">Login</span>
            </p>
          </div>
          <div>
            <div className="form-item">
              <label className="form-label">用户名</label>
              <div className="input_content_box">
                <IconInput
                  ref={usernameRef}
                  name="tcgUserName"
                  inputType="text"
                  value={tcgUserName}
                  callback={handleUserNameChange}
                  placeholder="请输入用户名"
                  enterKeyHint="next"
                />
              </div>
            </div>
          </div>
          <div className="form-item">
            <label className="form-label">密码</label>
            <div className="input_content_box">
              <IconInput
                ref={userpasswordRef}
                name="tcgUserPassword"
                inputType="password"
                value={tcgUserPassword}
                callback={(e) => setTcgUserPassword(e.target.value)}
                placeholder="请输入密码"
                enterKeyHint="done"
              />
            </div>
            <div className="btn-wrapper mt-3" onClick={tcgUserSignup}>
              <button className="submit-btn">注册</button>
            </div>
          </div>
        </div>
      </PopupDialogWrapper>
    </div>
  );
};
