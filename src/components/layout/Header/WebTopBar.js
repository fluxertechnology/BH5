import styled from "styled-components";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { main_height } from "@/components/layout/Header/TopBarContainer";
import WavaButton from "@/components/layout/Header/WavaButton";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from '@mui/lab/TabContext';
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { colors, pageUrlConstants, padding } from "@/lib/constants";
const { home, post, social, vendor, profile, notice, login } = pageUrlConstants;

const TopSearchBar = ({
  isPlaceholder,
  clickSearch = (e) => e.stopPropagation(),
  clickAvatar,
  clickService,
  clickNew,
  newNotice,
  location = usePathname() || "",
  avatar,
  // user = state.user,
  // userId = state.user.id,
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
  const [scroll, setScroll] = useState(0);
  // const [questInfoList, setQuestInfoList] = useState([]);
  // const [membershipDate, setMembershipDate] = useState("");
  const [tabValue, setTabValue] = useState(1);
  const { state } = useGlobalContext();
  let user = state.user;
  let userId = state.user.id;

  const [navList] = useState(() => [
    {
      cname: "Home",
      name: home.pages.homeMain.name,
      path: home.pages.homeMain.path,
      image: "/images/header/home.svg",
      activeImage: "/images/header/home_selected_btn.png",
    },
    {
      cname: "Posts",
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
      cname: "Shop",
      name: vendor.name,
      path: vendor.path,
      image: "/images/header/vendor.svg",
      activeImage: "/images/header/shop_selected_btn.png",
    },
  ]);

  useEffect(() => {
    const onScroll = () => {
      let { scrollY } = window;
      setScroll(Boolean(scrollY));
      let TargetStyle = ContainerRef?.current?.style; //不加問號目前好像動作太快會故障
      if (TargetStyle) {
        TargetStyle.transition = "0.2s";
        if (scrollY) {
          TargetStyle.backgroundColor = "#fff";
          TargetStyle.borderBottom = "0.5px grey dotted";
        } else {
          TargetStyle.backgroundColor = colors.dark_pink;
          TargetStyle.borderBottom = "none";
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    // <StyleSheetManager shouldForwardProp={() => true}>
      <TopsearchBarElement ref={ContainerRef} scroll={scroll}>
        <div className="search_bar">
          <div className="search_bar_item">
            <Image
              width={110}
              height={32}
              src={
                scroll
                  ? "/images/footer/logo_p.svg"
                  : "/images/header/logo_w.svg"
              }
              alt="B次元 LOGO"
              className="logo cursor-pointer"
              onClick={() => clickItem(navList[0])}
            />
            {navList.map((navItem) => (
              <div
                className="search_bar_nav cursor-pointer"
                key={navItem.name}
                style={{
                  animation: scroll ? "1s recharge-move 2" : "",
                }}
                onClick={(e) => {
                  clickItem(navItem);
                }}
              >
                <WavaButton
                  className={
                    "search_bar_nav_item_btn " +
                    (location.indexOf(navItem.path) !== -1 ? "active" : "")
                  }
                >
                  <div className="search_bar_nav_item_cover" />
                  <Image
                    width={"22"}
                    height={"22"}
                    className={"search_bar_nav_item_btn_img"}
                    src={scroll ? navItem.activeImage : navItem.image}
                    alt={navItem.name}
                  />
                  <div className="search_bar_nav_item_btn_title_text">
                    {navItem.cname}
                  </div>
                </WavaButton>
              </div>
            ))}
          </div>
          <div className="search_bar_item" />
          <div className="search_bar_main cursor-pointer">
            <Searchbar
              callback={clickSearch}
              isPlaceholder={isPlaceholder}
              scroll={scroll}
            />
          </div>
          <div className="search_bar_item">
            <div className="search_bar_recharge">
              <Image
                width={35}
                height={35}
                className={
                  "search_bar_recharge_img " +
                  (highlightRechargeState ? "" : "active")
                }
                onClick={toPaymentPage}
                src={
                  !highlightRechargeState
                    ? "/images/header/recharge_highlight.svg"
                    : scroll
                    ? "/images/header/recharge_highlight_dark.svg"
                    : "/images/header/recharge.svg"
                }
                alt="recharge"
              />
              <div className="search_bar_recharge_float">
                <div>VIP Benefits: Enjoy After Purchase</div>
                <div className="search_bar_recharge_float_description">
                  <span>
                    <Image
                      width={"30"}
                      height={"32"}
                      src={"/images/header/free-nor.svg"}
                      alt="free"
                    />
                    Unlimited Movie Streaming For Members!
                  </span>
                  <span>
                    <Image
                      width={"32"}
                      height={"32"}
                      src={"/images/header/fast-nor.svg"}
                      alt="fast"
                    />
                    Smooth Experience
                  </span>
                </div>
                <div
                  className={"search_bar_recharge_button"}
                  onClick={toPaymentPage}
                >
                  <WavaButton>
                    {userId === "guest"
                      ? "First Recharge Discount for New Members"
                      : "Recharge for VIP, happy non-stop."}
                  </WavaButton>
                </div>
                <div
                  className={"search_bar_recharge_button_light"}
                  onClick={clickVip}
                >
                  <WavaButton>Enter VIP Code By Clicking Here.</WavaButton>
                </div>
              </div>
            </div>

            <div className="search_bar_history">
                <Image
                  width={"35"}
                  height={"35"}
                  src={scroll ? "/images/header/history_dark.svg" : "/images/header/history.svg"}
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
                      {/* <ProfileWatchHistoryComicHandle disabledScrollRefresh /> */}
                    </TabPanel>
                    <TabPanel value={0}>
                      {/* <ProfileWatchHistoryAnimeHandle disabledScrollRefresh /> */}
                    </TabPanel>
                  </TabContext>
                </div>
              </div>
  {/* 
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
                </div> */}
          </div>
          {/*</div>*/}
          {/* <QrCode scroll={scroll} /> */}
          {/*</div> */}
        </div>
      </TopsearchBarElement>
    // </StyleSheetManager>
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

const TopsearchBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["scroll"].includes(prop),
})`
  /*  */
  padding-right: ${padding}px;
  padding-left: ${padding}px;
  height: ${main_height}px;
  background-color: ${colors.dark_pink};

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
    color: ${({ scroll }) => (scroll ? colors.text_grey : "#fff")};
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
        color: ${colors.text_grey};
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
              color: ${({ scroll }) => (scroll ? colors.text_grey : "#fff")};
            }
          }

          &.active {
            cursor: default;
            transform: translateY(-3px) scale(1.05);
            transform-origin: bottom center;
            font-size: 16px;
            color: ${colors.text_grey};
            text-shadow: 0.09px 0px ${colors.text_grey};

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
      color: ${colors.dark_pink};
      font-weight: 900;
      text-shadow: 0.2px 0.2px ${colors.dark_pink};
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
            color: ${colors.text_grey};
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
                background: ${colors.back_dark_pink};
                color: #fff;
                border: solid 1px ${colors.dark_pink};
              }
              &_t {
                color: ${colors.dark_pink};
                border: solid 1px ${colors.dark_pink};
              }
              &_b {
                color: ${colors.text_light_grey};
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
          color: ${colors.back_dark_pink};
        }

        .MuiTabs-indicator {
          background: ${colors.back_dark_pink};
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
        background-color: ${colors.dark_pink};
        border-radius: 30px;
      }
      &_button_light {
        background-color: #fff;
        color: ${colors.dark_pink};
        border-radius: 21px;
        border: solid 1px ${colors.dark_pink};
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
        color: ${({ scroll }) => (scroll ? "#fff" : colors.dark_pink)};
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
        color: ${colors.dark_pink};
        font-size: 14px;
        padding: 10px 14px;
        width: 100%;
        border: solid 1px ${colors.dark_pink};
        border-radius: 100px;
      }
      ol {
        color: ${colors.text_light_grey};
      }
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1% 0%;
      }
      color: ${colors.text_grey};
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

/* 
  Start Search Bar
  */
const Searchbar = ({
  value = "",
  isPlaceholder = true,
  scroll,
  callback,
  inputOnChange = () => {},
  inputKeyDown = () => {},
}) => {
  return (
    <SearchbarElement onClick={callback} scroll={scroll}>
      <div className={"search " + (isPlaceholder ? "placeholder" : "")}>
        <div className="search_content">
          {isPlaceholder ? (
            <div className="search_content_placeholder">Search Something</div>
          ) : (
            <input
              type="text"
              className="search_content_input"
              placeholder="搜寻你想要的..."
              enterKeyHint="search"
              value={value}
              onChange={inputOnChange}
              onKeyDown={inputKeyDown}
            />
          )}
        </div>
        <div className="search_icon">
          <Image
            width={"20"}
            height={"30"}
            src={
              scroll
                ? "/images/header/search_gray.svg"
                : "/images/header/search.svg"
            }
            className="search_icon_img"
            alt=""
          />
        </div>
      </div>
    </SearchbarElement>
  );
};

const SearchbarElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["scroll"].includes(prop),
  })`
  /*  */
  .search {
    padding: 5px;
    display: flex;
    align-items: middle;
    background-color: #fff;
    border-radius: 30px;
    @media (min-width: 899px) {
      padding: 0;
      min-width: 200px;
    }

    &_icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      vertical-align: middle;
      color: #aaa;

      &_img {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }

    &_content {
      width: 100%;
      font-size: 12px;
      margin-left: 10px;
      &_input {
        width: 100%;
        background-color: transparent;
        border: none;
        outline: none;
      }
    }

    &.placeholder {
      background-color: #00000036;
      font-weight: 600;
      .search {
        &_icon {
          color: #fffa;
        }

        &_content {
          display: flex;
          align-items: center;

          &_placeholder {
            color: ${({ scroll }) => (scroll ? "#a8a8a8" : "#fffa")};
          }
        }
      }
    }
  }

  @media (min-width: 599px) {
    .search_icon_img {
      height: 30px;
      width: 20px;
    }

    .search_content {
      font-size: 18px;
    }

    .search_content_input {
      font-size: 18px;
      height: 30px;
      font-weight: 600;
    }
  }
`;

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

export default TopSearchBar;