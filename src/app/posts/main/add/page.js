"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { nowLang } from "@/i18n/Metronici18n";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import styled from "styled-components";
import SmileIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import {
  colors,
  padding,
  requestUrlConstants,
  applyOriginal,
  userRank,
  pageUrlConstants,
} from "@/lib/constants";

import InputSwitch from "@/components/common/InputSwitch";
import { styled as MuiStyle } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { updateFileEventModule } from "@/store/actions/utilities";

import loadingImg from "@public/images/imgPlaceholder/300x300.jpg";

import callToast from "@/lib/services/toastCall";
import axiosRequest from "@/lib/services/axios";
import useMediaQuery from "@/hooks/useMediaQuery";
import WavaButton from "@/components/layout/Header/WavaButton";
import { CSSTransition } from "react-transition-group";
import useIndexDBController from "@/hooks/useIndexDBController";
import Image from "next/image";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { backRoutes, pushRoutes } from "@/store/actions/historyActions";
import { updateUserDataAction } from "@/store/actions/user";

const { postAddDynamicUrl, postAddDynamicImageUrl } = requestUrlConstants;
const { post } = pageUrlConstants;

const maxDynamicLength = 200;
const CssTextField = MuiStyle(TextField)({
  "& label": {
    color: colors.text_grey,
  },
  "& label.Mui-focused": {
    color: colors.text_grey,
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "#acffeb",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#acffeb",
  },
  "& .MuiInput-root:hover::before": {
    borderBottomColor: "#acffeb!important",
  },

  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "red",
    },
    "&:hover fieldset": {
      // borderColor: "yellow",
    },
    "&.Mui-focused fieldset": {},
  },
});

const dbName = "bh5_post";
var db;
var request = indexedDB.open(dbName, 2);
request.onupgradeneeded = function (event) {
  db = event.target.result;
  var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
  objectStore.createIndex("name", "name", { unique: true });
};
request.onsuccess = function (event) {
  db = event.target.result;
};
const PostsAddPage = () => {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();
  const [dynamicText, setDynamicText] = useState(
    window.localStorage.getItem("post_add_render_dynamicText") || ""
  );
  const [monthMoney, setMonthMoney] = useState(
    state.user.monthly_price || null
  );
  const [yearMoney, setYearMoney] = useState(state.user.yearly_price || null);

  const [pay_option, set_pay_option] = useState(
    JSON.parse(window.localStorage.getItem("post_add_render_payOption"))
  );
  const [subscription, set_subscription] = useState(
    JSON.parse(window.localStorage.getItem("post_add_render_subscription"))
  );
  const [payMoney, setPayMoney] = useState(
    JSON.parse(window.localStorage.getItem("post_add_render_price"))
  );
  const [payDiamond, setDiamond] = useState(
    JSON.parse(window.localStorage.getItem("post_add_render_diamond"))
  );
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [showSubscriptionView, setShowSubscriptionView] = useState(false);
  const [showPostOverloadView, setShowPostOverLoadView] = useState(false);
  const [update_media, set_update_media] = useState(false);

  const [postFileArray, setPostFileArray] = useState([]);

  const updateIconRef = useRef();
  const updateImageRef = useRef();

  const payOptionRef = useRef();
  const subscriptionOptionRef = useRef();

  const [update_icon_height, set_update_icon_height] = useState("auto");

  const [pay_height, set_pay_height] = useState(0);
  const [subscription_height, set_subscription_height] = useState(0);
  const { addData, readData } = useIndexDBController();

  useEffect(() => {
    set_pay_height(payOptionRef.current?.offsetHeight);
    set_update_icon_height(updateIconRef.current?.offsetHeight);
    set_subscription_height(subscriptionOptionRef?.current?.offsetHeight);
  }, []);

  useEffect(() => {
    if (postFileArray.length > 0) {
      set_update_media(true);
    }
  }, [postFileArray.length]);

  useEffect(() => {
    //初始化 讓indexedDB資料進入useState
    if (request.readyState === "done") {
      readData(setPostFileArray);
    }
  }, [request.readyState]);

  useEffect(() => {
    updateUserDataActionDispatch();
  }, []);

  function updateFileEvent(e) {
    let files = updateFileEventModule(e);
    if (files.length > 0 && files.length + postFileArray.length <= 6) {
      files.map((data) => {
        postFileArray.push(data);
        for (let i = 0; i < postFileArray.length; i++) {
          if (postFileArray[i].progress === 100) {
            continue;
          }
          let reader = new FileReader();
          reader.readAsDataURL(postFileArray[i].file);
          reader.onprogress = function (e) {
            postFileArray[i].progress = Math.floor((e.loaded / e.total) * 99);
            setPostFileArray([...postFileArray]);
          };
          reader.onload = function (e) {
            postFileArray[i].url = e.target.result;
            setPostFileArray([...postFileArray]);
          };
          if (request.readyState === "done") {
            addData([...postFileArray]);
          }
        }
      });
    }
  }

  function submitPostData() {
    if (dynamicText.length === 0) {
      callToast("至少说点什么喔 (◑‿◐)");
      return null;
    }
    if (pay_option) {
      if (payMoney !== null && payMoney < 5) {
        callToast("金币最少要 5 个喔  ♫.(◕∠◕).♫");
        return null;
      }
      if (payDiamond === null && payMoney === null) {
        callToast("请输入支付贴文金额");
        return null;
      }
      if (!postFileArray.length) {
        callToast("最少请上传一张照片设定解锁");
        return null;
      }
    }

    if (subscription && (yearMoney === null || monthMoney === null)) {
      callToast("请输入悬赏贴文金额  ♫.(◕∠◕).♫");
      return null;
    }
    if (postFileArray.length !== 0) {
      let formData = new FormData();
      formData.append("uid", state.user.id);
      postFileArray.forEach((value) => {
        formData.append("file[]", value.file);
      });
      axiosRequest
        .post(postAddDynamicImageUrl, formData, "上传失败")
        .then((data) => {
          if (data.image.length > 0) {
            addPostCard(data.image);
          } else {
            callToast("图片过大或影片长度超过15秒");
          }
        });
    } else {
      addPostCard();
    }
  }

  function addPostCard(updataImg = false) {
    let formData = new FormData();
    formData.append("uid", state.user.id);
    formData.append("title", dynamicText);
    if (updataImg.length > 0) {
      updataImg.forEach((value) => {
        formData.append("thumb[]", value);
      });
    }
    if (pay_option) {
      formData.append("mode", 1);
      if (payMoney) {
        formData.append("coin", payMoney);
        formData.append("pay_type", 0);
      } else {
        formData.append("coin", payDiamond);
        formData.append("pay_type", 1);
      }
    }

    if (state.postTags.selectTags.length > 0) {
      formData.append(
        "tag",
        state.postTags.selectTags.map((data) => data.id)
      );
    }

    if (subscription) {
      formData.append("subscribe", 1);
      formData.append("monthly_price", parseInt(monthMoney));
      formData.append("yearly_price", parseInt(yearMoney));
    }

    axiosRequest.post(postAddDynamicUrl, formData).then((data) => {
      if (state.user.rank === userRank[0] && state.user.is_creation === 0) {
        callToast("上传完成请等待审核");
      } else {
        callToast("发布成功");
      }
      addData([]);
      cleanSelectTagStorage();
      window.localStorage.setItem("post_add_render_dynamicText", "");
      window.localStorage.setItem("post_add_render_price", null);
      window.localStorage.setItem("post_add_render_diamond", null);
      window.localStorage.setItem("post_add_render_payOption", false);
      window.localStorage.setItem("post_add_render_subscription", false);
      goToPostMainPage();
    });
  }
  function onClickEmojiButton() {
    setShowEmojiList((pre) => !pre);
  }
  function onSelectEmoji(obj) {
    setDynamicText((pre) => pre + obj.native);
  }
  const handleChangeMonthMoney = useCallback((e) => {
    if (Number(e.target.value) >= 0) {
      setMonthMoney(Math.floor(Number(e.target.value)) || null);
    }
  }, []);

  const handleChangeYearMoney = useCallback((e) => {
    if (Number(e.target.value) >= 0) {
      setYearMoney(Math.floor(Number(e.target.value)) || null);
    }
  }, []);

  const goToApplyOriginal = useCallback(() => {
    window.open(applyOriginal);
  }, []);

  const handleClickPayOption = () => {
    set_pay_option((pre) => {
      window.localStorage.setItem("post_add_render_payOption", !pre);
      return !pre;
    });
    if (state.user.pay_dynamic_count >= 5) {
      setTimeout(() => {
        setShowPostOverLoadView(true);
        window.localStorage.setItem("post_add_render_payOption", false);
        set_pay_option(false);
      }, 500);
    }
  };

  const cancelToBack = () => {
    useGlobalDispatch(backRoutes());
  };
  const goToPostMainPage = () => {
    useGlobalDispatch(pushRoutes(post.pages.postMain.pages.postMainNew));
  };
  const goToSelectTagsPage = () => {
    useGlobalDispatch(pushRoutes(post.pages.postMain.pages.postAddTags));
  };
  const cleanSelectTagStorage = () => {
    useGlobalDispatch({ type: "CLEAN_POSTSSELECTTAGS" });
  };
  const updateUserDataActionDispatch = () => {
    useGlobalDispatch(updateUserDataAction());
  };

  const nodeRef = useRef(null);
  return (
    <PostsAddPageElement
      uploadMount={postFileArray.length}
      main_height={state.navbar.mainHeight}
      bottom_nav_height={state.navbar.bottomNavHeight}
      isMobile={isMobile}
    >
      <CSSTransition
        timeout={200}
        in={showSubscriptionView}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_donate"
        nodeRef={nodeRef}
      >
        <div className="float_cover">
          <div className="float_cover_container">
            <div className="float_cover_container_title">
              <p className="float_cover_container_title_text">设定金额</p>
            </div>
            <div className="float_cover_container_content">
              平台将收取订阅金额30%平台服务费
            </div>
            <div className="textfield_container">
              <CssTextField
                fullWidth
                type="number"
                id="standard-basic"
                label="月订阅价格"
                min={0}
                max={6000}
                value={monthMoney}
                onChange={handleChangeMonthMoney}
                variant="standard"
              />
              <div className="diamond">精钻/月</div>
            </div>
            <div className="received">
              实际获得收益：
              {Math.round(Number(monthMoney) * 0.7 * 100) / 100 || 0}
              精钻/月
            </div>
            <div className="textfield_container">
              <CssTextField
                fullWidth
                type="number"
                id="standard-basic"
                label="年订阅价格"
                min={0}
                max={6000}
                value={yearMoney}
                onChange={handleChangeYearMoney}
                variant="standard"
              />
              <div className="diamond">精钻/年</div>
            </div>
            <div className="received">
              实际获得收益：
              {Math.round(Number(yearMoney) * 0.7 * 100) / 100 || 0}
              精钻/年
            </div>
            <div className="float_cover_container_btn">
              <div
                className="float_cover_container_btn_button heightlight"
                onClick={() => {
                  setShowSubscriptionView(false);
                }}
              >
                <span className="float_cover_container_btn_button_text">
                  确定
                </span>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        timeout={200}
        in={showPostOverloadView}
        classNames="CSSTransition_opacity"
        unmountOnExit
        key="CSSTransition_show_pay_post_overload"
      >
        <div className="float_cover">
          <div className="float_cover_container">
            <div className="float_cover_container_title center">
              <p className="float_cover_container_title_text">已达上限</p>
            </div>
            <div className="float_cover_container_content center">
              付费贴文每日上限5篇,
              <br /> 超过待明日操作
            </div>

            <div className="float_cover_container_btn">
              <div
                className="float_cover_container_btn_button heightlight"
                onClick={() => {
                  setShowPostOverLoadView(false);
                }}
              >
                <span className="float_cover_container_btn_button_text">
                  我知道了
                </span>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>

      <TopBarContainer not_fixed z_index={5}>
        <div className="header">
          <div className="header_cancel" onClick={cancelToBack}>
            <span className="header_cancel_text">取消</span>
          </div>
          <div className="header_title">
            <span className="header_title_text">发布动态</span>
          </div>
          <div className="header_submit" onClick={submitPostData}>
            <span className="header_submit_text">发布</span>
          </div>
        </div>
      </TopBarContainer>

      <div className="container">
        <div className="container_body">
          <div className="container_body_input">
            <textarea
              className="container_body_input_textarea"
              placeholder="分享你的想法..."
              maxLength={maxDynamicLength}
              value={dynamicText}
              onChange={(e) => {
                window.localStorage.setItem(
                  "post_add_render_dynamicText",
                  e.target.value
                );
                setDynamicText(e.target.value);
              }}
            />
            <p className="container_body_input_length">
              {dynamicText.length} / {maxDynamicLength}
            </p>
          </div>
          <div className="container_body_effect_area">
            <div className="container_body_image">
              <input
                type="file"
                id="updatePostFile"
                className="displaynone"
                multiple
                accept="image/gif, image/jpeg, image/png, image/jpg, image/bmp, video/mp4"
                onChange={updateFileEvent}
              />
              <div
                ref={updateIconRef}
                style={{
                  height: !update_media ? update_icon_height + "px" : 0,
                }}
                className="container_body_image_icon"
              >
                <Image
                  className="container_body_image_icon_img"
                  src="/images/icons/picture.svg"
                  width={0}
                  height={0}
                  alt="icon"
                  onClick={() => {
                    set_update_media(true);
                  }}
                />
                <Image
                  className="container_body_image_icon_img"
                  src="/images/icons/video.svg"
                  width={0}
                  height={0}
                  alt="icon"
                  onClick={() => {
                    set_update_media(true);
                  }}
                />
              </div>
              <div
                ref={updateImageRef}
                style={{
                  height: update_media ? "100%" : 0,
                  padding: update_media ? "10px 0" : 0,
                }}
                className="container_body_image_list"
              >
                {postFileArray?.map((value, index) => {
                  return (
                    <div
                      className="container_body_image_list_item"
                      key={"updatefile_" + value.key}
                    >
                      {value.url?.indexOf("data:video") !== -1 ? (
                        <>
                          <video
                            src={value.url + "#t=0.1"}
                            preload="metadata"
                            className="container_body_image_list_item_item"
                            controlsList="nodownload"
                            poster={value.progress === 100 ? "" : loadingImg}
                            onCanPlay={() => {
                              postFileArray[index].progress = 100;
                              setPostFileArray([...postFileArray]);
                              addData(postFileArray);
                            }}
                          />
                          <div className="container_body_image_list_item_play">
                            <FontAwesomeIcon icon={faCaretRight} />
                          </div>
                        </>
                      ) : (
                        <img
                          className="container_body_image_list_item_item"
                          src={value.url}
                          onLoad={() => {
                            postFileArray[index].progress = 100;
                            setPostFileArray([...postFileArray]);
                            addData(postFileArray);
                          }}
                          alt="上傳的圖片"
                        />
                      )}
                      <div
                        className="container_body_image_list_item_cover"
                        style={{
                          display: value.progress === 100 ? "none" : "",
                        }}
                      >
                        <div className="container_body_image_list_item_cover_progress">
                          {value.progress}%
                        </div>
                      </div>
                      <div
                        className="container_body_image_list_item_close cursor"
                        onClick={() => {
                          postFileArray.splice(index, 1);
                          setPostFileArray([...postFileArray]);
                          addData(postFileArray);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                    </div>
                  );
                })}
                {postFileArray?.length < 6 && (
                  <label
                    htmlFor="updatePostFile"
                    className="container_body_image_list_item label"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </label>
                )}
              </div>
            </div>

            <div className="container_body_effect_tags_select">
              <SmileIcon
                fontSize="large"
                sx={{ color: "gray" }}
                className="cursor"
                onClick={onClickEmojiButton}
              />
              {showEmojiList && (
                <div className="container_body_effect_tags_select_emoji">
                  {/* 最下方有調整CSS高度 */}
                  <Picker
                    data={data}
                    onEmojiSelect={(e) => onSelectEmoji(e)}
                    locale={nowLang || "en"}
                  />
                </div>
              )}
              <div onClick={goToSelectTagsPage}>
                <WavaButton className="container_body_effect_tags">
                  ＃添加热门话题
                </WavaButton>
              </div>
            </div>
          </div>
          <div className="container_body_selected_tags">
            {state.postTags.selectTags.map((select) => (
              <div
                className="container_body_selected_tags_item"
                key={select.id}
              >
                {select.name}
              </div>
            ))}
          </div>
        </div>
        <div className="spacing">&nbsp;</div>
        <div className="container_footer">
          {state.user.is_creation || state.user.is_vip ? (
            <div className="container_footer_option">
              <div className="container_footer_option_pay">
                <div className="container_footer_option_pay_content">
                  <div className="container_footer_option_pay_content_title">
                    <p className="container_footer_option_pay_content_title_text">
                      付费贴文
                    </p>
                  </div>
                  <div className="container_footer_option_pay_content_switch">
                    <InputSwitch
                      state={pay_option}
                      callback={handleClickPayOption}
                    />
                  </div>
                </div>
                <div
                  ref={payOptionRef}
                  className="container_footer_option_pay_option"
                  style={{
                    height: pay_height
                      ? pay_option
                        ? pay_height + (!isMobile && 20) + "px"
                        : 0
                      : "auto",
                  }}
                >
                  <input
                    disabled={payDiamond !== null}
                    className={`container_footer_option_pay_option_input ${
                      payDiamond !== null && " disabled"
                    }`}
                    type="number"
                    placeholder="请在此输入解锁贴文金币(最少为5金币)"
                    min={5}
                    max={10000}
                    value={payMoney}
                    onChange={(e) => {
                      setPayMoney(Math.floor(e.target.value) || null);
                      window.localStorage.setItem(
                        "post_add_render_price",
                        Math.floor(e.target.value) || null
                      );
                    }}
                  />
                  {state.user.is_creation ? (
                    <input
                      disabled={payMoney !== null}
                      className={`container_footer_option_pay_option_input ${
                        payMoney !== null && " disabled"
                      }`}
                      type="number"
                      placeholder="请在此输入解锁贴文精钻，最高8精钻"
                      min={1}
                      max={8}
                      value={payDiamond}
                      onChange={(e) => {
                        setDiamond(Math.floor(e.target.value) || null);
                        window.localStorage.setItem(
                          "post_add_render_diamond",
                          Math.floor(e.target.value) || null
                        );
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="divider">&nbsp;</div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {state.user.is_creation ? (
        <div className="container_footer">
          <div className="container_footer_option">
            <div className="container_footer_option_pay">
              <div className="container_footer_option_pay_content">
                <div className="container_footer_option_pay_content_title">
                  <p className="container_footer_option_pay_content_title_text">
                    订阅贴文
                  </p>
                </div>
                <div className="container_footer_option_pay_content_switch">
                  <InputSwitch
                    state={subscription}
                    callback={() => {
                      set_subscription((pre) => {
                        window.localStorage.setItem(
                          "post_add_render_subscription",
                          !pre
                        );
                        return !pre;
                      });
                    }}
                  />
                </div>
              </div>
              <div
                className="container_footer_option_pay_field"
                ref={subscriptionOptionRef}
                style={{
                  height: subscription_height
                    ? subscription
                      ? "100%"
                      : 0
                    : "auto",
                }}
              >
                {monthMoney !== null || yearMoney !== null
                  ? `月订阅：${monthMoney || 0}精钻 ｜ 年订阅：${yearMoney || 0}
                    精钻`
                  : "尚未设定"}

                <div
                  className="container_footer_option_pay_field_modify cursor"
                  onClick={() => setShowSubscriptionView(true)}
                >
                  修改金额＞
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="original_owner">
          <Image
            src="/images/post/girl_icon.png"
            width={0}
            height={0}
            alt="girlIcon"
            className="original_owner_icon"
          />
          <div className="original_owner_middle_description">
            <div className="original_owner_middle_description_top">
              申请成为原创主！
            </div>
            <div className="original_owner_middle_description_bottom">
              轻松赚取高薪也看得开心
            </div>
          </div>
          <div onClick={goToApplyOriginal}>
            <WavaButton className="original_owner_apply">
              我要申请
              <Image
                src="/images/post/money.svg"
                width={0}
                height={0}
                alt={"apply_icon"}
                className="original_owner_apply_icon"
              />
            </WavaButton>
          </div>
        </div>
      )}
      <div className="description">
        <h3 className="description_title">规格说明</h3>
        <p className="description_text">付费贴文：</p>
        <p className="description_text">1.设定贴文金币或精钻其一并發布</p>
        <p className="description_text">2.若有其他用户解锁即可获得金币或精钻</p>
        <p className="description_text">订阅贴文：</p>
        <p className="description_text">1.申请成为创作者即可开启订阅功能</p>
        <p className="description_text">
          2.开启订阅功能后设定金额即可开始发佈贴文
        </p>
        <p className="description_text">
          3.用户订阅你即可获得精钻为自己提高收入
        </p>
      </div>
    </PostsAddPageElement>
  );
};

PostsAddPage.propTypes = {
  // title: PropTypes.string,
  // content: PropTypes.string,
  // noticeId: PropTypes.number
};

export default PostsAddPage;

export const PostsAddPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["main_height", "bottom_nav_height", "uploadMount", "isMobile"].includes(prop),
})`
  ${({ main_height, bottom_nav_height, uploadMount, isMobile }) => `
  /*  */
  .displaynone {
    display: none;
  }
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 150vh;
  @media (max-width: 899px) {
    padding-bottom: ${bottom_nav_height}px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${padding}px;
    height: ${main_height}px;

    &_cancel,
    &_title,
    &_submit {
      padding: 10px 5px;

      &_text {
        font-weight: 700;
        font-size: 16px;
      }
    }

    &_cancel,
    &_submit {
      cursor: pointer;
    }

    &_cancel {
      &_text {
        color: ${colors.text_light_grey};
      }
    }

    &_submit {
      &_text {
        color: ${colors.dark_pink};
      }
    }
  }

  .container {
    padding-top: ${isMobile ? main_height : 0}px;
    &_body {
      &_input {
        padding: ${padding}px;
        @media (min-width: 899px) {
          padding-top: ${main_height + 20}px;
          font-size: 18px;
        }
        &_textarea {
          padding: 0;
          width: 100%;
          height: 120px;
          color: black;
          border: none;
          outline: none;
          resize: none;
          @media (min-width: 899px) {
            font-size: 18px;
          }
        }

        &_length {
          text-align: right;
          color: ${colors.text_light_grey};
        }
      }
      &_effect {
        &_area {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 0 ${padding / 2}px;
          @media (max-width: 899px) {
            justify-content: ${
              uploadMount >= 1 ? "flex-end" : " space-between"
            };
            flex-direction: ${uploadMount >= 1 ? "column" : "row"};  
          }
        }
        &_tags {
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 16px;
          color: #fff;
          background: ${colors.dark_pink};
          white-space: nowrap;
          &_select {
            gap: 10px;
            display: flex;
            align-items: center;
            position: relative;
            font-size: 14px;
            @media (max-width: 899px) {
              align-items: center;
              width: ${uploadMount >= 1 ? "100%" : "auto"};
              justify-content: flex-end;
            }
            &_emoji {
              position: absolute;
              top: 120%;
              right: 0;
              z-index: 5;
            }
          }
        }
      }

      &_selected_tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 10px ${padding}px;
        gap: 10px;
        &_item {
          padding: 5px 15px;
          border-radius: 16px;
          color: #fff;
          background: ${colors.dark_pink};
          white-space: nowrap;
          transition: all 0.5s ease-in-out;
        }
      }

      &_image {
        align-self: start;
        &_list,
        &_icon {
          overflow: hidden;
          padding: 10px 0;
          transition: 0.2s;
        }

        &_icon {
          padding: 0 ${padding / 2}px;
          display: flex;
          align-items: center;
          &_img {
            margin: 10px;
            width: 30px;
            height: 30px;
            vertical-align: middle;
            cursor: pointer;
          }
        }

        &_list {
          &_item {
            flex-shrink: 0;
            position: relative;
            display: inline-block;
            margin: 5px 20px;
            width: 100px;
            height: 100px;
            font-size: 40px;
            text-align: center;
            vertical-align: middle;
            background-position: center;
            background-size: cover;
            background-color: #e9e9e9;
            background-image: url(${loadingImg});
            @media (max-width: 899px) {
              margin: 5px;
            }
            &_item {
              width: 100%;
              height: 100%;
              vertical-align: middle;
              object-fit: cover;
            }

            &_cover {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background-image: linear-gradient(to top, #000 0%, #0000 100%);

              &_progress {
                position: absolute;
                right: 0;
                bottom: 10px;
                left: 0;
                text-align: center;
                color: #fff;
              }
            }

            &_close {
              position: absolute;
              top: -10px;
              right: -10px;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 3px 5.14px;
              font-size: 12px;
              color: #fff;
              background-color: #000a;
              border-radius: 50%;
            }

            &_play {
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 1;
              transform: translate(-50%, -50%);
              font-size: 65px;
              color: #fff;
              filter: drop-shadow(0 0 5px black);
            }

            &.label {
              cursor: pointer;
              background-image: unset;
              line-height: 100px;
            }
          }
        }
      }
    }

    &_footer {
      padding: 0 ${padding}px;

      &_option {
        padding: 10px 0;

        &_pay {
          &_content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &_title {
              &_text {
                font-size: 16px;
                font-weight: 700;
                color: ${colors.text_grey};
              }
            }
          }

          &_field {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-top: 10px;
            color: ${colors.text_light_grey};
            overflow: hidden;
            margin-top: 10px;
            transition: 0.2s;
            div {
              height: 100%;
            }
            &_modify {
              color: #39b3fd;
              white-space: nowrap;
            }
          }

          &_option {
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: hidden;
            margin-top: 10px;
            transition: 0.2s;

            &_input {
              padding: 10px;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              background-color: ${colors.back_grey};
              border: none;
              border-radius: 4px;
              outline: none;
              @media (min-width: 899px) {
                font-size: 18px;
              }
              &.disabled {
                opacity: 0.5;
                color: ${colors.text_light_grey};
              }
            }
          }
        }
      }
    }
  }

  .description {
    padding: ${padding}px;
    line-height: 1.6;

    &_title {
      font-size: 14px;
      color: ${colors.text_grey};
      @media (min-width: 899px) {
        font-size: 16px;
      }
    }

    &_text {
      font-size: 12px;
      color: ${colors.text_light_grey};
      @media (min-width: 899px) {
        font-size: 14px;
      }
    }
  }
  .divider {
    height: 1px;
    width: 100%;
    background-color: ${colors.text_light_grey};
    margin-top: 20px;
  }
  .spacing {
    height: 10px;
    width: 100%;
    background-color: #f3f4f5;
  }

  .original_owner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fffbeb;
    padding: 5px 10px;
    @media (min-width: 899px) {
      padding: 10px 20px;
    }
    &_icon {
      width: 70px;
      height: 70px;
      @media (min-width: 899px) {
        width: 80px;
        height: 80px;
      }
    }
    &_middle_description {
      display: flex;
      flex-direction: column;

      &_bottom,
      &_top {
        font-weight: 600;
        @media (min-width: 899px) {
          font-size: 20px;
        }
      }

      &_top {
        color: #ffb000;
      }
    }
    &_apply {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      cursor: default;
      color: #fff;
      text-shadow: 0.09px 0px ${colors.text_grey};
      background-color: #ffb000;
      transition: 0.5s;
      border-radius: 20px;
      text-align: center;
      border: 2px solid black;
      cursor: pointer;
      @media (min-width: 899px) {
        margin-left: 60px;
        margin: 10px;
        font-size: 16px;
      }
      &_icon {
        width: 25px;
        height: 25px;
      }
    }
  }

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

    &_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;
      width: 80%;
      width: 300px;
      background-color: #fff;
      border-radius: 5px;
      padding: 10px 20px;

      &_title {
        margin-top: 20px;
        font-weight: 600;
        align-self: start;

        &.center {
          align-self: center;
        }

        &_text {
          font-size: 18px;
        }
      }

      &_content {
        margin-top: 15px;
        color: ${colors.text_grey};
        align-self: start;
        &.center {
          align-self: center;
          text-align: center;
        }

        &_input {
          width: 100%;
          text-align: center;
          border: none;
          border-bottom: 1px solid;
          outline: none;
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

  .textfield_container {
    display: flex;
    align-items: baseline;
    width: 100%;
  }
  .diamond {
    color: ${colors.back_dark_pink};
    font-size: 1rem;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  .received {
    align-self: start;
    font-size: 0.8rem;
    color: ${colors.text_light_grey};
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  em-emoji-picker {
    height: 300px;
    min-height: 100px;
  }
`}
`;
