import { useTranslations } from "next-intl";
import Divider from "@mui/material/Divider";
import styled from "styled-components";

import { colors, pageUrlConstants } from "@/lib/constants";

import LinkComponent from "@/components/common/LinkComponent";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  getPriceUnit,
  getPremiumDiamond,
  getUserPremiumDiamond,
} from "@/lib/services/price";

const ProfileMainNav = ({ sign, money }) => {
  const { isMobile } = useMediaQuery();
  const t = useTranslations();

  return (
    <ProfileMainNavElement isBrowser={!isMobile}>
      <div className="profile_container">
        <div className="w-full flex gap-2 p-[20px] md:hidden">
          <LinkComponent
            className="flex-1 flex items-center justify-end h-[16.8vw] bg-[url(/images/profile/topup_button.png)] bg-cover pr-[8vw]"
            routes={pageUrlConstants.profile.pages.profilePayment}
          >
            <span className="flex justify-end text-[5.867vw] text-white">
              充值
            </span>
          </LinkComponent>
          <LinkComponent
            className="flex-1 flex items-center justify-end h-[16.8vw] bg-[url(/images/profile/withdraw_button.png)] bg-cover pr-[8vw]"
            routes={pageUrlConstants.profile.pages.profilePayment}
          >
            <span className="text-[5.867vw] text-white">提現</span>
          </LinkComponent>
        </div>

        <div className="profile_container_header !block">
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
          <div className="flex md:flex-row flex-col gap-4">
            <div className="w-full md:w-[608px] mx-auto">
              <div className="w-full h-[30.667vw] md:h-[135px] rounded-t-[10px] bg-gradient-to-t from-[#f9ecd8] via-[#fdfbf5] to-[#fdfbf5] flex items-center justify-center gap-8 md:gap-4">
                <Image
                  src="/images/icons/diamond.png"
                  width={100}
                  height={100}
                  alt="diamond icon"
                  className="w-[25.733vw] h-[20.667vw] md:w-[6.042vw] md:h-[4.844vw]"
                />
                <div className="md:flex md:flex-col md:items-center">
                  <p className="text-[4.8vw] md:text-[24px]">
                    -- 总{getPriceUnit(t, true)} --
                  </p>
                  <p className="text-[8vw] md:text-[45px] text-[#f04c7e] font-bold">
                    {getPremiumDiamond(t, sign, true)}
                  </p>
                </div>
                <div className="w-[170px] hidden md:block">
                  <LinkComponent
                    className="w-full h-[45px] bg-[url(/images/profile/pc_topup_button.png)] bg-cover flex items-center pl-[60px] hidden"
                    routes={pageUrlConstants.profile.pages.profilePayment}
                  >
                    <span className="text-[5.867vw] md:text-[22px] text-white">
                      我要充值
                    </span>
                  </LinkComponent>
                  <LinkComponent
                    routes={pageUrlConstants.profile.pages.profileWithdraw}
                    className="w-full h-[45px] bg-[url(/images/profile/pc_withdraw_button.png)] bg-cover mt-2 flex items-center pl-[60px] hidden"
                  >
                    <span className="text-[5.867vw] md:text-[22px] text-white">
                      我要提现
                    </span>
                  </LinkComponent>
                </div>
              </div>
              <button className="w-full h-[70px] md:h-[30px] text-[4.8vw] md:text-[16px] text-white bg-gradient-to-r from-[#feb170] to-[#f04c7e] rounded-b-[10px]">
                总{getPriceUnit(t, true)}：{getPremiumDiamond(t, sign, true)}
              </button>
            </div>
            {money > 0 && (
              <div className="w-full md:w-[608px] mx-auto">
                <div className="w-full h-[30.667vw] md:h-[135px] rounded-t-[10px] bg-gradient-to-t from-[#f9ecd8] via-[#fdfbf5] to-[#fdfbf5] flex items-center justify-center gap-8 md:gap-4">
                  <Image
                    src="/images/icons/diamond.png"
                    width={100}
                    height={100}
                    alt="diamond icon"
                    className="w-[25.733vw] h-[20.667vw] md:w-[6.042vw] md:h-[4.844vw]"
                  />
                  <div className="md:flex md:flex-col md:items-center">
                    <p className="text-[4.8vw] md:text-[24px]">
                      -- 总{getPriceUnit(t)} --
                    </p>
                    <p className="text-[8vw] md:text-[45px] text-[#f04c7e] font-bold">
                      {getPremiumDiamond(t, money)}
                    </p>
                  </div>
                  <div className="w-[170px] hidden md:block">
                    <LinkComponent
                      className="w-full h-[45px] bg-[url(/images/profile/pc_topup_button.png)] bg-cover flex items-center pl-[60px]"
                      routes={pageUrlConstants.profile.pages.profilePayment}
                    >
                      <span className="text-[5.867vw] md:text-[22px] text-white">
                        我要充值
                      </span>
                    </LinkComponent>
                    <LinkComponent
                      routes={pageUrlConstants.profile.pages.profileWithdraw}
                      className="w-full h-[45px] bg-[url(/images/profile/pc_withdraw_button.png)] bg-cover mt-2 flex items-center pl-[60px]"
                    >
                      <span className="text-[5.867vw] md:text-[22px] text-white">
                        我要提现
                      </span>
                    </LinkComponent>
                  </div>
                </div>
                <button className="w-full h-[70px] md:h-[30px] text-[4.8vw] md:text-[16px] text-white bg-gradient-to-r from-[#feb170] to-[#f04c7e] rounded-b-[10px]">
                  可提现：{getPremiumDiamond(t, money)}
                </button>
              </div>
            )}
          </div>

          <div className="profile_container_currency !hidden">
            <div className="profile_container_currency_gold">
              <Image
                className="profile_container_currency_gold_icon"
                src="/images/icons/bag_gold.svg"
                width={0}
                height={0}
                alt="gold"
              />
              <p className="profile_container_currency_gold_show">
                {getPriceUnit(t)}：
                <span className="profile_container_currency_gold_show_amount">
                  {getUserPremiumDiamond(t, { sign, money }) ?? "---"}
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
                {getPriceUnit(t)}：
                <span className="profile_container_currency_gold_show_amount">
                  {getUserPremiumDiamond(t, { sign, money }) ?? "---"}
                </span>
              </p>
            </div>
          </div>
          <LinkComponent
            className="profile_container_header_recharge !hidden"
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
            display: flex;
            align-items: center;
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
