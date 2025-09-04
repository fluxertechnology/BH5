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
    <div className="bg-[#f2f2f2] pb-[20.48vw] xl:pb-0">
      <BindBankPageElement
        main_height={state.navbar.mainHeight}
        bg=""
        mobileBg=""
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
                  <label className="form-label">持卡人：</label>
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
                  <label className="form-label">银行卡号：</label>
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
                  <label className="form-label">开户银行：</label>
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
                  <label className="form-label">开户支行：</label>
                  <div className="form-inputs">
                    <input
                      className="input"
                      placeholder="请输入开户支行"
                      value={bankBranch}
                      onChange={(e) => setBankBranch(e.target.value)}
                    />
                  </div>
                </div>

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
    background-position: top;
    background-repeat: no-repeat !important;
    background-size: 100% 23.96vw ;

    
    @media (max-width: 1024px) {
      background: ${mobileBg ? `url(${mobileBg})` : "none"};
      background-size: 100% 53.33vw;
      background-position: top;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .bind-button {
      width: 100%;
      background: #ff4d4f;
      border-radius: 5.12vw;
      padding: 5px 30px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }
  `}
`;

