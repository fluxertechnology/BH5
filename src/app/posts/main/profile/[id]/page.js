"use client";

import { useEffect, useLayoutEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";
import TopBarContainer, { main_height } from "@/components/layout/Header/TopBarContainer";
import { colors } from "@/lib/constants/index.js";
import TopTitleBar from "@/components/common/TopTitleBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslations } from "next-intl";
import ImageComponent from "@/components/common/ImageComponent";
import WavaButton from "@/components/layout/Header/WavaButton";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import PostCardItem from "@/components/posts/PostCardItem";
import callToast from "@/lib/services/toastCall.js";
import { CSSTransition } from "react-transition-group";

import { useGlobalContext, useGlobalDispatch } from "@/store";
import { getPostListAction, postGetProfile } from '@/store/actions/pages/postsProfileAction.js'
import {
    postAttentionEventAction,
    postPayEventAction,
    postScribeEventAction,
  } from "@/store/actions/pages/postCardItemAction.js";

import { useParams } from 'next/navigation'
import Image from "next/image";

const vip_icon = "/images/post/vip_icon.png";
const male_icon = "/images/icons/male.svg";
const female_icon = "/images/icons/female.svg";
const more_icon = "/images/icons/more_icon.png";
const girl404 = "/images/imgPlaceholder/girl404.png";

const PostsProfilePage = ({

}) => {

    const { state } = useGlobalContext();
    const params = useParams()

    const localState = useMemo(() => {
        return {
            user: state.user,
            postProfile: state.postProfile || [],
            router: params.id,
        };
    }, [state])

    const {
        nick_name,
        avatar,
        vip,
        sex,
        is_creation,
        is_attention,
        fans_count = 0,
        attention_count = 0,
        post_count = 0,
        is_subscript,
        is_owner,
        monthly_price,
        yearly_price,
    } = localState.postProfile.profile;

    const t = useTranslations();
    const { isMobile } = useMediaQuery();
    const [showDonate, setShowDonate] = useState();
    const [showMore, setShowMore] = useState(false);
    const [showScribe, setShowScribe] = useState(false);
    const [donateSuccessShow, setDonateSuccessShow] = useState(false);
    const [showNoScribe, setShowNoScribe] = useState(false);
    const [donateGold, setDonateGold] = useState(null);
    const [moreSettingList, setMoreSettingList] = useState(() => [
        {
            text: "复制分享链接",
            onClick: () => handleCopy(),
        },
        {
            text: "检举",
            onClick: () => onReport(),
        },
        {
            text: is_attention ? "取消关注" : "关注",
            onClick: () => postCardAttentionEvent(localState.postProfile.profile),
        },
        {
            text: "取消",
            onClick: () => setShowMore(false),
        },
    ]);

    const [nowGuide, setNowGuide] = useState(0);
    const [contentGuide, setContentGuide] = useState(() => [
        {
            title: t('Global.all'),
            key: "total",
        },
        {
            title: t('Global.payment'),
            key: "is_topay",
        },
        {
            title: t('Global.subscribe'),
            key: "is_subscription",
        },
    ]);

    useLayoutEffect(() => {
        initPostListAction(nowGuide);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nowGuide, localState.router]);

    useLayoutEffect(() => {
        if (localState.router) postGetProfileAction(contentGuide[nowGuide].key);
        return () => {
            cleanProfile();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localState.router]);

    const postGetProfileAction = () => {
        useGlobalDispatch(postGetProfile());
    }
    const cancelToBack = () => {
        useGlobalDispatch(backRoutes());
    }
    const cleanProfile = () => {
        useGlobalDispatch({ type: "CLEAN_POST_PROFILE" });
    }
    const backRoutes = () => {
        useGlobalDispatch(backRoutes());
    }
    const getPostListActionFunction = (scrollColdEnd = () => { }, type) => {
        useGlobalDispatch(getPostListAction(scrollColdEnd, "", type));
    }
    const initPostListAction = (type) => {
        useGlobalDispatch(getPostListAction(() => { }, "init", type));
    }
    const postCardAttentionEvent = (data) => {
        if (state.user.id === "guest") {
            useGlobalDispatch(pushRoutes(login));
        } else {
            useGlobalDispatch(
                postAttentionEventAction({
                    uid: data.id,
                    is_attention: data.is_attention,
                })
            );
        }
    }
    const toEditOwner = () => {
        useGlobalDispatch(
            pushRoutes(
                pageUrlConstants.profile.pages.profileEdit.pages.profileEditInfo
            )
        );
    }
    const postCardScribeMediaEvent = (data, type) => {
        if (state.user.id === "guest") {
            useGlobalDispatch(pushRoutes(login));
        } else {
            useGlobalDispatch(postScribeEventAction({ uid: data.id }, type));
        }
    }
    const pushToNew = () => {
        useGlobalDispatch(pushRoutes(pageUrlConstants.post.pages.postMain));
    }
    const postCardDonateEvent = (
        data = "",
        gold,
        callback,
        action = 3,
        pay_type = 1
    ) => {
        //data 不傳代表不打賞對應貼文
        if (state.user.id === "guest") {
            useGlobalDispatch(pushRoutes(login));
        } else {
            useGlobalDispatch(postPayEventAction(data, gold, callback, action, pay_type));
        }
    }

    useEffect(() => {
        if (typeof window == 'undefined') return;
        window.addEventListener("scroll", scrollEvent);
        return () => {
            window.removeEventListener("scroll", scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (is_creation) {
            setContentGuide(() => [
                {
                    title:  t('Global.all'),
                    key: "total",
                },
                {
                    title: t('Global.payment'),
                    key: "is_topay",
                },
                {
                    title: t('Global.subscribe'),
                    key: "is_subscription",
                },
            ]);
        } else {
            setContentGuide(() => [
                {
                    title:  t('Global.all'),
                    key: "total",
                },
                {
                    title: t('Global.payment'),
                    key: "is_topay",
                },
            ]);
        }
    }, [is_creation]);

    useEffect(() => {
        if (is_attention) {
            const newTemp = moreSettingList;
            newTemp[2].text = "取消关注";
            setMoreSettingList([...moreSettingList]);
        } else {
            const newTemp = moreSettingList;
            newTemp[2].text = "关注";
            setMoreSettingList([...moreSettingList]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_attention]);

    function scrollEvent() {
        scrollBottomCallEvent((scrollColdEnd) => {
            if (!localState.postProfile.isDone) {
                getPostListActionFunction(scrollColdEnd);
            }
        });
    }

    function onChangeSelect(e) {
        const value = e.target.getAttribute("value");
        setNowGuide(
            contentGuide.findIndex((_, index) => index === parseInt(value))
        );
    }

    function onClickMore() {
        setShowMore((pre) => !pre);
    }

    function onReport() {
        onClickMore();
        callToast("检举成功(´;ω;`)");
    }

    function handleCopy() {
        if (typeof window == 'undefined') return;
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => callToast("复制成功(´;ω;`)"))
            .catch(() => callToast("复制失败(´;ω;`)"));
        onClickMore();
    }

    function donateGoldEvent() {
        postCardDonateEvent("", donateGold, () => {
            setShowDonate(false);
            setDonateSuccessShow(true);
            setTimeout(() => {
                setDonateSuccessShow(false);
            }, 3000);
            setTimeout(() => {
                setDonateGold(null);
            }, 3200);
        });
    }
    function onSubscribe(type) {
        setShowScribe((pre) => !pre);
        if (type) {
            postCardScribeMediaEvent(localState.postProfile.profile, type);
        }
    }

    const nodeRef = useRef(null);
    return (
        <PostsProfilePageElement>
            <PostsProfilePageCover>
                {/* 打賞 */}
                <CSSTransition
                    timeout={200}
                    in={showDonate}
                    classNames="CSSTransition_opacity"
                    unmountOnExit
                    key="CSSTransition_show_donate"
                    nodeRef={nodeRef}
                >
                    <div className="float_cover">
                        <div className="float_cover_container">
                            <div className="float_cover_container_title">
                                <p className="float_cover_container_title_text">
                                    {t('Post.thx_support')}
                                </p>
                            </div>
                            <div className="float_cover_container_content">
                                <input
                                    className="float_cover_container_content_input"
                                    type="number"
                                    step="1"
                                    placeholder={t('Post.placeholder_donate_money')}
                                    value={donateGold}
                                    onChange={(e) => {
                                        setDonateGold(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="float_cover_container_btn">
                                <div
                                    className="float_cover_container_btn_button heightlight"
                                    onClick={() => {
                                        donateGoldEvent();
                                    }}
                                >
                                    <span className="float_cover_container_btn_button_text">
                                        {t('Post.placeholder_donate_diamond')}
                                    </span>
                                </div>
                                <div
                                    className="float_cover_container_btn_button"
                                    onClick={() => {
                                        setShowDonate(false);
                                    }}
                                >
                                    <span className="float_cover_container_btn_button_text">
                                        {t('Post.placeholder_think_again')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                {/* 訂閱解鎖 */}
                <CSSTransition
                    timeout={200}
                    in={showScribe}
                    classNames="CSSTransition_scribe"
                    unmountOnExit
                    key="CSSTransition_show_scribe"
                    nodeRef={nodeRef}
                >
                    <div className="subscribe_cover" onClick={() => setShowScribe(false)}>
                        <div
                            className="subscribe_cover_container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="subscribe_cover_container_title">订阅解锁</div>
                            <div className="subscribe_cover_container_content">
                                {nick_name} <br />
                                {post_count}贴文・{fans_count}粉丝数
                            </div>
                            <div className="subscribe_cover_container_content">
                                订阅可以查看创作者所有「私密贴文」，更加亲近你喜爱的创作者
                            </div>
                            <div
                                className="subscribe_cover_container_btn"
                                onClick={() => onSubscribe(1)}
                            >
                                <div>訂閱</div>
                                <div>
                                    {monthly_price
                                        ? monthly_price + " 精钻/月"
                                        : "此原创主尚未设定"}
                                </div>
                            </div>
                            <div
                                className="subscribe_cover_container_btn"
                                onClick={() => onSubscribe(2)}
                            >
                                <div>訂閱</div>
                                <div>
                                    {yearly_price
                                        ? yearly_price + " 精钻/年"
                                        : "此原创主尚未设定"}
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                {/* 訂閱金額=null或是沒發過訂閱貼文提示 */}
                <CSSTransition
                    timeout={200}
                    in={showNoScribe}
                    classNames="CSSTransition_scribe"
                    unmountOnExit
                    key="CSSTransition_show_scribe_no_post"
                    nodeRef={nodeRef}
                >
                    <div
                        className="no_subscribe_cover"
                        onClick={() => setShowNoScribe(false)}
                    >
                        <div
                            className="no_subscribe_cover_container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="no_subscribe_cover_container_title">感谢支持</div>
                            <div className="no_subscribe_cover_container_content">
                                您要支持的原创主还未发布过订阅贴文，可以打赏她当作创作基金(人-ω◕)
                            </div>
                            <div
                                className="no_subscribe_cover_container_btn"
                                onClick={() => setShowNoScribe(false)}
                            >
                                我知道了
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                    timeout={200}
                    in={donateSuccessShow}
                    classNames="CSSTransition_scribe"
                    unmountOnExit
                    key="CSSTransition_show_donate_thanks"
                    nodeRef={nodeRef}
                >
                    <div
                        className={`post_card_body_media_donate_cover`}
                        onClick={() => setDonateSuccessShow(false)}
                    >
                        <div className="post_card_body_media_donate_cover_container">
                            打赏 {donateGold} 精钻，感谢你的爱~
                        </div>
                    </div>
                </CSSTransition>
            </PostsProfilePageCover>
            <TopBarContainer not_fixed={!isMobile} z_index={5} main_height={main_height}>
                <TopTitleBar
                    title={nick_name ?? 'null'}
                    showBack={true}
                    show_back_color={"#000"}
                    back_color={"#fff"}
                    color={"#000"}
                >
                    <Image
                        width={30}
                        height={31}
                        src={more_icon}
                        alt="more"
                        className="more"
                        onClick={onClickMore}
                    />
                    <div className={`more_setting ${showMore && "active"}`}>
                        {moreSettingList.map((item, index) => (
                            <div
                                key={"setting" + index}
                                className="more_setting_item"
                                onClick={item.onClick}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                </TopTitleBar>
            </TopBarContainer>
            <PostsProfileInformation>
                <section className="post_information">
                    <div className="post_information_avatar">
                        <ImageComponent
                            is_cover={true}
                            src={avatar}
                            alt={nick_name}
                            title={nick_name}
                            cursor="default"
                            border_radius="50%"
                            lazyLoad={false}
                        />
                        {avatar && (
                            <Image
                                width={25}
                                height={25}
                                src={sex === 1 ? female_icon : male_icon}
                                title={nick_name}
                                alt="sexicon"
                                className="post_information_avatar_sex"
                            />
                        )}
                    </div>
                    <article className="post_information_content">
                        <section className="post_information_content_top">
                            <span>{nick_name}</span>
                            <span className="post_information_content_top_icon">
                                {vip === 1 ? (
                                    <Image width={120} height={50} src={vip_icon} title="VIP图标" alt="VIP图标" />
                                ) : (
                                    ""
                                )}
                            </span>
                        </section>
                        <section className="post_information_content_bottom">
                            <span className="post_information_content_bottom_item">
                                <div className="post_information_content_bottom_item_mount">
                                    {post_count}
                                </div>
                                {t('Post.posts')}
                            </span>
                            <span className="post_information_content_bottom_item">
                                <div className="post_information_content_bottom_item_mount">
                                    {fans_count}
                                </div>
                                {t('Post.follower')}
                            </span>
                            <span className="post_information_content_bottom_item">
                                <div className="post_information_content_bottom_item_mount">
                                    {attention_count}
                                </div>
                                {t('Post.focus')}
                            </span>
                        </section>
                    </article>
                </section>
                {is_owner ? (
                    <section className="post_edit_owner" onClick={toEditOwner}>
                        <WavaButton>{"编辑资料"}</WavaButton>
                    </section>
                ) : (
                    <section className="post_effect">
                        <section>
                            {is_creation === 1 ? (
                                is_subscript === 0 ? (
                                    <section
                                        className="post_effect_subscribe"
                                        onClick={() =>
                                            //有貼文、有設定價格後的時候才能訂閱
                                            post_count > 0 &&
                                                yearly_price !== null &&
                                                monthly_price !== null
                                                ? setShowScribe(true)
                                                : setShowNoScribe(true)
                                        }
                                    >
                                        <WavaButton>{t('Post.click_subscribe')}(ゝ∀･)</WavaButton>
                                    </section>
                                ) : (
                                    <section className="post_effect_subscribe">
                                        <WavaButton>{t('Post.click_subscribed')}</WavaButton>
                                    </section>
                                )
                            ) : (
                                ""
                            )}
                        </section>
                        <section className="post_effect_bottom">
                            <section
                                className="post_effect_bottom_donate"
                                onClick={() => {
                                    setShowDonate(true);
                                }}
                            >
                                <WavaButton>{t('Post.placeholder_donate')}</WavaButton>
                            </section>
                            <section
                                className="post_effect_bottom_follow"
                                onClick={() => postCardAttentionEvent(localState.postProfile.profile)}
                            >
                                <WavaButton>{is_attention ? `${t('Post.focused')}` : `${t('Post.focus')}`}</WavaButton>
                            </section>
                        </section>
                    </section>
                )}
            </PostsProfileInformation>
            <PostsProfileContent transIndex={nowGuide}>
                <div className="post_content_guide">
                    {contentGuide.map((item, index) => (
                        <div
                            key={item.key}
                            value={index}
                            className={`post_content_guide_item ${nowGuide === index && "active"
                                }`}
                            onClick={onChangeSelect}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>

                <section className="post_main_container">
                    {localState.postProfile?.postList?.map((data, index) => {
                        return (
                            <div key={data.id} className="post_main_item">
                                <PostCardItem
                                    postData={data}
                                    index={index}
                                    showFollow={false}
                                />
                            </div>
                        );
                    })}
                </section>
                {localState.postProfile?.postList?.length === 0 ? (
                    <div className="container_empty">
                        <div className="container_empty_girl">
                            <Image
                                width={233}
                                height={375}
                                className="container_empty_girl_img"
                                src={girl404}
                                alt="404"
                            />
                            <p className="container_empty_girl_text">
                                {t('Global.tip.nothing')}
                            </p>
                        </div>
                        <div className="container_empty_btn" onClick={backRoutes}>
                            <span className="container_empty_btn_text">
                                {t('Post.go_search')}
                            </span>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </PostsProfileContent>
        </PostsProfilePageElement>
    );
};

PostsProfilePage.propTypes = {
    // title: PropTypes.string,
    // content: PropTypes.string,
    // noticeId: PropTypes.number
};

export default PostsProfilePage;
const PostsProfilePageCover = styled.section`
  /*  */
  .no_subscribe_cover,
  .subscribe_cover,
  .float_cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 11;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    background-color: #000c;
  }

  .float_cover {
    &_no_subscribe_container,
    &_subscribe_container,
    &_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      width: 60%;
      width: 300px;
      background-color: #fff;
      border-radius: 5px;

      &_title {
        margin-top: 20px;
        font-weight: 600;
        &_text {
          font-size: 18px;
        }
      }

      &_content {
        margin-top: 15px;
        width: 80%;
        text-align: center;
        color: ${colors.text_grey};

        &_input {
          width: 100%;
          text-align: center;
          border: none;
          border-bottom: 1px solid;
          outline: none;
          border-radius: 0;
        }
      }

      &_btn {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        width: 80%;

        &_button {
          cursor: pointer;
          padding: 10px;
          margin: 5px 0;
          box-sizing: border-box;
          width: 100%;
          font-size: 14px;
          text-align: center;
          border-radius: 20px;

          &_text {
            color: ${colors.text_light_grey};
          }

          &.heightlight {
            background-color: ${colors.back_dark_pink};

            .float_cover_container_btn_button_text {
              color: #fff;
            }
          }
        }
      }
    }
  }

  .subscribe_cover {
    &_container {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 5px;
      width: 300px;
      padding: 20px;
      &_title {
        margin-top: 20px;
        font-weight: 600;
        font-size: 18px;
      }
      &_content {
        margin: 15px 0;
        color: ${colors.text_grey};
      }
      &_btn {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 10px;
        margin: 5px 0;
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        text-align: center;
        border-radius: 20px;
        background-color: ${colors.back_dark_pink};
        color: #fff;
      }
    }
  }

  .no_subscribe_cover {
    &_container {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 5px;
      width: 80%;
      width: 300px;
      padding: 10px 40px;

      &_title {
        text-align: center;
        margin-top: 20px;
        font-weight: 600;
        width: 100%;
        font-size: 18px;
      }
      &_content {
        text-align: center;
        margin: 15px 0;
        color: ${colors.text_grey};
      }
      &_btn {
        display: flex;
        cursor: pointer;
        padding: 10px;
        margin: 5px 0;
        padding: 10 10px;
        box-sizing: border-box;
        width: 100%;
        font-size: 14px;
        border-radius: 20px;
        background-color: ${colors.back_dark_pink};
        color: #fff;
        justify-content: center;
      }
    }
  }

  .post_card_body_media_donate_cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;

    &_container {
      padding: 6px 12px;
      cursor: pointer;
      color: ${colors.back_dark_pink};
      background: rgba(0, 0, 0, 0.76);
      text-align: center;
      border-radius: 5px;
      @media (min-width: 899px) {
        padding: 10px 20px;
        border-radius: 10px;
      }

      &_icon,
      &_text {
        vertical-align: middle;
        @media (min-width: 899px) {
          font-size: 18px;
          font-weight: 600;
        }
      }

      &_icon {
        width: 20px;
        @media (min-width: 899px) {
          width: 30px;
          margin-right: 5px;
        }
      }
    }
  }
`;

const PostsProfilePageElement = styled.article`
  /*  */
  .post_main {
    &_container {
      display: flex;
      flex-direction: column;
    }

    &_item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 0.25em;
    }
  }
  .container_empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 20px;
    min-height: 100vh;
    background: #fff;

    &_girl {
      margin-top: 20px;

      &_img {
        width: 150px;
      }

      &_text {
        margin-top: 15px;
        font-size: 14px;
        color: ${colors.text_grey};
      }
    }

    &_btn {
      cursor: pointer;
      display: inline-block;
      padding: 18px;
      margin-top: 15px;
      width: 200px;
      font-size: 20px;
      text-align: center;
      color: #fff;
      background-image: linear-gradient(
        to bottom,
        #fa83b3 0%,
        #f45c8c 50%,
        #f24c7c 100%
      );
      border-radius: 36px;
    }
  }
  .more {
    width: 30px;
    margin-right: 5px;
    &_setting {
      display: none;
      &.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50px;
        right: 0;
        border-radius: 8px;
        box-shadow: 0 3px 6px 0 rgba(100, 100, 100, 0.36);
        background-color: #fff;
        border-radius: 10px;
      }
      &_item {
        white-space: nowrap;
        text-align: center;
        border-bottom-width: 1px;
        border-color: ${colors.text_light_grey};
        border-style: inset;
        color: ${colors.text_light_grey};
        padding: 10px 20px;
        &:hover {
          color: ${colors.dark_pink};
          text-shadow: 0 0 ${colors.dark_pink};
        }
        &:last-child {
          border-bottom-width: 0px;
        }
      }
    }
  }
`;

const PostsProfileInformation = styled.article`
  /*  */
  background: #fff;
  padding: 15px 20px;
  padding-top: ${main_height + 20}px;
  .post_information {
    display: flex;
    justify-content: start;
    align-items: center;
    font-weight: 600;
    &_avatar {
      position: relative;
      overflow: hidden;
      width: 120px;
      &_sex {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 25px;
        width: 25px;
      }
    }
    &_content {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;
      padding: 0 20px;
      @media (max-width: 899px) {
        padding: 0 10px;
      }
      &_top {
        display: flex;
        justify-content: space-between;
        font-size: min(18px, 2rem);
        span {
          align-self: center;
        }
        &_icon {
          display: flex;
          height: 35px;
        }
      }
      &_bottom {
        display: flex;
        justify-content: space-around;
        &_item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: none;
          color: ${colors.text_light_grey};
          &_mount {
            color: black;
            font-weight: 600;
            font-size: min(20px, 2rem);
          }
        }
      }
    }
  }
  .post {
    &_edit {
      &_owner {
        text-align: center;
        margin-top: 15px;
        cursor: pointer;
        width: 100%;
        flex-shrink: 1;
        display: inline-block;
        overflow: hidden;
        color: ${colors.text_grey};
        background-color: #f3f4f5;
        border-radius: 5px;
        padding: 5px 0px;
      }
    }
    &_effect {
      text-align: center;
      margin-top: 15px;
      gap: 10px;
      flex-direction: column;
      font-weight: 600;
      display: flex;
      &_subscribe {
        width: 100%;
        cursor: pointer;
        flex-shrink: 0;
        display: inline-block;
        overflow: hidden;
        color: #fff;
        background-color: ${colors.back_dark_pink};
        border-radius: 5px;
        padding: 5px 0;
      }
      &_bottom {
        display: flex;
        gap: 5px;
        &_donate {
          cursor: pointer;
          width: 100%;
          flex-shrink: 1;
          display: inline-block;
          overflow: hidden;
          color: ${colors.dark_pink};
          background-color: #fff;
          border-radius: 5px;
          padding: 5px 10px;
          border: solid 1px ${colors.dark_pink};
        }
        &_follow {
          cursor: pointer;
          width: 100%;
          flex-shrink: 1;
          display: inline-block;
          overflow: hidden;
          color: ${colors.text_grey};
          background-color: #f3f4f5;
          border-radius: 5px;
          padding: 5px 10px;
        }
      }
    }
  }
`;
const PostsProfileContent = styled.article.withConfig({
    shouldForwardProp: (prop) =>
        !["transIndex"].includes(prop),
})`
  /*  */
  margin-top: 0.5em;
  .post_content {
    &_guide {
      padding: 15px 20px;
      display: flex;
      gap: 30px;
      color: ${colors.dark_pink};
      position: relative;
      background: #fff;

      &::after {
        margin: 15px 20px;
        position: absolute;
        bottom: -5px;
        left: 1px;
        width: 30px;
        border-style: solid;
        border-bottom-width: 1.5px;
        border-bottom-: 1px;
        transform: ${({ transIndex }) => `translateX(${transIndex * 66}px)`};
        content: "";
        transition: 0.1s;
        border-radius: 5px;
      }
      &_item {
        font-size: 18px;
        cursor: pointer;
        min-width:30px;
        text-align:center;
        color: ${colors.text_grey};
        &:hover {
          color: ${colors.dark_pink};
        }
        &.active {
          color: ${colors.dark_pink};
          transition: 0.1s;
        }
      }
    }
  }
`;
