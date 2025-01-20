import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { colors, pageUrlConstants } from "@/lib/constants";
import ImageComponent from "@/components/common/ImageComponent";
import arrowDarkImg from "@public/images/home/arrow_dark.svg";
import avatarPlaceholder from "@public/images/imgPlaceholder/avatar.png";
import loadingImg from "@public/images/home/loading.jpg";
import LinkComponent from "@/components/common/LinkComponent";
import WavaButton from "@/components/layout/Header/WavaButton";
import { CSSTransition } from "react-transition-group";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { useTranslations } from "next-intl";

const OriginalCarousel = ({
  items,
  postCardScribeMediaEvent,
  postCardAttentionEvent,
}) => {
  const pageRef = useRef(0);
  const { isMobile } = useMediaQuery();
  const t = useTranslations();
  const [page, setPage] = useState(0);
  const [subscribeData, setSubscribeData] = useState({ id: -1 });
  const [showScribe, setShowScribe] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const pageCount = Math.ceil(items.length / 3); // 計算總頁數
  function onClickEvent(status) {
    if (status === "next") {
      pageRef.current = (pageRef.current + 1) % pageCount; // 取余運算實現循環翻頁
    } else {
      pageRef.current = (pageRef.current - 1 + pageCount) % pageCount; // 取余運算實現循環翻頁
    }
    setPage(pageRef.current);
  }
  useEffect(() => {
    if (subscribeData.id !== -1) {
      setShowScribe(true);
    } else {
      setShowScribe(false);
    }
  }, [subscribeData.id]);

  useEffect(() => {
    cancelAnimationFrame(animationRef.current); // 取消前一個動畫
    const startTime = performance.now(); // 開始時間
    function animateItems(timestamp) {
      const elapsedTime = timestamp - startTime; // 經過的時間
      const element = containerRef.current;
      if (element) {
        element.style.transition = "1s";
        element.style.transformStyle = "flat";
        element.style.position = "relative";
        element.style.zIndex = "1";
        element.style.transform = `translate3d(calc(-100% * ${page} ), 0, 0)`;
      }
      if (elapsedTime < 1000) {
        // 如果經過的時間小於 1000 毫秒 (1 秒)，繼續執行動畫
        animationRef.current = requestAnimationFrame(animateItems);
      }
    }

    // 開始動畫
    animationRef.current = requestAnimationFrame(animateItems);
  }, [page]);

  function onClickIndicator(e) {
    setPage(Number(e.target.getAttribute("value")));
  }

  function onScribe(type) {
    setShowScribe((pre) => !pre);
    if (type) {
      postCardScribeMediaEvent(subscribeData, type);
      onClickClose();
    }
  }
  function onClickClose() {
    setShowScribe(false);
    setTimeout(() => setSubscribeData({ id: -1 }), 500);
  }
  return (
    <SlideCarouselElement>
      <CSSTransition
        timeout={200}
        in={showScribe}
        classNames="CSSTransition_scribe"
        unmountOnExit
        key="CSSTransition_show_scribe"
      >
        <div className="subscribe_cover" onClick={onClickClose}>
          <div
            className="subscribe_cover_container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="subscribe_cover_container_title">订阅解锁</div>
            <div className="subscribe_cover_container_content">
              {subscribeData.nick_name} <br />
              {subscribeData.total_post} 贴文・{subscribeData.fans_count} 粉丝数
            </div>
            <div className="subscribe_cover_container_content">
              订阅可以查看创作者所有「私密贴文」，更加亲近你喜爱的创作者
            </div>
            <div
              className="subscribe_cover_container_btn"
              onClick={() => onScribe(1)}
            >
              <div>訂閱</div>
              <div>{subscribeData.monthly_price} 精钻/月</div>
            </div>
            <div
              className="subscribe_cover_container_btn"
              onClick={() => onScribe(2)}
            >
              <div>訂閱</div>
              <div>{subscribeData.yearly_price} 精钻/年</div>
            </div>
          </div>
        </div>
      </CSSTransition>

      <span className="home_Main_container_ranking_top g-flex-space-between  w-100 align-items-center px-3 py-1 ">
        <p className="home_Main_container_ranking_top_title fw-m">
          {t('Post.recommend_original')}
        </p>
        {!isMobile && (
          <p className="g-center gap-3">
            <ArrowBack
              className="arrow"
              alt="bh5_arrow_left"
              onClick={() => onClickEvent("prev")}
            />
            <ArrowForward
              className="arrow"
              alt="bh5_arrow_next"
              onClick={() => onClickEvent("next")}
            />
          </p>
        )}
      </span>
      {isMobile ? (
        <div className="original_container">
          <ArrowBack
            className="h5_arrow_l"
            alt="bh5_arrow_left"
            onClick={() => onClickEvent("prev")}
          />

          <div
            style={{
              overflow: "hidden",
              flex: `0 0 84%`,
              height: "100%",
            }}
          >
            <div
              className="original_carousel"
              ref={(ref) => (containerRef.current = ref)}
            >
              {items.map((item, index) => {
                const {
                  avatar,
                  nick_name,
                  title,
                  total_post,
                  thumb,
                  is_subscribe,
                  is_follow,
                  uid,
                } = item;
                return (
                  <p className="original_carousel_item" key={index}>
                    <div
                      className="original_carousel_card"
                      style={{
                        backgroundImage: `url(${thumb?.includes("video") ? loadingImg : thumb
                          })`,
                      }}
                    >
                      <div
                        className="original_carousel_card_img"
                        style={{ flex: 4 }}
                      >
                        <LinkComponent
                          className="g-center h-100 w-100"
                          routes={{
                            name: pageUrlConstants.post.pages.postMain.pages
                              .postProfile.name,
                            path: pageUrlConstants.post.pages.postMain.pages
                              .postProfile.path,
                            dynamic: {
                              profileId: uid,
                            },
                          }}
                        >
                          <ImageComponent
                            is_cover={true}
                            src={avatar}
                            title={nick_name}
                            background_color="transparent"
                            border_radius="50%"
                            img_border
                            height={100}
                            placeholderImg={avatarPlaceholder}
                          />
                        </LinkComponent>
                        <div
                          className="original_carousel_card_img_follow_tip_container"
                          onClick={() => postCardAttentionEvent(item)}
                        >
                          <WavaButton
                            className={`original_carousel_card_img_follow_tip ${is_follow && "followed"
                              }`}
                          >
                            {is_follow ? "已关注" : "关注"}
                          </WavaButton>
                        </div>
                      </div>
                      <div
                        className="g-flex-column-center gap-2 pt-3"
                        style={{ flex: 6, zIndex: 1 }}
                      >
                        <div className="original_carousel_card_title ">
                          {title}
                        </div>
                        <span className="g-flex-column-center gap-1 ">
                          <div className="original_carousel_card_other ">
                            {nick_name}
                          </div>
                          <div className="original_carousel_card_other">
                            {total_post} 则贴文
                          </div>
                        </span>
                      </div>
                      <div
                        className={`original_carousel_card_subscribe_container`}
                        onClick={() => !is_subscribe && setSubscribeData(item)}
                      >
                        <WavaButton
                          className={`original_carousel_card_subscribe ${is_subscribe && "subscribed"
                            }`}
                        >
                          {is_subscribe ? "已订阅" : "点我订阅"}
                        </WavaButton>
                      </div>
                      {/* 透明黑背景 */}
                      <div className="original_carousel_card_dark_barrier" />
                      {/* 透明超鏈結背景 */}
                      <LinkComponent
                        className="original_carousel_card_transparent_link_barrier"
                        routes={{
                          name: pageUrlConstants.post.pages.postMain.pages
                            .postProfile.name,
                          path: pageUrlConstants.post.pages.postMain.pages
                            .postProfile.path,
                          dynamic: {
                            profileId: uid,
                          },
                        }}
                      />
                    </div>
                  </p>
                );
              })}
            </div>
          </div>

          <ArrowForward
            className="h5_arrow_r"
            alt="bh5_arrow_next"
            onClick={() => onClickEvent("next")}
          />
        </div>
      ) : (
        <div
          className="original_carousel"
          ref={(ref) => (containerRef.current = ref)}
        >
          {items.map((item, index) => {
            const {
              avatar,
              nick_name,
              title,
              total_post,
              thumb,
              is_subscribe,
              is_follow,
              uid,
            } = item;
            return (
              <div className="original_carousel_item" key={index}>
                <div
                  className="original_carousel_card"
                  style={{
                    backgroundImage: `url(${thumb?.includes("video") ? loadingImg : thumb
                      })`,
                  }}
                >
                  <div
                    className="original_carousel_card_img"
                    style={{ flex: 3 }}
                  >
                    <LinkComponent
                      className="g-center h-100 w-100"
                      routes={{
                        name: pageUrlConstants.post.pages.postMain.pages
                          .postProfile.name,
                        path: pageUrlConstants.post.pages.postMain.pages
                          .postProfile.path,
                        dynamic: {
                          profileId: uid,
                        },
                      }}
                    >
                      <ImageComponent
                        is_cover={true}
                        src={avatar}
                        title={nick_name}
                        background_color="transparent"
                        border_radius="50%"
                        img_border
                        height={100}
                        placeholderImg={avatarPlaceholder}
                      />
                    </LinkComponent>
                    <div
                      className="original_carousel_card_img_follow_tip_container"
                      onClick={() => postCardAttentionEvent(item)}
                    >
                      <WavaButton
                        className={`original_carousel_card_img_follow_tip ${is_follow && "followed"
                          }`}
                      >
                        {is_follow ? "已关注" : "关注"}
                      </WavaButton>
                    </div>
                  </div>
                  <div
                    className={`g-flex-column-center gap-3 pt-4`}
                    style={{ flex: 7, zIndex: 1 }}
                  >
                    <div className="original_carousel_card_title ">{title}</div>
                    <span className="g-flex-column-center gap-1 ">
                      <div className="original_carousel_card_other ">
                        {nick_name}
                      </div>
                      <div className="original_carousel_card_other">
                        {total_post} 则贴文
                      </div>
                    </span>
                  </div>
                  <div
                    className={`original_carousel_card_subscribe_container`}
                    onClick={() => !is_subscribe && setSubscribeData(item)}
                  >
                    <WavaButton
                      className={`original_carousel_card_subscribe ${is_subscribe && "subscribed"
                        }`}
                    >
                      {is_subscribe ? "已订阅" : "点我订阅"}
                    </WavaButton>
                  </div>
                  {/* 透明黑背景 */}
                  <div className="original_carousel_card_dark_barrier" />
                  {/* 透明超鏈結背景 */}
                  <LinkComponent
                    className="original_carousel_card_transparent_link_barrier"
                    routes={{
                      name: pageUrlConstants.post.pages.postMain.pages
                        .postProfile.name,
                      path: pageUrlConstants.post.pages.postMain.pages
                        .postProfile.path,
                      dynamic: {
                        profileId: uid,
                      },
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="original_carousel_page mt-3">
        {Array.from({ length: pageCount }).map((_, index) => {
          return (
            <div
              key={index}
              value={index}
              className={`indicator ${index === page && "selected"}`}
              onClick={onClickIndicator}
            />
          );
        })}
      </div>
    </SlideCarouselElement>
  );
};

export default OriginalCarousel;
const SlideCarouselElement = styled.div`
  /*  */
  display: flex;
  overflow: hidden;
  height: 100%;
  flex-direction: column;
  .original_carousel {
    gap: 20px 0;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-flow: column dense;
    grid-template-rows: repeat(3, 1fr);
    @media (max-width: 899px) {
      gap: 5px 0;
    }
    &_item {
      width: 100%;
      padding: 1px;
      box-sizing: border-box;
    }
    &_card {
      position: relative;
      background: pink;
      border-radius: 10px;
      display: flex;
      height: 100%;
      justify-content: center;
      padding: 5px 10px 0 10px;
      align-items: center;
      background-size: cover;
      background-position: center;
      background-color: rgba(255, 255, 255, 0.5);
      background-blend-mode: overlay;
      gap: 1rem;
      @media (max-width: 899px) {
        height: auto;
        padding: 20px 15px 5px 15px;
      }
      &_img {
        z-index: 2;
        display: flex;
        justify-content: center;
        position: relative;
        &_follow_tip {
          &_container {
            position: absolute;
            bottom: -10%;
          }
          padding: 2px 10px;
          cursor: pointer;
          border-radius: 5px;
          color: #fff;
          background: rgba(0, 0, 0, 0.76);
        }
      }
      &_title {
        overflow: hidden;
        word-break: break-word;
        height: ${16 * 2.8}px;
        font-size: 16px;
        color: #010001;
        font-weight: 700;
        @media (max-width: 899px) {
          height: ${14 * 2.8}px;
          font-size: 14px;
        }
      }
      &_other {
        overflow: hidden;
        word-break: break-word;
        color: #fff;
        @media (max-width: 899px) {
          font-size: 14px;
        }
      }
      &_subscribe {
        &_container {
          z-index: 3;
          position: absolute;
          top: 5%;
          right: 5%;
        }
        color: #fff;
        background: ${colors.back_dark_pink};
        border: 1px solid ${colors.back_dark_pink};
        border-radius: 5px;
        padding: 2px 10px;
        cursor: pointer;
        font-size: 16px;
        @media (max-width: 899px) {
          font-size: 12px;
          padding: 2px 5px;
        }
        &.subscribed {
          color: ${colors.back_dark_pink};
          background: transparent;
          border: 1px solid ${colors.back_dark_pink};
        }
      }
      &_dark_barrier {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40%;
        background-color: rgba(0, 0, 0, 0.76);
        z-index: 0;
        border-radius: 0 0 10px 10px;
      }
      &_transparent_link_barrier {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 1;
        border-radius: 0 0 10px 10px;
      }
    }
    &_page {
      bottom: 0;
      display: flex;
      align-self: center;
      .indicator {
        content: "";
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #f3f4f5;
        margin: 0 5px;
        cursor: pointer;
        &.selected {
          background-color: ${colors.text_light_grey};
        }
      }
    }
  }
  .original_container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .arrow {
    width: 20px;
    cursor: pointer;
  }
  .h5_arrow {
    &_l,
    &_r {
      flex: 0 0 8%;
      max-width: 30px;
    }
  }

  .subscribe_cover {
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
      flex-direction: column;
      justify-content: start;
      align-items: start;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 5px;
      width: 300px;
      padding: 20px;
      &_title {
        margin-top: 20px;
        font-weight: 600;
        font-size: 18px;
        @media (max-width: 899px) {
          font-size: 16px;
        }
      }
      &_content {
        margin: 15px 0;
        color: ${colors.text_grey};
      }
      &_btn {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 10px;
        margin: 5px 0;
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        text-align: center;
        border-radius: 20px;
        background-color: ${colors.back_dark_pink};
        color: #fff;
        @media (max-width: 899px) {
          font-size: 12px;
        }
      }
    }
  }
`;
