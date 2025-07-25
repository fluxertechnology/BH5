"use client";

import LinkComponent from "@/components/common/LinkComponent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to import Cookies
import Image from "next/image";
import styled from "styled-components";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useGlobalContext } from "@/store";
import {
  colors,
  downloadPage,
  officialContact,
  profileService,
  profileFeedback,
  pageUrlConstants,
} from "@/lib/constants";
const { home } = pageUrlConstants;

const DesktopFooter = ({ locale }) => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  // const router = useRouter();

  // const changeLanguage = (newLocale) => {
  //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
  //     console.log(newLocale, 'Locale changed'); // Log the new locale
  //     router.push(`/${newLocale}`); // Navigate to the new locale route
  // };
  const { isMobile } = useMediaQuery();

  let urlItems = [
    {
      text: t("Profile.main.option.common_problem"),
      onClick: () => window.open(profileService),
    },
    {
      text: t("Profile.main.option.contact_us"),
      onClick: () => window.open("mailto: cs@bbacgn.com"),
    },
    {
      text: t("Profile.main.option.feeback"),
      onClick: () => window.open(profileFeedback),
    },
  ];

  let serviceTerms = [
    {
      text: t("Footer.user.privacy_policy"),
      url: {
        name: home.pages.homeProtocol.pages.homeEULA.name,
        path: home.pages.homeProtocol.pages.homeEULA.path,
      },
    },
    {
      text: t("Footer.user.services_agreement"),
      url: {
        name: home.pages.homeProtocol.pages.homeTSM.name,
        path: home.pages.homeProtocol.pages.homeTSM.path,
      },
    },
  ];

  if (isMobile) return <></>;

  return (
    <PCFooterElement
      className={"PCFooterElement"}
      show_footer={state.navbar.isShowFooter}
    >
      <div className="area">
        <div className="area_left">
          <div className="area_left_img">
            <Image
              width={"229"}
              height={"66"}
              src={"/images/footer/logo.png"}
              alt="B次元LOGO"
              className="mr-3 mb-1"
            />
          </div>
          {/* <div className="area_left_row">
            {friendUrlItems.map((item, index) => (
              <div key={index}>{item.text}</div>
            ))}
          </div> */}
        </div>
        <div className="area_right">
          <QrCode />
          <FriendSocial />
        </div>
      </div>
      <div className="bottom-container">
        <Grid2
          container
          className="bottom-container_link-list"
          direction="row"
          alignItems="start"
          spacing={0}
        >
          {urlItems.map((item, index) => (
            <Grid2
              item="true"
              sm="true"
              key={index}
              onClick={item.onClick}
              className="cursor-pointer link"
            >
              {item.text}
            </Grid2>
          ))}
          {serviceTerms.map((item, index) => (
            <Grid2
              item="true"
              sm="true"
              key={index}
              className="cursor-pointer link"
            >
              <LinkComponent routes={item.url} key={index}>
                {item.text}
              </LinkComponent>
            </Grid2>
          ))}
        </Grid2>
        <div className="area_description">
          {locale === "tc" ? (
            <ol>
              <li> ©2023 B次元</li>
              <li>于本网站出现的人物角色一律年满 18 岁。</li>
              <li>
                均遵照 18 U.S.C. 2257 Record Keeping Requirements Compliance
                Statement（记录保存合规声明）所要求的记录。
              </li>
              <li>
                您进入本网站即表宣誓您届满所在区域观看成人内容的合法年龄，且您有意愿观看此等内容。
              </li>
              <li> 站点找回邮箱(发信即可回家)：bli2acg@gmail.com </li>
              <li> 客服邮箱/商务邮箱：cs@bbacgn.com </li>
            </ol>
          ) : (
            <ol>
              <li>©2023 BHub Entertainment - All Rights Reserved.</li>
              <li>
                All characters appearing on this website are 18 years or older.
              </li>
              <li>
                It follows 18 U.S.C. 2257 Record Keeping Requirements Compliance
                Statement.
              </li>
              <li>
                By entering this site you swear that you are of legal age in
                your area to view adult material and that you wish to view such
                material.
              </li>
              <li>Back to website：bli2acg@gmail.com </li>
              <li> CS Email/Business Email：cs@bbacgn.com </li>
            </ol>
          )}
        </div>
      </div>
    </PCFooterElement>
  );
};

export default DesktopFooter;

export const bottom_footer_height = "250px";
export const PCFooterElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["show_footer"].includes(prop),
})`
  /*  */
  display: ${({ show_footer }) => (show_footer ? "block" : "none")};
  background-color: #333333;
  height: ${bottom_footer_height + "px"};
  font-size: 1.1rem;
  width: 100%;
  color: #999999;
  .area {
    display: flex;
    justify-content: center;
    padding: 1em 10em;
    @media (min-width: 900px) {
      padding: 1em 5em;
    }
    @media (max-width: 1080px) {
      padding: 1em 5em;
    }
    @media (min-width: 1081px) {
      padding: 1em 11.98vw;
    }

    &_left {
      border-bottom: 1px solid #484848;
      width: 100%;
      justify-content: start;
      &_img {
        display: flex;
        align-items: center;
        height: 62px;
        margin: 1.55rem 0 0 0;
        font-size: 0.8rem;
      }
    }

    &_right {
      border-bottom: 1px solid #484848;
      display: grid;
      justify-content: end;
      text-align: center;
      width: 100%;
      padding: 0.8rem 1em 1.52rem;
      display: flex;
      align-items: center;
    }

    &_description {
      color: #777777;
      padding-bottom: 2em;
      font-size: 0.75rem;
      line-height: 1.3rem;
      text-align: start;
    }
  }
  .bottom-container {
    @media (min-width: 900px) {
      padding: 1em 5em;
    }
    @media (max-width: 1080px) {
      padding: 1em 5em;
    }
    @media (min-width: 1081px) {
      padding: 0.65em 11.98vw 1em;
    }

    &_link-list {
      width: 404px;

      .link {
        flex-grow: 1;
        font-size: 0.875rem;
        cursor: pointer;
        display: block;
        text-decoration: none;
        white-space: nowrap;
        margin-bottom: 1.4rem;
        color: ${colors.text_dark_grey};
        align-self: center;
        &:hover {
          color: ${colors.back_dark_pink};
        }
      }
    }
  }
`;

/*
QRCode Start
*/

let timer;
let touchduration = 500;
const QrCode = () => {
  const t = useTranslations();
  const [isHover, setIsHover] = useState(false);
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
  function onHover() {
    setIsHover(true);
  }
  function onLeaveHover() {
    setIsHover(false);
  }
  return (
    <QrCodeElement>
      <div className="qrcode">
        <div>
          <Image
            width={"56"}
            height={"56"}
            onMouseEnter={onHover}
            onMouseLeave={onLeaveHover}
            className={"search_bar_nav_item_btn_img"}
            src={
              isHover
                ? "/images/footer/app_download_dark.png"
                : "/images/footer/app_download.png"
            }
            alt={"app_download"}
          />
        </div>
        <div className="pt-1 qrcode_text">
          {t("Global.action.download_app")}
        </div>
        <div className="qrcode_float">
          <ol>
            <li>
              {" "}
              {t("Global.action.download_app_description")
                .split("\n")
                .map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
            </li>
            <li>
              <QRCode
                className="share_info_qrcode_item_img"
                value={downloadPage[1]}
                onTouchStart={qrcodeStart}
                onTouchEnd={qrcodeEnd}
              />
            </li>
          </ol>
        </div>
      </div>
    </QrCodeElement>
  );
};

const QrCodeElement = styled.div`
  /*  */
  margin-right: 2em;
  font-size: 0.875rem;

  .qrcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    white-space: nowrap;
    color: ${colors.text_grey};
    &_float {
      display: none;
    }
    li {
      margin: 5px;
    }
    &:hover {
      .qrcode_float {
        z-index: 100;
        font-size: 14px;
        color: ${colors.text_grey};
        background-color: #fff;
        padding: 5px;
        text-align: center;
        position: absolute;
        display: flex;
        bottom: 100px;
        left: -50px;
        border-radius: 5px;
        box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
        z-index: 1;

        .share_info_qrcode_item_img {
          width: 128px;
          height: 128px;
          margin: 5px auto;
        }
      }
      .qrcode_text {
        color: ${colors.back_dark_pink};
      }
    }
  }
`;

/*
Friend Social Start
*/
const FriendSocial = () => {
  const t = useTranslations();
  const [isHover, setIsHover] = useState(false);
  function onClick() {
    window.open(officialContact);
  }
  function onHover() {
    setIsHover(true);
  }
  function onLeaveHover() {
    setIsHover(false);
  }
  return (
    <FriendSocialElement className="cursor-pointer" onClick={onClick}>
      <Image
        width={"56"}
        height={"56"}
        onMouseEnter={onHover}
        onMouseLeave={onLeaveHover}
        className={"search_bar_nav_item_btn_img"}
        src={
          isHover
            ? "/images/footer/friend_socrial_dark.png"
            : "/images/footer/friend_socrial.png"
        }
        alt={"friend_socrial"}
      />
      <div className="pt-1 ">
        {t("Profile.main.option.official_friend_group")}
      </div>
    </FriendSocialElement>
  );
};
const FriendSocialElement = styled.div`
  /*  */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  &:hover {
    color: ${colors.back_dark_pink};
  }
`;
