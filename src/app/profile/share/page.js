"use client";

import { useTranslations } from "next-intl";
import { useRef, useEffect } from "react";
import styled from "styled-components";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import { colors, downloadPage, padding } from "@/lib/constants";

import html2canvas from "html2canvas";

import { QRCodeCanvas as QRCode } from "qrcode.react";
import { navigatorShare } from "@/store/actions/utilities";
import { useGlobalContext } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";

const shareBackImg = "/images/profile/share.jpg";

const socialIconList = [
  "/images/icons/sicon-qq.svg",
  "/images/icons/sicon-tiktok.svg",
  "/images/icons/sicon-wechat.svg",
  "/images/icons/sicon-telegram.svg",
  "/images/icons/sicon-zihu.png",
  "/images/icons/sicon-weibo.svg",
  "/images/icons/sicon-line.svg",
  "/images/icons/sicon-fb.svg",
  "/images/icons/sicon-ig.png",
];
const gameIconList = ["/images/icons/sicon-lol.png", "/images/icons/sicon-hok.png", "/images/icons/sicon-mihoyo.png"];

let timer;
let touchduration = 500;

function ProfileShare () {
  const t = useTranslations();
  const shareCatchRef = useRef();
  const arrowRef = useRef();

  const { isMobile } = useMediaQuery();
  const { state, dispatch } = useGlobalContext();
  const user = state.user;
  const adsList = state.adsList;

  useEffect(() => {
    dispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => (
          <>
            <TopBarContainer show_shadow={false}>
                <TopTitleBar back_color="transparent" showBack={true} />
            </TopBarContainer>
          </>
        ),
      }
    });
  }, [isMobile]);

  useEffect(() => {
    let Element = document.getElementsByClassName("PCFooterElement");
    Element[0].style.setProperty("display", "none");
  }, [])

  async function saveUrl() {
    // html2canvas(document.getElementById("root"), {
    //   allowTaint: true
    // }).then(async function(canvas) {
    // const dataUrl = canvas.toDataURL();
    // const blob = await (await fetch(dataUrl)).blob();
    // const filesArray = [
    //   new File(
    //     [blob],
    //     'animation.png',
    //     {
    //       type: blob.type,
    //       lastModified: new Date().getTime()
    //     }
    //   )
    // ];
    navigatorShare({
      title: "",
      text:
        t("Profile.share.description_1") +
        (user.share_ma
          ? t("Profile.share.description_2") +
            user.share_ma
          : "") +
          t("Profile.share.description_3"),
      url: downloadPage[1],
      // files: filesArray,
    });
    // });
  }
  function savePage() {
    /* background-image: url(${({back_img}) =>back_img}); */
    shareCatchRef.current.style.backgroundImage = "url(" + shareBackImg + ")";
    arrowRef.current.style.display = "none";
    html2canvas(shareCatchRef.current, {
      allowTaint: true,
    }).then(function (canvas) {
      shareCatchRef.current.style.backgroundImage = "none";
      arrowRef.current.style.display = "block";
      let link = document.createElement("a");
      link.download = "2次元分享.jpg";
      link.href = canvas
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    });
  }
  function qrcodeStart(e) {
    timer = setTimeout(qrcodeLong, touchduration);
  }
  function qrcodeEnd(e) {
    if (timer) {
      clearTimeout(timer);
    }
  }

  function qrcodeLong() {
    let link = document.createElement("a");
    link.href = downloadPage[1];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  function scrollDown() {
    window.scrollTo({
      top: document.body.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <ProfileShareElement
      // 因為需要儲存圖片所以這邊必須要本地圖片
      // back_img={adsList.share_banner ? adsList.share_banner[0].picurl : ""}
      back_img={shareBackImg}
    >
      <div ref={shareCatchRef} className="share">
        <div className="share_info">
          <div className="share_info_qrcode">
            <div className="share_info_qrcode_item">
              <QRCode
                className="share_info_qrcode_item_img"
                value={downloadPage[1]}
                onTouchStart={qrcodeStart}
                onTouchEnd={qrcodeEnd}
              />
            </div>
            <div className="share_info_qrcode_description">
              <div className="share_info_qrcode_description_header">
                <p className="share_info_qrcode_description_header_title">
                  {t("Profile.share.label.scan_code")}
                </p>
                {/* <p className="share_info_qrcode_description_header_subtitle">或长按二维码识别下载</p> */}
              </div>
              <div className="share_info_qrcode_description_body">
                <p className="share_info_qrcode_description_body_text">
                  {t("Profile.share.label.write.my_invited_code")}
                </p>
                <p className="share_info_qrcode_description_body_code">
                  {user.share_ma}
                </p>
              </div>
            </div>
          </div>
          <div className="share_info_btn">
            <div className="share_info_btn_button" onClick={savePage}>
              <div className="share_info_btn_button_text">
                {t("Profile.share.label.save.my_invited_code")}
              </div>
            </div>
            <div className="share_info_btn_button" onClick={saveUrl}>
              <div className="share_info_btn_button_text">
                {t("Profile.share.label.url")}
              </div>
            </div>
          </div>
        </div>
        <div ref={arrowRef} className="arrow_down" onClick={scrollDown}>
          <img
            className="arrow_down_img"
            src={"/images/icons/arrow_down.svg"}
            alt="arrow down"
          />
        </div>
      </div>
      <div className="teach">
        <div className="teach_container">
          <div className="teach_container_info">
            <p className="teach_container_info_text">
              {t("Profile.share.description_4")}
            </p>
            <p className="teach_container_info_text">
              {t("Profile.share.description_5")}
            </p>
            <p className="teach_container_info_text">
              {t("Profile.share.description_6")}
            </p>
          </div>
          <div className="teach_container_shareflow">
            <div className="teach_container_shareflow_title">
              <p className="teach_container_shareflow_title_text">
                {t("Profile.share.label.step")}
              </p>
            </div>
            <ol className="teach_container_shareflow_list">
              <li className="teach_container_shareflow_list_item">
                <div className="teach_container_shareflow_list_item_header">
                  <span className="teach_container_shareflow_list_item_header_text">
                    1
                  </span>
                </div>
                <div className="teach_container_shareflow_list_item_body">
                  <p className="teach_container_shareflow_list_item_body_text">
                    {t("Profile.share.label.step_1")}
                  </p>
                </div>
              </li>
              <li className="teach_container_shareflow_list_item">
                <div className="teach_container_shareflow_list_item_header">
                  <span className="teach_container_shareflow_list_item_header_text">
                    2
                  </span>
                </div>
                <div className="teach_container_shareflow_list_item_body">
                  <p className="teach_container_shareflow_list_item_body_text">
                    {t("Profile.share.label.step_2")}
                  </p>
                  <div className="teach_container_shareflow_list_item_body_icon">
                    {socialIconList.map((url, index) => {
                      return (
                        <img
                          className="teach_container_shareflow_list_item_body_icon_img"
                          src={url}
                          alt="social"
                          key={index}
                        />
                      );
                    })}
                  </div>
                  <p className="teach_container_shareflow_list_item_body_text">
                    {t("Profile.share.label.step_2_1")}
                  </p>
                  <div className="teach_container_shareflow_list_item_body_icon">
                    {gameIconList.map((url, index) => {
                      return (
                        <img
                          className="teach_container_shareflow_list_item_body_icon_img"
                          src={url}
                          alt="social"
                          key={index}
                        />
                      );
                    })}
                  </div>
                </div>
              </li>
              <li className="teach_container_shareflow_list_item">
                <div className="teach_container_shareflow_list_item_header">
                  <span className="teach_container_shareflow_list_item_header_text">
                    3
                  </span>
                </div>
                <div className="teach_container_shareflow_list_item_body">
                  <p className="teach_container_shareflow_list_item_body_text">
                    {t("Profile.share.label.step_3")}
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <img className="background_image" src={shareBackImg} alt="background" />
    </ProfileShareElement>
  );
};

export default ProfileShare;


const ProfileShareElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["back_img"].includes(prop),
})`
  /*  */
  .share,
  .teach {
    position: relative;
    z-index: 1;
  }

  .background_image {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    margin: 0 auto;
    width: 100vw;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    object-fit: cover;
  }

  .arrow_down {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    filter: drop-shadow(0 0 3px #000);
    animation-name: arrow-move;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: liner;

    &_img {
      width: 60px;
    }
  }

  @keyframes arrow-move {
    0% {
      transform: translateX(-50%) translateY(0);
    }

    100% {
      transform: translateX(-50%) translateY(-10px);
    }
  }

  .teach {
    padding: 16px;

    &_container {
      padding: 10px;
      color: #fff;
      background-color: #0008;
      border-radius: 10px;

      &_info {
        &_text {
          font-size: 24px;
          line-height: 1.2em;
          font-weight: 700;
        }
      }

      &_shareflow {
        margin-top: 20px;

        &_list {
          margin-top: 20px;

          &_item {
            position: relative;
            display: flex;
            padding-bottom: 30px;
            font-size: 24px;
            line-height: 1.8em;
            font-weight: 900;

            &_header {
              &::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0.87em;
                width: 0.2em;
                background-color: #fde17b;
              }

              &_text {
                position: relative;
                z-index: 2;
                display: block;
                padding: 0 0.7em;
                margin-right: 20px;
                color: #000;
                background-color: #fde17b;
              }
            }

            &_body {
              &_icon {
                display: flex;
                flex-wrap: wrap;

                &_img {
                  margin: 10px;
                  margin-left: 0;
                  width: 60px;
                  height: 60px;
                }
              }
            }

            &:last-of-type {
              .teach_container_shareflow_list_item_header {
                &::after {
                  content: unset;
                }
              }
            }
          }
        }

        &_title {
          &_text {
            font-size: 30px;
            font-weight: 700;
            color: #fde17b;
          }
        }
      }
    }
  }

  .share {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    background-position: center;
    background-size: cover;

    /* background-image: url(${({ back_img }) => back_img}); */

    &_info {
      padding: ${padding}px;

      &_qrcode {
        display: flex;
        padding: 20px;
        box-sizing: border-box;
        width: 100%;
        background-color: #fff;
        border-radius: 10px;

        &_item,
        &_description {
          display: flex;
          justify-content: center;
          width: 50%;
          text-align: center;
        }

        &_item {
          &_img {
            width: 100px !important;
            height: 100px !important;
            vertical-align: middle;
          }
        }

        &_description {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          &_header {
            &_title {
              font-weight: 900;
              font-size: 16px;
            }

            &_subtitle {
              margin-top: 5px;
              font-size: 12px;
            }
          }

          &_body {
            &_text {
              font-size: 12px;
            }

            &_code {
              margin-top: 5px;
              font-weight: 900;
              font-size: 20px;
            }
          }
        }
      }

      &_btn {
        display: flex;
        justify-content: space-evenly;
        margin-top: 20px;

        &_button {
          cursor: pointer;
          padding: 15px 0;
          box-sizing: border-box;
          width: 40%;
          font-size: 14px;
          text-align: center;
          color: ${colors.dark_pink};
          background-color: #fff;
          border-radius: 5px;
          font-weight: 900;

          &:last-child {
            color: #fff;
            background-color: ${colors.dark_pink};
          }
        }
      }
    }
  }
`;

