"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";

import { colors, padding, pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import {
  buyVipMemberAction,
  setVipInfoAction,
} from "@/store/actions/pages/profileBuyVipCommonAction";
import { useGlobalContext, useGlobalDispatch } from "@/store";

const sexCardBack = "/images/profile/sex_card_back.svg";
const sexGoldCardBack = "/images/profile/sex_gold_card_back.svg";
const infiniteIcon = "/images/profile/buyvip_infinite.svg";
const serverIcon = "/images/profile/buyvip_server.svg";
const discountIcon = "/images/profile/buyvip_discount.svg";

const sexCardBackArr = [sexCardBack, sexGoldCardBack];

const ProfileBuyVipSex = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();

  const [selectCard, setSelectCard] = useState(0);

  useEffect(() => {
    if (!state.vipInfoData.sexvip) {
      setVipInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buyMemberEvent() {
    if (
      parseInt(state.user.money) >=
      state.vipInfoData.sexvip[selectCard].pay_price
    ) {
      buyVipMember(state.vipInfoData.sexvip[selectCard]);
    } else {
      toBuyGoldPage();
    }
  }

  const setVipInfo = () => {
    useGlobalDispatch(setVipInfoAction());
  };
  const buyVipMember = (vipInfo) => {
    useGlobalDispatch(buyVipMemberAction(vipInfo));
  };
  const toBuyGoldPage = () => {
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profilePayment)
    );
  };

  return (
    <ProfileBuyVipSexElement main_height={state.navbar.mainHeight}>
      <div className="container">
        <div className="container_body">
          {state.vipInfoData.sexvip
            ? state.vipInfoData.sexvip.map((data, index) => {
                return (
                  <ProfileCardItem
                    index={index}
                    selectCard={selectCard}
                    setSelectCard={setSelectCard}
                    active={index}
                    title={data.outside_display_name}
                    description={data.description}
                    price={data.pay_price}
                    back_img={sexCardBackArr[index % sexCardBackArr.length]}
                    key={data.id}
                  />
                );
              })
            : ""}
        </div>
        <div className="container_footer">
          <div className="container_footer_title">
            <p className="container_footer_title_text">
              {t("Profile.buy.label.benefit_introduce")}
            </p>
          </div>
          <div className="container_footer_description">
            <span className="container_footer_description_text">
              {t("Profile.buy.vip.and_chill.description")}
            </span>
          </div>
          <div className="container_footer_highlight">
            <HighlightItem
              icon={infiniteIcon}
              title={t("Profile.buy.vip.label.watch.forever")}
              text={t("Profile.buy.vip.label.watch.all_website_free")}
            />
            <HighlightItem
              icon={serverIcon}
              title={t("Profile.buy.vip.label.service.priority.")}
              text={t("Profile.buy.vip.label.service.priority.after_sale")}
            />
            <HighlightItem
              icon={discountIcon}
              title={t("Profile.buy.vip.label.and_chill.discount.")}
              text={t("Profile.buy.vip.label.and_chill.discount.cost")}
            />
          </div>
        </div>
        <div className="container_more_info">
          <p>{t("Profile.buy.label.info.description_1")}</p>
          <p>{t("Profile.buy.label.info.description_2")}</p>
        </div>
        <div className="container_btn" onClick={buyMemberEvent}>
          <span className="container_btn_text">
            {t("Profile.buy.label.buy_now")}
          </span>
        </div>
      </div>
    </ProfileBuyVipSexElement>
  );
};

export default ProfileBuyVipSex;

const ProfileBuyVipSexElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    .container {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - ${main_height}px);
        min-height: calc((var(--vh, 1vh) * 100) - ${main_height}px);

        &_body {
        padding: 0 ${padding}px;
        @media (min-width: 599px) {
            padding: 0 35%;
        }
        }

        &_footer {
        padding: ${padding}px;
        margin-top: auto;

        &_title {
            padding-bottom: 5px;
            border-bottom: 2px dashed #a8a8a8;

            &_text {
            font-weight: 600;
            font-size: 16px;
            }
        }

        &_description {
            margin-top: 10px;
            text-align: center;

            &_text {
            font-size: 12px;
            color: ${colors.dark_pink};
            }
        }

        &_highlight {
            display: flex;
            @media (min-width: 599px) {
            padding: 0 30%;
            }
        }
        }

        &_more_info {
        text-align: center;
        color: ${colors.text_light_grey};
        > p {
            padding: 8px;
            &:first-child {
            padding-bottom: 0;
            }
        }
        }

        &_btn {
        cursor: pointer;
        flex-shrink: 0;
        padding: 15px;
        font-size: 16px;
        text-align: center;
        color: #fff;
        background-color: ${colors.dark_pink};
        font-weight: 900;
        }
    }
  `}
`;

const ProfileCardItem = ({
  title,
  description,
  price,
  back_img,
  index,
  selectCard,
  setSelectCard,
}) => {
  return (
    <ProfileCardItemElement
      className={selectCard === index ? "active" : ""}
      back_img={back_img}
      onClick={() => {
        setSelectCard(index);
      }}
    >
      <div className="title">
        <p className="title_text">{title}</p>
      </div>
      <div className="description">
        <p className="description_text">{description}</p>
      </div>
      <div className="price">
        <p className="price_text">¥ {price}</p>
      </div>
    </ProfileCardItemElement>
  );
};

const ProfileCardItemElement = styled.div`
  /*  */
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background-position: center;
  background-size: cover;
  background-image: url(${({ back_img }) => back_img});
  border-radius: 10px;
  transition: 0.2s;

  &.active {
    box-shadow: 0 0 0 3px #f00;
  }

  .title {
    &_text {
      font-size: 22px;
      font-weight: 600;
    }
  }

  .description {
    &_text {
      margin-top: 10px;
      font-size: 18px;
      line-height: 1.5em;
      white-space: pre;
    }
  }

  .price {
    margin-top: 10px;

    &_text {
      font-size: 16px;
      text-align: right;
    }
  }
`;

export const HighlightItem = ({
  icon,
  title,
  text,
  color = colors.text_grey,
}) => {
  return (
    <HighlightElementItem color={color}>
      <img className="icon" src={icon} alt={text} title={text} />
      <p className="title">{title}</p>
      <p className="text">{text}</p>
    </HighlightElementItem>
  );
};

const HighlightElementItem = styled.div`
  /*  */
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 15px;

  .icon {
    width: 53%;
  }

  .title {
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
  }

  .text {
    margin-top: 10px;
    font-size: 12px;
    color: ${colors.text_grey};
  }
`;
