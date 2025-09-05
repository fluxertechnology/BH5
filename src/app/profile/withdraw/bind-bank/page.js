"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import useMediaQuery from "@/hooks/useMediaQuery";
import { bindWithdrawPayment } from "@/hooks/useWithdraw";
import { useGlobalContext, useGlobalDispatch } from "@/store";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";
import toastCall from "@/lib/services/toastCall";

function BindBankPage() {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const { isDesktop } = useMediaQuery();

  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        show: false,
        isShowFooter: isDesktop ? true : false,
      },
    });
  }, [isDesktop]);

  const handleSubmit = async () => {
    if (!cardHolderName || !cardNumber || !bankName || !bankBranch) {
      toastCall("请填写完整信息");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bindWithdrawPayment(state, {
        pay_id: 2,
        card_number: cardNumber,
        card_bank: bankName,
        card_bank_branch: bankBranch,
      });

      if (result.isSuccess) {
        setCardHolderName("");
        setCardNumber("");
        setBankName("");
        setBankBranch("");
      }
    } catch (error) {
      console.error("绑定银行卡失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-[20.48vw] xl:pb-0">
      <BindBankPageElement
        main_height={state.navbar.mainHeight}
        bg="/images/profile/withdraw_bg_bind_bank.png"
        mobileBg="/images/profile/withdraw_mobile_bg_bind_bank.png"
      >
        <TopBarContainer>
          <TopTitleBar
            title="银行卡绑定"
            showBack={true}
            color="#000"
            back_color="#fff"
          />
        </TopBarContainer>

        <div className="component-container--outer">
          <div className="component-container">
            <div className="withdraw-container">
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">持卡人</label>
                  <div className="form-inputs">
                    <input
                      className="input"
                      placeholder="请输入持卡人姓名"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">银行卡号</label>
                  <div className="form-inputs">
                    <input
                      className="input"
                      placeholder="请输入银行卡号"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">开户银行</label>
                  <div className="form-inputs">
                    <input
                      className="input"
                      placeholder="请输入开户银行"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">开户支行</label>
                  <div className="form-inputs">
                    <input
                      className="input"
                      placeholder="请输入开户支行"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                    />
                  </div>
                </div>
                <p className="tips">
                  （请妥善填写银行卡信息，绑定后不可以更改）
                </p>

                <div className="bind-container">
                  <button
                    className="bind-button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "绑定中..." : "绑定"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BindBankPageElement>
    </div>
  );
}

export default BindBankPage;

const BindBankPageElement = styled.div.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height, bg, mobileBg }) => `
    margin-top: ${main_height}px;
    font-family: "Microsoft YaHei";
    background: ${bg ? `url(${bg})` : "none"};
    background-position: center;
    background-size: 100% 23.96vw ;
    padding-top: 10.9vw;
    padding-bottom: 10.9vw;
    
    @media (max-width: 1024px) {
      background: ${mobileBg ? `url(${mobileBg})` : "none"} no-repeat;
      background-size: 100% 42.13vw;
      background-position: top;
      padding-top: 24.45vw;
      padding-bottom: 10.9vw;
    }

    // .component-container--outer{
    //   padding-top: 2vw;
    // }

    .form-section {
      display: flex;
      flex-direction: column;
      padding: 4.4vw 3.18vw 11vw;
      background-color: #fff;
      border-color: rgb(205, 205, 205);
      border-width: 1px;
      border-style: solid;
      border-radius: 0.78vw;
      width: 95.89vw;
      margin: auto;

      @media (max-width: 1024px) {
        padding: 7.0vw 5.6vw 17vw;
        width: 93.33vw;
        border-radius:2.67vw;
      }
    }

    .form-group {
      display: flex;
      border-bottom: 1px solid #cdcdcd;
      padding-bottom: 1.4vw;
      margin-bottom: 1.4vw;
      @media (max-width: 1024px) {
        padding-bottom: 3.5vw;
        margin-bottom: 3.8vw;
      }
    }

    .form-label {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      color: rgb(51, 51, 51);
      font-weight: bold;
      line-height: 1.2;
      text-align: left;
      width: 10vw;

      @media (max-width: 1024px) {
        width: 21.2vw;
        font-size: 3.2vw;
      }
    }

    .form-inputs {
      display: flex;
      align-items: center;
    }

    .form-inputs .input {
      font-size: 24px;
      font-family: "Microsoft YaHei";
      line-height: 1.2;
      text-align: left;
      @media (max-width: 1024px) {
        font-size: 2.8vw;
      }
    }
      
    .form-inputs .input::placeholder {
      font-size: 18px;
      @media (max-width: 1024px) {
        font-size: 2.4vw;
      }
    }
        
    .tips{
      font-size: 18px;
      font-family: "Microsoft YaHei";
      color: rgb(102, 102, 102);
      line-height: 1.2;
      text-align: center;
      z-index: 23;
      margin: 0.35vw 0 5.5vw;
      @media (max-width: 1024px) {
        font-size: 2.4vw;
        margin: 0.85vw 0 9.5vw;
      }
    }

    .bind-container{
      position: relative;
      margin: auto;
      display:flex;
      justify-content: center;
    }

    .bind-button {
      width: 18.75vw;
      height: 4.15vw;
      background-image: -moz-linear-gradient( 90deg, rgb(249,54,34) 0%, rgb(255,69,122) 100%);
      background-image: -webkit-linear-gradient( 90deg, rgb(249,54,34) 0%, rgb(255,69,122) 100%);
      background-image: -ms-linear-gradient( 90deg, rgb(249,54,34) 0%, rgb(255,69,122) 100%);
      border-radius: 5.12vw;
      padding: 5px 30px;
      color: #fff;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;

      @media (max-width: 1024px) {
        width: 46.67vw;
        height: 10.67vw;
        font-size: 4vw;
      }
    }

  `}
`;
