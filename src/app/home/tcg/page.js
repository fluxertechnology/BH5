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
import gameTypes from "@/lib/tcg/game_types";
import toastCall from "@/lib/services/toastCall";
import { PopupDialogWrapper } from "@/components/login/PopupComponent";
import IconInput from "@/components/login/IconInputComponent";
import { openPopup } from "@/store/actions/user";
import { nowLang } from "@/i18n/Metronici18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import { useIframe } from "@/hooks/useIframe";
import FullPageIframe from "@/components/common/FullPageIframe";
import { getPremiumDiamond } from "@/lib/services/price";

const HomeTcgMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(10); // 当前选中的功能按钮

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
  const [tcgProductTypes, setTcgProductTypes] = useState(4);
  const [tcgGameType, setTcgGameType] = useState("HOT");
  const [tcgGameList, setTcgGameList] = useState([]);
  const [tcgGameCurrentPage, setTcgCurrentPage] = useState(1);
  const [tcgTotalGames, setTcgTotalGames] = useState(0);
  const tcgGamePageSize = 100;

  const { isOpen, currentUrl, openIframe, closeIframe } = useIframe();

  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentGameUrl, setCurrentGameUrl] = useState("");
  const [currentGameProductType, setCurrentGameProductType] = useState("");
  const [isLoadingGameUrl, setIsLoadingGameUrl] = useState(false);

  const tcgGetGameList = async (page = 1) => {
    const payload = {
      game_type: tcgGameType === "HOT" ? "" : tcgGameType,
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

  const tcgGetGameUrl = async (gameId, confirm = true) => {
    setCurrentGameId(gameId);
    if (!confirm) {
      setIsTipsOpen(true);
      return;
    }
    console.log("获取游戏链接，游戏ID:", gameId);
    if (!gameId) {
      return;
    }
    setIsLoadingGameUrl(true);

    const isGuest = state.user.id === "guest";
    const guestUid = localStorage.getItem("guestTcgUID") ?? "guest";
    const payload = {
      uid: isGuest ? guestUid : state.user.id,
      game_id: gameId,
      platform: isMobile ? "html5" : "html5-desktop",
    };

    const apiPath = isGuest ? "launch_game" : "launch_game_by_auth";
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/${apiPath}`, {
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
      if (data.data?.uid) {
        localStorage.setItem("guestTcgUID", data.data.uid);
      }

      if (!data.data?.url) {
        toastCall("获取游戏链接失败，请稍后再试");
        return;
      }

      setCurrentGameUrl(data.data.url);
      setCurrentGameProductType(data.data.product_type || "");
      openIframe(data.data.url);
    } catch (error) {
      console.error("获取游戏链接失败:", error);
      toastCall("获取游戏链接失败，请稍后再试");
    } finally {
      setIsLoadingGameUrl(false);
    }
  };

  const tcgGameExit = async () => {
    await tcgTransferOutAll(
      {
        stopPropagation: () => {},
      },
      currentGameId,
    );
    closeIframe();
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
          product_type: currentGameProductType,
          ...(gameId === "all"
            ? {
                type: "all",
              }
            : {
                game_id: gameId,
              }),
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

  const openGame = (gameUrl = null) => {
    setIsTipsOpen(false);
    tcgGetGameUrl(currentGameId, true);
    return;
    console.log("打开游戏链接:", gameUrl || currentGameUrl);
    //const win = window.open(data.data.url, "_blank");
    //if (win) {
    //  const checkClosed = setInterval(async () => {
    //    if (win.closed) {
    //       await tcgTransferOutAll(
    //        {
    //          stopPropagation: () => {},
    //        },
    //        gameId,
    //      );
    //      clearInterval(checkClosed);
    //    }
    //  }, 500);
    //} else {
    //  alert("Popup blocked. Please allow popups for this site.");
    //}
    //window.open(data.data.url, "_blank");
    openIframe(gameUrl || currentGameUrl);
  };

  useEffect(() => {
    setTcgCurrentPage(1);
  }, [tcgProductTypes, tcgGameType]);

  useEffect(() => {
    //tcgUserGetBalance();
    tcgGetGameList(tcgGameCurrentPage);
  }, [tcgGameType, tcgGameCurrentPage]);

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => false,
      },
    });
  }, []);

  return (
    <HomeTcgMainPageElement main_height={state.navbar.mainHeight}>
      {/* 顶部轮播图 */}
      <ImageCarousel
        adsKey={adsKeys.search_interval}
        threeInOneBanner={!isMobile}
        size="banner_animated"
        is_cover
      />

      {/* 主体内容 */}
      <div className="content-grid">
        {/* 左侧用户信息和功能列表 */}
        <div className="sidebar">
          <div className="user-feature-header">
            <div className="user-panel w-full md:w-auto flex justify-center">
              <div className="user-info m-2">
                <div className="user-name truncate w-20">{state.user.id}</div>
                <div className="user-money">
                  余额: {getPremiumDiamond(t, state.user.money, false)}
                  <Image
                    src="/images/icons/refresh.png"
                    alt="refresh"
                    width={14}
                    height={14}
                    className={`inline-block cursor-pointer ml-2 ${state.user.id === "guest" ? "hidden" : ""}`}
                    onClick={(e) => tcgTransferOutAll(e, "all")}
                  />
                </div>
              </div>
              <div className="feature-list">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className={`feature-item w-20 h-20 ${
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
                    ),
                  )}
                </div>
              </div>

              {tcgGameList && tcgGameList.length > 0 ? (
                <div className="w-[85%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-2">
                  {tcgGameList.map((game, index) => (
                    <div
                      key={index}
                      className="relative game-item p-2 border rounded-lg shadow hover:shadow-lg cursor-pointer text-center max-h-[108px]"
                      onClick={() =>
                        tcgGetGameUrl(game.id, state.user.id !== "guest")
                      }
                    >
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
            <div className="pagination-controls my-6 flex justify-center">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-2">
                {/* 首页 */}
                <button
                  onClick={() => setTcgCurrentPage(1)}
                  disabled={tcgGameCurrentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
                >
                  &laquo;
                </button>

                {/* 上一页 */}
                <button
                  onClick={() =>
                    setTcgCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={tcgGameCurrentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
                >
                  ‹
                </button>

                {/* 页码 */}
                {Array.from(
                  {
                    length: Math.min(
                      isMobile ? 3 : 5,
                      Math.ceil(tcgTotalGames / tcgGamePageSize),
                    ),
                  },
                  (_, i) => {
                    const totalPages = Math.ceil(
                      tcgTotalGames / tcgGamePageSize,
                    );
                    let startPage = Math.max(
                      1,
                      Math.min(
                        tcgGameCurrentPage - Math.floor((isMobile ? 3 : 5) / 2),
                        totalPages - (isMobile ? 2 : 4),
                      ),
                    );
                    const page = startPage + i;

                    if (page > totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setTcgCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center border rounded shrink-0 ${
                          page === tcgGameCurrentPage
                            ? "bg-gray-300 font-bold"
                            : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}

                {/* 下一页 */}
                <button
                  onClick={() =>
                    setTcgCurrentPage((prev) =>
                      prev < Math.ceil(tcgTotalGames / tcgGamePageSize)
                        ? prev + 1
                        : prev,
                    )
                  }
                  disabled={
                    tcgGameCurrentPage >=
                    Math.ceil(tcgTotalGames / tcgGamePageSize)
                  }
                  className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
                >
                  ›
                </button>

                {/* 尾页 */}
                <button
                  onClick={() =>
                    setTcgCurrentPage(
                      Math.ceil(tcgTotalGames / tcgGamePageSize),
                    )
                  }
                  disabled={
                    tcgGameCurrentPage >=
                    Math.ceil(tcgTotalGames / tcgGamePageSize)
                  }
                  className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
                >
                  &raquo;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TcgRegisterPopupModal
        open={isOpenLogin}
        onRegisterSuccess={() => {
          setIsOpenLogin(false);
        }}
      />
      <TcgTipsModal
        open={isTipsOpen}
        onClose={() => {
          setIsTipsOpen(false);
        }}
        onOpenGame={() => {
          openGame();
        }}
        isLoading={isLoadingGameUrl}
      />

      <FullPageIframe
        url={currentUrl}
        isOpen={isOpen}
        onClose={tcgGameExit}
        title=""
      />
    </HomeTcgMainPageElement>
  );
};

export default HomeTcgMainPage;

export const HomeTcgMainPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
  // padding: 0 ${side_padding}px;
  padding-top: ${main_height}px;

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
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
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
      max-height: 108px;
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
      margin-bottom: 67px;
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
        gap: 1.5vw !important;

        .feature-item {
          padding: 2vw !important;
          min-width: 12vw !important;
          width: inherit;
        }
      }
    }
  }
  `}
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
            "注册失败，请稍后再试",
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

const TcgTipsModal = ({ open, onClose, onOpenGame, isLoading }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <PopupDialogWrapper>
        <div className="card-container">
          <div className="close-cont" onClick={onClose}>
            <FontAwesomeIcon
              className="close-icon"
              icon={faX}
              style={{ color: "#434343" }}
            />
          </div>
          <div className="card-header">
            <h3 className="title-text">温馨提示</h3>
          </div>
          <div className="card-body">
            <p>您尚未創建帳號，請先前往創建帳號並且綁定信箱。</p>
            <div className="flex gap-2 mt-3">
              <button className="submit-btn p-3" onClick={onOpenGame}>
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "加载中..." : "继续游戏"}
              </button>
              <button
                className="submit-btn p-3"
                onClick={() => {
                  useGlobalDispatch(openPopup("login"));
                  onClose();
                }}
              >
                前往创建账号
              </button>
            </div>
          </div>
        </div>
      </PopupDialogWrapper>
    </div>
  );
};
