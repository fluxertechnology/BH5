"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import scrollBottomCallEvent from "@/lib/services/scrollEvent";
// import PropTypes from "prop-types";

import PostCardItem from "@/components/posts/PostCardItem";

import girl404 from "public/images/imgPlaceholder/girl404.png";
import { colors } from "@/lib/constants/index.js";
import { clearScrollPage } from "@/store/actions/historyActions";
import LoadingSkeleton from "@/components/posts/LoadingSkeleton";
import { getPostListAction } from "@/store/actions/pages/postsMainNewAction";

import { useGlobalContext, useGlobalDispatch } from "@/store";

const PostsMainTrackPage = ({
    refreshData,
}) => {
    const location = usePathname();
    const t = useTranslations();
    const { state } = useGlobalContext();

    const getLocalState = () => {
        const breadcrumbsLength = state.breadcrumbs.length;
        const nowRoute = state.router.location.pathname;
        const notPath = state.breadcrumbs[breadcrumbsLength - 1]?.path;
        const lastPath = state.breadcrumbs[breadcrumbsLength - 2]?.path;
        const isFirstEnter = state.breadcrumbs.find((data, index) => {
            if (index < breadcrumbsLength - 1) return data.path === nowRoute;
        });
        return {
            refreshData:
                notPath === lastPath || !isFirstEnter || breadcrumbsLength <= 1,
            postTrackData: state.postTrackData,
            isBack: state.router.action === "POP",
        };
    };
    const [localState, setLocalState] = useState(getLocalState());

    const updatePostTrackData = (scrollColdEnd = () => { }) => {
        useGlobalDispatch(getPostListAction(scrollColdEnd, 1));
    }

    const initPostTrackData = () => {
        useGlobalDispatch(getPostListAction(() => { }, 1, "init"));
    }
    const pushToNew = () => {
        useGlobalDispatch(pushRoutes(pageUrlConstants.post.pages.postMain));
    }

    useEffect(() => {
        setLocalState(getLocalState());
    }, [state]);

    useEffect(() => {
        window.addEventListener("scroll", scrollEvent);
        return () => {
            window.removeEventListener("scroll", scrollEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        //如果再當前頁面在點一次側欄
        if (refreshData || localState.postTrackData.postTrack?.length === 0) {
            initPostTrackData();
            clearScrollPage();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);
    function scrollEvent() {
        scrollBottomCallEvent((scrollColdEnd) => {
            if (!localState.postTrackData.isDone) {
                updatePostTrackData(scrollColdEnd);
            }
        });
    }
    return (
        <PostsMainTrackPageElement hasData={localState.postTrackData.postTrack?.length > 0}>
            <div className="container">
                {Array.isArray(localState.postTrackData.postTrack) &&
                    localState.postTrackData.postTrack.length > 0 ? (
                    // If postTrack is valid and has data, map through it
                    localState.postTrackData.postTrack.map((data, index) => (
                        <div className="post_main_track_item" key={index}>
                            <LoadingSkeleton>
                                <PostCardItem postData={data} index={index} key={data.id} />
                            </LoadingSkeleton>
                        </div>
                    ))
                ) : (
                    // Else display the 404 message
                    <div className="container_empty">
                        <img className="container_empty_girl_img" src={girl404} alt="404" />
                        <p className="container_empty_girl_text">
                            {t('Global.tip.nothing')}
                        </p>
                        <div className="container_empty_btn" onClick={pushToNew}>
                            <span className="container_empty_btn_text">
                                {t('Post.go_search')}
                            </span>
                        </div>
                    </div>
                )}

            </div>
        </PostsMainTrackPageElement>
    );
};

PostsMainTrackPage.propTypes = {
    // title: PropTypes.string,
    // content: PropTypes.string,
    // noticeId: PropTypes.number
};

export default PostsMainTrackPage;

export const PostsMainTrackPageElement = styled.div.withConfig({
    shouldForwardProp: (prop) =>
        !["hasData"].includes(prop),
})`
  /*  */
  height: 100%;
  background-color: #f3f4f5;
  @media (min-width: 899px) {
    width: 600px;
  }
  .container {
    height: 100%;
    min-height: 100vh;
    background-color: ${({ hasData }) => !hasData && "#fff"};
  }
  @media (max-width: 899px) {
    background-color: #f3f4f5;
  }
  .post_main_track_item {
    margin-bottom: 0.25em;
  }
  .container_empty {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;

    &_girl {
      &_img {
        margin-top: 20px;
        width: 150px;
        @media (max-width: 899px) {
          width: 100px;
        }
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
      @media (max-width: 899px) {
        width: 150px;
        padding: 5px 10px;
        font-size: 18px;
      }
      background-image: linear-gradient(
        to bottom,
        #fa83b3 0%,
        #f45c8c 50%,
        #f24c7c 100%
      );
      border-radius: 36px;
    }
  }
`;
