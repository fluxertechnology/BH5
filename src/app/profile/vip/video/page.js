"use client";

import { useState, useEffect, use } from "react";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@/hooks/useMediaQuery";
import Image from "next/image";
import { breakPoint, colors, padding, pageUrlConstants } from "@/lib/constants";
import { pushRoutes } from "@/store/actions/historyActions";
import {
  buyVipMemberAction,
  setVipInfoAction,
} from "@/store/actions/pages/profileBuyVipCommonAction";

const videoCardBack = "/images/profile/buyvip_videocard.svg";
const videoCardBackArr = [videoCardBack];

const ProfileBuyVipVideo = () => {
  const { state } = useGlobalContext();
  const t = useTranslations();
  const { isMobile } = useMediaQuery();
  const HighlightDatas = [
    {
      icon: "/images/profile/buyvip_infinite.svg",
      title: t("Profile.buy.vip.label.watch.forever"),
      text: t("Profile.buy.vip.label.watch.all_website_free"),
    },
    {
      icon: "/images/profile/buyvip_server.svg",
      title: t("Profile.buy.vip.label.service.priority."),
      text: t("Profile.buy.vip.label.service.priority.after_sale"),
    },
    {
      icon: "/images/profile/buyvip_discount.svg",
      title: t("Profile.buy.vip.label.and_chill.discount."),
      text: t("Profile.buy.vip.label.and_chill.discount.cost"),
    },
  ];
  const [selectCard, setSelectCard] = useState(0);
  useEffect(() => {
    if (!state.vipInfoData.videovip) {
      setVipInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buyMemberEvent() {
    if (
      parseInt(state.user.money) >=
      state.vipInfoData.videovip[selectCard].pay_price
    ) {
      buyVipMember(state.vipInfoData.videovip[selectCard]);
    } else {
      toBuyGoldPage();
    }
  }

  const setVipInfo = () => {
    useGlobalDispatch(setVipInfoAction());
  };
  const buyVipMember = (vipInfo) => {
    useGlobalDispatch(buyVipMemberAction(vipInfo, intl));
  };
  const toBuyGoldPage = () => {
    useGlobalDispatch(
      pushRoutes(pageUrlConstants.profile.pages.profilePayment)
    );
  };

  return (
    <ProfileBuyVipVideoElement main_height={state.navbar.mainHeight}>
      <div className="container">
        {state.vipInfoData.videovip_expired && (
          <div className="container_header">
            <p className="container_header_text">
              {Date.now() <
              new Date(state.vipInfoData.videovip_expired).valueOf()
                ? t("Profile.buy.vip.video.card.maturity.until") +
                  state.vipInfoData.videovip_expired +
                  t("Profile.buy.label.maturity")
                : t("Profile.buy.vip.video.card.maturity.description")}
            </p>
          </div>
        )}
        <div className="container_body">
          <div className="container_body_content">
            {state.vipInfoData.videovip
              ? state.vipInfoData.videovip.map((data, index) => {
                  return (
                    <ProfileCardItem
                      index={index}
                      selectCard={selectCard}
                      setSelectCard={setSelectCard}
                      active={index}
                      title={data.outside_display_name}
                      description={data.description}
                      price={data.pay_price}
                      back_img={
                        videoCardBackArr[index % videoCardBackArr.length]
                      }
                      key={data.id}
                    />
                  );
                })
              : ""}
          </div>
        </div>
        <div className="container_footer">
          <div className="container_footer_title">
            <p className="container_footer_title_text">
              {t("Profile.buy.label.benefit_introduce")}
            </p>
          </div>
          <div className="container_footer_description">
            <span className="container_footer_description_text fw-m">
              {t("Profile.buy.vip.video.label.watch.description")}
            </span>
          </div>
          <div className="container_footer_highlight">
            <Grid
              container
              direction="row"
              alignItems="center"
              className={`${
                !isMobile && "px-indent container_footer_highlight_content"
              }`}
              spacing={4}
            >
              {HighlightDatas.map((data) => {
                return (
                  <Grid item md={4} xs={4} key={data.title}>
                    <HighlightItem
                      icon={data.icon}
                      title={data.title}
                      text={data.text}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
        <div className="container_btn" onClick={buyMemberEvent}>
          <span className="container_btn_text">
            {t("Profile.buy.label.buy_now")}
          </span>
        </div>
      </div>
    </ProfileBuyVipVideoElement>
  );
};

export default ProfileBuyVipVideo;

const ProfileBuyVipVideoElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    /*  */
    .container {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - ${main_height}px);
        min-height: calc((var(--vh, 1vh) * 100) - ${main_height}px);

        &_header {
        margin-top: 20px;
        text-align: center;
        &_text {
            font-size: 16px;
            color: ${colors.text_light_grey};
        }
        }
        &_body {
        display: flex;
        justify-content: center;
        width: 100%;
        &_content {
            width: 30%;

            @media (max-width: ${breakPoint.mobile}px) {
            width: 90%;
            }
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
            font-size: 24px;
            }
        }

        &_description {
            margin-top: 10px;
            text-align: center;

            &_text {
            font-size: 16px;
            color: ${colors.dark_pink};
            }
        }

        &_highlight {
            display: flex;
            justify-content: center;
            width: 100%;
            &_content {
            width: 50%;
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
  const t = useTranslations();
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
        <p className="description_text fw-m">{description}</p>
      </div>
      <div className="price">
        <p className="price_text fw-m ">
          {price} &nbsp;
          <label className="price_money fw-xl">{t("Global.money")}</label>
          <label className="fw-s">/</label>
          <label className="price_unit_day fw-xl">
            {t("Global.label.day")}
          </label>
        </p>
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
  border-radius: 5px;
  transition: 0.2s;

  &.active {
    box-shadow: 0 0 0 3px ${colors.dark_pink};
  }

  .title {
    &_text {
      font-size: 30px;
      font-weight: 600;
    }
  }

  .description {
    &_text {
      margin-top: 10px;
      line-height: 1.5em;
      white-space: pre;
    }
  }

  .price {
    margin-top: 10px;

    &_text {
      font-size: 30px;
      text-align: right;

      @media (max-width: ${breakPoint.mobile}px) {
        font-size: 20px;
      }
    }
    &_unit_day {
      font-size: 22px;

      @media (max-width: ${breakPoint.mobile}px) {
        font-size: 16px;
      }
    }
  }
`;

const HighlightItem = ({ icon, title, text }) => {
  return (
    <HighlightElementItem>
      <Image
        className="icon"
        src={icon}
        width={0}
        height={0}
        alt={text}
        title={text}
      />
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
