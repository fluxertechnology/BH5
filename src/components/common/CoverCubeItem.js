import { createContext, useContext, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import LinkComponent from "@/components/common/LinkComponent";
import ImageComponent, {
  ImageComponentElement,
} from "@/components/common/ImageComponent";
import { colors, pageUrlConstants } from "@/lib/constants";
import { useGlobalDispatch } from "@/store";

import heartIcon from "@public/images/icons/heart.svg";
// import diamondIcon from "@public/images/icons/diamond.png";
import likeIcon from "@public/images/shared/like.svg";
import unlikeIcon from "@public/images/shared/unlike.svg";
import playIcon from "@public/images/shared/play.svg";

import { collectComicAnimeAction } from "@/store/actions/comicAnimeActionData";
import { toggleVideoCollectAction } from "@/store/actions/pages/homeVideoContentAction";
import Image from "next/image";
import { getPrice } from "@/lib/services/price";

const { home } = pageUrlConstants;
const Props = createContext("");
const Provider = Props.Provider;
/**
 * @description parentnode need display flex
 *
 * @param {*} { data, type, title_line }
 * @return {*}
 */
const CoverCubeItem = ({
  data,
  title_line = 1,
  user = { is_video_card_opened: false },
  type,
  externalControlPosition = false, //因層級問題不是Carousel之下的都會是False
  rankStyle = false, //動畫排行榜特別style
  rank, //排名順序
  disabledPrice = false,
  total_view_show = false,
  continueWatch = false,
}) => {
  const collectAction = (data, type) => {
    const { id, is_collect, title, img, url } = data;
    if (type === "video") {
      useGlobalDispatch(
        toggleVideoCollectAction({
          video_id: id,
          type: 0,
          status: is_collect ? 0 : 1,
          vod_name: title,
          vod_pic: img,
          vod_url: url,
        })
      );
    } else {
      useGlobalDispatch(collectComicAnimeAction(data));
    }
  };

  const isVideo = ["animated", "video"].includes(type);
  const elementRef = useRef(null);
  const [floatCardWidth, setFloatCardWidth] = useState(0);
  const handleMouseEnter = () => {
    const element = elementRef.current;
    const elementRect = element.getBoundingClientRect();
    setFloatCardWidth(elementRect.width * 1.15);
  };
  return (
    <Provider
      value={{ data, type, collectAction, rankStyle, rank, disabledPrice }}
    >
      <CoverCubeItemElement
        ref={elementRef}
        onMouseEnter={handleMouseEnter}
        title_line={title_line}
        isVideo={!continueWatch && isVideo ? "video" : ""}
        type={type}
        externalControlPosition={externalControlPosition}
        floatCardWidth={floatCardWidth}
        rankStyle={rankStyle}
      >
        <Links>
          <CoverCubeContent
            total_view_show={total_view_show}
            continueWatch={continueWatch}
          />
        </Links>
        <div className="item_modal">
          <CoverCubeContent isModal />
        </div>
      </CoverCubeItemElement>
    </Provider>
  );
};

export default CoverCubeItem;

export const CoverCubeItemElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    ![
      "rankStyle",
      "floatCardWidth",
      "externalControlPosition",
      "isVideo",
      "continueWatch",
      "type",
    ].includes(prop),
})`
  /*  */
  position: ${({ externalControlPosition }) =>
    !externalControlPosition && "relative"};
  margin: 0rem;
  background: ${({ rankStyle }) => rankStyle && "#e2eeff"};
  border-radius: 3%;
  &:hover {
    ${ImageComponentElement} {
      border-bottom-left-radius: ${({ isVideo }) => isVideo && 0};
      border-bottom-right-radius: ${({ isVideo }) => isVideo && 0};
    }
    @media (min-width: 899px) {
      z-index: 1;
      .item_modal {
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        background: #fafafa;
        z-index: 3;
        border-radius: 3%;
        background: ${({ rankStyle }) => rankStyle && "#e2eeff"};
        visibility: ${({ isVideo }) => (isVideo ? "visible" : "hidden")};
        width: ${({ floatCardWidth }) => floatCardWidth}px;
      }
      .item {
        color: ${({ isVideo }) => !isVideo && colors.back_dark_pink};
        margin-bottom: 20px;
        &_body {
          position: relative;
          box-shadow: ${({ isVideo }) =>
            !isVideo && "0 0 7px 0 rgba(250, 113, 154, 0.84)"};
          border-radius: 5%;
          img {
            transform: ${({ isVideo }) =>
              !isVideo && "scale(1.05) translate(0, -2%)"};
            transition: 0.25s;
          }
          &_icon {
            &_play,
            &_like {
              display: block;
              position: absolute;
              bottom: 5%;
              right: 22%;
              width: 40px;
              pointer-events: none;
            }
            &_like {
              right: 5%;
              pointer-events: initial;
            }
          }
        }
        &_footer {
          padding: ${({ isVideo }) => isVideo && "0 10px"};
          &.modal {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 5px;
            height: 100%;
          }
          &_title {
            &_text {
              font-size: 18px;
            }
          }
        }
        &_tag {
          display: flex;
          overflow: auto;
          white-space: nowrap;
          gap: 5px;
          padding: 5px 0;
          &_item {
            flex-shrink: 0;
            display: inline-block;
            overflow: hidden;
            padding: 5px 10px;
            border-radius: 30px;
            background: #f3f4f5;
            color: ${colors.back_dark_pink};
            font-size: 12px;
          }
        }

        &_description {
          color: ${colors.text_light_grey};
          overflow: hidden;
          height: ${({ type }) => type !== "video" && 2.5 * 16}px;
          font-size: 14px;
          font-weight: 700;
          word-break: break-all;
        }

        &_footer_description_text {
          color: ${({ isVideo }) => !isVideo && colors.back_dark_pink};
        }
      }
    }
  }

  &.video {
    width: 100%;
    max-width: 100%;
  }

  .item {
    text-decoration: none;
    color: #000;
    cursor: pointer;
    &_body_icon {
      &_play,
      &_like {
        display: none;
      }
    }
    &_tag {
      display: none;
    }
    &_footer {
      padding: 0 0.3rem;
      &_title,
      &_description {
        margin-top: 5px;
      }
      &_rank {
        color: #5a65f2;
        font-size: 4rem;
        font-weight: 900;
        @media (max-width: 899px) {
          font-size: 3rem;
        }
      }
      &_title {
        &_text {
          overflow: hidden;
          max-height: ${({ title_line }) => title_line * 15}px;
          font-size: 12px;
          font-weight: 700;
          word-break: break-all;
          @media (min-width: 899px) {
            min-height: ${({ title_line }) => title_line * 50}px;
            max-height: ${({ title_line }) => title_line * 50}px;
            font-size: 16px;
          }
          &.video {
            font-size: 3.2vw;
            max-height: 12vw;
            margin-top: 1.75vw;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            @media (min-width: 899px) {
              min-height: 10px;
              margin-top: 0.8vw;
              font-size: 14px;
            }
          }
        }
      }

      &_description {
        margin-top: 5px;

        &_text {
          font-size: 12px;
          width: fit-content;
          padding: 4px 6px;
          height: auto;
          overflow: hidden;
          color: #ffffff !important;
          background-color: #ff367a;
          @media (max-width: 899px) {
            font-size: 0.825rem;
            height: 1.2125rem;
            padding: 0 2px;
          }
        }
      }

      &_gold {
        margin-top: 25px;

        &_text {
          font-family: "Microsoft YaHei";
          font-size: 14px;
          color: #000000;
          display: flex;
          align-items: center;
          @media (max-width: 898px) {
            font-size: 12px;
          }
          &_icon {
            margin-right: 5px;
            width: 16px;
            height: 16px;
            vertical-align: bottom;
          }
        }
        &.video {
          margin-top: 2.28vw !important;
          @media (min-width: 899px) {
            margin-top: 0.68vw !important;
          }

          .item_footer_gold_text {
            font-size: 2.93vw !important;
            &_icon {
              margin-right: 1.47vw;
              width: auto;
              height: 2.93vw;
            }
            @media (min-width: 899px) {
              font-size: 14px !important;

              &_icon {
                width: 16px;
                height: 16px;
                margin-right: 11px;
              }
            }
          }
        }
      }
    }
    @media (max-width: 898px) {
      .item_body div {
        min-width: ${({ type }) => ["vendor"].includes(type) && 28.93}vw;
        min-height: ${({ type }) => ["vendor"].includes(type) && 30.6}vw;
      }
    }
  }

  .item_modal {
    position: absolute;
    display: none;
  }
`;

const CoverCubeContent = ({ isModal, total_view_show, continueWatch }) => {
  const t = useTranslations();
  const { data, type, collectAction, rank, rankStyle, disabledPrice } =
    useContext(Props);

  const [likeIconStatus, setLikeIconStatus] = useState(
    Boolean(data.is_collect)
  );
  const isVendor = ["vendor"].includes(type);
  const isNovel = ["novel"].includes(type);
  const regex = /[a-zA-Z\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;

  const isVideo = ["animated", "video"].includes(type);
  const onCollect = () => {
    collectAction(
      data,
      type,
      setLikeIconStatus((pre) => !pre)
    );
  };
  function nowHeight() {
    if (continueWatch) {
      return 140;
    } else {
      if (type === "video") {
        return 66;
      } else if (type == "animated") {
        return 65;
      } else if (type == "vendor") {
        return 100;
      } else {
        return 140;
      }
    }
  }
  return (
    <>
      <div className="item_body">
        {isModal ? (
          <Links>
            <ImageComponent
              is_cover
              cover={true}
              src={data.img}
              alt={data.title}
              lazyLoad={false}
              title={data.title}
              isFree={
                data.need_jinbi == 0 ||
                data.limit_free_time == "1" ||
                data.jinbi == 0
              }
              height={nowHeight()}
            />
          </Links>
        ) : isVendor ? (
          <Links>
            <ImageComponent
              is_cover
              cover={true}
              src={data.image}
              alt={data.store_name}
              lazyLoad={false}
              title={data.store_name}
              isFree={data.price == 0}
              height={nowHeight()}
            />
          </Links>
        ) : (
          <ImageComponent
            is_cover
            lazyLoad={false}
            cover={true}
            src={data.img}
            alt={data.title}
            title={data.title}
            total_view={data.fake_total_view}
            isFree={
              data.need_jinbi == 0 ||
              data.limit_free_time == "1" ||
              data.jinbi == 0
            }
            total_view_show={total_view_show}
            continueWatch={continueWatch}
            height={nowHeight()}
          />
        )}

        {/*動畫視頻hover後的 modal 顯示播放、蒐藏按鈕*/}
        {isModal && isVideo && (
          <>
            <Image
              src={playIcon}
              alt="BH5 palyIcon"
              className="item_body_icon_play"
              width={0}
              height={0}
            />
            <Image
              src={likeIconStatus ? likeIcon : unlikeIcon}
              width={0}
              height={0}
              alt="BH5 palyIcon"
              className="item_body_icon_like cursor"
              onClick={onCollect}
            />
          </>
        )}
      </div>
      <div className={`item_footer ${isModal && "modal"} `}>
        <Links>
          <div
            className={`g-flex-start align-items-center  ${
              rankStyle && "gap-2"
            }`}
          >
            <div className="item_footer_rank">
              {!isModal && rank !== undefined && rank + 1}
            </div>
            <div className="g-flex-column-center g-overflow-h">
              <div className={`g-flex ${rankStyle && "gap-1"}`}>
                <div className="item_footer_rank">
                  {isModal && rank !== undefined && rank + 1}
                </div>
                <div className="g-flex-column-center">
                  {rankStyle
                    ? data.description && (
                        <div className="item_footer_description">
                          <p className="item_footer_description_text">
                            {data.description}
                          </p>
                        </div>
                      )
                    : data.total_episode &&
                      !continueWatch &&
                      !disabledPrice && (
                        <div className="item_footer_description">
                          <p className="item_footer_description_text">
                            {data.process === 1
                              ? t("Global.update_to")
                              : t("Global.total")}
                            {data.total_episode}
                            {t("Global.word")}
                          </p>
                        </div>
                      )}
                  {!isNovel && (
                    <div className="item_footer_title">
                      <p className={`item_footer_title_text ${type}`}>
                        {data.title}
                      </p>
                    </div>
                  )}
                  {/* {rankStyle
                    ? data.description && (
                        <div className="item_footer_description">
                          <p className="item_footer_description_text">
                            {data.description}
                          </p>
                        </div>
                      )
                    : data.total_episode &&
                      !continueWatch &&
                      !disabledPrice && (
                        <div className="item_footer_description">
                          <p className="item_footer_description_text">
                            {data.process === 1
                              ? t("Global.update_to")
                              : t("Global.total")}
                            {data.total_episode}
                            {t("Global.word")}
                          </p>
                        </div>
                      )} */}
                </div>
              </div>
              {/* 動畫、視頻 Hover的時候顯示的*/}
              {isModal ? (
                <>
                  <div className="item_tag">
                    {(type === "video"
                      ? data?.biaoqian?.split(" ")
                      : data?.tag_gp
                    )?.map((item) => (
                      <div className="item_tag_item" key={item}>
                        {" "}
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="item_description">{data.description}</div>
                </>
              ) : isVendor ? (
                <div>
                  <h3 className="text-[14px] font-semibold line-clamp-2 lg:line-clamp-1">
                    {data.store_name}
                  </h3>
                  <div className="g-flex items-baseline gap-1 lg:gap-3">
                    <div className="bg-[#ff367a] text-white text-[2.4vw] lg:text-[12px] h-[4.07vw] lg:h-[18px] px-[3px]">
                      {t("Global.promo-price")}
                    </div>
                    <p className="text-[3.2vw] lg:text-[18px] text-[#ff367a] font-bold mt-1">
                      ${data.price}
                    </p>
                  </div>
                  <div className="text-gray-600 text-xs lg:text-sm mt-2 line-clamp-2">
                    {t("Global.sold")}&nbsp;&nbsp;{data.sales}
                    {data.unit_name}
                  </div>
                </div>
              ) : isNovel ? (
                <>
                  <div className="item_footer_title">
                    <p className="item_footer_title_text line-clamp-2">
                      {data.miaoshu ? data.miaoshu.replace(regex, "") : ""}
                    </p>
                  </div>
                  <div className="item_description text-[#666666] text-[0.75rem] mt-3 min-h-[35px] line-clamp-2">
                    {data.title}&nbsp;作者：{data.author ? data.author : ""}
                  </div>
                </>
              ) : (
                ""
              )}

              {/* 判斷免費欄位不是顯示免費才能show */}
              {!rankStyle && !disabledPrice && (
                <div className={`item_footer_gold ${type}`}>
                  <p className="item_footer_gold_text">
                    {!!getPrice(t, data) && (
                      <Image
                        className="item_footer_gold_text_icon"
                        src={heartIcon}
                        width={0}
                        height={0}
                        alt="heart"
                      />
                    )}
                    {getPrice(t, data)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Links>
      </div>
    </>
  );
};

export const Links = ({ children, contextProps }) => {
  const { data, type } = useContext(contextProps || Props);
  return (
    <LinkComponent
      className="item"
      routes={
        type === "video"
          ? {
              name:
                home.pages.homeVideoSwitch.pages.homeVideoContent.name +
                data.title,
              path: home.pages.homeVideoSwitch.pages.homeVideoContent.path,
              dynamic: {
                videoId: data.id,
              },
            }
          : type === "animated"
          ? {
              name:
                home.pages.homeAnimesSwitch.pages.homeAnimesContent.name +
                data.title +
                "-1",
              path: home.pages.homeAnimesSwitch.pages.homeAnimesContent.path,
              dynamic: {
                animeId: data.id,
                animeEp: data.episode || 1,
              },
            }
          : {
              name:
                home.pages.homeComicList.pages.homeComicListSwitch.pages
                  .homeComicListContent.name + data.title,
              path: home.pages.homeComicList.pages.homeComicListSwitch.pages
                .homeComicListContent.path,
              dynamic: {
                comicId: data.id,
              },
            }
      }
    >
      {children}
    </LinkComponent>
  );
};
