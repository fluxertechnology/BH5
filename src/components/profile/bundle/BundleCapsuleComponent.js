"use client";

import { useTranslations } from "next-intl";
import styled from "styled-components";
import ImageComponent from "@/components/common/ImageComponent";
import { colors } from "@/lib/constants";

const BundleCapsuleComponent = ({
  id,
  title,
  expire_time,
  image,
  exchange_code,
  is_receive,
  is_expire = false,
  type,
  index,
  exchangeMyAwardItem,
  showActualInputWindow,
  data,
}) => {
  const t = useTranslations();
  function exchangeMyAwardButton(event) {
    let element = event.target;
    if (type === "virtual") {
      element.innerText = t("Profile.build.redemption");
      element.style.backgroundColor = "#aaa";
      exchangeMyAwardItem(id, index, element);
      if (exchange_code) {
        navigator.clipboard.writeText(exchange_code);
        element.innerText = t("Profile.build.redemption.fast_go");
        element.style.backgroundColor = "#f00";
      }
    } else if (type === "link" || type === "game") {
      element.innerText = t("Profile.build.redemption");
      element.style.backgroundColor = "#aaa";
      exchangeMyAwardItem(id, index, element);
      if (exchange_code) {
        navigator.clipboard.writeText(exchange_code);
        element.innerText = t("Profile.build.redemption.fast_go");
        element.style.backgroundColor = "#f00";
      }
    } else if (type === "actual") {
      showActualInputWindow(data);
    }
  }

  return (
    <BundleCapsuleComponentElement is_expire={is_expire}>
      <div className="box">
        <div className="container">
          <div className="container_header">
            <div className="container_header_cover">
              <ImageComponent
                src={image}
                alt={title}
                title={title}
                is_cover={true}
                border_radius="0"
              />
            </div>
          </div>
          <div className="container_body">
            <div className="container_body_title">
              <p className="container_body_title_text">{title}</p>
            </div>
            <div className="container_body_exchange">
              <p className="container_body_exchange_text">
                {exchange_code}
                <span
                  className={
                    "container_body_exchange_text_btn " +
                    (is_receive || is_expire ? "is_receive" : "")
                  }
                  onClick={(event) => {
                    if (!is_expire && !is_receive) {
                      exchangeMyAwardButton(event);
                    }
                  }}
                >
                  {is_receive
                    ? t("Profile.build.redemption.redemptioned")
                    : exchange_code
                    ? t("Profile.build.action.click.copy")
                    : t("Profile.build.action.click.redemption")
                  }
                </span>
              </p>
            </div>
            <div className="container_body_time">
              <p className="container_body_time_text">
                {t("Profile.build.validity.period")}
                {expire_time.getFullYear()}.{expire_time.getMonth() + 1}.
                {expire_time.getDate()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BundleCapsuleComponentElement>
  );
};

export default BundleCapsuleComponent;

export const BundleCapsuleComponentElement = styled.div`
  /*  */
  padding: 10px;
  box-sizing: border-box;
  filter: grayscale(${({ is_expire }) => (is_expire ? 1 : 0)});
  transition: 0.3s;

  .box {
    overflow: hidden;
  }

  .container {
    display: flex;
    border: 2px solid #fee873;
    border-radius: 5px;
    transition: 0.3s;

    &_header {
      flex-shrink: 0;
      position: relative;
      padding: 10px 22px 10px 10px;
      box-sizing: border-box;
      width: 25vw;
      max-width: 150px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        right: -12px;
        z-index: 1;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        background-color: #fff;
        border: 2px solid #fee873;
        border-radius: 50%;
      }

      &::before {
        top: -12px;
      }

      &::after {
        bottom: -12px;
      }

      &_cover {
        width: 100%;
      }
    }

    &_body {
      flex-grow: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding: 0 0 0 19px;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -1px;
        z-index: 1;
        transform: translateY(-50%);
        width: 2px;
        height: 60%;
        background-color: #fee873;
      }

      &_title {
        &_text {
          font-size: 16px;
          font-weight: 900;
        }
      }

      &_time,
      &_exchange {
        &_text {
          font-size: 14px;
        }
      }

      &_exchange {
        &_text {
          letter-spacing: 0.5px;
          color: #324183;
          font-weight: 900;

          &_btn {
            cursor: pointer;
            display: inline-block;
            padding: 3px 5px;
            margin-left: 5px;
            color: #fff;
            background-color: #324183;

            &.is_receive {
              cursor: auto;
              background-color: ${colors.text_grey};
            }
          }
        }
      }

      &_time {
        &_text {
          color: ${colors.text_light_grey};
        }
      }
    }
  }
`;
