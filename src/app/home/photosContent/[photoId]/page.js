"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import WavaButton from "@/components/layout/Header/WavaButton";
import ImageComponent from "@/components/common/ImageComponent";
import LinkComponent from "@/components/common/LinkComponent";
import { CSSTransition } from "react-transition-group";
import { colors, padding, pageUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import { checkinPageConditioncheckAction } from "@/store/actions/utilities";
import { toggleCollectAction } from "@/store/actions/toggleCollect";
import { buyDownloadPhotoAction } from "@/store/actions/pages/homePhotosContentAction";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
let mouseMoveBasePoint = 0;
let move = 0;

const HomePhotosContent = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const t = useTranslations();

  const navRef = useRef(null);

  let [view_type, setView_type] = useState(0); // 0 scroll 1 swiper

  const [photos_list, set_photos_list] = useState([]);

  let [photos_pages, set_photos_pages] = useState(0);
  const [show_setphotos_pages, set_show_setphotos_pages] = useState(false);
  const [show_buy_pic, set_show_buy_pic] = useState(false);

  const [photos_pages_offset, set_photos_pages_offset] = useState(0);

  const [showOptionNav, setShowOptionNav] = useState(true);

  const photoId = useParams().photoId;
  const photoData = useMemo(() => {
    return state.homePhotosContentData[photoId]
      ? state.homePhotosContentData[photoId]
      : {};
  }, [state.homePhotosContentData]);
  useEffect(() => {
    if (!photoData.miaoshu && photoId) {
      // getPhotoContent(photoId, (data) => {
      checkUser({
        id: photoId,
      });
      // });;
    }

    // 用 [1來用]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId,state.user.id]);

  useEffect(() => {
    if (photoData.miaoshu) {
      const myRegex = /src="([^"]*)/gm;
      const matches = photoData.miaoshu.matchAll(myRegex);
      const matchArr = [...matches];
      set_photos_list(matchArr);
    }
  }, [photoData.miaoshu]);

  useEffect(() => {
    window.removeEventListener("scroll", scrollEvent);
    window.addEventListener("scroll", scrollEvent);

    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view_type]);

  function scrollEvent(e) {
    if (!view_type) {
      const container_card = document.getElementsByClassName("container_card");
      const windowBottom = Math.abs(
        document.documentElement.getBoundingClientRect().top
      );

      for (let i = 0; i < container_card.length; i++) {
        if (windowBottom <= container_card[i].offsetTop) {
          set_photos_pages(i);
          return;
        }
      }
    }
  }

  function clickCollectEven() {
    clickCollect({
      id: photoData.id,
      status:
        typeof photoData.is_collect === "number"
          ? photoData.is_collect === 1
            ? 0
            : 1
          : 1,
    });
  }

  function scrollToImage() {
    window.scroll({
      top: document.getElementsByClassName("container_card")[photos_pages]
        .offsetTop,
      left: 0,
    });
  }

  function pagesRangeChange(e) {
    photos_pages = parseInt(e.target.value);
    set_photos_pages(photos_pages);
    if (!view_type) {
      scrollToImage();
    }
  }

  function sliderStart(e) {
    if (view_type) {
      mouseMoveBasePoint = e.changedTouches
        ? e.changedTouches[0].clientX || 0
        : e.clientX;
      move = 0;
      window.addEventListener("mousemove", sliderMove);
      window.addEventListener("touchmove", sliderMove);
      window.addEventListener("mouseup", sliderDone);
      window.addEventListener("mouseout", sliderDone);
      window.addEventListener("touchend", sliderDone);
    }
  }

  function sliderMove(e) {
    move =
      (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) -
      mouseMoveBasePoint;
    if (photos_pages === 0 && move > 0) {
      move = 0;
    } else if (photos_pages === photos_list.length - 1 && move < 0) {
      move = 0;
    }
    set_photos_pages_offset(move);
  }

  function sliderDone(e) {
    window.removeEventListener("mousemove", sliderMove);
    window.removeEventListener("touchmove", sliderMove);
    window.removeEventListener("mouseup", sliderDone);
    window.removeEventListener("mouseout", sliderDone);
    window.removeEventListener("touchend", sliderDone);
    if (move >= 100) {
      set_photos_pages(photos_pages - 1);
    } else if (move <= -100) {
      set_photos_pages(photos_pages + 1);
    }
    set_photos_pages_offset(0);
  }

  function clickPayDownload() {
    buyDownloadPhoto(photoData.id, async () => {
      try {
        const zip = new JSZip();
        for (let i = 0; i < photos_list.length; i++) {
          let extension = photos_list[i][1].split(".");
          extension = extension[extension.length - 1];
          set_photos_pages(i);
          if (document.getElementsByClassName("container_card")[i]) {
            window.scroll(
              0,
              document.getElementsByClassName("container_card")[i].offsetTop
            );
          }
          zip.file(
            i + 1 + "." + extension,
            await axiosRequest.getArraybuffer(photos_list[i][1])
          );
        }

        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, photoData.title + ".zip");
        });
      } catch (e) {
        callToast("请通知管理人员");
      }
    });
  }

  function toggleOptionNav() {
    setShowOptionNav(!showOptionNav);
  }

  const checkUser = (data) => {
    useGlobalDispatch(
      checkinPageConditioncheckAction({
        itemId: data.id,
        itemType: 1,
        checkOnPage: true,
      })
    );
  };

  const clickCollect = (data) => {
    useGlobalDispatch(
      toggleCollectAction({
        id: data.id,
        type: 1,
        status: data.status,
      })
    );
  };
  const buyDownloadPhoto = (id, callback) => {
    useGlobalDispatch(buyDownloadPhotoAction(id, callback));
  };

  const photoRef = useRef(null);

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <CSSTransition
            timeout={200}
            in={showOptionNav}
            classNames="CSSTransition_opacity"
            unmountOnExit
            key="CSSTransition_top_nav"
            nodeRef={photoRef}
          >
            <TopBarContainer>
              <TopTitleBar
                title={photoData.title}
                showBack={true}
                back_color={"#000a"}
                show_back_color={"#ffffff"}
                iconCallback={clickCollectEven}
                iconState={photoData.is_collect}
              />
            </TopBarContainer>
          </CSSTransition>
        ),
      },
    });
  }, [showOptionNav]);

  return (
    <HomePhotosContentElement
      view_type={view_type}
      onMouseDown={sliderStart}
      onTouchStart={sliderStart}
      onClick={toggleOptionNav}
    >
      <div
        className="container"
        style={{
          width: view_type
            ? photos_list.length + "00%"
            : isMobile
            ? "100%"
            : "50%",
          height: view_type ? "calc(var(--vh, 1vh) * 100)" : "auto",
          transform: view_type
            ? "translateX(calc( " +
              photos_pages_offset +
              "px + -" +
              (100 / photos_list.length) * photos_pages +
              "%))"
            : "unset",
          transition: photos_pages_offset ? "unset" : ".2s",
        }}
      >
        {photos_list.map((data) => {
          return (
            <div
              className="container_card"
              style={{
                width: view_type ? 100 / photos_list.length + "%" : "100%",
              }}
              key={data[0]}
            >
              <ImageComponent
                className="container_card_img"
                style={
                  view_type
                    ? {
                        paddingBottom: 0,
                        height: "100%",
                      }
                    : {}
                }
                src={data[1]}
                alt={photoData.title}
                border_radius={0}
                toFixSize={true}
                height={30}
                background_color="#000"
              />
            </div>
          );
        })}
      </div>
      <CSSTransition
        timeout={200}
        in={showOptionNav}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_bottom_nav"
        nodeRef={photoRef}
      >
        <div ref={navRef} className="bottom_nav">
          <div
            className="bottom_nav_download "
            style={
              show_buy_pic
                ? {
                    top: "-90px",
                    height: "89px",
                    opacity: 1,
                  }
                : {}
            }
          >
            <div className="bottom_nav_download_card">
              <div className="bottom_nav_download_card_header">
                <p className="bottom_nav_download_card_header_money m-1">
                  {t("Navbar.bottom_download_own")}
                  <span className="bottom_nav_download_card_header_money_inset">
                    {parseInt(state.user.money) || 0}
                  </span>
                  {t("Global.money")}
                </p>
                <LinkComponent
                  className="bottom_nav_download_card_header_buy"
                  routes={pageUrlConstants.profile.pages.profilePayment}
                >
                  {t("Global.action.charge")}
                </LinkComponent>
              </div>
              <div className="bottom_nav_download_card_body">
                <div
                  className="bottom_nav_download_card_body_btn"
                  onClick={clickPayDownload}
                >
                  {t("Global.action.always_save")}
                  <span className="bottom_nav_download_card_body_btn_text">
                    5
                  </span>
                  {t("Global.money")}
                </div>
              </div>
            </div>
          </div>
          <div
            className="bottom_nav_pages"
            style={
              show_setphotos_pages
                ? {
                    top: "-30px",
                    height: "30px",
                    opacity: 1,
                  }
                : {}
            }
          >
            <div className="bottom_nav_pages_range">
              <input
                className="bottom_nav_pages_range_input"
                type="range"
                min="0"
                max={photos_list.length - 1}
                step="1"
                value={photos_pages}
                onChange={pagesRangeChange}
              />
            </div>
            <div className="bottom_nav_pages_show">
              <p className="bottom_nav_pages_show_text">
                {photos_pages + 1}/{photos_list.length}
              </p>
            </div>
          </div>
          <div
            className="bottom_nav_item"
            onClick={(e) => {
              set_show_setphotos_pages(!show_setphotos_pages);
              set_show_buy_pic(false);
              e.stopPropagation();
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  width={0}
                  height={0}
                  src="/images/icons/book.svg"
                  alt="pages"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {t("Global.page_amount")}
              </div>
            </WavaButton>
          </div>
          <div
            className="bottom_nav_item"
            onClick={() => {
              view_type = !view_type;
              setView_type(view_type);

              setTimeout(() => {
                scrollToImage();
              }, 500);
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src={
                    view_type
                      ? "/images/icons/book_open.svg"
                      : "/images/icons/scroll.svg"
                  }
                  width={0}
                  height={0}
                  alt="type"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {view_type
                  ? t("Global.action.turn_pages")
                  : t("Global.action.turn_scroll")}
              </div>
            </WavaButton>
          </div>
          <div className="bottom_nav_item" onClick={clickCollectEven}>
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src={
                    photoData.is_collect
                      ? "/images/icons/star_fill.svg"
                      : "/images/icons/star.svg"
                  }
                  width={0}
                  height={0}
                  alt="collect"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {t("Global.action.collect")}
              </div>
            </WavaButton>
          </div>
          <div
            className="bottom_nav_item"
            onClick={() => {
              set_show_buy_pic(!show_buy_pic);
              set_show_setphotos_pages(false);
            }}
          >
            <WavaButton
              className="bottom_nav_item_box"
              currentRefs={[navRef]}
              type={1}
            >
              <div className="bottom_nav_item_box_icon">
                <Image
                  className="bottom_nav_item_box_icon_img"
                  src="/images/icons/download.svg"
                  width={0}
                  height={0}
                  alt="download"
                />
              </div>
              <div className="bottom_nav_item_box_text">
                {t("Global.action.download")}
              </div>
            </WavaButton>
          </div>
        </div>
      </CSSTransition>
    </HomePhotosContentElement>
  );
};

export default HomePhotosContent;

export const HomePhotosContentElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["view_type"].includes(prop),
})`
  /*  */
  display: ${({ view_type }) => (view_type ? "block" : "flex")};
  justify-content: center;

  input[type="range"] {
    height: 5px;
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 10px;
    outline: none; /* 避免點選會有藍線或虛線 */
    appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    appearance: none;
    transition: 0.2s;
  }

  input[type="range"]::-moz-range-thumb {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: #fff;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .bottom_nav {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    margin: auto;
    background-color: #000a;
    height: 80px;

    &_pages,
    &_download {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      overflow: hidden;
      padding: 0 ${padding}px;
      height: 0;
      background-color: #000a;
      opacity: 0%;
      transition: 0.2s;
    }

    &_pages {
      user-select: none;
      display: flex;
      align-items: center;

      &_range {
        flex-grow: 1;

        &_input {
          width: 100%;
        }
      }

      &_show {
        width: 70px;
        text-align: right;

        &_text {
          color: #fff;
        }
      }
    }

    &_download {
      &_card {
        &_header {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          font-size: 14px;
          color: #fff;

          &_money {
            font-size: 16px;
            &_inset {
              padding: 0 5px;
              color: ${colors.dark_pink};
            }
          }

          &_buy {
            cursor: pointer;
            text-decoration: none;
            color: #fff;
          }
        }

        &_body {
          margin-top: 5px;

          &_btn {
            cursor: pointer;
            user-select: none;
            padding: 10px 0;
            margin: auto;
            width: 100%;
            height: 100%;
            font-size: 20px;
            text-align: center;
            color: ${colors.dark_pink};
            background-color: #fff;
            border-radius: 30px;
          }
        }
      }
    }

    &_item {
      cursor: pointer;
      user-select: none;
      flex-grow: 1;

      &_box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;

        &_icon {
          width: 35px;
          height: 35px;

          &_img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }

        &_text {
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
`;
