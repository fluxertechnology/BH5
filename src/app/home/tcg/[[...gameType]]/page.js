"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Image from "next/image";
import gameTypes from "@/lib/tcg/game_types";
import ImageCarousel from "@/components/common/ImageCarousel";
import ImageComponent from "@/components/common/ImageComponent";
import { adsKeys, side_padding, apiUrl } from "@/lib/constants";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import tcgAxios from "@/lib/services/tcgAxios";
// import gameTypes from "@/lib/tcg/game_types";
import toastCall from "@/lib/services/toastCall";
import { PopupDialogWrapper } from "@/components/login/PopupComponent";
import IconInput from "@/components/login/IconInputComponent";
import { openPopup } from "@/store/actions/user";
import { nowLang } from "@/i18n/Metronici18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import { useIframe } from "@/hooks/useIframe";
import FullPageIframe from "@/components/common/FullPageIframe";
import { getPremiumDiamond } from "@/lib/services/price";
import LoadingComponent from "@/components/common/LoadingComponent";
import { updateUserDataAction } from "@/store/actions/user";
import gameManager from "@/lib/services/gameManager";
import { useParams } from "next/navigation";

const HomeTcgMainPage = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile, isDesktop } = useMediaQuery();
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(10); // 当前选中的功能按钮

  const features = [
    {
      title: "存款",
      icon: "user-panel-saving",
      url: pageUrlConstants.profile.pages.profilePayment,
    },
    {
      title: "提现",
      icon: "user-panel-withdraw",
      url: pageUrlConstants.profile.pages.profileWithdraw,
    },
    {
      title: "优惠",
      icon: "user-panel-offer",
      url: pageUrlConstants.promotions,
    },
    {
      title: "记录",
      icon: "user-panel-record",
      url: pageUrlConstants.profile.pages.profileWithdraw
        .profileWithdrawHistory,
    },
  ];

  // const productTypeLogos = {
  //   4: "/images/tcg/logo/AG.png",
  //   79: "/images/tcg/logo/BB.png",
  //   41: "/images/tcg/logo/BG.png",
  //   16: "/images/tcg/logo/CQ9.png",
  //   55: "/images/tcg/logo/JDB.png",
  //   152: "/images/tcg/logo/WL.png",
  // };

  const gameTypeImages = {
    RNG: {
      AG: "/images/tcg/RNG/AG.png",
      BB: "/images/tcg/LIVE/BB.png",
      CQ9: "/images/tcg/RNG/CQ9.png",
      FC: "/images/tcg/RNG/FC.png",
      JDB: "/images/tcg/RNG/JDB.png",
      KY: "/images/tcg/PVP/KY.png",
      LY: "/images/tcg/PVP/LY.png",
      MGS: "/images/tcg/RNG/MGS.png",
      PG: "/images/tcg/RNG/PG.png",
    },
    LIVE: {
      AG: "/images/tcg/LIVE/AG.png",
      BB: "/images/tcg/LIVE/BB.png",
      BG: "/images/tcg/LIVE/BG.png",
      CQ9: "/images/tcg/LIVE/CQ9.png",
      WL: "/images/tcg/LIVE/WL.png",
    },
    FISH: {
      AG: "/images/tcg/FISH/AG.png",
      BOLE: "/images/tcg/PVP/BOLE.png",
      CQ9: "/images/tcg/FISH/CQ9.png",
      FC: "/images/tcg/RNG/FC.png",
      JDB: "/images/tcg/RNG/JDB.png",
      KY: "/images/tcg/PVP/KY.png",
      LY: "/images/tcg/PVP/LY.png",
      MGS: "/images/tcg/RNG/MGS.png",
      WL: "/images/tcg/PVP/WL.png",
    },
    SPORTS: {
      BB: "/images/tcg/LIVE/BB.png",
      CR: "/images/tcg/SPORTS/CR.png",
      TF: "/images/tcg/SPORTS/TF.png",
    },
    PVP: {
      BOLE: "/images/tcg/PVP/BOLE.png",
      JDB: "/images/tcg/RNG/JDB.png",
      KY: "/images/tcg/PVP/KY.png",
      LY: "/images/tcg/PVP/LY.png",
      MGS: "/images/tcg/RNG/MGS.png",
      WL: "/images/tcg/PVP/WL.png",
    },
    ELOTT: {
      VR: "/images/tcg/ELOTT/VR.png",
    },
  };

  const params = useParams();
  const initGameType = params.gameType?.[0];

  const lang = ["sc", "tc"].includes(nowLang) ? "zh" : "en";
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [gameCategoryList, setGameCategoryList] = useState([]);
  const [productTypeLogos, setProductTypeLogos] = useState({});
  const [tcgProductTypes, setTcgProductTypes] = useState(0);
  const [tcgProductTypesList, setTcgProductTypesList] = useState([]);
  const [tcgProductTypesDisplay, setTcgProductTypesDisplay] = useState([]);
  const [tcgGameType, setTcgGameType] = useState(initGameType || "HOT");
  const [tcgGameList, setTcgGameList] = useState([]);
  const [tcgGameCurrentPage, setTcgCurrentPage] = useState(1);
  const [tcgTotalGames, setTcgTotalGames] = useState(0);
  const tcgGamePageSize = 30;
  const [isGameOpen, setIsGameOpen] = useState(false);

  const { isOpen, currentUrl, openIframe, closeIframe } = useIframe();

  const [isTipsOpen, setIsTipsOpen] = useState(false);

  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentGameUrl, setCurrentGameUrl] = useState("");
  const [currentGameProductType, setCurrentGameProductType] = useState("");
  const [isLoadingTransferOutAll, setIsLoadingTransferOutAll] = useState(false);
  const [isLoadingGameUrl, setIsLoadingGameUrl] = useState(false);

  const tcgGetGameCategory = async () => {
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/get_category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify({
          uid: state.user.id,
        }),
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "获取产品类型失败，请稍后再试");
        return;
      }
      setGameCategoryList(data.data || []);
      handleGameListUpdate(data.data);
      setProductTypeLogos(
        data.data
          .flatMap((category) =>
            category.product
              .filter((e) => e.id < 0)
              .map((product) => ({
                [product.product_type]: product.img,
              })),
          )
          .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      );
    } catch (error) {
      console.error("获取产品类型失败:", error);
      toastCall("获取产品类型失败，请稍后再试");
    }
  };

  const tcgGetProductTypes = async () => {
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/get_product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: "",
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "获取产品类型失败，请稍后再试");
        return;
      }
      const typeList = data.data.map((m) => ({
        ...m,
        product_type: parseInt(m.product_type),
      }));

      setTcgProductTypesList(typeList);
      setTcgProductTypesDisplay([]);
    } catch (error) {
      console.error("获取产品类型失败:", error);
      toastCall("获取产品类型失败，请稍后再试");
    }
  };

  const tcgGetGameList = async (page = 1) => {
    const isHot = tcgGameType === "HOT";
    const payload = {
      ...(!isHot && {
        product_type: tcgProductTypes,
        game_type: tcgGameType,
      }),
      page,
      page_size: tcgGamePageSize,
    };

    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/get_game_list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.code === 0) {
        toastCall(data.msg || "获取游戏列表失败，请稍后再试");
        return;
      }

      setTcgTotalGames(data.data.total || 0);
      setTcgGameList(data.data.value || []);
    } catch (error) {
      console.error("获取游戏列表失败:", error);
    }
  };

  const tcgGetGameUrl = async (gameId, confirm = true) => {
    if (isLoadingGameUrl) {
      return;
    }
    setCurrentGameId(gameId);
    if (!confirm) {
      setIsTipsOpen(true);
      return;
    }
    if (!gameId) {
      return;
    }

    const gameStart = await gameManager.startGame(state, gameId);
    if (!gameStart.success) {
      toastCall(gameStart.message || "无法启动游戏，请稍后再试");
      return;
    }

    setIsLoadingGameUrl(true);
    setIsGameOpen(true);
    const isGuest = state.user.id === "guest";
    const guestUid = localStorage.getItem("guestTcgUID") ?? "guest";
    const payload = {
      uid: isGuest ? guestUid : state.user.id,
      game_id: gameId,
      platform: isMobile ? "html5" : "html5-desktop",
    };

    const apiPath = isGuest ? "launch_game" : "launch_game_by_auth";
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/${apiPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.code === 0) {
        setIsGameOpen(false);
        gameManager.endGame(state, gameId);
        toastCall(data.msg || "获取游戏链接失败，请稍后再试");
        return;
      }
      if (data.data?.uid) {
        localStorage.setItem("guestTcgUID", data.data.uid);
      }

      if (!data.data?.url) {
        setIsGameOpen(false);
        gameManager.endGame(state, gameId);
        toastCall("获取游戏链接失败，请稍后再试");
        return;
      }

      setCurrentGameUrl(data.data.url);
      // setCurrentGameProductType(data.data.product_type || "");
      const gameDetail = tcgGameList.find((game) => game.id === gameId);
      setCurrentGameProductType(gameDetail?.product_type || "");
      openIframe(data.data.url);
    } catch (error) {
      setIsGameOpen(false);
      gameManager.endGame(state, gameId);
      console.error("获取游戏链接失败:", error);
      toastCall("获取游戏链接失败，请稍后再试");
    } finally {
      setIsLoadingGameUrl(false);
    }
  };

  const tcgGameExit = async () => {
    await tcgTransferOutAll(
      {
        stopPropagation: () => {},
      },
      currentGameId,
    );
    setIsGameOpen(false);
    gameManager.endGame(state, currentGameId);
    closeIframe();
  };

  const tcgTransferOutAll = async (e, gameId) => {
    e.stopPropagation();
    if (state.user.id === "guest") {
      return;
    }
    setIsLoadingTransferOutAll(true);
    try {
      const response = await fetch(`${apiUrl}/appapi/tcg/transfer_out_by_all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Language": lang,
        },
        body: JSON.stringify({
          uid: state.user.id,
          product_type: currentGameProductType,
          ...(gameId === "all"
            ? {
                type: "all",
              }
            : {
                game_id: gameId,
              }),
        }),
      });
      const data = await response.json();
      if (data.code === 0) {
        toastCall(data.msg || "转出失败，请稍后再试");
        return;
      }
      toastCall("转出成功");
      useGlobalDispatch(
        updateUserDataAction(() => {
          if (gameId === "all") {
            window.location.reload();
          }
        }),
      );
    } catch (error) {
      console.error("转出失败:", error);
      toastCall("转出失败，请稍后再试");
    } finally {
      setIsLoadingTransferOutAll(false);
    }
  };

  const openGame = (gameUrl = null) => {
    setIsTipsOpen(false);
    tcgGetGameUrl(currentGameId, true);
    return;
    //const win = window.open(data.data.url, "_blank");
    //if (win) {
    //  const checkClosed = setInterval(async () => {
    //    if (win.closed) {
    //       await tcgTransferOutAll(
    //        {
    //          stopPropagation: () => {},
    //        },
    //        gameId,
    //      );
    //      clearInterval(checkClosed);
    //    }
    //  }, 500);
    //} else {
    //  alert("Popup blocked. Please allow popups for this site.");
    //}
    //window.open(data.data.url, "_blank");
    openIframe(gameUrl || currentGameUrl);
  };

  const handleGameListUpdate = (list = null) => {
    setTcgCurrentPage(1);
    const fullGameList = list || gameCategoryList;
    const categoryProductList =
      fullGameList.find((item) => item.game_type == tcgGameType)?.product || [];
    const productType = categoryProductList.find(
      (item) => item.id < 0 && item.product_type == tcgProductTypes,
    );
    const gameList = categoryProductList.filter(
      (item) => item.product_type == productType?.product_type && item.id > 0,
    );
    setTcgTotalGames(gameList.length);
    setTcgGameList(gameList);
  };

  useEffect(() => {
    const categoryProductList =
      gameCategoryList.find((item) => item.game_type === tcgGameType)
        ?.product || [];
    const displayList = categoryProductList.filter((item) => item.id < 0);
    setTcgProductTypesDisplay(displayList);
    setTcgProductTypes(0);
  }, [tcgGameType]);

  useEffect(() => {
    handleGameListUpdate();
  }, [tcgProductTypes, tcgGameType]);

  const handleGameTypeChange = (key) => {
    setTcgGameType(key);
    setTcgProductTypes(0);
  };

  useEffect(() => {
    gameManager.setIsCurrentTabOpeningGame(0);
    tcgGetGameCategory();
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      key: "customComponent",
      data: {
        customComponent: () => false,
      },
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      console.log(
        "beforeunload event triggered",
        isGameOpen,
        gameManager.getIsCurrentTabOpeningGame(),
      );
      if (gameManager.getIsCurrentTabOpeningGame()) {
        localStorage.removeItem(gameManager.storageKey);
        const beaconResult = navigator.sendBeacon(
          "/api/tcg/game-session",
          JSON.stringify({
            userId: gameManager.getUserId(state),
            gameId: currentGameId,
            action: "end",
          }),
        );
        console.log("Beacon result for game session end:", beaconResult);
        const beaconResult2 = navigator.sendBeacon(
          `${apiUrl}/appapi/tcg/transfer_out_by_all`,
          JSON.stringify({
            uid: state.user.id,
            product_type: currentGameProductType,
            game_id: currentGameId,
          }),
        );
        console.log("Beacon result for transfer_out_by_all:", beaconResult2);
      }

      //event.preventDefault();
      //event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const TcgPagination = ({
    currentPage,
    totalItems,
    pageSize,
    isMobile = false,
    onPageChange,
  }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pageCount = isMobile ? 3 : 5;

    const startPage = Math.max(
      1,
      Math.min(
        currentPage - Math.floor(pageCount / 2),
        totalPages - (pageCount - 1),
      ),
    );

    const pages = Array.from(
      { length: pageCount },
      (_, i) => startPage + i,
    ).filter((page) => page <= totalPages);

    return (
      <div className="pagination-controls my-6 flex justify-center">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
          >
            &laquo;
          </button>

          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
          >
            ‹
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 flex items-center justify-center border rounded shrink-0 ${
                page === currentPage ? "bg-[#ff367a] text-white font-bold" : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
          >
            ›
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className="w-10 h-10 flex items-center justify-center border rounded disabled:opacity-50 shrink-0"
          >
            &raquo;
          </button>
        </div>
      </div>
    );
  };

  return (
    <HomeTcgMainPageElement main_height={state.navbar.mainHeight}>
      {/* 顶部轮播图 */}
      {/* <ImageCarousel
        adsKey={adsKeys.search_interval}
        threeInOneBanner={!isMobile}
        size="banner_animated"
        is_cover
      /> */}

      {/* 主体内容 */}
      <div className="content-grid">
        {/* 左侧用户信息和功能列表 */}
        <div className="sidebar">
          <div className="user-feature-header">
            <div className="user-panel">
              {isDesktop && (
                <div className="w-auto">
                  <div className="flex type-list">
                    {gameCategoryList.map((category, index) => (
                      <div
                        key={index}
                        className={`inline-block m-1 rounded-lg border ${
                          tcgGameType === category.game_type
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        <button
                          className={`flex flex-col items-center rounded-lg justify-center gap-1 p-2 md:p-3 w-full type-item ${
                            tcgGameType === category.game_type ? "active" : ""
                          }`}
                          onClick={() =>
                            handleGameTypeChange(category.game_type)
                          }
                        >
                          <Image
                            src={
                              tcgGameType === category.game_type
                                // ? category.img_selected
                                ? category.img
                                : category.img
                            }
                            key={`${index}-${tcgGameType === category.game_type ? 1 : 0}`}
                            alt={category.name}
                            width={128}
                            height={128}
                            className="inline-block type-item--image"
                          />
                          <span className="whitespace-nowrap">
                            {category.name}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="user-info">
                <div className="user-name truncate">
                  {state.user.id === "guest" ? "guest" : state.user.nick_name}
                </div>
                <div className="user-money">
                  余额: {getPremiumDiamond(t, state.user.money, false)}
                  <Image
                    src="/images/icons/refresh.png"
                    alt="refresh"
                    width={24}
                    height={24}
                    className={`inline-block cursor-pointer refresh-icon ${
                      state.user.id === "guest" ? "hidden" : ""
                    }`}
                    onClick={(e) => tcgTransferOutAll(e, "all")}
                  />
                </div>
              </div>
              <div className="feature-list">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className={`feature-item ${
                      activeFeatureIndex === index ? "active" : ""
                    }`}
                    onClick={() => {
                      // setActiveFeatureIndex(index);
                      useGlobalDispatch(pushRoutes(item.url));
                    }}
                  >
                    <Image
                      src={`/images/tcg/${item.icon}.png`}
                      alt={item.title}
                      width={128}
                      height={128}
                      className="feature-item--image"
                    />
                    <div className="title">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`w-full gap-2 mb-6 ${isDesktop ? "block" : "flex"}`}
            >
              {!isDesktop && (
                <div className="w-auto">
                  <div className="flex flex-col overflow-x-auto overflow-visible whitespace-nowrap type-list">
                    {gameCategoryList.map((category, index) => (
                      <div key={index} className="inline-block type-item">
                        <button
                          className={`flex flex-col items-center rounded-lg justify-center gap-1 md:gap-2 p-2 md:p-3 w-full ${
                            tcgGameType === category.game_type ? "active" : ""
                          }`}
                          onClick={() =>
                            handleGameTypeChange(category.game_type)
                          }
                        >
                          <Image
                            src={
                              tcgGameType === category.game_type
                                ? category.img
                                : category.img
                            }
                            key={`${index}-${tcgGameType === category.game_type ? 1 : 0}`}
                            alt={category.name}
                            width={128}
                            height={128}
                            className="inline-block type-item--image"
                          />
                          <span
                            className={`md:text-base whitespace-nowrap ${
                              tcgGameType === category.game_type
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {category.name}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 w-auto">
                {tcgProductTypesDisplay &&
                  tcgProductTypesDisplay.length > 0 &&
                  tcgProductTypes === 0 && (
                    <div className="w-auto">
                      <div
                        className="grid game-list"
                        style={{
                          "grid-template-columns": `repeat(${gameCategoryList.find((item) => item.game_type === tcgGameType)?.span_count}, minmax(0, 1fr))`,
                        }}
                      >
                        {!isDesktop && gameCategoryList
                          .find((item) => item.game_type === tcgGameType)
                          ?.product.filter((e) => e.id > 0)
                          ?.slice(
                            0,
                            gameCategoryList.find(
                              (item) => item.game_type === tcgGameType,
                            )?.span_count * 2,
                          )
                          ?.map((game, index) => (
                            <div
                              key={index}
                              className="relative game-item border cursor-pointer text-center "
                              onClick={() =>
                                tcgGetGameUrl(
                                  game.id,
                                  state.user.id !== "guest",
                                )
                              }
                            >
                              <div className="icon text-2xl w-full">
                                <div className="relative rounded-md overflow-hidden icon flex justify-center w-full">
                                  {productTypeLogos[game.product_type] && (
                                    <Image
                                      src={productTypeLogos[game.product_type]}
                                      alt="platform logo"
                                      width={32}
                                      height={32}
                                      className="icon-logo"
                                    />
                                  )}
                                  <ImageComponent
                                    className="icon-img"
                                    key={game.id}
                                    width={64}
                                    height={64}
                                    is_cover={true}
                                    src={game.img?.replace("/zh/", "/EN/")}
                                    alt={game.name}
                                    draggable="false"
                                  />
                                </div>
                              </div>
                              <div className="title font-medium">
                                {game.name}
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className={`product-type-container ${tcgGameType}`}>
                        {tcgProductTypesDisplay.map((type, index) => (
                          <div
                            key={index}
                            className={`cursor-pointer product_type ${
                              tcgProductTypes === type.product_type
                                ? "font-extrabold"
                                : ""
                            } ${!isDesktop && "!w-[100%]"}`}
                            onClick={() =>
                              setTcgProductTypes(type.product_type)
                            }
                          >
                            <ImageComponent
                              // width={354}
                              // height={146}
                              is_cover={true}
                              className="product_type_img"
                              src={
                                gameCategoryList
                                  .find(
                                    (item) => item.game_type === tcgGameType,
                                  )
                                  ?.product.find(
                                    (item) =>
                                      item.id < 0 &&
                                      item.product_type === type.product_type,
                                  )?.img || ""
                              }
                              alt={type.product_code}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {tcgGameType === "HOT" || tcgProductTypes ? (
                  tcgGameList && tcgGameList.length > 0 ? (
                    <div>
                      {!isDesktop && tcgGameType !== "HOT" && (
                        <div className="game-float">
                          <div className="game-navbar">
                            <Image
                              src={`/images/tcg/back.png`}
                              alt="back"
                              width={26}
                              height={46}
                              className="back-icon"
                              onClick={() => {
                                setTcgGameList([]);
                                handleGameTypeChange(tcgGameType);
                              }}
                            />
                            <h5 className="title">
                              {
                                gameCategoryList
                                  .find((item) => item.game_type == tcgGameType)
                                  ?.product?.find(
                                    (i) =>
                                      i.product_type == tcgProductTypes &&
                                      i.id === -1,
                                  )?.product_code
                              }
                              {gameCategoryList.find(
                                (item) => item.game_type === tcgGameType,
                              )?.name || ""}
                            </h5>
                          </div>
                          <div className="grid game-list">
                            {tcgGameList.map((game, index) => (
                              <div
                                key={index}
                                className="relative game-item border cursor-pointer text-center "
                                onClick={() =>
                                  tcgGetGameUrl(
                                    game.id,
                                    state.user.id !== "guest",
                                  )
                                }
                              >
                                <div className="icon text-2xl w-full">
                                  <div className="relative rounded-md overflow-hidden icon flex justify-center w-full">
                                    {productTypeLogos[game.product_type] && (
                                      <Image
                                        src={
                                          productTypeLogos[game.product_type]
                                        }
                                        alt="platform logo"
                                        width={32}
                                        height={32}
                                        className="icon-logo"
                                      />
                                    )}
                                    <ImageComponent
                                      className="icon-img"
                                      // key={game.id}
                                      width={64}
                                      height={64}
                                      is_cover={true}
                                      src={game.img?.replace("/zh/", "/EN/")}
                                      alt={game.name}
                                      draggable="false"
                                    />
                                  </div>
                                </div>
                                <div className="title font-medium">
                                  {game.name}
                                </div>
                              </div>
                            ))}
                          </div>
                          <TcgPagination
                            currentPage={tcgGameCurrentPage}
                            totalItems={tcgTotalGames}
                            pageSize={tcgGamePageSize}
                            isMobile={isMobile}
                            onPageChange={setTcgCurrentPage}
                          />
                        </div>
                      )}
                      <div>
                        {isDesktop && tcgGameType !== "HOT" && (
                          <div className="game-title">
                            {
                              gameCategoryList
                                .find((item) => item.game_type == tcgGameType)
                                ?.product?.find(
                                  (i) =>
                                    i.product_type == tcgProductTypes &&
                                    i.id === -1,
                                )?.product_code
                            }
                            {gameCategoryList.find(
                              (item) => item.game_type === tcgGameType,
                            )?.name || ""}
                          </div>
                        )}
                        <div className="grid game-list">
                          {tcgGameList.map((game, index) => (
                            <div
                              key={index}
                              className="relative game-item border cursor-pointer text-center "
                              onClick={() =>
                                tcgGetGameUrl(
                                  game.id,
                                  state.user.id !== "guest",
                                )
                              }
                            >
                              <div className="icon text-2xl w-full">
                                <div className="relative rounded-md overflow-hidden icon flex justify-center w-full">
                                  {productTypeLogos[game.product_type] && (
                                    <Image
                                      src={productTypeLogos[game.product_type]}
                                      alt="platform logo"
                                      width={32}
                                      height={32}
                                      className="icon-logo"
                                    />
                                  )}
                                  <ImageComponent
                                    className="icon-img"
                                    // key={game.id}
                                    width={64}
                                    height={64}
                                    is_cover={true}
                                    src={game.img?.replace("/zh/", "/EN/")}
                                    alt={game.name}
                                    draggable="false"
                                  />
                                </div>
                              </div>
                              <div className="title font-medium">
                                {game.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      暂无游戏
                    </div>
                  )
                ) : null}
              </div>
            </div>
            {(tcgProductTypes !== 0 || tcgGameType === "HOT") && (
              <TcgPagination
                currentPage={tcgGameCurrentPage}
                totalItems={tcgTotalGames}
                pageSize={tcgGamePageSize}
                isMobile={isMobile}
                onPageChange={setTcgCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
      <TcgRegisterPopupModal
        open={isOpenLogin}
        onRegisterSuccess={() => {
          setIsOpenLogin(false);
        }}
      />
      <TcgTipsModal
        open={isTipsOpen}
        onClose={() => {
          setIsTipsOpen(false);
        }}
        onOpenGame={() => {
          openGame();
        }}
        isLoading={isLoadingGameUrl}
      />

      <FullPageIframe
        url={currentUrl}
        isOpen={isOpen}
        onClose={tcgGameExit}
        title=""
      />

      <LoadingComponent
        isLoading={isLoadingGameUrl || isLoadingTransferOutAll}
      />
    </HomeTcgMainPageElement>
  );
};

export default HomeTcgMainPage;

export const HomeTcgMainPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
  // padding: 0 ${side_padding}px;
  padding-top: ${main_height}px;

  .carousel {
    margin-top: 16px;
    margin-bottom: 20px;
  }

  .content-grid {
    display: flex;
    justify-content: center;
    gap: 16px;
    width: 100%;
    flex-wrap: wrap;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  .user-feature-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    // border-radius: 10px;
    // padding: 10px;
    gap: 20px;
    width: 100%;

    .user-panel {
      display: flex;
      align-items: center;
      // border-radius: 0.5rem;

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        // border-right: 1px solid #ccc7cd;
        // padding-right: 2rem;
        // margin-right: 2rem;
        font-family: "Microsoft YaHei";
        color: rgb(255, 255, 255);
        font-size: 18px;

        .user-name {
          font-weight: bold;
        }

        .user-money {
          filter: brightness(0) invert(1);
          margin-top: 5px;
        }
      }

      .feature-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 2px solid transparent;
          border-radius: 10px;
          background-color: #f3f3f3;
          cursor: pointer;
          transition: all 0.3s;

          .icon {
            font-size: 24px;
          }
          .title {
            font-family: "Microsoft YaHei";
            color: rgb(51, 51, 51);
            line-height: 1;
            text-align: center;
          }

          &.active {
            border-color: #ff9900;
            background-color: #fff7e6;
          }
        }
      }
    }
  }

  .category-game-list {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 200px;

    .category-item {
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 10px;
      cursor: pointer;
      text-align: center;
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      transition: background-color 0.3s;
      flex-shrink: 0;
      min-width: 100px;

      &.active {
        background-color: #fff7e6;
      }

      .category-title {
        font-size: 16px;
      }
    }
  }

  .game-list {
    flex: 1;
    display: grid;
    // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    justify-content: center;
    // max-width: 1000px;
    margin: 0 auto;
    width: 100%;

    .game-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      // background: #fafafa;
      // max-height: 108px;
      // padding: 16px;
      // border-radius: 10px;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .icon {
        font-size: 30px;
        .icon-logo {
          z-index: 9;
          position: absolute;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          padding: 0.4vw;
          object-fit: contain;
        }
      }

      .title {
        margin-top: 8px;
        font-size: 16px;
      }
    }
  }

  .product-type-container {
    display: flex;
    justify-content: start;
    width: auto;
    flex-wrap: wrap;
    position: relative;
    margin: 0 0 0 auto;

    .product_type {

      .product_type_img {
        height:100%;
        width:100%;
        position: relative;
        padding-bottom: 0;
      }
    }
  }


  @media (min-width: 1025px) {

    .user-panel{
        justify-content: space-between !important;
        background: linear-gradient(to right, #ffffff,#d18fd7,#873fdb);
        width: 100%;
        padding: 0.63vw 11.98vw;
    }

    .user-info {

      .user-name {
      }

      .user-money {
        margin-top: 5px;
        font-size: 0.83vw;

        .refresh-icon{
          height:0.78vw;
          width:0.78vw;
          margin-left:  0.63vw;
        }
      }
    }

    .type-list{
      .type-item{
        height:2.08vw;
        min-width:6.77vw;  
        border-radius:0.26vw;
        font-size: 0.83vw;
        font-weight: 700;
        font-family: "Microsoft YaHei";
        color: #333333;
        background: #f3f3f3;
        flex-direction: row;

        &.active {
          background: linear-gradient(to right, #335fc2,#863fdb);
          color: rgb(255, 255, 255);
        }

        .type-item--image{
          height: 1.56vw;
          width: auto;
        }
      }
    }

    .feature-list {
      gap:0.36vw !important;

      .feature-item {
        width: 3.65vw;
        height: 4.38vw;
        padding: 0 !important;

        .feature-item--image{
          height: 2.4vw;
          width: auto;
        }

        .title{
          font-size: 0.83vw !important;
          margin-top: 0.13vw !important;
        }
      }
    }

    .game-title{
      margin: 0.85vw 11.98vw 1.4vw;
      font-size: 0.829vw;
      font-weight: 700;
      color: #343434;
    }

    .game-list {
      gap: 0.18vw 0.83vw;
      // max-width: 76.04vw;
      margin: 0 11.98vw;
      width: 76.04vw;
      grid-template-columns: repeat(8, minmax(0, 1fr));

      .game-item {

        .icon {
          .icon-logo {
            height: 2vw;
            width: auto;
          }
          .icon-img {
              height: 8.85vw;
              width: 8.85vw;
              border-radius: 0.67vw;
          }
        }

        .title {
          font-size: 0.73vw;
          margin-top: 0.05vw !important;
          margin-bottom: 0.38vw;
          display:flex;
          align-items:center;
          min-height: 2.29vw;
        }

      }
    }

    .product-type-container{
      margin: 0 11.98vw;
      gap: 0.63vw; 

      &.RNG {
        gap: 0.78vw; 
        .product_type {
          width: 12.00vw;
          height: 10.21vw;
        }
      }

      .product_type{
        height: 7.6vw;
        width: 18.44vw;
        position: relative;

        .product_type_img{

        }
      }
    }

  }
  @media (max-width: 1024px) {

    .content-grid {
      flex-direction: column;
      margin-bottom: 67px;
    }

    .category-game-list {
      flex-direction: column;
    }

  
    .user-feature-header {
      padding: 0 2.67vw 8vw;
      margin : 4vw 0 0vw;
      gap: 5.5vw;

      .user-panel {
        padding: 2vw 1vw 1.6vw !important;
        // padding: 2vw 3.07vw 1.6vw 6.93vw !important;
        background: linear-gradient(to bottom right, #ee51ab, #873fdb);
        background: url('/images/tcg/user-panel-bg.png') no-repeat center center !important;
        background-size: cover !important;
        border-radius: 0.67vw;
        justify-content: space-between;
        width: 100%;

        .user-info {
          line-height: 0.917;
          margin: auto;
          // padding-right: 1vw;
          .user-name{
            font-size: 3.2vw;
            margin-bottom: 1.2vw;
          }
          .user-money{
            font-size: 3.2vw;
            display:flex;
            align-items:center;
            width: max-content;

            .refresh-icon{
              height:3.2vw;
              width:3.2vw;
              margin-left: 1.6vw;
            }
          }
        }

        .feature-list {
          justify-content: space-between;
          flex-wrap: nowrap !important;
          gap: 1.5vw !important;

          .feature-item {
            width: 13.25vw !important;
            height: 16.93vw !important;
            padding: 0 !important;

            .feature-item--image{
              height: 8vw;
              width: auto;
            }

            .title{
              font-size: 2.93vw !important;
              margin-top: 1.13vw !important;
            }
          }
        }
      }
    }

    .game-float{
      position: fixed;
      width: 100vw;
      max-width: 100vw;
      height: 100vh;
      z-index: 67;
      left: 0px;
      top: 0px;
      overflow-y: auto;
      background-color: rgb(255, 255, 255);

      .game-navbar{
        
        box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.17);
        height: 14.67vw;
        width: 100%;
        position: fixed;
        top:0;
        left:0;
        z-index: 68;
        background-color: rgb(255, 255, 255);

        .back-icon{
          position: absolute;
          left: 2.67vw;
          top: 4.27vw;
          width: 3.47vw;
          height: 6.13vw;
          z-index: 68;
        }

        .title{
          font-size: 4vw;
          font-family: "Microsoft YaHei";
          color: rgb(51, 51, 51);
          line-height: 0.733;
          text-align: center;
          display:flex;
          justify-content:center;
          align-items: center;
          height: 100%;
        }
      }

      .game-list{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2vw;
        width: 100%;
        max-width: 100%;
        margin: 24.07vw 0 0;
        padding: 0 2.667vw; 
        box-sizing: border-box;

        .game-item {
          width: 22.13vw;
          min-height: 29vw;
          margin-bottom: 0vw;

          .icon{
            .icon-logo {
              display: none;
            }
            .icon-img{
                height: 22.27vw;
                width: 100%;
                border-radius: 0.67vw;
            }
          }

          .title {
            margin-top: 1.2vw;
            line-height: 1.217;
          }

        }
      }
    }


    .game-list {
      gap: 0 2.13vw;
      width:71.87vw;
      max-width:71.87vw;
      position:relative;
      margin: 0 0 0 auto;
      grid-template-columns: repeat(3, minmax(0, 1fr));

      .game-item {
        // width: 22.67vw;
        min-height: 29.23vw;
        margin-bottom: 2vw;

        .icon{
          .icon-logo {
            display: none;
          }
          .icon-img{
              height: 22.67vw;
              width: 100%;
              border-radius: 0.67vw;
          }
        }

        .title{
          font-family: "Microsoft YaHei";
          color: rgb(51, 51, 51);
          font-size:3.2vw;
          display: flex;
          align-items: center;
          min-height: 5.4vw;
          margin-top: 1.5vw;
        }

      }
    }

    .type-list{
      width: 20.67vw;
      .type-item{
        height: 20.67vw;
        width: 20.67vw;
        margin-bottom: 1.07vw;

        button {
          height: 100%;
          width: 100%;
          background: url('/images/tcg/type-inactive.png') no-repeat center center !important;
          background-size: cover !important;

          &.active {
            background: url('/images/tcg/type-active.png') no-repeat center center !important;
            background-size: cover !important;
          }
        }

        .type-item--image{
          height: 11.47vw;
          width: auto;
        }
      }
    }

    .product-type-container{
      margin-left: auto;
      justify-content: flex-start;
      gap: 2.27vw ; 

      &.RNG {
        gap: 2.13vw 2.1vw; 
        .product_type {
          width: 34.67vw !important;
          height: 29.33vw;
        }
      }

      .product_type{
        height: 29.33vw;
        width: 71.73vw !important;
        position: relative;

        .product_type_img{
          border-radius:0.67vw;
        }
      }
    }
      
    .pagination-controls{
      margin: 4vw 0 10vw;
    }

    @media (max-width: 425px) {
    .user-feature-header {
      margin : 4vw 0 16.8vw;
    }

  `}
`;

export const TcgRegisterPopupModal = ({ open, onRegisterSuccess }) => {
  const { state } = useGlobalContext();
  const [isOpen, setIsOpen] = useState(open);
  const [usernameRef] = useState(null);
  const [userpasswordRef] = useState(null);
  const [tcgUserName, setTcgUserName] = useState("");
  const [tcgUserPassword, setTcgUserPassword] = useState("");

  const closeModal = () => {
    setTcgUserName("");
    setTcgUserPassword("");
    setIsOpen(false);
  };

  const handleUserNameChange = (e) => {
    setTcgUserName(e.target.value);
  };

  const tcgUserSignup = async () => {
    const userId = state.user.nickname;
    if (userId === "guest") {
      useGlobalDispatch(openPopup("login"));
      return;
    }
    const payload = {
      bh5_user_id: userId,
      username: tcgUserName,
      password: tcgUserPassword,
    };
    try {
      const response = await tcgAxios.post(`/create_user`, payload);
      if (response.data.status !== 0) {
        toastCall(
          response.data.error_desc ||
            response.data.message ||
            "注册失败，请稍后再试",
        );
        return;
      }
      onRegisterSuccess();
    } catch (error) {
      console.error("注册失败:", error);
    }
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <PopupDialogWrapper>
        <div className="card-container">
          <div className="close-cont" onClick={closeModal}>
            <FontAwesomeIcon
              className="close-icon"
              icon={faX}
              style={{ color: "#434343" }}
            />
          </div>
          <div className="card-header">
            <h3 className="title-text">注册</h3>
            <p className="subtitle-text hidden">
              have account?
              <span className="green cursor-pointer">Login</span>
            </p>
          </div>
          <div>
            <div className="form-item">
              <label className="form-label">用户名</label>
              <div className="input_content_box">
                <IconInput
                  ref={usernameRef}
                  name="tcgUserName"
                  inputType="text"
                  value={tcgUserName}
                  callback={handleUserNameChange}
                  placeholder="请输入用户名"
                  enterKeyHint="next"
                />
              </div>
            </div>
          </div>
          <div className="form-item">
            <label className="form-label">密码</label>
            <div className="input_content_box">
              <IconInput
                ref={userpasswordRef}
                name="tcgUserPassword"
                inputType="password"
                value={tcgUserPassword}
                callback={(e) => setTcgUserPassword(e.target.value)}
                placeholder="请输入密码"
                enterKeyHint="done"
              />
            </div>
            <div className="btn-wrapper mt-3" onClick={tcgUserSignup}>
              <button className="submit-btn">注册</button>
            </div>
          </div>
        </div>
      </PopupDialogWrapper>
    </div>
  );
};

const TcgTipsModal = ({ open, onClose, onOpenGame, isLoading }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <PopupDialogWrapper>
        <div className="card-container">
          <div className="close-cont" onClick={onClose}>
            <FontAwesomeIcon
              className="close-icon"
              icon={faX}
              style={{ color: "#434343" }}
            />
          </div>
          <div className="card-header">
            <h3 className="title-text">温馨提示</h3>
          </div>
          <div className="card-body">
            <p>您尚未創建帳號，請先前往創建帳號並且綁定信箱。</p>
            <div className="flex gap-2 mt-3">
              <button className="submit-btn p-3" onClick={onOpenGame}>
                {isLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isLoading ? "加载中..." : "继续游戏"}
              </button>
              <button
                className="submit-btn p-3"
                onClick={() => {
                  useGlobalDispatch(openPopup("login"));
                  onClose();
                }}
              >
                前往创建账号
              </button>
            </div>
          </div>
        </div>
      </PopupDialogWrapper>
    </div>
  );
};
