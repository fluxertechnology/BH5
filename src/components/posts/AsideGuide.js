import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { useLocation } from "react-router";

import { colors, profileFeedback,profileService, pageUrlConstants,officialContact,downloadPage,userRank} from "@/lib/constants/index.js";
import WavaButton from "@/components/layout/Header/WavaButton";

import postIcon from "public/images/post/post_nor.png";
import { main_height } from "@/components/layout/Header/TopBarContainer";
import { Grid } from "@mui/material";
import LinkComponent from "@/components/common/LinkComponent";
import { useDispatch } from "react-redux";
import { pushRoutes } from "@/store/actions/historyActions";
import { nowLang } from "@/i18n/Metronici18n";

const { home, profile } = pageUrlConstants;

const AsideGuide = ({ labelList, callback, floatBtnClick, user, showTip }) => {
    const t = useTranslations();
    const postDescriptionRef = useRef();
    const dispatch = useDispatch();
    const AsideGuidRef = useRef();
    const location = useLocation();
    const [labelListKey] = useState(Object.keys(labelList));
    const [nowKey, setNowKey] = useState(labelListKey[0]);
    const [showPostTip, setShowPostTip] = useState(showTip);
    const [status, setStatus] = useState();
    let urlItems = [
        {
            text: intl.formatMessage({
                id: "PROFILE.MAIN.OPTION.COMMON_PROBLEM",
            }),
            onClick: () => window.open(profileService),
        },
        {
            text: intl.formatMessage({
                id: "PROFILE.MAIN.OPTION.CONTACT_US",
            }),
            onClick: () => window.open("mailto: cs@bbacgn.com"),
        },
        {
            text: intl.formatMessage({
                id: "PROFILE.FEEBACK.LABEL.FEEBACK",
            }),
            onClick: () => window.open(profileFeedback),
        },
    ];
    let serviceTerms = [
        {
            text: intl.formatMessage({
                id: "PC.FOOTER.USER.PRIVACY.POLICY",
            }),
            url: {
                name: home.pages.homeProtocol.pages.homeEULA.name,
                path: home.pages.homeProtocol.pages.homeEULA.path,
            },
        },
        {
            text: intl.formatMessage({
                id: "PC.FOOTER.USER.SERVICES.AGREEMENT",
            }),
            url: {
                name: home.pages.homeProtocol.pages.homeTSM.name,
                path: home.pages.homeProtocol.pages.homeTSM.path,
            },
        },
    ];
    let otherTerms = [
        {
            text: intl.formatMessage({
                id: "GLOBAL.ACTION.DOWNLOAD.APP",
            }),
            url: downloadPage[1],
        },
        {
            text: intl.formatMessage({
                id: "PROFILE.MAIN.OPTION.OFFICIAL_FRIEND_GROUP",
            }),
            url: officialContact,
        },
    ];

    useEffect(() => {
        //對應的身分組發送貼文完顯示提示
        if (user.rank === userRank[0] && showTip) {
            setShowPostTip(true);
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "flex";
            setTimeout(() => {
                setShowPostTip(false);
                setTimeout(() => {
                    if (postDescriptionRef.current)
                        postDescriptionRef.current.style.display = "none";
                }, 1550);
            }, 6000);
        } else {
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "none";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTip]);

    useEffect(() => {
        //如果沒有這個點選提示後會有一個小BUG 會因為沒有DISPLAY NONE 點不到後面的東西
        if (showPostTip && showTip) {
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "flex";
        } else {
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "none";
        }
    }, [showPostTip]);

    useEffect(() => {
        if (AsideGuidRef.current) {
            AsideGuidRef.current.style.minHeight =
                window.innerHeight - main_height - 10 + "px";
        }
    }, [window.innerHeight]);

    useEffect(() => {
        for (let i = 0; i < labelListKey.length; i++) {
            if (location.pathname.indexOf(labelListKey[i]) !== -1) {
                setNowKey(labelListKey[i]);
                return;
            } else if (!location.pathname.split("/")[3]) {
                setNowKey(labelListKey[0]);
                return;
            }
        }
        setNowKey(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const handleChange = (newValue) => {
        setNowKey(newValue);
        callback(newValue);
    };

    return (
        <AsideGuideElement ref={AsideGuidRef}>
            {labelListKey.map((labelKey) => {
                return (
                    <div
                        onMouseEnter={() => setStatus(labelKey)}
                        onMouseLeave={() => setStatus("")}
                        className={`aside_container ${labelKey === nowKey && "active"}`}
                        key={labelKey}
                        onClick={() => {
                            handleChange(labelKey);
                        }}
                    >
                        <img
                            src={
                                labelKey === nowKey || status === labelKey
                                    ? labelList[labelKey].pressIcon
                                    : labelList[labelKey].icon
                            }
                            alt={labelList[labelKey].name}
                        />
                        <div
                            length={labelListKey.length}
                            value={labelKey}
                            label={labelList[labelKey].name}
                        >
                            {labelList[labelKey].name}
                        </div>
                    </div>
                );
            })}
            <div className="create_post">
                <div
                    ref={postDescriptionRef}
                    className={`create_post_tip  ${showPostTip && " open"}`}
                    onClick={() =>
                        dispatch(
                            pushRoutes(profile.pages.profileBuyVip.pages.profileBuyVipCommon)
                        )
                    }
                >
                    想赚取金币或精钻，立即开通VIP或成为原创主
                </div>
                <div className="wava_button_container" onClick={floatBtnClick}>
                    <WavaButton className="wava_button">
                        <img src={postIcon} alt="Post Icon" />
                        {intl.formatMessage({ id: "POST.POST_ARTICLE" })}
                    </WavaButton>
                </div>
            </div>
            <footer className="aside_footer">
                <ol>
                    <Grid
                        className="aside_footer_item"
                        container
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                    >
                        {urlItems.map((data) => (
                            <Grid item key={data.text} onClick={data.onClick}>
                                {data.text}
                            </Grid>
                        ))}
                        {serviceTerms.map((data) => (
                            <Grid item key={data.text}>
                                <LinkComponent routes={data.url} className="link">
                                    {data.text}
                                </LinkComponent>
                            </Grid>
                        ))}
                        {otherTerms.map((data) => (
                            <Grid item key={data.text} onClick={() => window.open(data.url)}>
                                {data.text}
                            </Grid>
                        ))}
                    </Grid>

                    {nowLang === "zh" ? (
                        <>
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
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </ol>
            </footer>
        </AsideGuideElement>
    );
};

export default AsideGuide;

export const AsideGuideElement = styled.div`
  /*  */
  position: relative;
  padding: 1% 15px;
  max-width: 300px;
  .aside {
    &_container {
      display: flex;
      flex-direction: row !important;
      margin-top: 1.5em;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      white-space: nowrap;

      img {
        width: 25px;
        height: 25px;
        padding: 10px;
      }

      div {
        padding: 10px;
        color: ${colors.text_grey};
      }
      &:hover {
        transition: 1s;
        background-color: ${colors.back_grey};
        border-radius: 10px;
        div {
          color: ${colors.back_dark_pink};
        }
      }
      &.active {
        transition: 1s;
        div {
          color: ${colors.back_dark_pink};
        }
      }
    }

    &_footer {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      padding: 0px 15px;

      li {
        color: ${colors.text_light_grey};
        font-size: 12px;
        white-space: pre-wrap;
      }
      &_item {
        font-size: 12px;
        color: ${colors.text_light_grey};
        margin-bottom: 10px;
        cursor: pointer;
      }
    }
  }
  .create_post {
    position: relative;
    .wava_button {
      cursor: pointer;
      width: 100%;
      border-radius: 25px;
      text-decoration: none;
      color: #fff;
      background-color: ${colors.dark_pink};
      text-align: center;
      display: flex;
      padding: 10px 0px;
      gap: 5px;
      justify-content: center;
      align-items: center;
      &_container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.5em;
        img {
          width: 25px;
          height: 25px;
        }
      }
    }
    &_tip {
      position: absolute;
      top: -80px;
      left: 15%;
      right: 15%;
      border-radius: 5px;
      background: #39b3fd;
      padding: 8px;
      color: #fff;
      white-space: initial;
      font-size: 12px;
      opacity: 0%;
      transition: 1s;
      cursor: pointer;
      &.open {
        opacity: 100%;
        &::after {
          position: absolute;
          top: 0px;
          left: 35%;
          right: 35%;
          bottom: -10px;
          z-index: -1;
          clip-path: polygon(50% 100%, 0 0, 100% 0);
          content: "";
          background: #39b3fd;
        }
      }
    }
  }

  .link {
    cursor: pointer;
    display: block;
    text-decoration: none;
    white-space: nowrap;
    color: ${colors.text_light_grey};
    align-self: center;
  }
`;
