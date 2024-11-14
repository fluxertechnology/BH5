"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to import Cookies
import Image from "next/image";
import styled from "styled-components";
import Grid2 from "@mui/material/Grid2";

// import logo from "../../public/footer/logo_p.svg";
// import app_download from "/footer/app_download.svg";
// import app_download_dark from "/footer/app_download_dark.svg";
// import friend_socrial from "/footer/friend_socrial.svg";
// import friend_socrial_dark from "/footer/friend_socrial_dark.svg";

const DesktopFooter = ({ locale }) => {
  // const t = useTranslations('Footer');
  // const router = useRouter();

  // const changeLanguage = (newLocale) => {
  //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
  //     console.log(newLocale, 'Locale changed'); // Log the new locale
  //     router.push(`/${newLocale}`); // Navigate to the new locale route
  // };

  return (
    <PCFooterElement className={"PCFooterElement"}>
      <div className="area">
        <div className="area_left">
          <div className="area_left_img">
            <Image
              width={"138"}
              height={"40"}
              src={"/footer/logo_p.svg"}
              alt="B次元LOGO"
              className="mr-3 mb-2"
            />
          </div>
          <Grid2
            container
            className="area_left_row"
            direction="row"
            alignItems="start"
            spacing={0}
          >
            {/* {urlItems.map((item, index) => ( */}
              <Grid2
                item
                sm
                // key={index}
                // onClick={item.onClick}
                className="cursor mt-3 link"
              >
                {/* {item.text} */}
                hihihi
              </Grid2>
            {/* ))} */}
            {/* {serviceTerms.map((item, index) => (
              <Grid2 item sm key={index} className="cursor mt-3">
                <LinkComponent routes={item.url} key={index} className="link">
                  {item.text}
                </LinkComponent>
              </Grid2>
            ))} */}
          </Grid2>
          {/* <div className="area_left_row">
            {friendUrlItems.map((item, index) => (
              <div key={index}>{item.text}</div>
            ))}
          </div> */}
        </div>
        <div className="area_right">
          {/* <QrCode /> */}
          {/* <FriendSocial /> */}
        </div>
      </div>
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
              By entering this site you swear that you are of legal age in your
              area to view adult material and that you wish to view such
              material.
            </li>
            <li>Back to website：bli2acg@gmail.com </li>
            <li> CS Email/Business Email：cs@bbacgn.com </li>
          </ol>
        )}
      </div>
    </PCFooterElement>
  );
};

export default DesktopFooter;

export const bottom_footer_height = "250";
export const PCFooterElement = styled.div`
  /*  */
  background-color: #f3f4f5;
  height: ${bottom_footer_height + "px"};
  font-size: 1.1rem;
  width: 100%;
  color: #646464;
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
      padding: 1em 10em;
    }

    &_left {
      border-bottom: 1px solid gray;
      width: 100%;
      justify-content: start;
      &_img {
        display: flex;
        align-items: center;
        height: 40px;
        margin: 20px 0 0 0;
        font-size: 0.8rem;
      }
    }

    &_right {
      border-bottom: 1px solid gray;
      display: grid;
      justify-content: end;
      text-align: center;
      width: 100%;
      padding: 1em;
      display: flex;
      align-items: center;
    }

    &_description {
      padding-bottom: 2em;
      font-size: 0.9rem;
      line-height: 1.2rem;
      text-align: center;
    }
  }
  .link {
    cursor: pointer;
    display: block;
    text-decoration: none;
    white-space: nowrap;
    color: #646464;
    align-self: center;
    &:hover {
      color: #f24c7c;
    }
  }
`;