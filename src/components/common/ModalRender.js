import { useEffect, useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { colors } from "@/lib/constants";
import { useTranslations } from "next-intl";

const PostsAddModalPage = ({ initStatus, title, children, buttonProps }) => {
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setShow(initStatus);
  }, [initStatus]);

  const {
    text = "",
    onButtonClick = () => {},
    localStorageName = "",
  } = buttonProps;

  function onAccept() {
    setShow(false);
    onButtonClick();
    //如果今日不在提示被選取設定一天儲存時間
    if (checked) {
      window.localStorage.setItem(
        localStorageName,
        JSON.stringify(new Date().getTime() + 24 * 60 * 60 * 1000)
      );
    }
  }

  function onReject() {
    setShow(false);
    //如果今日不在提示被選取設定一天儲存時間
    if (checked) {
      window.localStorage.setItem(
        localStorageName,
        JSON.stringify(new Date().getTime() + 24 * 60 * 60 * 1000)
      );
    }
  }
  const onChange = () => {
    setChecked((pre) => !pre);
  };

  const nodeRef = useRef(null);
  return (
    <CSSTransition
      timeout={200}
      in={show}
      classNames="CSSTransition_opacity"
      unmountOnExit
      key="CSSTransition_show_donate"
      nodeRef={nodeRef}
    >
      <PostAddModalElement>
        <div className="float_cover">
          <div className="float_cover_container">
            <div className="float_cover_container_title">
              <p className="float_cover_container_title_text">{title}</p>
            </div>
            <div className="float_cover_container_content">{children}</div>
            <div className="float_cover_container_btn">
              <div
                className="float_cover_container_btn_button heightlight"
                onClick={onAccept}
              >
                <span className="float_cover_container_btn_button_text fw-m">
                  {text || t("Post.modal_confirm")}
                </span>
              </div>
              <div
                className="float_cover_container_btn_button"
                onClick={onReject}
              >
                <span className="float_cover_container_btn_button_text fw-m">
                  {t("Post.modal_cancel")}
                </span>
              </div>
            </div>
          </div>
          <div className="float_cover_tip">
            <input
              type="radio"
              id="member_expired_float_show"
              checked={checked}
              onChange={onChange}
            />
            <label htmlFor="member_expired_float_show">
              {t("Post.modal_not_tip")}
            </label>
          </div>
        </div>
      </PostAddModalElement>
    </CSSTransition>
  );
};
export default PostsAddModalPage;

const PostAddModalElement = styled.div`
  /*  */
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
      background-color: #fff;
      border-radius: 5px;
      @media (max-width: 899px) {
        width: 300px;
      }

      &_title {
        margin-top: 20px;
        font-weight: 600;
        color: #000;
        &_text {
          font-size: 22px;
        }
      }

      &_content {
        margin-top: 15px;
        text-align: center;
        color: ${colors.text_grey};
        font-size: 20px;

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
          font-size: 16px;
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

    &_tip {
      position: absolute;
      bottom: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid white;
        border-radius: 50%;
        outline: none;
      }
      input[type="radio"]:checked {
        background-color: ${colors.back_dark_pink};
      }
    }
  }
`;
