"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  createRef,
  useMemo,
} from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import {
  faAngleRight,
  faLock,
  faShareAlt,
  faStar as fillStart,
} from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSTransition } from "react-transition-group";
import InlineShareButton from "@/components/common/InlineShareButton";

import { colors, padding, pageUrlConstants } from "@/lib/constants";
import CategoryTab from "@/components/common/CategoryTab";
import ImageComponent from "@/components/common/ImageComponent";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";

import ListSideBar from "@/components/common/ListSideBar";
import LinkComponent from "@/components/common/LinkComponent";
import WavaButton from "@/components/layout/Header/WavaButton";
import { navigatorShare } from "@/store/actions/utilities";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import {
  collectComicAnimeContentAction,
  getComicAnimeContentAction,
} from "@/store/actions/comicAnimeActionData";
import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import { useParams } from "next/navigation";

const HomeComicListContent = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const bottomNavRef = useRef(null);
  const { isMobile } = useMediaQuery();
  const [nowPage, setNowPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [share_ma] = useState(state.user.share_ma);
  const x = useRef(0);
  const shareThisRef = createRef(null);
  const comicId = useParams().comicId;

  const comicData = state.homeComicContentData[comicId]
    ? { ...state.homeComicContentData[comicId] }
    : {};

  x.current++;
  useEffect(() => {
    if (comicId && !comicData.id) {
      useGlobalDispatch(
        getComicAnimeContentAction(comicId, 1, "INIT_COMICCONTENT")
      );
    }
  }, []);

  function clickPageEvent(number) {
    if (!checkLock(number)) {
      setNowPage(number);
    } else {
      buyComicBook({
        id: comicData.id,
        jinbi: comicData.jinbi,
        episode: number,
      });
    }
  }

  /**
   * @description 檢查是不是被鎖住
   *
   * @param {*} page
   * @return {*}
   */
  const checkLock = useCallback(
    (page) =>
      comicData.buy_episode
        ? state.user.time === "-1" || Date.now() < state.user.time * 1000
          ? false
          : state.user.day_usedviewcount < state.user.day_maxviewcount
          ? false
          : comicData.total_free >= page
          ? false
          : comicData.buy_episode.indexOf(page) !== -1
          ? false
          : true
        : true,
    [comicId]
  );

  const shareUrl = useCallback(() => {
    navigatorShare({
      title: comicData.title,
      text:
        "B次元真的超好看！看看我在上面发现的" +
        comicData.title +
        "\n\n立刻免费成为B次元的小伙伴" +
        (share_ma ? "，输入我的邀请码" + share_ma : "") +
        "\n",
      url: window.location.href,
    });
  }, [comicId]);

  //PC 處理重新整理後最後一個圖標不顯示文字

  useEffect(() => {
    const shareRef = shareThisRef.current;
    if (shareRef && !isMobile) {
      const shareButtonRef = shareRef.buttons.current;
      shareButtonRef.style.position = "absolute";
      shareButtonRef.style.bottom = "1%";
      shareButtonRef.style.right = "1%";
    } else {
      const shareButtonRef = shareRef.buttons.current;
      shareButtonRef.style.padding = `0 ${padding}px`;
    }
  }, [isMobile]);

  const buyComicBook = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 2,
        episode: data.episode,
      })
    );
  };
  const collectEvent = (id) => {
    useGlobalDispatch(collectComicAnimeContentAction(id));
  };

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
            <TopBarContainer not_fixed={true} show_shadow={false} z_index={9}>
              <TopTitleBar
                showBack={true}
                show_back_color="#ffffff"
                color={"#000"}
                back_color={"transparent"}
              />
            </TopBarContainer>
        ),
      },
    });
  }, []);

  return (
    <HomeComicListContentElement
      bottom_nav_height={state.navbar.bottomNavHeight}
    >
      <CSSTransition
        timeout={200}
        in={showMore}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_cover"
      >
        <ListSideBar
          is_in={showMore}
          nowIndex={nowPage}
          totalIndex={comicData.total_episode}
          checkLock={checkLock}
          clickCallback={clickPageEvent}
          clickClose={setShowMore}
        />
      </CSSTransition>
      <div className="header">
        <div className="header_cover">
          <img
            className="header_cover_img"
            src={comicData.img}
            alt={comicData.title}
          />
          {!isMobile && <InlineShareButton ref={shareThisRef} />}
        </div>

        <div className="header_container">
          <div className="header_container_cover">
            <ImageComponent
              src={comicData.img}
              placeholderImg={comicData.img}
              alt={comicData.title}
              title={comicData.title}
              height={135}
              is_cover={true}
            />
          </div>
          <div className="header_container_description">
            <div className="header_container_description_title">
              <p className="header_container_description_title_text fw-l">
                {comicData.title}
              </p>
            </div>
            <div className="header_container_description_text">
              <p className="header_container_description_text_p">
                {comicData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="body_tab fw-l mb-3 mt-2">
          {comicData.tag_gp
            ? comicData.tag_gp.map((title) => {
                return <CategoryTab title={title} type={1} key={title} />;
              })
            : ""}
        </div>

        {isMobile && (
          <InlineShareButton ref={shareThisRef} show_total={false} />
        )}
        <div className="body_header mt-3">
          <p className="body_header_part mb-2 fw-l">
            {comicData.process ? t("Global.update_to") : t("Global.total")}
            {comicData.total_episode || 0}
            {t("Global.word")}
          </p>
          <p
            className="body_header_more"
            onClick={() => {
              setShowMore(true);
            }}
          >
            <span className="body_header_more_text">{t("Global.more")}</span>
            <FontAwesomeIcon
              style={{ color: `${colors.dark_pink}` }}
              className="body_header_more_icon"
              icon={faAngleRight}
            />
          </p>
        </div>
        <div className="body_pages">
          {Array.from(
            {
              length:
                comicData.total_episode <= 8 ? comicData.total_episode : 8,
            },
            (v, i) => i + 1
          ).map((data) => {
            return (
              <div
                className={
                  "body_pages_item mr-2 " +
                  (nowPage === data ? "active " : "") +
                  (checkLock(data) ? "lock" : "")
                }
                key={data}
                onClick={() => {
                  clickPageEvent(data);
                }}
              >
                <p className="body_pages_item_text mb-2">{data}</p>
                <FontAwesomeIcon
                  className="body_pages_item_lock"
                  icon={faLock}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="recommend">
        <div className="recommend_title">{t("Global.you_also_like")}</div>
        <div className="recommend_list">
          {comicData.recommend_list
            ? comicData.recommend_list.map((data) => {
                return (
                  <LinkComponent
                    className="recommend_list_item fw-l"
                    key={data.id}
                    routes={{
                      name:
                        pageUrlConstants.home.pages.homeComicList.pages
                          .homeComicListSwitch.pages.homeComicListContent.name +
                        data.title,
                      path: pageUrlConstants.home.pages.homeComicList.pages
                        .homeComicListSwitch.pages.homeComicListContent.path,
                      dynamic: {
                        comicId: data.id,
                      },
                    }}
                  >
                    <div className="recommend_list_item_cover mr-3">
                      <ImageComponent
                        src={data.img}
                        alt={data.title}
                        title={data.title}
                        height={145}
                        is_cover={true}
                        total_view={data.fake_total_view}
                        total_view_show
                      />
                    </div>
                    <div className="recommend_list_item_container">
                      <div className="recommend_list_item_container_title">
                        <p className="recommend_list_item_container_title_text">
                          {data.title}
                        </p>
                      </div>
                      {data.description ? (
                        <div className="recommend_list_item_container_description">
                          <p className="recommend_list_item_container_description_text">
                            {data.description}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="recommend_list_item_container_number">
                        <p className="recommend_list_item_container_number_text">
                          {data.process
                            ? t("Global.update_to")
                            : t("Global.total")}
                          {data.total_episode || 0}
                          {t("Global.word")}
                        </p>
                      </div>
                      <div className="recommend_list_item_container_tab">
                        {data.tag_gp.map((title) => {
                          return (
                            <CategoryTab title={title} type={1} key={title} />
                          );
                        })}
                      </div>
                    </div>
                  </LinkComponent>
                );
              })
            : ""}
        </div>
      </div>
      <div ref={bottomNavRef} className="footer">
        <div className="footer_content">
          <div className="footer_content_box my-2">
            <div className="footer_content_box_btn" onClick={shareUrl}>
              <WavaButton
                className="footer_content_box_btn_wava"
                currentRefs={[bottomNavRef]}
              >
                <FontAwesomeIcon
                  className="footer_content_box_btn_wava_icon"
                  icon={faShareAlt}
                />
                <span className="footer_content_box_btn_wava_text">
                  {t("Global.action.share")}
                </span>
              </WavaButton>
            </div>
            <div
              className="footer_content_box_btn"
              onClick={() => {
                collectEvent(comicData.id);
              }}
            >
              <WavaButton
                className="footer_content_box_btn_wava"
                currentRefs={[bottomNavRef]}
              >
                <FontAwesomeIcon
                  className={
                    "footer_content_box_btn_wava_icon " +
                    (comicData?.is_collect == "1" ? "light" : "")
                  }
                  icon={comicData?.is_collect == "1" ? fillStart : faStar}
                />
                <span className="footer_content_box_btn_wava_text">
                  {t("Global.action.collect")}
                </span>
              </WavaButton>
            </div>
          </div>
          <div
            className="footer_content_btn"
            onClick={() => {
              buyComicBook({
                id: comicId,
                episode: nowPage,
              });
            }}
          >
            <WavaButton
              className="footer_content_btn_wava my-2"
              currentRefs={[bottomNavRef]}
            >
              <p className="footer_content_btn_wava_text">
                {t("Global.start_read")}
                {nowPage}
                {t("Global.word")}
              </p>
            </WavaButton>
          </div>
        </div>
      </div>
    </HomeComicListContentElement>
  );
};

export default HomeComicListContent;

export const HomeComicListContentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["bottom_nav_height"].includes(prop),
})`
  ${({ bottom_nav_height }) => `
    /*  */
    padding-bottom: ${bottom_nav_height}px;
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);

    .header {
        position: relative;

        &_cover {
        position: relative;
        overflow: hidden;
        padding-bottom: 40%;
        width: 100%;
        @media (min-width: 599px) {
            padding-bottom: 13%;
        }

        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-image: linear-gradient(to Top, #0007 0%, #0002 100%);
        }

        &_img {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: none;
            filter: blur(10px);
        }
        }

        &_container {
        position: relative;
        display: flex;
        padding: 0 ${padding}px;
        margin-top: -30%;
        @media (min-width: 599px) {
            margin-top: -17%;
        }
        &_cover {
            margin-top: 9%;
            flex-shrink: 0;
            width: 30%;
            @media (min-width: 599px) {
            width: 10%;
            }
        }

        &_description {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            &_title {
            display: flex;
            align-items: center;
            height: 100%;
            @media (min-width: 599px) {
                margin-top: 15%;
                line-height: 1.2;
                min-width: 400px;
            }

            &_text {
                color: #fff;
                align-items: center;
                @media (min-width: 599px) {
                font-size: 20px;
                line-height: 1.2;
                }
            }
            }

            &_text {
            display: flex;
            align-items: center;
            height: 40%;
            width: 100%;
            line-height: 1.8;
            &_p {
                color: #8e8e8e;
                font-weight: 500;
                font-size: 14px;
            }
            }
        }
        }
    }

    .body {
        &_tab {
        padding: 5px ${padding}px;
        }

        &_header {
        display: flex;
        justify-content: space-between;
        padding: 0 ${padding}px;

        &_part {
            letter-spacing: 1px;
            @media (min-width: 599px) {
            font-size: 20px;
            }
        }

        &_more {
            cursor: pointer;
            align-self: center;

            &_text {
            color: ${colors.dark_pink};
            @media (min-width: 599px) {
                font-size: 20px;
            }
            }

            &_icon {
            margin-left: 5px;
            vertical-align: bottom;
            color: #646464;
            }
        }
        }

        &_pages {
        display: flex;
        padding: 0 ${padding - 5}px;
        flex-wrap: wrap;

        &_item {
            user-select: none;
            position: relative;
            box-sizing: border-box;
            width: calc(20%);
            @media (min-width: 599px) {
            width: calc(8%);
            }

            &_text {
            cursor: pointer;
            padding: 10px 0;
            text-align: center;
            background-color: #f3f3f3;
            border-radius: 5px;
            transition: 0.2s;
            @media (min-width: 599px) {
                padding: 20px 0;
            }
            }

            &_lock {
            position: absolute;
            right: 15px;
            bottom: 10px;
            font-size: 12px;
            color: #646464;
            opacity: 0%;
            }

            &.active {
            .body_pages_item_text {
                color: #fff;
                background-color: ${colors.back_dark_pink};
            }
            }

            &.lock {
            .body_pages_item_lock {
                opacity: 100%;
            }
            }
        }
        }
    }

    .recommend {
        padding: 0 ${padding}px;
        margin-top: 10px;

        &_title {
        font-weight: 700;
        letter-spacing: 1px;
        }

        &_list {
        &_item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 10px 0;
            text-decoration: none;
            color: #000;

            &::after {
            content: "";
            position: absolute;
            right: 0;
            bottom: -0.5px;
            left: 0;
            height: 1px;
            background-color: #646464;
            }

            &:last-of-type {
            &::after {
                content: unset;
            }
            }

            &_cover {
            flex-shrink: 0;
            min-width: 30%;
            @media (min-width: 599px) {
                min-width: 10%;
            }
            }

            &_container {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            height: 100%;
            margin-left: 10px;

            &_title {
                &_text {
                overflow: hidden;
                font-weight: 900;
                line-height: 16px;
                font-size: 14px;
                margin-bottom: 5px;
                @media (min-width: 599px) {
                    line-height: 18px;
                    font-size: 18px;
                    margin-bottom: 50px;
                }
                }
            }

            &_description,
            &_number {
                &_text {
                font-size: 12px;
                overflow: hidden;
                color: #646464;
                }
            }
            }
        }
        }
    }

    .footer {
        position: fixed;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;

        &_content {
        display: flex;
        font-size: 18px;
        line-height: 16px;
        text-align: center;
        background-color: ${colors.back_grey};

        &_box {
            display: flex;
            width: 50%;

            &_btn {
            cursor: pointer;
            flex-grow: 1;

            &_wava {
                padding: 21px 0;

                &_icon {
                font-size: 18px;
                vertical-align: bottom;

                &.light {
                    color: ${colors.light_star};
                }
                }

                &_text {
                margin-left: 5px;
                }
            }
            }
        }

        &_btn {
            cursor: pointer;
            width: 50%;
            text-decoration: none;
            color: #fff;
            background-color: ${colors.back_dark_pink};
            font-weight: 600;
            font-size: 26px;

            &_wava {
            padding: 21px 0;
            }
        }
        }
    }
    `}
`;
