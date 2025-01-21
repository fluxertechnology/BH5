import React, { useEffect } from "react";
import styled from "styled-components";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { colors, padding } from "@/lib/constants";
import {
  dismissPreventPageScroll,
  preventPageScroll,
} from "@/store/actions/utilities";

const ListSideBar = ({
  is_in,
  nowIndex,
  totalIndex,
  checkLock,
  clickClose,
  clickCallback,
}) => {
  useEffect(() => {
    preventPageScroll();
    return () => {
      dismissPreventPageScroll();
    };
  }, []);

  return (
    <ListSideBarElement
      onClick={() => {
        clickClose(false);
      }}
      is_in={is_in}
    >
      <div
        className="list_bar"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="list_bar_title mt-5">集数列表</div>
        <div className="list_bar_content">
          {Array.from({ length: totalIndex }, (v, i) => i + 1).map((data) => {
            return (
              //
              <div
                className={
                  "list_bar_content_item " +
                  (nowIndex === data ? "active " : "") +
                  (checkLock(data) ? "lock" : "")
                }
                key={data}
                onClick={() => {
                  clickCallback(data);
                }}
              >
                <p className="list_bar_content_item_text">{data}</p>
                <FontAwesomeIcon
                  className="list_bar_content_item_lock"
                  icon={faLock}
                />
              </div>
            );
          })}
        </div>
      </div>
    </ListSideBarElement>
  );
};

export default ListSideBar;

export const ListSideBarElement = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["is_in"].includes(prop),
})`
  /*  */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 94035;
  overflow: hidden;
  margin: auto;
  background-color: #0007;

  @keyframes navbar-in {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(0);
    }
  }

  .list_bar {
    transform: translateX(${({ is_in }) => (is_in ? 0 : "100%")});
    overflow: auto;
    margin-left: auto;
    width: 50%;
    height: 100%;
    background-color: #fff;
    transition: 0.2s;
    animation: navbar-in 0.2s;
    @media (min-width: 599px) {
      width: 25%;
    }

    &_title {
      font-size: 26px;
      padding: 20px 0;
      text-align: center;
      font-weight: 900;
    }

    &_content {
      display: flex;
      padding: 0 ${padding - 5}px;
      flex-wrap: wrap;

      &_item {
        user-select: none;
        position: relative;
        padding: 5px;
        box-sizing: border-box;
        width: calc(33.33%);

        &_text {
          cursor: pointer;
          padding: 15px 0;
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          background-color: #f3f3f3;
          border-radius: 5px;
          transition: 0.2s;
        }

        &_lock {
          position: absolute;
          right: 15px;
          bottom: 10px;
          font-size: 12px;
          color: #646464;
          opacity: 0%;
        }

        &.active {
          .list_bar_content_item_text {
            color: #fff;
            background-color: ${colors.dark_pink};
          }
        }

        &.lock {
          .list_bar_content_item_lock {
            opacity: 100%;
          }
        }
      }
    }
  }
`;
