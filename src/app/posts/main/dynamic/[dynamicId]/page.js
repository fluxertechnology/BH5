"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import styled from "styled-components";
import { bottom_nav_height } from "@/components/layout/Header/BottomNavBar";
import TopBarContainer, {main_height} from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import PostCardItem from "@/components/posts/PostCardItem";

import {
  colors,
  padding,
  pageUrlConstants,
  requestUrlConstants,
  userRank,
} from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";
import ImageComponent from "@/components/common/ImageComponent";

import scrollBottomCallEvent from "@/lib/services/scrollEvent";
import useMediaQuery from "@/hooks/useMediaQuery";
import { pushRoutes } from "@/store/actions/historyActions";
import callToast from "@/lib/services/toastCall";
import Image from "next/image";
import { getPostCardDetailAction } from "@/store/actions/pages/postsCardDetailAction";
import { useParams } from "next/navigation";

const { postGetPostCommentUrl, postLikeCommentUrl } = requestUrlConstants;

const { login } = pageUrlConstants;
const PostCardDetail = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  // const [showSharePage, setShowSharePage] = useState(false);
  const [commentString, setCommentString] = useState("");
  const [commentList, setCommentList] = useState([]);
  const { isMobile } = useMediaQuery();

  const [page, setPages] = useState(0);

  const postId = useParams().dynamicId;
  const postCardData = useMemo(() => {
    return state.postData[postId]
      ? state.postData[postId]
      : {
          create_time: Date.now(),
        };
  }, [state.postData, postId]);

  useEffect(() => {
    if (!postCardData.id) {
      getPostCardDetail(postId);
    }
    getCommentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    window.removeEventListener("scroll", scrollEvent);
    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentList]);

  function scrollEvent() {
    scrollBottomCallEvent((callback) => {
      if (page !== "done") {
        getCommentList(callback);
      }
    });
  }

  function clickSubmit() {
    if (state.user.id !== "guest") {
      if (commentString.match(/\d+/) === null) {
        //不包含任何數字
        submitCommentEvent(commentString, postId, () => {
          getPostCardDetail(postId);
          getCommentList(() => {}, "init");
          setCommentString("");
        });
      } else {
        callToast(
          intl.formatMessage({ id: "POST.CARD_DETAIL.INPUT_NUMBER_TIP" })
        );
      }
    } else {
      useGlobalDispatch(pushRoutes(login));
    }
  }

  function getCommentList(callback = () => {}, type = "update") {
    const formData = new FormData();
    formData.append("uid", state.user.id);
    formData.append("dynamic_id", postId);
    formData.append("limit", 10);
    if (type === "update") {
      formData.append("page", page + 1);
      setPages(page + 1);
    } else {
      formData.append("page", 1);
      setPages(1);
    }
    axiosRequest.post(postGetPostCommentUrl, formData).then((data) => {
      if (data.length < 10) {
        setPages("done");
      }
      if (type === "update") {
        setCommentList([...commentList, ...data]);
      } else {
        setCommentList(data);
      }
      callback(false);
    });
  }
  function likeComment(data) {
    if (state.user) {
      const formData = new FormData();
      formData.append("uid", state.user.id);
      formData.append("dynamic_id", postId);
      formData.append("comment_id", data.id);
      formData.append("status", parseInt(data.is_like) === 0 ? 1 : 0);

      axiosRequest.post(postLikeCommentUrl, formData).then((resData) => {
        for (let i = 0; i < commentList.length; i++) {
          if (commentList[i].id === data.id) {
            commentList[i].is_like = parseInt(data.is_like) === 0 ? 1 : 0;
            commentList[i].total_like = resData.total;
          }
        }
        setCommentList([...commentList]);
      });
    } else {
      useGlobalDispatch(pushRoutes(login));
    }
  }

  const submitCommentEvent = (comment, dynamic_id, callback = () => {}) => {
    const formData = new FormData();

    if (comment.length === 0) {
      callToast("空...空的Σ( ° △ °|||)");
    } else if (comment.length > 30) {
      callToast("太...太长了受不了拉,,Ծ‸Ծ,,");
    } else {
      formData.append("uid", state.user.id);
      formData.append("dynamic_id", dynamic_id);
      formData.append("content", comment);
      axiosRequest.post(postAddCommentUrl, formData).then((data) => {
        callToast("已送出留言。");
        callback();
      });
    }
  };
  const getPostCardDetail = (goodsId) => {
    useGlobalDispatch(getPostCardDetailAction(goodsId));
  };

  return (
    <PostCardDetailElement>
      {isMobile ? (
        <TopBarContainer>
          <TopTitleBar
            not_clear_history
            title={t("Post.dynamic_news")}
            showBack={true}
            color="#000"
            back_color="#fff"
            show_back_color="#000"
          />
        </TopBarContainer>
      ) : (
        <TopTitleBar
          not_clear_history
          show_border_bottom
          title={t("Post.dynamic_news")}
          showBack={true}
          color="#000"
          back_color="#fff"
          show_back_color="#000"
        />
      )}
      {/* <CSSTransition
        timeout={200}
        in={showSharePage}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_showCover"
      >
        <div
          className="share_cover"
          onClick={() => {
            setShowSharePage(false);
          }}
        >
          <div
            className="share_cover_container"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="share_cover_container_title">
              <span className="share_cover_container_title_text">
                {intl.formatMessage({ id: "POST.INSUFFICIENT_LEVEL" })}
              </span>
            </div>
            <div className="share_cover_container_description">
              <p className="share_cover_container_description_text">
                {intl.formatMessage({ id: "POST.CARD_DETAIL.DESCRIPTION" })}
              </p>
              {/* <p className="share_cover_container_description_text">
                才可以新增评论
              </p> 
            </div>
            <div className="share_cover_container_btn">
              <div className="share_cover_container_btn_button highlight">
                <LinkComponent
                  className="share_cover_container_btn_button_text"
                  routes={pageUrlConstants.profile.pages.profileShare}
                >
                  {intl.formatMessage({ id: "POST.UPDATE_VIP" })}
                </LinkComponent>
              </div>
              <div
                className="share_cover_container_btn_button"
                onClick={() => {
                  setShowSharePage(false);
                }}
              >
                <span className="share_cover_container_btn_button_text">
                  {intl.formatMessage({ id: "POST.REJECT" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition> */}

      <div className="container">
        <PostCardItem postData={postCardData} />
      </div>
      {!isMobile && (
        <div className="message">
          <div className="message_container">
            <div className="message_container_input">
              <input
                className="message_container_input_comment"
                type="text"
                placeholder={t("Post.friendly_comment")}
                value={commentString}
                onChange={(e) => {
                  setCommentString(e.target.value);
                }}
              />
            </div>
            <div className="message_container_submit" onClick={clickSubmit}>
              <Image
                className="message_container_submit_icon"
                src="/images/post/send_arrow.svg"
                width={0}
                height={0}
                alt="submit"
              />
            </div>
          </div>
          <div className="message_description">
            {t("Post.card_detail_speech_prompt")}
          </div>
        </div>
      )}
      <div className="comment">
        <div className="comment_title">
          <span className="comment_title_text">{t("Post.all_comments")}</span>
        </div>
        <div className="comment_list">
          {commentList.map((data) => {
            return (
              <div className="comment_list_item" key={data.id}>
                <div className="comment_list_item_avatar">
                  <ImageComponent
                    is_cover={true}
                    className="comment_list_item_avatar_img"
                    src={data.avatar}
                    border_radius="50%"
                    alt="avatar"
                    title={data.nick_name}
                  />
                </div>
                <div className="comment_list_item_comment">
                  <div className="comment_list_item_comment_name">
                    <span className="comment_list_item_comment_name_text">
                      {data.nick_name}
                    </span>
                  </div>
                  <div className="comment_list_item_comment_time">
                    <span className="comment_list_item_comment_time_text">
                      <Image
                        className="comment_list_item_comment_time_sex"
                        src={
                          data.sex === 1
                            ? "/images/icons/female.svg"
                            : "/images/icons/male.svg"
                        }
                        width={0}
                        height={0}
                        alt="sexicon"
                      />
                      {data.show_time}
                    </span>
                  </div>
                  <div className="comment_list_item_comment_content">
                    <span className="comment_list_item_comment_content_text">
                      {data.content}
                    </span>
                  </div>
                </div>
                <div
                  className="comment_list_item_like"
                  onClick={() => {
                    likeComment(data);
                  }}
                >
                  <div className="comment_list_item_like_icon">
                    <Image
                      className="comment_list_item_like_icon_img"
                      src={
                        parseInt(data.is_like) === 0
                          ? "/images/post/like_nor.png"
                          : "/images/post/like.svg"
                      }
                      width={0}
                      height={0}
                      alt="iconUnlike"
                    />
                  </div>
                  <div className="comment_list_item_like_total">
                    {data.total_like === 0 ? t("Post.like") : data.total_like}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isMobile && (
        <div className="message">
          <div className="message_container">
            <div className="message_container_input">
              <input
                className="message_container_input_comment"
                type="text"
                placeholder={t("Post.friendly_comment")}
                value={commentString}
                onChange={(e) => {
                  setCommentString(e.target.value);
                }}
              />
            </div>
            <div className="message_container_submit" onClick={clickSubmit}>
              <Image
                className="message_container_submit_icon"
                src="/images/post/send_arrow.svg"
                width={0}
                height={0}
                alt="submit"
              />
            </div>
          </div>
        </div>
      )}
    </PostCardDetailElement>
  );
};

export default PostCardDetail;

export const PostCardDetailElement = styled.div`
  /*  */
  .share_cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    background-color: #0008;

    &_container {
      padding: ${padding}px;
      background-color: #fff;
      border-radius: 10px;
      min-width: 300px;

      &_title,
      &_btn,
      &_description {
        text-align: center;
      }

      &_title {
        &_text {
          font-size: 18px;
          font-weight: 900;
        }
      }

      &_description {
        margin-top: 20px;

        &_text {
          line-height: 1.4em;
        }
      }

      &_btn {
        margin-top: 20px;

        &_button {
          margin-top: 10px;

          &_text {
            cursor: pointer;
            display: block;
            padding: 10px 0;
            font-size: 14px;
            text-decoration: none;
            color: ${colors.text_light_grey};
            border-radius: 20px;
          }

          &.highlight {
            .share_cover_container_btn_button_text {
              color: #fff;
              background-color: ${colors.dark_pink};
            }
          }
        }
      }
    }
  }

  .comment {
    @media (max-width: 899px) {
      margin-top: 5px;
    }
    padding: 15px;
    @media (min-width: 899px) {
      padding-top: 0px;
    }
    background-color: #fff;
    &_list {
      &_item {
        display: flex;
        padding: 15px 0;
        border-bottom: 1px solid #a8a8a8;

        &:last-of-type {
          border-bottom: none;
        }

        &_avatar {
          margin-right: 10px;
          width: 46px;
          height: 46px;
        }

        &_comment {
          flex-grow: 1;
          width: 0;

          &_name {
            color: ${colors.text_grey};
          }

          &_time {
            margin-bottom: 5px;
            &_text {
              color: ${colors.text_light_grey};
              display: flex;
              font-size: 14px;
            }
            &_sex {
              width: 14px;
              vertical-align: text-top;
              margin-right: 5px;
            }
          }
        }

        &_like {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          min-width: 50px;
          @media (min-width: 899px) {
            align-self: end;
            flex-direction: row;
            min-width: 35px;
          }

          &_total {
          }
          &_icon {
            margin-bottom: 5px;

            &_img {
              width: 20px;
              height: 20px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }

  .message {
    @media (max-width: 899px) {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      border-top: 1px solid #aaa;
    }
    @media (min-width: 899px) {
      margin-top: 5px;
      position: sticky;
      top: ${main_height + 1}px;
      z-index: 8;
      height: ${bottom_nav_height * 1.5}px;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    box-sizing: border-box;
    max-width: 599px;
    height: ${bottom_nav_height}px;
    background-color: #fff;
    padding-top: 20px;
    padding: 0 15px;
    font-size: 12px;

    &_description {
      color: ${colors.text_light_grey};
      padding: 8px;
    }

    &_container {
      display: flex;
      align-items: center;
      width: 100%;

      &_input {
        flex-grow: 1;
        padding: 10px;
        box-sizing: border-box;
        width: 0;
        background-color: ${colors.back_grey};
        border: none;
        border-radius: 30px;

        &_comment {
          box-sizing: border-box;
          width: 100%;
          background-color: transparent;
          border: none;
          outline: none;
        }
      }

      &_submit {
        cursor: pointer;
        margin-left: 20px;

        &_icon {
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
      }
    }
  }
`;
