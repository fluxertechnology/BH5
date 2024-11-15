"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Make sure to import Cookies
import Image from "next/image";
import styled from "styled-components";
import Grid2 from "@mui/material/Grid2";
import { useState } from 'react';

// start copy of constants
const colors = {
  dark_pink: "#FA719A",
  light_pink: "#fcdce5",
  back_dark_pink: "#f24c7c",
  text_grey: "#646464",
  text_light_grey: "#a8a8a8",
  back_grey: "#f4f4f4",
  light_star: "#fde17b",
  grey: "#f3f4f5",
};

const officialContact = "https://sto13.com/offcial";

const pageUrlConstants = {
  post: {
    name: "動態頁",
    path: "/posts",
    pages: {
      postMain: {
        name: "動態主頁",
        path: "/posts/main",
        closePcFooter: true,
        pages: {
          postAddModal: {
            name: "建立貼文提示遮障",
            path: "/posts/main/add/modal",
            login: false,
          },
          postSameTagList: {
            name: "特定種類貼文",
            path: "/posts/main/dynamicTag/:tagId",
            login: false,
          },
          postMainNew: {
            name: "動態牆",
            path: "/posts/main",
            bottomNav: true,
          },
          postMainTrack: {
            name: "關注牆",
            path: "/posts/main/track",
            bottomNav: true,
          },
          postMainRecommend: {
            name: "精選色友:",
            path: "/posts/main/recommend",
            bottomNav: true,
            login: false,
          },
          postMainNotice: {
            name: "動態通知:",
            path: "/posts/main/notice",
            login: true,
          },
          postCard: {
            name: "動態:",
            path: "/posts/main/dynamic/:dynamicId",
            login: false,
          },
          postProfile: {
            name: "動態原創主檔案:",
            path: "/posts/main/profile/:profileId",
            login: false,
          },

          postMoreOriginal: {
            name: "更多原創主:",
            path: "/posts/main/original",
            login: false,
          },
          postAddTags: {
            name: "新增熱門標籤",
            path: "/posts/main/add/tags",
            login: true,
          },
          postAdd: {
            name: "撰寫動態",
            path: "/posts/main/add",
            login: true,
          },
        },
      },
    },
  },
  social: {
    name: "約砲頁",
    path: "/social",
    bottomNav: true,
    pages: {
      socialList: {
        name: "美女清單",
        path: "/social",
      },
      socialSelectLocal: {
        name: "選擇地點",
        path: "/social/local",
      },
      socialDetailInfo: {
        name: "美女:",
        path: "/social/profile/:profileId",
      },
    },
  },
  vendor: {
    name: "商城頁",
    path: "/vendor",
    pages: {
      vendorMain: {
        name: "商城清單",
        path: "/vendor",
        bottomNav: true,
      },
      vendorCategory: {
        name: "商城分類:",
        path: "/vendor/category/:category",
      },
      vendorGoods: {
        name: "商品:",
        path: "/vendor/goods/:goodsId",
      },
      vendorSheet: {
        name: "購買商品:",
        path: "/vendor/sheet/:goodsId/:buyType",
        login: true,
      },
    },
  },
  profile: {
    name: "個人資訊",
    path: "/profile",
    closePcFooter: true,
    pages: {
      profileMain: {
        name: "個人主頁",
        path: "/profile",
        bottomNav: true,
        pages: {
          profileMission: {
            name: "任務頁",
            path: "/profile/mission",
            login: true,
            closePcFooter: true,
          },
        },
      },
      profileSet: {
        name: "編輯",
        path: "/profile/setInfo",
        pages: {
          profileSetEmail: {
            name: "編輯郵箱",
            path: "/profile/setInfo/email",
          },
          profileSetInfo: {
            name: "編輯設定",
            path: "/profile/setInfo",
          },
        },
      },
      profileBuyVip: {
        name: "買vip頁",
        path: "/profile/vip",
        pages: {
          profileBuyVipCommon: {
            name: "普通 vip 頁",
            path: "/profile/vip/common",
            login: true,
          },
          profileBuyVipSex: {
            name: "砲卡頁",
            path: "/profile/vip/sex",
            login: true,
          },
          profileBuyVipVideo: {
            name: "視頻卡頁",
            path: "/profile/vip/video",
            login: true,
          },
        },
      },
      profileEdit: {
        name: "編輯頁面",
        path: "/profile/edit",
        pages: {
          profileEditInfo: {
            name: "編輯資料",
            path: "/profile/edit",
            login: true,
            pages: {
              profileEditAvatar: {
                name: "編輯頭像資料",
                path: "/profile/edit/avatar",
                login: true,
              },
            },
          },
          profileEditNickName: {
            name: "編輯資料暱稱",
            path: "/profile/edit_nick_name",
            login: true,
          },
        },
      },
      profilePayment: {
        name: "充值頁",
        path: "/profile/payment",
        login: true,
      },
      profileDirectBuyVip: {
        name: "直購VIP頁面",
        path: "/profile/direct_buy_vip",
        login: true,
      },
      profileTransferCoin: {
        name: "轉換金幣頁面",
        path: "/profile/transfer",
        login: true,
      },
      profileTransferRecord: {
        name: "轉換金幣紀錄",
        path: "/profile/record",
        login: true,
      },
      profileBundle: {
        name: "禮包序號頁",
        path: "/profile/bundle",
        pages: {
          profileBundleReward: {
            name: "兌換獎品頁",
            path: "/profile/bundle",
            login: true,
          },
          profileBundleCoupon: {
            name: "兌換優惠卷頁",
            path: "/profile/bundle/coupon",
            login: true,
          },
          profileBundleGift: {
            name: "兌換禮物頁",
            path: "/profile/bundle/gift",
            login: true,
          },
        },
      },
      profilePaymentWithDraw: {
        name: "申請提現金",
        path: "/profile/payment_record/with_draw",
        login: true,
        closePcFooter: true,
      },
      profilePaymentWithDrawHistory: {
        name: "申請提現金紀錄",
        path: "/profile/payment_record/with_draw/history/:type",
        login: true,
      },
      profilePaymentRecord: {
        name: "充值紀錄",
        path: "/profile/payment_record",
        login: true,
      },
      profileShare: {
        name: "分享畫面頁",
        path: "/profile/share",
      },
      profileSwitchLanguage: {
        name: "切換語言",
        path: "/profile/switchLanguage",
      },
      profileMyCollect: {
        name: "收藏頁",
        path: "/profile/collect",
        login: true,
        pages: {
          profileMyCollectComic: {
            name: "收藏漫畫頁",
            path: "/profile/collect/comic",
            login: true,
          },
          profileMyCollectAnime: {
            name: "收藏動畫頁",
            path: "/profile/collect/anime",
            login: true,
          },
          profileMyCollectVideo: {
            name: "收藏影片頁",
            path: "/profile/collect/video",
            login: true,
          },
          profileMyCollectNovel: {
            name: "收藏小說頁",
            path: "/profile/collect/novel",
            login: true,
          },
          profileMyCollectPhoto: {
            name: "收藏美圖頁",
            path: "/profile/collect/photo",
            login: true,
          },
        },
      },
      profileInviteMission: {
        name: "任務分享頁",
        path: "/profile/invites",
        login: true,
        closePcFooter: true,
      },
      profileMyorder: {
        name: "我的訂單",
        path: "/profile/myorder",
        login: true,
      },
      profileMyorderDetail: {
        name: "訂單:",
        path: "/profile/myorderDetail/:orderId",
        login: true,
      },
      profileWatchHistory: {
        name: "觀看紀錄:",
        path: "/profile/watch_history",
        login: true,
        pages: {
          profileWatchHistoryAnime: {
            name: "動漫觀看紀錄:",
            path: "/profile/watch_history/anime",
            login: true,
          },
          profileWatchHistoryComic: {
            name: "漫畫觀看紀錄:",
            path: "/profile/watch_history/comic",
            login: true,
          },
        },
      },
      profilePurchaseRecord: {
        name: "購買紀錄",
        path: "/profile/purchase_record",
        login: true,
        pages: {
          profilePurchaseRecordComic: {
            name: "購買漫畫紀錄",
            path: "/profile/purchase_record/comic",
            login: true,
          },
          profilePurchaseRecordAnime: {
            name: "購買動畫紀錄",
            path: "/profile/purchase_record/anime",
            login: true,
          },
          profilePurchaseRecordVideo: {
            name: "購買影片紀錄",
            path: "/profile/purchase_record/video",
            login: true,
          },
          profilePurchaseRecordNovel: {
            name: "購買小說紀錄",
            path: "/profile/purchase_record/novel",
            login: true,
          },
          profilePurchaseRecordPhoto: {
            name: "購買美圖紀錄",
            path: "/profile/purchase_record/photo",
            login: true,
          },
          profilePurchaseRecordSocial: {
            name: "購買約砲紀錄",
            path: "/profile/purchase_record/social",
            login: true,
          },
        },
      },
      profileFeedback: {
        name: "回饋意見",
        path: "/profile/feedback",
        login: true,
      },
    },
  },
  login: {
    name: "登入頁",
    path: "/login",
    pages: {
      loginMain: {
        name: "密碼輸入頁",
        path: "/login",
      },
      loginOhter: {
        name: "密碼輸入頁:",
        path: "/login/other/:loginType",
      },
      recoverPassword: {
        name: "恢復密碼",
        path: "/login/recoverPassword",
      },
      resetPassword: {
        name: "重置密碼",
        path: "/login/resetPassword",
      },
      signup: {
        name: "註冊頁",
        path: "/login/signup",
      },
    },
  },
  notice: {
    name: "提示頁",
    path: "/notice",
    pages: {
      noticeList: {
        name: "提示清單頁",
        path: "/notice",
      },
      noticeContent: {
        name: "消息:",
        path: "/notice/:noticeId",
      },
    },
  },
  home: {
    name: "主頁",
    path: "/home",
    pages: {
      homeGame: {
        name: "遊戲頁面",
        path: "/home/games",
      },
      homeSearch: {
        name: "搜尋頁",
        path: "/home/search",
        pages: {
          homeSearchMain: {
            name: "搜尋主頁",
            path: "/home/search",
          },
          homeSearchResult: {
            name: "搜尋結果頁",
            path: "/home/search/result/:search",
            pages: {
              homeSearchResultSAC: {
                name: "搜尋漫畫:",
                path: "/home/search/result/:search/SAC",
              },
              homeSearchResultSAV: {
                name: "搜尋動畫:",
                path: "/home/search/result/:search/SAV",
              },
              homeSearchResultSV: {
                name: "搜尋視頻:",
                path: "/home/search/result/:search/SV",
              },
              homeSearchResultSX: {
                name: "搜尋小說:",
                path: "/home/search/result/:search/SX",
              },
              homeSearchResultST: {
                name: "搜尋美圖:",
                path: "/home/search/result/:search/ST",
              },
            },
          },
        },
      },
      homeVideoSwitch: {
        name: "視頻集數容器",
        path: "/home/video",
        pages: {
          homeVideoContent: {
            name: "視頻:",
            path: "/home/video/:videoId",
            // login: true,
          },
        },
      },
      homeAnimesSwitch: {
        name: "動畫集數容器",
        path: "/home/anime",
        pages: {
          homeAnimesContent: {
            name: "動畫:", // name + XXX + ep
            path: "/home/anime/:animeId/:animeEp",
            // login: true,
          },
        },
      },
      homeComicList: {
        name: "漫畫集數容器",
        path: "/home/comic",
        pages: {
          homeComicListSwitch: {
            name: "集數過渡用",
            path: "/home/comic/:comicId",
            pages: {
              homeComicListContent: {
                name: "漫畫:",
                path: "/home/comic/:comicId",
                login: false,
              },
              homeComicListContentView: {
                name: "漫畫:", // name + XXXXX + ep
                path: "/home/comic/:comicId/:ep",
                login: true,
              },
            },
          },
        },
      },
      homeNovelsContent: {
        name: "小說:",
        path: "/home/novelsContent/:novelId",
      },
      homeNovelsList: {
        name: "小說分類:",
        path: "/home/novels/:category",
      },
      homePhotosList: {
        name: "美圖分類:",
        path: "/home/photos/:category",
      },
      homePhotosContent: {
        name: "美圖:",
        path: "/home/photosContent/:photoId",
      },
      homeLeaderboard: {
        name: "排行榜",
        path: "/home/category/leaderboard",
        pages: {
          homeLeaderboardComic: {
            name: "漫畫排行榜",
            path: "/home/category/leaderboard/comic",
          },
          homeLeaderboardAnime: {
            name: "動畫排行榜",
            path: "/home/category/leaderboard/anime",
          },
        },
      },
      homeLabel: {
        name: "分類:",
        path: "/home/label/:type/:label",
      },
      homeMain: {
        name: "主頁",
        path: "/home/main",
        pages: {
          home: {
            name: "預設主頁",
            path: "/home/main",
            bottomNav: true,
          },
          homeAnime: {
            name: "主頁動畫",
            path: "/home/main/anime",
            bottomNav: true,
          },
          homeNovels: {
            name: "主頁小說",
            path: "/home/main/novels",
            bottomNav: true,
          },
          homePhotos: {
            name: "主頁美圖",
            path: "/home/main/photos",
            bottomNav: true,
          },
          homeStreams: {
            name: "主頁直播",
            path: "/home/main/streams",
            bottomNav: true,
          },
          homeVideosSelect: {
            name: "主頁影片遮擋",
            path: "/home/main/videosSelect",
            bottomNav: true,
          },
          homeVideos: {
            name: "主頁影片",
            path: "/home/main/videos",
            bottomNav: true,
          },
          homeCategory: {
            name: "動漫分類:",
            path: "/home/main/category/:tab",
          },
          homeError: {
            name: "路徑錯誤頁面",
            path: "/home/main/404",
            bottomNav: true,
          },
        },
      },
      homeProtocol: {
        name: "協議",
        path: "/about",
        pages: {
          homeEULA: {
            name: "客戶服務協議及隱私權˙",
            path: "/about",
            bottomNav: true,
          },
          homeTSM: {
            name: "客戶服務協議˙",
            path: "/about",
            bottomNav: true,
          },
        },
      },
    },
  },
  start: {
    name: "啟動頁",
    path: "/",
  },
  error: {
    name: "什麼都沒有",
    path: "*",
    bottomNav: true,
  },
};
// end copy of constants

const { home } = pageUrlConstants;

// import app_download from "/footer/app_download.svg";
// import app_download_dark from "/footer/app_download_dark.svg";
const DesktopFooter = ({ locale }) => {
  // const t = useTranslations('Footer');
  // const router = useRouter();

  // const changeLanguage = (newLocale) => {
  //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
  //     console.log(newLocale, 'Locale changed'); // Log the new locale
  //     router.push(`/${newLocale}`); // Navigate to the new locale route
  // };

  let urlItems = [
    {
      // text: t('faq'),
      text: "FAQs",
      onClick: () => window.open(profileService),
    },
    {
      text: "Contact Us",
      onClick: () => window.open("mailto: cs@bbacgn.com"),
    },
    {
      text: "Report",
      onClick: () => window.open(profileFeedback),
    },
  ];

  let serviceTerms = [
    {
      text: "Privacy Policy",
      url: {
        name: home.pages.homeProtocol.pages.homeEULA.name,
        path: home.pages.homeProtocol.pages.homeEULA.path,
      },
    },
    {
      text: "EULA",
      url: {
        name: home.pages.homeProtocol.pages.homeTSM.name,
        path: home.pages.homeProtocol.pages.homeTSM.path,
      },
    },
  ];

  return (
    <PCFooterElement className={"PCFooterElement"}>
      <div className="area">
        <div className="area_left">
          <div className="area_left_img">
            <Image
              width={"138"}
              height={"40"}
              src={"/images/footer/logo_p.svg"}
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
            {urlItems.map((item, index) => (
              <Grid2
                item="true"
                sm="true"
                key={index}
                // onClick={item.onClick}
                className="cursor-pointer mt-3 link"
              >
                {item.text}
              </Grid2>
            ))}
            {serviceTerms.map((item, index) => (
              <Grid2
                item="true"
                sm="true"
                key={index}
                className="cursor-pointer mt-3 link"
              >
                <Link href={item.url} key={index}>
                  {item.text}
                </Link>
              </Grid2>
            ))}
          </Grid2>
          {/* <div className="area_left_row">
            {friendUrlItems.map((item, index) => (
              <div key={index}>{item.text}</div>
            ))}
          </div> */}
        </div>
        <div className="area_right">
          {/* <QrCode /> */}
          <FriendSocial />
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

export const bottom_footer_height = "250px";
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
    flex-grow: 1;
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

const FriendSocial = () => {
  // const intl = useIntl();
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
          isHover ? "/images/footer/friend_socrial_dark.svg" : "/images/footer/friend_socrial.svg"
        }
        alt={"friend_socrial"}
      />
      <div className="pt-1 ">
        {/* {intl.formatMessage({
          id: "PROFILE.MAIN.OPTION.OFFICIAL_FRIEND_GROUP",
        })} */}
        Official Channel
      </div>
    </FriendSocialElement>
  );
};
const FriendSocialElement = styled.div`
  /*  */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  &:hover {
    color: #f24c7c;
  }
`;
