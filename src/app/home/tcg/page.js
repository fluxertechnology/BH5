"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageCarousel from "@/components/common/ImageCarousel";
import { adsKeys, side_padding } from "@/lib/constants";
import { useGlobalContext } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";

const HomeTcgMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // 当前选中的类别
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0); // 当前选中的功能按钮

  // 假数据
  const userInfo = { name: "用户姓名", money: "¥1000" }; // 用户信息
  const features = [
    { title: "充值", icon: "💰" },
    { title: "提现", icon: "💵" },
    { title: "优惠", icon: "🎁" },
    { title: "记录", icon: "📜" },
  ];
  const categories = [
    {
      title: "热门游戏",
      games: [
        "快1",
        "百家乐",
        "捕鱼",
        "龙虎",
        "轮盘",
        "PC28",
        "牛牛",
        "时时彩",
      ],
    },
    {
      title: "新游戏",
      games: [
        "快2",
        "百家乐",
        "捕鱼",
        "龙虎",
        "轮盘",
        "PC28",
        "牛牛",
        "时时彩",
      ],
    },
    {
      title: "经典游戏",
      games: [
        "快3",
        "百家乐",
        "捕鱼",
        "龙虎",
        "轮盘",
        "PC28",
        "牛牛",
        "时时彩",
      ],
    },
  ];

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
            <div className="user-info">
              <div className="user-name">{userInfo.name}</div>
              <div className="user-money">{userInfo.money}</div>
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

          <div className="category-game-list">
            <div className="category-list">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`category-item ${
                    activeCategoryIndex === index ? "active" : ""
                  }`}
                  onClick={() => setActiveCategoryIndex(index)}
                >
                  <div className="category-title">{category.title}</div>
                </div>
              ))}
            </div>

            <div className="game-list">
              {categories[activeCategoryIndex].games.map((game, index) => (
                <div key={index} className="game-item">
                  <div className="icon">🎲</div>
                  <div className="title">{game}</div>
                </div>
              ))}
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

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

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
      justify-content: center;
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
