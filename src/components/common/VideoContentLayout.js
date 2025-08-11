"use client";

import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import ImageCarousel from "@/components/common/ImageCarousel";
import { colors, side_padding } from "@/lib/constants";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useEffect } from "react";

/**
 * 通用视频内容布局
 *
 * @param {Object} props
 * @param {ReactNode} props.playerComponent - 左侧的视频播放器组件
 * @param {string|ReactNode} props.recommendTitle - 推荐区标题
 * @param {ReactNode} props.recommendContent - 推荐区组件（如 HomeVideos / 推荐列表）
 * @param {string} props.adsKey - 轮播广告 key
 * @param {boolean} props.hideBack - 顶部栏是否隐藏返回按钮
 * @param {boolean} props.noRightSection - 是否隐藏右侧推荐区
 * @param {ReactNode} props.rightSectionContent - 右侧推荐区内容
 */
const VideoContentLayout = ({
  playerComponent,
  recommendTitle = "你也喜欢",
  recommendContent,
  adsKey,
  hideBack = false,
  noRightSection = false,
  rightSectionContent = null,
}) => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  // 初始化布局时隐藏底部导航
  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        isShowFooter: false,
      },
    });
  }, []);

  return (
    <VideoContentLayoutElement main_height={state.navbar.mainHeight}>
      {/* <TopBarContainer
        not_fixed={true}
        show_shadow={false}
        z_index={8}
        top="unset"
      >
        <TopTitleBar
          showBack={!hideBack}
          back_color={"transparent"}
          show_back_color={"#fff"}
        />
      </TopBarContainer> */}

      <div
        className={`main-container ${!isMobile ? "mx-indent" : "mobile-width"}`}
      >
        <div className="left-section">
          {playerComponent}

          {adsKey && (
            <div className="carousel-container">
              <ImageCarousel
                adsKey={adsKey}
                threeInOneBanner={!isMobile}
                size="banner_animated"
                is_cover
                customSlidesPerView={isMobile ? 1 : 2}
              />
            </div>
          )}
        </div>

        {!noRightSection && (
          <div className="right-section">{rightSectionContent}</div>
        )}
      </div>

      {recommendTitle && <h5 className="recommend-title">{recommendTitle}</h5>}

      {recommendContent}
    </VideoContentLayoutElement>
  );
};

export default VideoContentLayout;

// 样式
const VideoContentLayoutElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
   padding: ${main_height}px 0;


  .main-container {
    display: flex;
    position: relative;
    flex-direction: column;


    @media (min-width: 899px) {
      margin-top: 0.55vw;
      gap: 1.46vw;
      margin-top: 1.98vw;
      margin-bottom: 1.1vw;
      flex-direction: row;
    }

    .left-section {
      width: 100%;

      .banner-padding{
        width: 100%;
      }

      @media (min-width: 899px) {
        padding-bottom: 1vw;
        width: 51.3vw;
      }

      .carousel-container{
        margin: 0 2.67vw;
        width: auto;

        @media (min-width: 899px) {
          margin: 0.55vw 0 0;
          width: 100%;
        }
      }
    }
    .right-section {
      display: none;

      @media (min-width: 899px) {
        width: 23.44vw;
        padding-bottom: 1vw;
        gap: 0.57vw;
        display: flex;
        flex-direction: column;
      }

      .intro-item{
        display: flex;
        height: 5.73vw;
        gap: 16px;
        position: relative;

        .info-container {
            @media (min-width: 899px) {
              flex-shrink: 0;
              width: 13.91vw;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              margin: 0.2vw 0 0.1vw;
            }

            h5 {
                font-family: "Microsoft YaHei";
                color: rgb(0, 0, 0);
                font-weight: bold;

                @media (min-width: 899px) {
                    font-size: 14px;
                    margin-bottom: 0.48vw;
                }
            }

            p {
                font-family: "Microsoft YaHei";
                color: rgb(51, 51, 51);

                @media (min-width: 899px) {
                    font-size: 12px;
                }
            }


            .diamon_icon {
            
                @media (min-width: 899px) {
                    height: 16px;
                    width: 20px;
                    margin-right: 8px;
                }
            }

            .episode_div {
                font-size: 12px;
                width: fit-content;
                padding: 4px 6px;
                height: auto;
                overflow: hidden;
                color: #ffffff !important;
                background-color: #ff367a;
            }

            .diamon_icon + p{
                font-size: 14px;
                font-family: "Microsoft YaHei";
                color: rgb(0, 0, 0);
            }

        }
      }
    }
  }
  .nav_list {
    display: flex;
    overflow: auto;
    white-space: nowrap;

    &_tag {
      cursor: pointer;
      flex-shrink: 0;
      display: inline-block;
      overflow: hidden;
      margin: 10px;
      color: ${colors.dark_pink};
      border: 1px solid ${colors.dark_pink};
      border-radius: 30px;

      &.active {
        color: #fff;
        background-color: ${colors.dark_pink};
      }

      &_text {
        padding: 5px 10px;
        font-size: 18px;
      }
    }
  }

  .recommend-title{
    font-family: "Microsoft YaHei";
    color: rgb(0, 0, 0);
    font-weight: 900;
    font-size: 3.47vw;
    margin: 5.8vw 3.47vw 4vw;

    @media (min-width: 899px) {
      font-size: 16px;
      margin: 0vw 12% 1.35vw;
    }
  }
  .recommend {
    &_item {
      cursor: pointer;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        right: ${side_padding}px;
        bottom: -0.5px;
        left: ${side_padding}px;
        height: 1px;
        background-color: #e1e1e1;
      }

      &:last-of-type {
        &::after {
          content: unset;
        }
      }

      &_cover {
        flex-shrink: 0;
        position: relative;
        width: 100%;

        &_gold {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 12px;
          color: #fff;
        }
      }

      &_info {
        &_title {
          &_text {
            overflow: hidden;
            height: 36px;
            font-size: 18px;
            line-height: 18px;
            letter-spacing: 1px;
            font-weight: 900;
          }
        }

        &_description,
        &_viewtime {
          &_text {
            font-size: 16px;
            letter-spacing: 1px;
            color: ${colors.text_grey};
            font-weight: 700;

            &.view {
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
`}
`;
