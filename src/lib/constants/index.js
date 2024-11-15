import placeholder_345x80 from "@public/images/imgPlaceholder/345x80.jpg";
// import placeholder_688x140 from "/images/imgPlaceholder/688x140.jpg";
import placeholder_694x206 from "@public/images/imgPlaceholder/694x206.jpg";
import placeholder_720x400 from "@public/images/imgPlaceholder/720x400.jpg";
import { encryptionData } from "@/lib/services/aes";

const apiDomain = ["https://bili01.com", "https://bacg01.com"];

export const webVersion = "3.4.7";
export const m3ubDomain = "https://bhub.pikaporn.site/";
export const officialContact = "https://sto13.com/offcial";
export const socialForm = "https://iypdwor69.com/";
export const applyOriginal = "https://ficgqwp.cn/bRev0";
export const vendorUrl = "https://18tao.shop/";
// @media (max-width: 300px) {}
export const breakPoint = {
  mobile: 899, // 這是 mui 的斷點
};

export function checkIsMobile() {
  // TODO(ZY): uncomment and fix document issues
  return true;
  // return (
  //   document.body.getBoundingClientRect().width <= breakPoint.mobile
  //   //這個斷點在899px 但 CSS要判斷 599px 以上不然會太小
  // ); // 這個是 mui 的斷點設定
}

export const downloadPageUrl = "https://hqew1.com/bhub";
export const downloadBackUrl = "https://wws.lanzouq.com/iKnBU014vfzc";
export const profileService = "https://189.cafe/Sshzd";
export const profileFeedback = "https://189.cafe/Slq3n";
export const downloadIosUrl = "https://hqew1.com/bhubios";

// 職播網址設定
export const streamIframeUrl = `https://creative.18live.ink/widgets/v4/Universal?tag=girls%2Fasian%2Cgirls%2Fteens%2Cgirls%2Fyoung&autoplay=onHover&targetDomain=18live.ink&userId=92c725c0e3a10d9130ff1a4636f1172df8a5f413e4a0c91465b629785ab4761e`;

export const downloadPage = [
  "https://bc6y9.com",
  "https://trun.2jidj7m.com/share",
  "https://jingyindao-1.com/",
];

export const metaPageUrl = "https://blid2.com/video-one";
export const hub2cyPageUrl = "https://blid2.com/video-two";

export const capsuleUrl =
  process.env.REACT_APP_DEPLOY === "prd"
    ? "https://capsule.b2j39e.com/"
    : "https://staging-capsule.b2j39e.com";

export const systemTimestamp = 1636714606 * 1000;

export const shortTermTimestamp = 30 * 60 * 1000;

export const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

// 判斷哪個網址圖片可以正常連線沒被封，可以的記錄下來之後就連那個
if (typeof window !== 'undefined') {
  for (let i = 0; i < apiDomain.length; i++) {
    let img = document.createElement("img");
    img.src = apiDomain[i] + "/downzai/assets/images/test.jpg";
    img.onload = () => {
      window.localStorage.setItem("domain", encryptionData(apiDomain[i]));
    };
  }
}

let qqReg = /^[1-9]\d{4,10}$/;
let phoneReg = /^(1[3-9]\d{9}|9\d{8})$/;
// eslint-disable-next-line no-useless-escape
let emailReq = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
let emailVerifyReq = /^\d{5}$/;
let alphanumericReq = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
let editNickNameReq = /^([\u4E00-\u9FFF]{1,7}|[a-zA-Z]{1,14})$/;

export const REG_SET = {
  qqReg,
  emailReq,
  emailVerifyReq,
  phoneReg,
  alphanumericReq,
  editNickNameReq,
};

export const imgUrl = "http://agent.bbllbb.com/";

export const padding = 20;

export const side_padding = 10;

export const page_over_duration = 500;

export const toastAutoCloseDuring = 1000;

export const colors = {
  dark_pink: "#FA719A",
  light_pink: "#fcdce5",
  back_dark_pink: "#f24c7c",
  text_grey: "#646464",
  text_light_grey: "#a8a8a8",
  back_grey: "#f4f4f4",
  light_star: "#fde17b",
  grey: "#f3f4f5",
};

export const userRank = [
  "普通会员",
  "高级会员",
  "黄金会员",
  "钻石会员",
  "尊享会员",
];

export const pageUrlConstants = {
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
        path: "/home/protocol",
        pages: {
          homeEULA: {
            name: "客戶服務協議及隱私權˙",
            path: "/home/protocol/EULA",
            bottomNav: true,
          },
          homeTSM: {
            name: "客戶服務協議˙",
            path: "/home/protocol/TSM",
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
// 後面加 * 號代表有撰寫 swagger 文件
export const requestUrlConstants = {
  toPaymentPageUrl: "/appapi/pay/cz/", // 前往購買網址
  getHomeAnnouncementUrl: "index/send/tc", // 獲得公告訊息
  getUserLogin: "/login/login/veifys", // 用戶登入用*
  getFBUserLogin: "/login/login/fbLogin", // 用戶FB登入用*
  getUserSignup: "/login/login/create", // 用戶註冊 跟下面的相同
  postUserSignup: "/banime/user/create", // 用戶註冊 跟上面的相同
  postCheckUserEmail: "/banime/user/check_email", // 確認信箱用戶是否註冊過
  postGetEmailVerify: "/login/login/createVerifyMail", // 獲取信箱驗證碼
  postVerifyEmailCode: "/login/login/verifyMail", // 信箱驗證碼比對
  getAreaCode: "/login/login/getcdbyreg", // 獲取各國電話國碼*
  getAnimeHome: checkIsMobile() //這個暫時沒有接上因為ipad 轉換的時候在這邊就沒辦法熱更新
    ? "/mobileapi/anime/home"
    : "/mobileapi/anime/pchome", // 獲取 anime home 的資料*
  getNewAnimeHome: "/mobileapi/anime/newhome", //獲取anime new home新首頁資料
  getBannerList: "/mobileapi/banner/get_banner_list", // 獲取所有廣告*
  getQuestInfo: "/login/login/getsharereg", // 獲取伺服器設定*
  getXiaoxilist: "/login/login/xiaoxilist", // 獲取最新消息*
  getHomeVideoTagList: "login/login/videobytuijiancate", // 獲取videoList
  getResetPassword: "/login/login/repasswordneedv", // 重置密碼驗證*
  getNovelsTabUrl: "/login/login/getxiaoshuobcate", // 獲得小說類別
  getPhotosTabUrl: "/login/login/gettupianbcate", // 獲得美圖類別
  getStreamListUrl: "/login/login/zhibjkpingtai1", // 獲得直接頻道清單
  getSocialList: "/mobileapi/oneforone/getList", // 獲得樓鳳清單
  getSocialLocalUrl: "/login/login/getOneForOneLocation", // 獲得樓鳳地點圖
  getSocialProfileUrl: "/mobileapi/oneforone/getProfile", // 獲得美女資料
  getBuySocialProfileUrl: "/mobileapi/oneforone/buyProfile", // 解鎖樓鳳美女檔案
  getVendeorTabUrl: "/mobileapi/shop/category_list", // 獲得商城種類清單
  getHomeCategoryTabList: "/mobileapi/common/get_tag_list", // 獲取分類清單
  getUserDailyView: "/login/login/daygycs", // 獲得並增加每日觀影次數
  getComicViewPhotos: "/mobileapi/anime/get_data_by_episode", // 獲得對應漫畫集數
  // getVideoContentRecommendUrl: "login/login/sjvideolist1", // 獲取影片內容推薦清單
  getVideoContentRecommendUrl: "/banime/video/recommend", // 獲取影片內容推薦清單
  // getUserVideoFavoriteList: "/login/login/getmysc", // 獲取影片收藏清單 user_id
  getUserDailyLogin: "/login/login/qiand", // 用戶每日登入
  postMissionList: "/mobileapi/mission/get_list", // 獲取任務列表
  postAddRecordMissionList: "/mobileapi/mission/add_record", // 獲取任務列表
  postAddCheckIn: "/mobileapi/mission/add_checkin", // 每日任務簽到
  postGetReward: "/mobileapi/mission/get_reward", // 領取任務獎勵
  getVipInfoDataUrl: "/mobileapi/common/get_vip_card", // 獲取 vip 商品資訊
  getVipExchangeCodeUrl: "/login/login/dianka", // 兌換 vip 兌換碼
  getBuyGoldMoneyPaymentUrl: "/login/login/getuserauditorder", // 獲取購買紀錄
  getGameListUrl: "/banime/game/home", // 獲取遊戲清單
  postTransferMoney: "/banime/transform/m2s", //使用者晶鑽轉金幣
  getTransferMoneyRule: "/banime/transform/m2sRule", //晶鑽轉金幣規則
  getTransferMoneyHistory: "/banime/transform/m2sLog", //晶鑽轉金幣紀錄
  getWithDrawHistory: "/mobileapi/withdraw/get_list", //提現紀錄
  postUsernameExist: "/login/login/check", // 確認帳號是否存在
  postToggleCollect: "/mobileapi/common/add_collect", // 收藏狀態切換
  postCollectComicAnime: "/mobileapi/anime/collect", // 收藏漫畫狀態
  postGoldBuy: "/login/login/jinbipaybuy", // 金幣購買東西目前用在美圖漫畫小說
  postGoldPay: "/login/login/jinbipay", // 金幣購買東西目前用在影片
  postGoldBuyComic: "/mobileapi/anime/buy", // 金幣購買漫畫和動畫
  postGetBuyRecord: "login/login/getbuyrecordstatus", //確認有沒有買過
  // postGetNovelsData: "/login/login/getxiaoshuobbycateid", // 獲取小說列表
  postGetNovelsData: "/banime/novel/lists", // 獲取小說列表
  postBuyDownloadPhoto: "/mobileapi/user/buy_download_photo", // 購買圖片
  postGetNovelContent: "login/login/getxiaoshuobbyid", // 獲取對應小說 id 用 ?id=XXXX 帶
  postVerifyThenGetNovelContent: "/banime/novel/profile", // 驗證並獲取小說內容
  postGetComicAnimeData: "/mobileapi/anime/get_data", // 獲取漫畫動畫資料與清單
  postGetAnimeContent: "/mobileapi/anime/get_data_by_episode", // 獲取動畫內容
  postVerifyThenGetAnimeContentUrl: "/banime/anime/profile", // 驗證並獲取動漫相關內容 動畫與漫畫
  // postGetVideoContent: "/login/login/getvideo", // 獲取影片內容
  postVerifyThenGetVideoContent: "/banime/video/profile", // 驗證並獲取影片內容
  postGetVideoPreview: "/login/login/imgad", // 獲取影片是否有人看過
  postGetVideoBuyRecord: "/login/login/getuserisbuy", // 獲取影片是否被買過
  postAddVideoCollect: "/login/login/addvideocollect", // 收藏影片
  // postGetPhotosData: "login/login/gettupianbbycateid", //獲取美圖清單
  postGetPhotosData: "/banime/photo/lists", //獲取美圖清單
  postGetPhotoContent: "/login/login/gettupianbbyid", // 獲取對應美圖 id 用 ?id=XXXX 帶
  postVerifyThenGetPhotoContentUrl: "/banime/photo/profile", // 驗證並獲取美圖內容
  postGetRankListData: "/mobileapi/anime/get_rank", // 獲取排行榜清單
  postGetCategoryData: "/mobileapi/anime/get_list", // 獲取首頁分頁內的資料
  postGetSearchTab: "/mobileapi/user/search_home", // 獲取 search tab 資料
  postGetSearchList: "mobileapi/user/search_list", // 獲取搜尋結果
  postGetUserInfoUrl: "/login/login/getuserinfo", // 獲得 user 資料
  postRefreshAnime: checkIsMobile()
    ? "/mobileapi/anime/get_list_by_change"
    : "/mobileapi/anime/get_pclist_by_change", // 更新 anime home 資料*
  postGetSignupVerify: "/login/login/send_sms", // 獲取註冊用驗證碼*
  postGetVerify: "/login/login/getforgetcode", // 獲取驗證碼*
  // postGetVideoCateData: "login/login/videobycateid", // 獲取對應分類資料
  postGetVideoCateData: "/banime/video/lists", // 獲取對應分類資料
  postGetPostDataUrl: "/mobileapi/pornzone/get", // 獲取動態資料
  postGetPostTags: "/mobileapi/pornzone/get_tag", // 獲取動態標籤資料
  postGetRecommendListUrl: "/mobileapi/pornzone/get_recommend", // 獲取推薦動態原創主清單
  postGetPostDataListUrl: "/mobileapi/pornzone/get_list", // 獲取動態貼文清單
  postGetPostDataSpecialListUrl: "/mobileapi/pornzone/get_list_by_uid", // 獲取特定使用者的動態貼文清單
  postUpdateOriginalProfile: "/mobileapi/pornzone/update_profile", // 更新原創主資料
  postGetRecommendOriginalListUrl: "/mobileapi/pornzone/get_profile_list", // 獲取動態畫面原創主清單
  postGetRecommendOriginalProfileUrl: "/mobileapi/pornzone/get_profile", // 獲取動態畫面原創主清單
  postGetPostNoticeUrl: "/mobileapi/pornzone/get_notice", // 獲取動態的通知
  postGetPostCommentUrl: "/mobileapi/pornzone/get_comment_list", // 獲得動態評論清單
  postGetCouponListUrl: "/mobileapi/shop/get_coupon_list", // 獲得折價卷
  postGetUsedCouponListUrl: "/mobileapi/shop/get_coupon_record", // 獲得使用過的折價卷
  postGetCouponRedeemUrl: "/mobileapi/shop/receive", // 獲得兌換碼
  postGetCapsuleAwardUrl: "/mobileapi/gashapon/get_user_award", // 獲得我的轉蛋禮物
  postExchangeAwardUrl: "/mobileapi/gashapon/exchange", // 換我的轉蛋禮物
  postExchangeActualAwardUrl: "/mobileapi/gashapon/exchangeActualAward", // 兌換實體商品
  postReadCouponUrl: "/mobileapi/user/read_coupon", // 讓新禮包提示點點消失
  postLikeCommentUrl: "/mobileapi/pornzone/add_comment_like", // 喜愛動態評論
  postAddCommentUrl: "/mobileapi/pornzone/create_comment", // 新增一個動態評論
  postPostLikeUrl: "/mobileapi/pornzone/add_like", // 動態 post like
  postPostAttentionUrl: "/mobileapi/pornzone/attention", // 動態 post 關注
  postScribeOriginal: "/mobileapi/pornzone/subscript", // 訂閱原創主
  postAddWatchMount: "/mobileapi/pornzone/add_view", // 動態新增觀看數
  postPostPayUrl: "/mobileapi/pornzone/pay", // 動態 post 關注付費
  postAddDynamicUrl: "/mobileapi/pornzone/create", // 上傳動態消息
  postAddDynamicImageUrl: "/mobileapi/pornzone/upload", // 上傳動態消息圖片
  postAddSocialProfileCollectUrl: "/login/login/add_oneforone_like", // 樓鳳 愛心狀態 新增
  postVendeorGameListUrl: "/mobileapi/shop/newshoplist", //商城遊戲
  postVendeorListUrlPC:
    "https://18tao.shop/api/product/spu/lst?lang=zh-Hans&page=1&limit=15&keyword=&brand_id=&price_on=&price_off=&order=&cate_pid=1404&common=1", // 獲得商城商品清單 PC
  postVendeorListUrlH5:
    "https://18tao.shop/api/product/spu/lst?pid=1404&page=1&limit=15&lang=zh-Hant", // 獲得商城商品清單 H5
  postVendeorAdvertiseUrl:
    "https://18taoshop.cn/api/pc/rec_list?page=1&limit=4&common=1", // 獲得商城商品清單
  postVendorGoodsLikeUrl: "/mobileapi/shop/add_like", // 獲得喜歡商品
  postGetVendorGoods: "/mobileapi/shop/profile", // 獲取對應商品資料
  postBuyVendorGoods: "/mobileapi/shop/buy", // 購買對應商品
  postGetOrderListUrl: "/mobileapi/shop/order_list", // 獲得訂單清單
  postGetDirectOrderListUrl: "/appapi/pay/get_purchase_list", // 獲得直購資料
  postGetDirectOrderUrl: "/appapi/pay/purchase", // 直購
  postGetOrderDetailUrl: "/mobileapi/shop/order", // 獲得訂單明細
  postUpdateUserAvatarUrl: "/mobileapi/user/upload_avatar", // 更新用戶圖片
  postUpdateUserDataUrl: "/mobileapi/user/update_profile", // 更新用戶資料
  postGetAvatarListUrl: "/mobileapi/user/get_avatar_list", // 獲取用戶頭像列表
  postUnClockAvatarUrl: "/mobileapi/user/buy_avatar", // 購買、解鎖頭像
  postUnClockPersonalAvatarUrl: "/mobileapi/user/buy_upload_avatar", // 自己上傳頭像
  postBindEmailUrl: "/login/login/bandEmail", // 用戶綁定信箱
  postBindInviteUrl: "/login/login/yaoqingma", // 用戶綁定邀請碼
  postWithDraw: "/mobileapi/withdraw/create", // 用戶提領申請
  postBuyVipMemberUrl: "/login/login/memberyuepay", // 購買 vip 頁面
  postGetUserCollectListUrl: "/mobileapi/user/get_collect_list", // 獲得用戶收藏清單
  postGetUserBuyListtUrl: "/mobileapi/user/get_buy_list", // 獲得用戶購買清單
  postAddFeedbackUrl: "/login/login/addfeedback1", // 意見反饋
  postGetReportOptionList: "/banime/report/lists", // 獲取回報清單
  postReportProblem: "/banime/report/post", // 回報使用者問題
  postWatchHistory: "/banime/history/add", //新增觀看紀錄
  postSearchHistory: "/banime/history/lists", //查詢觀看紀錄
  postContinueHistory: "/banime/history/readon", //查詢繼續看紀錄
  getIdleHome: "/mobileapi/anime/idlehome", //查詢觀看紀錄(閒置廣告)
};
// process
// has_episode
export const adsKeys = {
  home: {
    key: "home",
    placeholder: placeholder_720x400,
  },
  register_banner: {
    key: "register_banner",
    placeholder: placeholder_345x80,
  },
  profile_interval: {
    key: "my_banner",
    placeholder: placeholder_345x80,
  },
  anime_top_banner: {
    key: "anime_top_banner",
    placeholder: placeholder_694x206,
  },
  anime_interval: {
    key: "anime_interval",
    placeholder: placeholder_345x80,
  },
  anime_video_banner: {
    key: "anime_video_banner",
    placeholder: placeholder_345x80,
  },
  video_banner: {
    key: "video_banner",
    placeholder: placeholder_345x80,
  },
  search_interval: {
    // key: "anime_interval",
    key: "search_banner",
    placeholder: placeholder_345x80,
  },
  social_top_banner: {
    key: "oneforone_banner",
    placeholder: placeholder_720x400,
  },
  shop_top_banner: {
    key: "shop_banner",
    placeholder: placeholder_720x400,
  },
  shop_activity_banner: {
    key: "shop_activity_banner",
    placeholder: placeholder_345x80,
  },
  home_side_move_banner: {
    key: "home_side_move_banner",
    placeholder: placeholder_345x80,
  },
};

export const tokens = [
  "74b3971a25fdd1784cb4574faf6be4543d7c1cc7aa6d7c7d63b0e5fdf22",
  "74b3971a25fdd1784cb4574f40cf9af6be4543d7c1cc7aa6d7c7d63b0e5fdf22",
];

export const showBottomBarWhenPathEquals = [];
export const loginCheckWhenPathEquals = [];
export const closePcFooter = [];
function filterCondition(pageData) {
  for (let key in pageData) {
    if (pageData[key].closePcFooter) {
      closePcFooter.push(pageData[key].path);
    }
    if (pageData[key].bottomNav) {
      showBottomBarWhenPathEquals.push(pageData[key].path);
    }
    if (pageData[key].login) {
      loginCheckWhenPathEquals.push(pageData[key].path);
    }
    filterCondition(pageData[key].pages);
  }
}

filterCondition(pageUrlConstants);

export const searchTabName = {
  SAC: "漫畫",
  SAV: "動畫",
  SV: "視頻",
  SX: "小說",
  ST: "美圖",
};
