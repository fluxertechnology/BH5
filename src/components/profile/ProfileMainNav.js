import { useTranslations } from "next-intl";
import Divider from "@mui/material/Divider";
import styled from "styled-components";

import { colors, pageUrlConstants } from "@/lib/constants";

import LinkComponent from "@/components/common/LinkComponent";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";

const ProfileMainNav = ({ sign, money }) => {
  const { isMobile } = useMediaQuery();
  const t = useTranslations();

  return (
    <ProfileMainNavElement isBrowser={!isMobile}>
      <div className="profile_container">
        <div className="profile_container_header">
          <h3 className="profile_container_header_title">
            <span className="profile_container_header_title_text ">
              <Image
                className="profile_container_header_title_icon mb-2"
                src="/images/profile/account_wallet.svg"
                width={0}
                height={0}
                alt="account wallet icon"
              />
              {t("Profile.main.nav.my_account")}
            </span>
          </h3>
          <LinkComponent
            className="profile_container_header_recharge"
            routes={pageUrlConstants.profile.pages.profilePayment}
          >
            <Image
              className="profile_container_header_title_icon_recharge"
              src="/images/icons/recharge.svg"
              width={0}
              height={0}
              alt="recharge icon"
            />
            {t("Profile.main.nav.charge")}
          </LinkComponent>
        </div>
        <div className="profile_container_currency">
          <div className="profile_container_currency_gold">
            <Image
              className="profile_container_currency_gold_icon"
              src="/images/icons/bag_gold.svg"
              width={0}
              height={0}
              alt="gold"
            />
            <p className="profile_container_currency_gold_show">
              {t("Global.gold_money")}：
              <span className="profile_container_currency_gold_show_amount">
                {typeof sign === "number" ? sign : "---"}
              </span>
            </p>
          </div>
          <div className="profile_container_currency_money">
            <Image
              className="profile_container_currency_money_icon"
              src="/images/icons/bag_money.svg"
              width={0}
              height={0}
              alt="money"
            />
            <p className="profile_container_currency_money_show">
              {t("Global.money")}：
              <span className="profile_container_currency_gold_show_amount">
                {money ? parseInt(money) : "---"}
              </span>
            </p>
          </div>
        </div>
        <Divider className="profile_container_divider" />
      </div>
    </ProfileMainNavElement>
  );
};

export default ProfileMainNav;

export const ProfileMainNavElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isBrowser"].includes(prop),
})`
  ${({ isBrowser }) => `
    /*  */
    padding: 1% 1% 0 1%;
    background-color: ${colors.back_grey};

    .profile_container {
        background-color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        font-size: ${isBrowser && "16px"};

        &_title {
            &_text {
            font-size: ${isBrowser && "28px"};
            }

            &_icon {
            vertical-align: middle;
            margin-right: 5px;
            width: 35px;
            height: 35px;

            &_recharge {
                margin-top: 2px;
                width: 25px;
                height: 25px;
            }
            }

            &_text {
            font-weight: 1000;
            }
        }

        &_recharge {
            display: flex;
            align-items: center;
            font-size: 1em;
            text-decoration: none;
            color: #fff;
            background-color: ${colors.back_dark_pink};
            padding: 2px 3px;
        }
        }

        &_divider {
        margin: 0 1% 0 1%;
        border-width: 1px;
        }
    }

    .profile_container_currency {
        display: flex;
        padding-bottom: 20px;

        &_gold {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            right: -0.5px;
            width: 1px;
            height: 100%;
            background-color: #aaa;
        }
        }

        &_gold,
        &_money {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;

        &_icon {
            margin-bottom: -6px;
            width: 45px;
        }

        &_show {
            margin-left: 10px;
            font-size: ${isBrowser && "16px"};
            color: #646464;

            &_amount {
            font-size: ${isBrowser && "26px"};
            letter-spacing: 1px;
            color: #000;
            font-weight: 900;
            }
        }
        }
    }
    `}
`;
