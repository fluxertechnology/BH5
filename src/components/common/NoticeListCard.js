import React from "react";

import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTag, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { colors, padding } from "@/lib/constants";
import LinkComponent from "@/components/common/LinkComponent";

import WavaButton from "@/components/layout/Header/WavaButton";


const NoticeListCard = ({
  isNew,
  title,
  root,
  routes
}) => {
  return (
    <NoticeListCardElement
    >
      <LinkComponent
        className="link"
        routes={routes}
      >
        <WavaButton
          currentRefs={[root]}
        >
          <div className="item">
            <div className="item_title">
              <p className="item_title_text">
                {title}
              </p>
            </div>
            <div className="item_arrow">
              <FontAwesomeIcon className="item_arrow_icon" icon={faAngleRight} />
            </div>
          </div>
        </WavaButton>
      </LinkComponent>
    </NoticeListCardElement>
  )
}

export default NoticeListCard;

export const NoticeListCardElement = styled.div`/*  */
font-size:18px;

.link {
  text-decoration: none;
  color: #000;
}

.item {
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 18px ${padding}px;

  &::after {
    content: "";
    position: absolute;
    right: ${padding}px;
    bottom: 0;
    left: ${padding}px;
    height: 1px;
    background-color: #aaa;
  }

  &_title {
    &_text {
      &_new {
        margin-right: 10px;

        &_icon {
          vertical-align: middle;
          color: ${colors.dark_pink};
        }
      }
    }
  }

  &_arrow {
    &_icon {
      vertical-align: middle;
    }
  }
}

&:last-child {
  .item {
    &::after {
      content: unset;
    }
  }
}

`;