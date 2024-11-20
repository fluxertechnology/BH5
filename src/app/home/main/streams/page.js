"use client";

import styled from "styled-components";
import { adsKeys, colors, streamIframeUrl } from "@/lib/constants";

import ImageCarousel from "@/components/common/ImageCarousel";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const HomeStreamsPage = () => {
  const { state } = useGlobalContext();

  const t = useTranslations();
  const { isMobile } = useMediaQuery();

  const getStreamList = () => {
    useGlobalDispatch(getStreamListAction());
  };
  return (
    <HomeStreamsPageElement>
      <ImageCarousel
        adsKey={adsKeys.home}
        threeInOneBanner={!isMobile}
        is_cover
        size="banner_main"
      />
      <div className="m-1 title">
        {t("Stream.tip.start")}
        <label className="title_focus">{t("Stream.tip.thire_soft_name")}</label>
        {t("Stream.tip.end")}
      </div>
      <div className="px-indent">
        <iframe
          loading="lazy"
          title="直播"
          style={{
            width: "100%",
            height: "100vh",
            border: 0,
          }}
          src={streamIframeUrl}
        />
      </div>
      {/* <CSSTransition 
        in={showCover} 
        timeout={200} 
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_stream_cover"
      >        
        <Cover>
          <div className="cover_container">
            <div className="cover_container_img">
              <img
                className="cover_container_img_img"
                src={girl404Img}
                alt="notwork"
              />
            </div>
            <div className="cover_container_description">
              <p className="cover_container_description_p">
                亲～请用安卓手机App观看٩(๑´3｀๑)۶
              </p>
            </div>
            <div className="cover_container_action">
              <a
                className="cover_container_action_button positive"
                href={downloadPageUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setShowCover(false);
                }}
              >
                走你！
                <span className="cover_container_action_button_face">
                  ─=≡Σ((( つ•̀ω•́)つ
                </span>
              </a>
              <div
                className="cover_container_action_button"
                onClick={() => {
                  setShowCover(false);
                }}
              >
                不看了
                <span className="cover_container_action_button_face">
                  ( ˘•ω•˘ )
                </span>
              </div>
            </div>
          </div>
        </Cover>
      </CSSTransition>
      <div className="stream_container">
        {state.homeStreamList.map((data) => {
          return (
            <div className="stream_container_box">
              <div
                className="stream_container_box_item"
                onClick={() => {
                  setShowCover(true);
                }}
              >
                <div className="stream_container_box_item_header">
                  <ImageComponent
                    src={data.xinimg}
                    alt={data.title}
                    title={data.title}
                    border_radius={"10px"}
                    is_cover={true}
                  />
                </div>
                <div className="stream_container_box_item_body">
                  <div className="stream_container_box_item_body_title">
                    {data.title}
                  </div>
                  <div className="stream_container_box_item_body_amount">
                    在綫主播： {data.Number} 位
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </HomeStreamsPageElement>
  );
};

export default HomeStreamsPage;

export const HomeStreamsPageElement = styled.div`
  /*  */
  .title {
    text-align: center;
    font-size: 20px;
    font-weight: 700;

    &_focus {
      color: #b22222;
    }
  }

  .stream_container {
    display: flex;
    flex-wrap: wrap;

    &_box {
      position: relative;
      padding: 3px;
      box-sizing: border-box;
      width: 33.3333%;

      &::after {
        content: "";
        position: absolute;
        top: 20%;
        right: -0.5px;
        bottom: 15%;
        width: 1px;
        background-color: #ddd;
      }

      &:nth-child(3n) {
        &::after {
          content: unset;
        }
      }

      &_item {
        cursor: pointer;

        &_header {
          overflow: hidden;
          margin: 20px auto;
          width: 50%;
          border-radius: 50%;
          box-shadow: 0 3px 5px #0003;
        }

        &_body {
          font-size: 14px;
          text-align: center;

          &_title {
            font-weight: 900;
          }

          &_amount {
            margin-top: 20px;
            color: ${colors.text_grey};
          }
        }
      }
    }
  }
`;

// const Cover = styled.div`position: fixed;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   z-index: 11;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: auto;
//   max-width: 599px;
//   background-color: #000a;

//   .cover_container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     padding: 10px;
//     margin-top: 180px;
//     background-color: #fff;
//     border-radius: 10px;

//     &_img {
//       margin-top: -200px;
//       width: 200px;

//       &_img {
//         width: 100%;
//         vertical-align: middle;
//       }
//     }

//     &_description {
//       margin-top: 20px;
//     }

//     &_action {
//       margin-top: 10px;
//       width: 100%;

//       &_button {
//         cursor: pointer;
//         display: block;
//         overflow: hidden;
//         padding: 10px;
//         margin-top: 10px;
//         text-align: center;
//         color: #aaa;
//         border-radius: 5px;

//         &_face {
//           display: inline-block;
//           vertical-align: baseline;
//           transition: 0.3s;
//         }

//         &:hover {
//           .cover_container_action_button_face {
//             transform: rotateY(360deg);
//           }
//         }

//         &.positive {
//           text-decoration: none;
//           color: #fff;
//           background-color: ${colors.dark_pink};

//           &:hover {
//             .cover_container_action_button_face {
//               transform: translateX(200px);
//             }
//           }
//         }
//       }
//     }
//   }
// `;
