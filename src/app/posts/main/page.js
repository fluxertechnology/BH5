"use client";

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router";
import scrollBottomCallEvent from "../../modules/scrollEvent";
// import PropTypes from "prop-types";

import PostCardItem from "@/components/posts/PostCardItem";
import paperAddIcon from "@public/images/icons/paper_add.svg";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
    clearScrollPage,
    pushRoutes,
} from "../../reducers/actions/historyActions";
import { pageUrlConstants, userRank } from "@/lib/constants/index.js";
import { useDispatch } from "react-redux";
import LoadingSkeleton from "../component/LoadingSkeleton";

const { profile } = pageUrlConstants;
const PostsMainNewPage = ({
    user,
    postListData,
    updatePostListData,
    initPostListData,
    floatBtnClick,
    refreshData,
    showTip,
}) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const postDescriptionRef = useRef();
    const [showPostTip, setShowPostTip] = useState(showTip);
    const { size, isMobile } = useMediaQuery();
    const { width } = size;
    useEffect(() => {
        window.addEventListener("scroll", scrollEvent);
        return () => {
            window.removeEventListener("scroll", scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        //如果再當前頁面在點一次側欄
        if (refreshData || postListData.postList.length === 0) {
            initPostListData();
            clearScrollPage();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        //對應的身分組發送貼文完顯示提示
        if (user.rank === userRank[0] && showTip) {
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
            if (!postListData.isDone) {
                updatePostListData(scrollColdEnd);
            }
        });
    }

    return (
        <PostsMainNewPageElement>
            <section className="post_main_container">
                {postListData.postList.map((data, index) => {
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
                <img className="float_btn_img" src={paperAddIcon} alt="btnPost" />
            </FloatBtn>

            <div
                className={`create_post_tip  ${showPostTip && " open"}`}
                ref={postDescriptionRef}
                onClick={() =>
                    dispatch(
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
