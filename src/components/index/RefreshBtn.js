import React from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { colors } from "@/lib/constants";

const RefreshBtn = () => {
  const t = useTranslations();
  return (
    <RefreshBtnElement>
      <div className="refresh_btn">
        <p className="refresh_btn_text">
          {t("Global.refresh")}
          <span className="refresh_btn_text_icon">
            <FontAwesomeIcon
              className="refresh_btn_text_icon_img"
              style={{ width: '20px' }}
              icon={faRedo}
            />
          </span>
        </p>
      </div>
    </RefreshBtnElement>
  );
};

export default RefreshBtn;

export const RefreshBtnElement = styled.div`
  /*  */
  .refresh {
    &_btn {
      cursor: pointer;
      padding: 5px;
      border: 1px solid ${colors.dark_pink};
      border-radius: 5px;
      @media (max-width: 899px) {
        padding: 3px;
      }
      &_text {
        //display: flex;
        align-items: center;
        width: 100%;
        text-align: center;
        color: ${colors.dark_pink};
        font-weight: 900;
        font-size: 16px;
        @media (max-width: 899px) {
          font-size: 12px;
        }
        &_icon {
          margin-left: 6px;
          vertical-align: middle;

          &_img {
            width: 20px;
            height: 20px;
            vertical-align: middle;
            @media (max-width: 899px) {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
    }
  }
`;
