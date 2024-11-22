import React, { useEffect } from "react";

import styled from "styled-components";

import { QRCodeCanvas as QRCode } from "qrcode.react";
import { downloadIosUrl, downloadPage, downloadPageUrl } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";
import Image from "next/image";
function MentionAppCover({ closeMentionAppCover }) {
  useEffect(() => {
    // if (typeof window === "undefined") return;
    // document
    //   .getElementById("clicklink")
    //   ?.addEventListener("click", function () {
    //     window.open(downloadPage[1], "_blank");
    //   });
    // QRCode.toDataURL(downloadPage[1], {
    //   margin: 1,
    // })
    //   .then((url) => {
    //     document
    //       .getElementById("animebliav-1qrcode")
    //       .setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, []);

  return (
    <MentionAppCoverElement>
      <div className="container">
        <div className="container_image">
          {/* TODO(ZY): add click event to qrcode only in svg */}
          <Image
            id="clicklink"
            className="container_image_svg"
            src="/images/coverpage/mention_app_cover.svg"
            width={0}
            height={0}
            alt="mention app cover"
          />
        </div>
        <div className="container_buttonbox">
          <LinkComponent
            className="container_buttonbox_button"
            routes={{
              linkurl: downloadPageUrl,
            }}
          >
            安卓下载
          </LinkComponent>
          <LinkComponent
            className="container_buttonbox_button"
            routes={{
              linkurl: downloadIosUrl,
            }}
          >
            苹果下载
          </LinkComponent>
          <div
            onClick={closeMentionAppCover}
            className="container_buttonbox_button"
          >
            <span className="container_buttonbox_button_hightlight">
              我已截图
            </span>
            ， 来去看片
          </div>
        </div>
      </div>
    </MentionAppCoverElement>
  );
}

export default MentionAppCover;

const MentionAppCoverElement = styled.div`
  /*  */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  max-width: 599px;
  background-color: #fff;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: auto;
    width: 80%;
    height: 100%;

    &_image {
      width: 100%;

      &_svg {
        width: 100%;
        vertical-align: middle;
      }
    }

    &_buttonbox {
      display: flex;
      flex-direction: column;
      align-items: center;

      &_button {
        cursor: pointer;
        display: block;
        padding: 15px 30px;
        margin-bottom: 15px;
        box-sizing: border-box;
        width: 80%;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background-color: #f24c7c;
        border-radius: 40px;
        font-weight: 900;

        &_hightlight {
          padding: 1px 5px;
          background-color: #fde17b;
          border-radius: 16px;
        }

        &:last-child {
          padding: 0;
          padding-bottom: 10px;
          margin-bottom: 0;
          color: #000;
          background-color: unset;
        }
      }
    }
  }
`;
