import React, { useEffect, useState } from "react";
import styled from "styled-components";

import CloseComponent, {
  CloseComponentElement,
} from "@/components/common/CloseComponent";
import axiosRequest from "@/lib/services/axios";
import { colors, downloadPage, requestUrlConstants } from "@/lib/constants";
import { toggleAnnouncementCoverAction } from "@/store/actions/showCoverCenter";
import LinkComponent from "@/components/common/LinkComponent";
import Image from "next/image";
import { useGlobalDispatch } from "@/store";
import announcement_cover_bg from "@public/images/coverpage/announcement_cover_bg.png";


const AnnouncementCover = () => {
  const [announcementHtml, setAnnouncementHtml] = useState("");

  useEffect(() => {
    axiosRequest
      .get(requestUrlConstants.getHomeAnnouncementUrl)
      .then((data) => {
        setAnnouncementHtml(data.remark);
      });
  }, []);

  const closeAnnouncementCover = () => {
    useGlobalDispatch(toggleAnnouncementCoverAction());
  };

  return (
    <AnnouncementCoverElement>
      <div className="announcement_container">
        <div className="announcement_container_title">
          <Image
            className="announcement_container_title_img"
            src="/images/coverpage/announcement_cover_title.svg"
            width={0}
            height={0}
            alt="announcement title"
          />
        </div>
        <div
          className="announcement_container_content"
          dangerouslySetInnerHTML={{
            __html: announcementHtml,
          }}
        />
        <LinkComponent
          className="announcement_container_btn"
          routes={{
            linkurl: downloadPage[2],
          }}
        >
          <span className="announcement_container_btn_text">应用中心</span>
        </LinkComponent>
        <div className="announcement_container_close">
          <CloseComponent styleType={1} callback={closeAnnouncementCover} />
        </div>
      </div>
    </AnnouncementCoverElement>
  );
};

export default AnnouncementCover;

export const AnnouncementCoverElement = styled.div`
  /*  */

  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding-bottom: 2%;
  background-color: #0009;

  .announcement_container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40% 5px 5px 5px;
    box-sizing: border-box;
    max-width: 350px;
    width: 80%;
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-image: url(${announcement_cover_bg});
    border-radius: 10px;
    @media (min-width: 599px) {
      padding: 10% 10px 10px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 25%;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
      background-color: #fff;
      border-radius: 10px;
    }

    &_title {
      flex-shrink: 0;
      margin-bottom: 5px;

      &_img {
        width: 100%;
        vertical-align: middle;
      }
    }

    &_content {
      overflow: auto;

      * {
        width: 100%;
        font-size: max(15px, 0.5rem) !important;
        line-height: 1.3rem;
      }
    }

    &_btn {
      cursor: pointer;
      padding: 10px 0;
      margin: auto;
      margin-top: 5px;
      width: 200px;
      text-align: center;
      text-decoration: none;
      color: #fff;
      background-color: ${colors.dark_pink};
      border-radius: 30px;
    }

    &_close {
      position: absolute;
      bottom: -60px;
      left: 50%;
      transform: translateX(-50%);
      ${CloseComponentElement} {
        width: 50px;
        height: 50px;
      }
    }
  }
`;
