"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useMediaQuery from "@/hooks/useMediaQuery";
import styled from "styled-components";
import { useState, useRef } from "react";
import { StyleSheetManager } from "styled-components";

// start copy of constants
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

const { home, post, social, vendor, profile, notice, login } = pageUrlConstants;

const padding = 20;
let main_height = global?.window && window.innerWidth > 768 ? 72 : 50;
let sub_height = global?.window && window.innerWidth > 768 ? 42 : 38;
const bottom_nav_height = 62;

const DesktopHeader = ({ locale }) => {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const changeLanguage = (newLocale) => {
    Cookies.set("NEXT_LOCALE", newLocale, { path: "/" });
    router.refresh();
  };

  const { isDesktop, isTablet, isMobile, isTouchDevice } = useMediaQuery();
  const [slide_height, setSlide_height] = useState(0);

  return (
    <StyleSheetManager shouldForwardProp={() => true}>
        <HomeMainSwitchPageElement slide_height={slide_height}>
          <TopBarContainer>
            {isMobile ? (
                <p>You are on a mobile device!</p>
              ) : (
                // <WebTopBar  />
                <StyleSheetManager shouldForwardProp={() => true}>
                  <TopSearchBar />
                </StyleSheetManager>
              )}
          </TopBarContainer>
        </HomeMainSwitchPageElement>
      </StyleSheetManager>
      
      // <nav style={styles.navbar}>
      //   <ul style={styles.navList}>
      //     <li style={styles.navItem}>
      //       <Link href={`/`}>{t("home")}</Link>
      //     </li>
      //     <li style={styles.navItem}>
      //       <Link href={`/about`}>{t("about")}</Link>
      //     </li>
      //     <li style={styles.navItem}>
      //       <Link href={`/contact`}>{t("contact")}</Link>
      //     </li>
      //   </ul>
      //   <div style={styles.languageSwitcher}>
      //     <button
      //       onClick={() => changeLanguage("en")}
      //       style={styles.languageButton}
      //     >
      //       {t("english")}
      //     </button>
      //     <button
      //       onClick={() => changeLanguage("tc")}
      //       style={styles.languageButton}
      //     >
      //       {t("chinese_hant")}
      //     </button>
      //   </div>
      // </nav>
  );
};

const TopBarContainer = ({ children }) => {
  const [not_fixed, setNot_fixed] = useState("false");
  const [show_shadow, setShow_shadow] = useState("true");
  const [z_index, setZindex] = useState(10);
  const [backgroundColor1, setBbackgroundColor1] = useState("transparent");

  return (
    <StyleSheetManager shouldForwardProp={() => true}>
      <TopBarContainerElement
        not_fixed={not_fixed}
        show_shadow={show_shadow}
        z_index={z_index}
        background_color={backgroundColor1}
      >
        {children}
      </TopBarContainerElement>
    </StyleSheetManager>
  );
};

const HomeMainSwitchPageElement = styled.div`
  /*  */
  padding-top: ${main_height + sub_height}px;
  position: relative;
  @media (max-width: 899px) {
    padding-bottom: ${bottom_nav_height}px;
  }
  .float_category {
    position: fixed;
    overflow: scroll;
    top: ${main_height + sub_height}px;
    right: 0;
    z-index: 10;
    background-color: #fff;
    padding: 10px 0;
    border-radius: 5px;
  }

  .container {
    position: relative;
  }

  .recharge {
    cursor: pointer;
    position: relative;
    &_float_time {
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      width: 100%;
      color: #fff;
      padding: 1px 0;
      &_bg {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        position: absolute;
        background-color: #010001;
        opacity: 0.55;
        z-index: 9;
      }
      &_text {
        z-index: 10;
      }
    }
  }
`;

const TopBarContainerElement = styled.header`
  /*  */
  background-color: ${({ background_color }) => background_color};
  position: ${({ not_fixed }) => (not_fixed ? "absolute" : "fixed")};
  top: 0;
  right: 0;
  left: 0;
  z-index: ${({ z_index }) => z_index};
  width: 100%;
  margin: auto;
  ${({ show_shadow }) =>
    show_shadow ? "box-shadow: 0 1px 0px 0 rgb(0 0 0 / 30%);" : ""}
  @media (min-width: 599px) {
    max-width: 100%;
  }
`;

const TopSearchBar = ({
  isPlaceholder,
  clickSearch = (e) => e.stopPropagation(),
  clickAvatar,
  clickService,
  clickNew,
  newNotice,
  location,
  avatar,
  user,
  userId,
  highlightRechargeState,
  toPaymentPage,
  clickItem,
  dailyEvent,
  clickLogin,
  config,
  clearUserData,
  clickCollect,
  clickSetting,
  clickVip,
  postSearchWatchHistoryEvent,
  videoDataList,
  comicDataList,
}) => {
  // const intl = useIntl();
  // const lang = useLang();
  const ContainerRef = useRef();
  const [scroll, setScroll] = useState("false");
  // const [questInfoList, setQuestInfoList] = useState([]);
  // const [membershipDate, setMembershipDate] = useState("");
  // const [tabValue, setTabValue] = React.useState(1);

  const [navList] = useState(() => [
    {
      cname: "BOTTOM.NAVIGATOR.INDEX",
      name: home.pages.homeMain.name,
      path: home.pages.homeMain.path,
      image: "/images/header/home.svg",
      activeImage: "/images/header/home_selected_btn.png",
    },
    {
      cname: "BOTTOM.NAVIGATOR.DYNAMIC",
      name: post.pages.postMain.name,
      path: post.pages.postMain.path,
      image: "/images/header/feed.svg",
      activeImage: "/images/header/feed_selected_btn.png",
    },
    // {
    //   cname: intl.formatMessage({ id: "BOTTOM.NAVIGATOR.AND_CHILL" }),
    //   name: social.name,
    //   path: social.path,
    //   image: socialIcon,
    //   activeImage: socialIconSelected,
    // },
    {
      cname: "BOTTOM.NAVIGATOR.MALL",
      name: vendor.name,
      path: vendor.path,
      image: "/images/header/vendor.svg",
      activeImage: "/images/header/shop_selected_btn.png",
    },
  ]);

  // useEffect(() => {
  //   const onScroll = () => {
  //     let { scrollY } = global?.window;
  //     setScroll(Boolean(scrollY));
  //     let TargetStyle = ContainerRef?.current?.style; //不加問號目前好像動作太快會故障
  //     if (TargetStyle) {
  //       TargetStyle.transition = "0.2s";
  //       if (scrollY) {
  //         TargetStyle.backgroundColor = "#fff";
  //         TargetStyle.borderBottom = "0.5px grey dotted";
  //       } else {
  //         TargetStyle.backgroundColor = colors.dark_pink;
  //         TargetStyle.borderBottom = "none";
  //       }
  //     }
  //   };
  //   global?.window.addEventListener("scroll", onScroll);
  //   return () => global?.window.removeEventListener("scroll", onScroll);
  // }, []);

  // useEffect(() => {
  //   let daily = [
  //     {
  //       icon: coin,
  //       title: intl.formatMessage({ id: "PROFILE.PERMISSION.SIGNIN.EVERYDAY" }),
  //       content:
  //         config.signinbegin +
  //         "-" +
  //         config.signinend +
  //         intl.formatMessage({ id: "GLOBAL.GOLD_MONEY" }),
  //       description: intl.formatMessage({
  //         id: "PROFILE.PERMISSION.SIGNIN.CLICK.AWARD",
  //       }),
  //       button: intl.formatMessage({
  //         id: user.id === "guest" ? "LOGIN" : "PROFILE.PERMISSION.SIGNIN.NOW",
  //       }),
  //       buttonEvent: user.id === "guest" ? toLoginPage : dailyEvent,
  //     },
  //     {
  //       title: intl.formatMessage({ id: "PROFILE.PERMISSION.INVITE.FRIEND" }),
  //       content:
  //         intl.formatMessage({
  //           id: "TOP.NAVIGATOR.FLOAT.INVITE.DESCRIPTION1",
  //         }) +
  //         " :" +
  //         (user.id === "guest" ? "------" : user.share_ma),
  //       description: intl.formatMessage({
  //         id: "TOP.NAVIGATOR.FLOAT.INVITE.DESCRIPTION",
  //       }),
  //       button: intl.formatMessage({
  //         id: user.id === "guest" ? "LOGIN" : "TOP.NAVIGATOR.FLOAT.INVITE",
  //       }),
  //       buttonEvent: user.id === "guest" ? toLoginPage : saveUrl,
  //     },
  //   ];
  //   setQuestInfoList(daily);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [config, user]);

  // useEffect(() => {
  //   const variable =
  //     user.time === "-1"
  //       ? intl.formatMessage({ id: "PROFILE.BUY.WATCH.FOREVER_1" })
  //       : Date.now() > user.time * 1000
  //       ? intl.formatMessage({ id: "PROFILE.MAIN.VIP.MATURITY" })
  //       : new Date(user.time * 1000).toLocaleDateString().toString();
  //   setMembershipDate(variable);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user.time]);
  // useEffect(() => {
  //   postSearchWatchHistoryEvent(tabValue);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tabValue]);

  // const judgeSwitchLangImg = scroll
  //   ? lang === "zh"
  //     ? switch_lang_dark
  //     : switch_lang_en_dark
  //   : lang === "zh"
  //   ? switch_lang
  //   : switch_lang_en;

  // async function saveUrl() {
  //   // navigatorShare({
  //   //   title: "",
  //   //   text:
  //   //     intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_1" }) +
  //   //     (user.share_ma
  //   //       ? intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_2" }) +
  //   //         user.share_ma
  //   //       : "") +
  //   //     intl.formatMessage({ id: "PROFILE.SHARE.DESCRIPTION_3" }),
  //   //   url: downloadPage[1] + "?utm_source=" + user.share_ma,
  //   // });
  //   navigator.clipboard
  //     .writeText(downloadPage[1] + "?utm_source=" + user.share_ma)
  //     .then(() => {
  //       callToast("复制成功");
  //     })
  //     .catch((err) => {
  //       callToast("复制失敗");
  //     });
  // }

  // function toLoginPage() {
  //   clickLogin();
  // }

  // const handleChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  return (
    <StyleSheetManager shouldForwardProp={() => true}>
      <TopsearchBarElement ref={ContainerRef} scroll={scroll}>
        <div className="search_bar">
          <div className="search_bar_item">
            <img
              src={
                scroll ? "/images/footer/logo_p.svg" : "/images/header/logo_w.svg"
              }
              alt="B次元 LOGO"
              className="logo cursor-pointer"
              onClick={() => clickItem(navList[0])}
            />
            {navList.map((navItem) => (
              <div
                className="search_bar_nav cursor"
                key={navItem.name}
                style={{
                  animation: scroll ? "1s recharge-move 2" : "",
                }}
                onClick={(e) => {
                  clickItem(navItem);
                }}
              >
            {/* <WavaButton
                  className={
                    "search_bar_nav_item_btn " +
                    (location.indexOf(navItem.path) !== -1 ? "active" : "")
                  }
                >
                  <div className="search_bar_nav_item_cover" />
                  <img
                    className={"search_bar_nav_item_btn_img"}
                    src={scroll ? navItem.activeImage : navItem.image}
                    alt={navItem.name}
                  />
                  <div className="search_bar_nav_item_btn_title_text">
                    {navItem.cname}
                  </div>
                </WavaButton> */}
            </div>
            ))}
          </div>
          {/* <div className="search_bar_item" /> */}
          {/* <div className="search_bar_main cursor">
            <Searchbar
              callback={clickSearch}
              isPlaceholder={isPlaceholder}
              scroll={scroll}
            />
          </div> */}
          {/* <div className="search_bar_item">
            <div className="search_bar_recharge">
              <img
                className={
                  "search_bar_recharge_img " +
                  (highlightRechargeState ? "" : "active")
                }
                onClick={toPaymentPage}
                src={
                  !highlightRechargeState
                    ? recharge_highlight
                    : scroll
                    ? recharge_highlight_dark
                    : recharge
                }
                alt="recharge"
              />
              <div className="search_bar_recharge_float">
                <div>
                  {intl.formatMessage({
                    id: "TOP.BAR.RECHARGE.DESCRIPTION",
                  })}
                </div>
                <div className="search_bar_recharge_float_description">
                  <span>
                    <img src={free} alt="free" />
                    {intl.formatMessage({
                      id: "TOP.BAR.RECHARGE.DESCRIPTION_1",
                    })}
                  </span>
                  <span>
                    <img src={fast} alt="fast" />
                    {intl.formatMessage({
                      id: "TOP.BAR.RECHARGE.DESCRIPTION_2",
                    })}
                  </span>
                </div>
                <div
                  className={"search_bar_recharge_button"}
                  onClick={toPaymentPage}
                >
                  <WavaButton>
                    {intl.formatMessage({
                      id:
                        userId === "guest"
                          ? "TOP.BAR.RECHARGE.BUTTON_NOTLOGIN"
                          : "TOP.BAR.RECHARGE.BUTTON",
                    })}
                  </WavaButton>
                </div>
                <div
                  className={"search_bar_recharge_button_light"}
                  onClick={clickVip}
                >
                  <WavaButton>
                    {intl.formatMessage({
                      id: "TOP.BAR.RECHARGE.BUTTON_1",
                    })}
                  </WavaButton>
                </div>
              </div>
            </div>

            <div className="search_bar_history">
              <img
                src={scroll ? history_dark : history}
                alt="service"
                className="search_bar_history_img"
              />
              <div className="search_bar_history_cover">
                <TabContext value={tabValue}>
                  <Box className="search_bar_history_tab_container">
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="H漫" value={1} />
                      <Tab label="番剧" value={0} />
                    </TabList>
                  </Box>
                  <TabPanel value={1}>
                    <ProfileWatchHistoryComicHandle disabledScrollRefresh />
                  </TabPanel>
                  <TabPanel value={0}>
                    <ProfileWatchHistoryAnimeHandle disabledScrollRefresh />
                  </TabPanel>
                </TabContext>
              </div>
            </div>

            <div className="search_bar_switch">
              <img
                src={judgeSwitchLangImg}
                alt="switch"
                className="search_bar_switch_img"
              />
              <div className="search_bar_switch_cover">
                <div className="search_bar_switch_cover_content">
                  {LanguageList.map((list) => (
                    <div
                      key={list.name}
                      className="cursor"
                      onClick={() => setLanguage(list.lang)}
                    >
                      {list.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="search_bar_task ">
              <img
                src={scroll ? task_dark : task}
                alt="task"
                className="search_bar_float_img"
              />

              <div className={`search_bar_float`}>
                {questInfoList?.map((daliy, index) => (
                  <React.Fragment key={index}>
                    <ol>
                      <li className="search_bar_float_title">{daliy.title}</li>
                      <li>{daliy.description}</li>
                      <li
                        className={`search_bar_float_content ${!index && "gold"}`}
                      >
                        {!index && (
                          <img
                            src={daliy.icon}
                            alt="coin"
                            className="search_bar_float_img"
                          />
                        )}

                        {daliy.content}
                      </li>
                      <li>
                        <div
                          className="search_bar_float_button"
                          onClick={daliy.buttonEvent}
                        >
                          {daliy.button}
                        </div>
                      </li>
                    </ol>
                    <ol style={{ display: index && "none" }}>
                      <div className="divider" />
                    </ol>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="search_bar_service" onClick={clickService}>
              <img
                src={scroll ? service_dark : service}
                alt="service"
                className="search_bar_service_img"
              />
            </div>

            <div className="search_bar_news" onClick={clickNew}>
              <img
                src={scroll ? newsDarkIcon : newsIcon}
                alt="news"
                className="search_bar_news_img"
              />
              {newNotice ? (
                <span className="search_bar_news_number">{newNotice}</span>
              ) : (
                ""
              )}
            </div>
            <div className="search_bar_avatar_container">
              <div className="search_bar_avatar" onClick={clickAvatar}>
                {userId !== "guest" ? (
                  <ImageComponent
                    is_cover={true}
                    src={avatar}
                    background_color="transparent"
                    border_radius="50%"
                    placeholderImg={avatarPlaceholder}
                  />
                ) : (
                  <div className="search_bar_avatar_login">
                    {intl.formatMessage({ id: "LOGIN" })}
                  </div>
                )}
              </div>
              <div className="search_bar_avatar_cover">
                {userId === "guest" ? (
                  <>
                    <div className="search_bar_avatar_cover_user_info vertical">
                      <div>
                        {intl.formatMessage({
                          id: "LOGIN.HAVE_GOOD_EXPERIENCES",
                        })}
                      </div>
                    </div>
                    <div onClick={clickAvatar}>
                      <WavaButton className="search_bar_avatar_button_login">
                        {intl.formatMessage({ id: "LOGIN.NOW" })}
                      </WavaButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="search_bar_avatar_cover_user_info">
                      <div className="search_bar_avatar_cover_user_info_avatar">
                        <ImageComponent
                          is_cover={true}
                          src={avatar}
                          background_color="transparent"
                          border_radius="50%"
                          placeholderImg={avatarPlaceholder}
                        />
                      </div>
                      <div className="search_bar_avatar_cover_user_info_item">
                        <div className="search_bar_avatar_cover_user_info_item_name">
                          {user.nick_name}
                        </div>
                        <div className="search_bar_avatar_cover_user_info_item_description g-center gap-1">
                          {user.time === "-1" || Date.now() < user.time * 1000 ? (
                            <img
                              className="search_bar_avatar_cover_user_info_crown"
                              src={crownIcon}
                              alt="crown"
                            />
                          ) : (
                            ""
                          )}
                          {membershipDate}
                        </div>
                      </div>
                      <div
                        className="search_bar_avatar_cover_user_info_setting cursor"
                        onClick={clickSetting}
                      >
                        {intl.formatMessage({
                          id: "PERSONAL.SETTING",
                        })}
                        >
                      </div>
                    </div>
                    <div onClick={clickCollect}>
                      <WavaButton className="search_bar_avatar_button_t ">
                        {intl.formatMessage({
                          id: "SEARCH.COLLECT.RECENT",
                        })}
                      </WavaButton>
                    </div>
                    <div onClick={clearUserData}>
                      <WavaButton className="search_bar_avatar_button_b">
                        {intl.formatMessage({
                          id: "LOGOUT",
                        })}
                      </WavaButton>
                    </div>
                  </>
                )}
                {/* </div> */}
          {/*</div>*/}
          {/*</div>*/}
          {/* <QrCode scroll={scroll} /> */}
          {/*</div> */}
        </div>
      </TopsearchBarElement>
    </StyleSheetManager>
  );
};

// const TopSearchBarStateToProps = (state, ownProps) => {
//   let newNotice = 0;
//   let noticeList = state.noticeList || [];
//   let noticeListRead = state.noticeListRead || [];
//   for (let i = 0; i < noticeList.length; i++) {
//     if (noticeListRead.indexOf(noticeList[i].id) === -1) {
//       newNotice++;
//     }
//   }

//   return {
//     config: state.config,
//     user: state.user,
//     isPlaceholder: true,
//     location: state.router.location.pathname || "",
//     newNotice: newNotice,
//     avatar: state.user.avatar,
//     userId: state.user.id,
//     highlightRechargeState: state.config.highlightRechargeState,
//     videoDataList: state.myWatchHistory["anime_video_list"] || [],
//     comicDataList: state.myWatchHistory["anime_comic_list"] || [],
//   };
// };

// const TopSearchBarDispatchToProps = (dispatch) => {
//   const intl = useIntl();
//   return {
//     clickItem: (routes) => {
//       dispatch(pushRoutes(routes));
//     },
//     clearUserData: () => {
//       dispatch(userLoginOutAction());
//       dispatch(clearVipInfoAction());
//       dispatch(backRoutes());
//       dispatch(userFBLoginOutAction());
//       dispatch(initPostData());
//     },
//     clickSearch: () => {
//       dispatch(pushRoutes(home.pages.homeSearch));
//     },
//     clickService: () => {
//       window.open("https://bli2pay.com/8jcng");
//     },
//     toPaymentPage: () => {
//       dispatch(updateRechargeStateAction(true));
//       dispatch(pushRoutes(profile.pages.profilePayment));
//     },
//     clickNew: () => {
//       dispatch(pushRoutes(notice));
//     },
//     clickAvatar: () => {
//       const userData = store.getState().user;
//       if (userData.id !== "guest") {
//         dispatch(pushRoutes(profile.pages.profileMain));
//       } else {
//         dispatch(pushRoutes(login));
//       }
//     },
//     clickLogin: () => {
//       dispatch(pushRoutes(login));
//     },
//     clickCollect: () => {
//       dispatch(
//         pushRoutes(profile.pages.profileMyCollect.pages.profileMyCollectComic)
//       );
//     },
//     clickSetting: () => {
//       dispatch(pushRoutes(profile.pages.profileEdit.pages.profileEditInfo));
//     },
//     clickVip: () => {
//       dispatch(
//         pushRoutes(profile.pages.profileBuyVip.pages.profileBuyVipCommon)
//       );
//     },
//     dailyEvent: () => {
//       dispatch(dailyLoginAction(intl));
//     },
//     postSearchWatchHistoryEvent: (type) => {
//       dispatch(postSearchWatchHistoryAction(type));
//     },
//   };
// };

// export default connect(
//   TopSearchBarStateToProps,
//   TopSearchBarDispatchToProps
// )(memo(TopSearchBar, areEqual));

const TopsearchBarElement = styled.div`
  /*  */
  padding-right: ${padding}px;
  padding-left: ${padding}px;
  height: ${main_height}px;
  background-color: #FA719A;

  .logo {
    width: 110px;
    margin-right: 15px;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  .search_bar_task {
    display: flex;
    align-items: center;
    position: relative;
    white-space: nowrap;
    font-size: 14px;
    color: ${({ scroll }) => (scroll ? "#646464" : "#fff")};
    &_float {
      position: absolute;
      z-index: 999;
      visibility: hidden;
    }
    li {
      margin: 5px;
    }
    &:hover {
      .search_bar_float_img {
        animation: navbar-jump 1.5s;
      }
      .qrcode_float {
        color: #646464;
        background-color: #fff;
        padding: 5px;
        text-align: center;
        display: flex;
        top: 50px;
        border-radius: 5px;
        box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
        z-index: 1;
      }
    }
  }

  .search_bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    &_main {
      display: flex;
      justify-content: end;
    }
    &_item {
      display: flex;
    }

    &_nav {
      white-space: nowrap;
      margin-right: 0.5em;

      &_item {
        position: relative;
        cursor: pointer;
        user-select: none;
        &_cover {
          display: none;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: #fff;
          opacity: 20%;
          border-radius: 5px;
        }

        &_btn {
          display: flex;
          padding: 4px 8px;
          &:hover {
            animation: navbar-jump infinite 1.5s;
          }
          &_img {
            width: 22px;
            height: 22px;
            margin-right: 2px;
            vertical-align: middle;
            transition: 0.3s;
          }
          &_title {
            &_text {
              align-self: center;
              font-size: 14px;
              color: #fff;
              font-weight: 600;
              color: ${({ scroll }) => (scroll ? "#646464" : "#fff")};
            }
          }

          &.active {
            cursor: default;
            transform: translateY(-3px) scale(1.05);
            transform-origin: bottom center;
            font-size: 16px;
            color: #646464;
            text-shadow: 0.09px 0px #646464;

            .search_bar_nav_item_cover {
              display: block;
            }
          }
        }
      }
    }

    &_avatar,
    &_main,
    &_news,
    &_service,
    &_switch,
    &_history,
    &_recharge {
      margin-right: 10px;
    }
    &_avatar {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-self: center;
      margin-left: 10px;
      width: ${main_height * 0.55}px;
      height: ${main_height * 0.55}px;
      font-size: 14px;
      color: #fa719a;
      font-weight: 900;
      text-shadow: 0.2px 0.2px #fa719a;
      align-self: center;
      &_login {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #fffa;
      }

      &_cover {
        position: absolute;
        z-index: 999;
        visibility: hidden;
        min-width: 250px;
        &_user_info {
          display: flex;
          justify-content: space-around;
          align-items: center;
          gap: 15px;
          white-space: nowrap;
          color: black;
          font-weight: 500;
          margin-bottom: 5px;
          font-size: 13px;
          &.vertical {
            flex-direction: column;
          }

          &_item {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-weight: 600;
          }

          &_setting {
            color: #646464;
          }
        }
      }

      &_container {
        position: relative;
        align-self: center;

        &:hover {
          .search_bar_avatar_login,
          img {
            animation: navbar-jump 1.5s;
          }
          .search_bar_avatar_cover {
            background-color: #fff;
            padding: 20px 25px;
            text-align: center;
            visibility: visible;
            display: flex;
            flex-direction: column;
            top: 40px;
            right: 0;
            gap: 10px;
            border-radius: 5px;
            box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
            &_user_info {
              &_crown {
                width: 20px;
                margin-right: 5px;
              }
              &_avatar {
                width: 42px;
                height: 42px;
              }
            }
          }

          .search_bar_avatar {
            &_button {
              &_login,
              &_t,
              &_b {
                cursor: pointer;
                word-break: keep-all;
                font-size: 12px;
                padding: 5px 10px;
                border-radius: 100px;
              }
              &_login {
                background: #fa719a;
                color: #fff;
                border: solid 1px #fa719a;
              }
              &_t {
                color: #fa719a;
                border: solid 1px #fa719a;
              }
              &_b {
                color: #a8a8a8;
                border: solid 1px #f3f4f5;
                background: #f3f4f5;
                border: solid 1px #f3f4f5;
              }
            }
          }
        }
      }
    }

    &_main {
      flex-grow: 0.5;
      white-space: nowrap;
    }

    &_switch {
      align-self: center;
      position: relative;

      &_cover {
        position: absolute;
        display: none;
        z-index: 999;
      }

      &:hover {
        .search_bar_switch_img {
          animation: navbar-jump 1.5s;
        }
        .search_bar_switch_cover {
          left: -10px;
          display: block;
          position: absolute;
          &_content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px 0;
            gap: 5px;
            top: 40px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
            white-space: nowrap;
            &:hover {
              .search_bar_switch_cover {
                display: block;
              }
            }
            > div {
              margin: 5px;
              width: 100%;
              font-size: 14px;
              &:hover {
                background-color: #f3f4f5;
              }
            }
          }
        }
      }
      &_img {
        width: 35px;
        height: 35px;
      }
    }

    &_history {
      position: relative;
      align-self: center;
      &_img {
        cursor: pointer;
        width: 35px;
      }
      &_cover {
        z-index: 999;
        display: none;
        cursor: default;
      }
      &:hover {
        .search_bar_history {
          &_img {
            animation: navbar-jump 1.5s;
          }
          &_cover {
            background-color: #fff;
            padding: 15px;
            font-size: 12px;
            text-align: center;
            position: absolute;
            gap: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            top: 40px;
            right: -20em;
            width: 25em;
            border-radius: 5px;
            box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
          }
          &_tab_container {
            border-bottom: 1;
            border-color: divider;
            width: 100%;
          }
        }
        .MuiTabPanel-root {
          padding: 0px !important;
        }
        .MuiTab-root {
          color: #000000;
          width: 50%;
        }

        .Mui-selected {
          color: #f24c7c;
        }

        .MuiTabs-indicator {
          background: #f24c7c;
        }
      }
    }

    &_service {
      cursor: pointer;
      &:hover {
        animation: navbar-jump infinite 1.5s;
      }
    }

    &_float,
    &_recharge {
      align-self: center;
      margin-right: 10px;
      position: relative;
      &_img {
        width: 30px;
        height: 30px;

        &.active {
          animation: 1s recharge-move infinite;

          @keyframes recharge-move {
            0% {
              transform: rotate(0) translateX(0) translateY(5px);
            }

            10% {
              transform: rotate(20deg) translateX(5px) translateY(-5px);
            }

            20% {
              transform: rotate(0deg) translateX(0) translateY(5px);
            }

            30% {
              transform: rotate(-20deg) translateX(-5px) translateY(-5px);
            }

            40% {
              transform: rotate(0deg) translateX(0) translateY(5px);
            }

            50% {
              transform: rotate(0deg) translateX(0) translateY(0);
            }
          }
        }
      }
    }

    &_recharge {
      &_float {
        z-index: 999;
        display: none;
        cursor: default;
        &_description {
          display: flex;
          gap: 15px;
          > span {
            gap: 5px;
            display: flex;
            align-items: center;
            > img {
              width: 25px;
              height: 25px;
            }
          }
        }
      }

      &:hover {
        .search_bar_recharge_float {
          background-color: #fff;
          padding: 15px 35px;
          font-size: 12px;
          text-align: center;
          position: absolute;
          gap: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          white-space: nowrap;
          top: 40px;
          left: -370%;
          border-radius: 5px;
          box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
        }
      }
      &_button,
      &_button_light {
        cursor: pointer;
        padding: 10px 0;
        margin: auto;
        margin-top: 5px;
        width: 100%;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background-color: #fa719a;
        border-radius: 30px;
      }
      &_button_light {
        background-color: #fff;
        color: #fa719a;
        border-radius: 21px;
        border: solid 1px #fa719a;
      }
    }

    &_task {
      // margin: 0px 6px;
      &:hover {
        .search_bar_float {
          z-index: 999;
          visibility: visible;
        }
      }
    }
    &_news {
      position: relative;
      margin-right: 10px;
      align-self: center;
      cursor: pointer;
      &:hover {
        animation: navbar-jump infinite 1.5s;
      }
      &_img {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        color: #fff;
      }

      &_number {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 14px;
        height: 14px;
        font-size: 12px;
        line-height: 14px;
        text-align: center;
        padding: 1%;
        color: ${({ scroll }) => (scroll ? "#fff" : "#FA719A")};
        background-color: ${({ scroll }) => (scroll ? "red" : "#fff")};
        border-radius: 50%;
      }
    }
    &_float {
      z-index: 999;
      position: absolute;
      visibility: hidden;
      display: flex;
      top: 30px;
      right: -230px;
      cursor: default;

      &_title {
        color: black;
        font-weight: 700;
      }

      .gold {
        color: #f4eb0b;
      }

      &_content {
        color: black;
        font-weight: 700;
        img {
          width: 15px;
          height: 15px;
        }
      }

      &_img {
        margin-right: 5px;
      }

      &_button {
        cursor: pointer;
        word-break: keep-all;
        color: #fa719a;
        font-size: 14px;
        padding: 10px 14px;
        width: 100%;
        border: solid 1px #fa719a;
        border-radius: 100px;
      }
      ol {
        color: #a8a8a8;
      }
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1% 0%;
      }
      color: #646464;
      background-color: #fff;
      padding: 5px;
      text-align: center;
      position: absolute;
      top: 45px;
      border-radius: 5px;
      box-shadow: 0px 3px 6px 0px RGB(100, 100, 100, 0.36);
    }
  }

  .divider {
    height: 100%;
    margin: 0% 1em;
    width: 0.2px;
    background-color: gray;
  }

  @media (min-width: 899px) {
    .search_bar_news_img {
      height: 30px;
      width: 30px;
    }

    .search_bar_recharge_img {
      height: 35px;
      width: 35px;
    }
    .search_bar_avatar_login {
      background-color: ${({ scroll }) => scroll && "#1a2950"};
      color: ${({ scroll }) => scroll && "#fff"};
      font-size: 16px;
    }
  }
`;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    backgroundColor: "#333",
    color: "#fff",
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    gap: "1rem",
  },
  navItem: {
    color: "#fff",
    textDecoration: "none",
  },
  languageSwitcher: {
    display: "flex",
    gap: "0.5rem",
  },
  languageButton: {
    backgroundColor: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "0.5rem",
    cursor: "pointer",
  },
};

export default DesktopHeader;
