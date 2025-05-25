"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Image from "next/image";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys, side_padding } from "@/lib/constants";
import { useGlobalContext } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import tcgAxios from "@/lib/services/tcgAxios";
import productTypes from "@/lib/tcg/product_types";
import gameTypes from "@/lib/tcg/game_types";
import getLanguageCode from "@/lib/tcg/language_code";
import toastCall from "@/lib/services/toastCall";

const HomeTcgMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // 当前选中的类别
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0); // 当前选中的功能按钮

  // 假数据
  const userInfo = { name: "用户姓名", money: "¥1000" }; // 用户信息
  const features = [
    { title: "存款", icon: "💰", url: "#" },
    { title: "提现", icon: "💵", url: "#" },
    { title: "优惠", icon: "🎁", url: "#" },
    { title: "记录", icon: "📜", url: "#" },
  ];

  const [tcgUserName, setTcgUserName] = useState("");
  const [tcgUserBalance, setTcgUserBalance] = useState(0);
  const [tcgProductTypes, setTcgProductTypes] = useState(4);
  const [tcgGameType, setTcgGameType] = useState("RNG");
  const [tcgGameList, setTcgGameList] = useState([]);
  const [tcgGameCurrentPage, setTcgCurrentPage] = useState(1);
  const [tcgTotalGames, setTcgTotalGames] = useState(0);
  const tcgGamePageSize = 20;

  const tcgUserSignup = async () => {
    const payload = {
      username: "test",
      password: "Aa123123",
    };
    try {
      const response = await tcgAxios.post(`/create_user`, payload);
      if (response.data.status !== 0) {
        toastCall(response.error_desc || "注册失败，请稍后再试");
        return;
      }
      setTcgUserName(payload.username);
      localStorage.setItem("tcgUserName", payload.username);
      console.log("注册成功:", response.data);

      tcgUserGetBalance();
    } catch (error) {
      console.error("注册失败:", error);
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
        toastCall(response.error_desc || "获取用户余额失败，请稍后再试");
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
      product_type: tcgProductTypes,
      platform: "all",
      client_type: "all",
      game_type: tcgGameType,
      page,
      page_size: tcgGamePageSize,
      language: getLanguageCode(),
    };

    try {
      const response = await tcgAxios.post(`/getGameList`, payload);
      if (response.data.status !== 0) {
        toastCall(response.error_desc || "获取游戏列表失败，请稍后再试");
        return;
      }
      setTcgGameList(response.data.games || []);
      setTcgTotalGames(response.data?.page_info?.totalCount ?? 0);
    } catch (error) {
      console.error("获取游戏列表失败:", error);
    }
  };

  const tcgGetGameUrl = async (gameCode) => {
    if (!tcgUserName) {
      toastCall("请先注册或登录TCG用户");
      return;
    }
    const payload = {
      username: tcgUserName,
      product_type: tcgProductTypes,
      game_mode: 0, // 会员帐户类型（1 =真实，0 =测试）
      game_code: gameCode,
      platform: "html5",
    };
    try {
      const response = await tcgAxios.post(`/getLaunchGameRng`, payload);
      if (response.data.status !== 0) {
        toastCall(response.error_desc || "获取游戏链接失败，请稍后再试");
        return;
      }
      window.open(response.data.game_url, "_blank");
    } catch (error) {
      console.error("获取游戏链接失败:", error);
      toastCall("获取游戏链接失败，请稍后再试");
    }
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
    const storedUserName = localStorage.getItem("tcgUserName");
    if (storedUserName) {
      console.log("从本地存储获取的用户名:", storedUserName);
      setTcgUserName(storedUserName);
    }
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
            <div className="user-panel">
              <div className="user-info">
                {!tcgUserName ? (
                  <>
                    <div className="user-name">游客</div>
                    <button
                      className="border border-1 p-2"
                      onClick={tcgUserSignup}
                    >
                      注册TCG用户
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
                    onClick={() => setActiveFeatureIndex(index)}
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="title">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              厂商
              {productTypes.map((type, index) => (
                <button
                  key={index}
                  className={`border border-1 p-2 m-1 ${
                    tcgProductTypes === type.product_type
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => setTcgProductTypes(type.product_type)}
                >
                  {type.product_name}
                </button>
              ))}
            </div>

            <div>
              游戏类型
              {Object.entries(gameTypes).map(([key, value], index) => (
                <button
                  key={index}
                  className={`border border-1 p-2 m-1 ${
                    tcgGameType === key ? "bg-blue-500 text-white" : ""
                  }`}
                  onClick={() => setTcgGameType(key)}
                >
                  {value}
                </button>
              ))}
            </div>

            {tcgGameList && tcgGameList.length > 0 ? (
              <div className="game-list">
                {tcgGameList.map((game, index) => (
                  <div
                    key={index}
                    className="game-item p-2 border rounded shadow hover:shadow-lg cursor-pointer text-center"
                    onClick={() => tcgGetGameUrl(game.tcgGameCode)}
                  >
                    <div className="icon text-2xl">
                      <div className="relative rounded-md overflow-hidden icon">
                        <Image
                          className="object-contain"
                          src={`https://images.b240784.com:42666/TCG_GAME_ICONS/${game.productCode}/EN/${game.tcgGameCode}.png`}
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
                      {game.gameName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">暂无游戏</div>
            )}
            <div className="mt-4 flex justify-center items-center gap-2">
              <button
                onClick={() =>
                  setTcgCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={tcgGameCurrentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                上一页
              </button>
              <span className="text-gray-700">
                第 {tcgGameCurrentPage} 页 / 共{" "}
                {Math.ceil(tcgTotalGames / tcgGamePageSize)}页
              </span>
              <button
                onClick={() =>
                  setTcgCurrentPage((prev) =>
                    prev < Math.ceil(tcgTotalGames / tcgGamePageSize)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  tcgGameCurrentPage >=
                  Math.ceil(tcgTotalGames / tcgGamePageSize)
                }
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
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
  }
`;
