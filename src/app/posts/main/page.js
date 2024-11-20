"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import styled from "styled-components";
import { usePathname } from 'next/navigation'
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
// import PropTypes from "prop-types";

import PostCardItem from "@/components/posts/PostCardItem";
import paperAddIcon from "@public/images/icons/paper_add.svg";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
    clearScrollPage,
    pushRoutes,
} from "@/store/actions/historyActions";
import { pageUrlConstants, userRank } from "@/lib/constants/index.js";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import LoadingSkeleton from "@/components/posts/LoadingSkeleton";
import { getPostListAction } from '@/store/actions/pages/postsMainNewAction.js'
import Image from "next/image";

const { profile } = pageUrlConstants;
const PostsMainNewPage = ({
    showTip,
}) => {
    const location = usePathname();
    const postDescriptionRef = useRef();
    const [showPostTip, setShowPostTip] = useState(showTip);
    const { size, isMobile } = useMediaQuery();
    const { width } = size;
    const { state } = useGlobalContext();

    const localState = useMemo(() => {
        const breadcrumbsLength = state.breadcrumbs.length;
        const newRoute = state.router?.location?.pathname;
        const notPath = state.breadcrumbs[breadcrumbsLength - 1]?.path;
        const lastPath = state.breadcrumbs[breadcrumbsLength - 2]?.path;
        const isFirstEnter = state.breadcrumbs.find((data, index) => {
            if (index < breadcrumbsLength - 1) return data.path === newRoute;
        });
        return {
            user: state.user,
            refreshData:
                notPath === lastPath || !isFirstEnter || breadcrumbsLength <= 1,
            showTip:
                state.breadcrumbs[breadcrumbsLength - 2]?.path === "/posts/main/add" &&
                !state.user.is_creation,
            postListData: state.postListData,
        };
    }, [state]);

    const updatePostListData = (scrollColdEnd = () => { }) => {
        useGlobalDispatch(getPostListAction(scrollColdEnd));
    }
    const initPostListData = () => {
        useGlobalDispatch(getPostListAction(() => { }, "", "init"));
    }
    const floatBtnClick = () => {
        let user = state.user;
        if (user.id === "guest") {
            useGlobalDispatch(pushRoutes(login));
        } else {
            useGlobalDispatch(pushRoutes(post.pages.postMain.pages.postAdd));
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", scrollEvent);
        return () => {
            window.removeEventListener("scroll", scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        //如果再當前頁面在點一次側欄
        if (typeof window !== "undefined" && (localState.refreshData || state.postListData.postList?.length === 0)) {
            initPostListData();
            clearScrollPage(state);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        //對應的身分組發送貼文完顯示提示
        if (state.user.rank === userRank[0] && showTip) {
            setShowPostTip(true);
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "content";
            setTimeout(() => {
                setShowPostTip(false);
                setTimeout(() => {
                    if (postDescriptionRef.current)
                        postDescriptionRef.current.style.display = "none";
                }, 1550);
            }, 6000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showTip]);

    useEffect(() => {
        //如果沒有這個點選提示後會有一個小BUG 會因為沒有DISPLAY NONE 點不到後面的東西
        if (showPostTip && showTip && isMobile) {
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "flex";
        } else {
            if (postDescriptionRef.current)
                postDescriptionRef.current.style.display = "none";
        }
    }, [showPostTip]);

    function scrollEvent() {
        scrollBottomCallEvent((scrollColdEnd) => {
            if (!state.postListData.isDone) {
                updatePostListData(scrollColdEnd);
            }
        });
    }

    return (
        <PostsMainNewPageElement>
            <section className="post_main_container">
                {localState.postListData.postList?.map((data, index) => {
                    return (
                        <div key={data.id} className="post_main_item">
                            <LoadingSkeleton>
                                <PostCardItem postData={data} index={index} />
                            </LoadingSkeleton>
                        </div>
                    );
                })}
            </section>
            <FloatBtn
                style={{
                    transform: "translateX(-50%) translateX(" + width * 0.48 + "px)",
                }}
                onClick={floatBtnClick}
            >
                <Image className="float_btn_img" src={paperAddIcon} width={0} height={0} alt="btnPost" />
            </FloatBtn>

            <div
                className={`create_post_tip  ${showPostTip && " open"}`}
                ref={postDescriptionRef}
                onClick={() =>
                    useGlobalDispatch(
                        pushRoutes(profile.pages.profileBuyVip.pages.profileBuyVipCommon)
                    )
                }
            >
                免审核！充值并开通VIP即可节省新贴文和评论上架时间，点我前往开通VIP吧！
            </div>
        </PostsMainNewPageElement>
    );
};

PostsMainNewPage.propTypes = {
    // title: PropTypes.string,
    // content: PropTypes.string,
    // noticeId: PropTypes.number
};

export default PostsMainNewPage;

export const PostsMainNewPageElement = styled.div`
  /*  */
  @media (max-width: 899px) {
    background-color: #f3f4f5;
  }
  .post_main {
    &_container {
      display: flex;
      flex-direction: column;
      min-height: 150vh;
    }

    &_item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-bottom: 0.25em;
    }
  }

  .create_post {
    &_tip {
      position: fixed;
      left: 45%;
      right: 2%;
      z-index: 999;
      bottom: calc(${(bottom_nav_height + 10) * 3}px);
      border-radius: 5px;
      background: #39b3fd;
      padding: 8px;
      color: #fff;
      white-space: initial;
      font-size: 12px;
      opacity: 0%;
      transition: 1s;
      cursor: default;
      &.open {
        opacity: 100%;
        &::after {
          position: absolute;
          top: 0px;
          left: 75%;
          right: 0;
          bottom: -10px;
          z-index: -1;
          clip-path: polygon(50% 100%, 0 0, 100% 0);
          content: "";
          background: #39b3fd;
        }
      }
    }
  }
`;

export const FloatBtn = styled.div`
  /*  */
  cursor: pointer;
  position: fixed;
  right: 0;
  bottom: calc(${(bottom_nav_height + 10) * 2}px);
  left: 0;
  z-index: 1;
  overflow: hidden;
  margin: auto;
  width: 50px;
  border-radius: 50%;
  box-shadow: 3px 3px 6px #0006;
  .float_btn_img {
    width: 100%;
    vertical-align: middle;
  }
  @media (min-width: 899px) {
    display: none;
  }
`;
