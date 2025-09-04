import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import {
  calculateWithdrawTotal,
  getCurrencyDisplay,
} from "@/hooks/useWithdraw";
import WithdrawCardCarousel from "@/components/common/WithdrawCardCarousel";

export default function BankWithdraw({
  paymentMethod = {},
  onSubmit = () => {},
}) {
  const { isDesktop } = useMediaQuery();

  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const mainetOptions = [{ value: "TRC20", label: "Tron(TRC20)" }];
  const [mainnet, setMainnet] = useState(mainetOptions[0].value);

  const [address, setAddress] = useState("");

  const handleWithdrawAmountChange = async (e) => {
    setWithdrawAmount(parseInt(e.target.value));
  };

  const items = [
    {
      id: 1,
      title: "card-1",
    },
    {
      id: 2,
      title: "card-2",
    },
    {
      id: 3,
      title: "card-3",
      card: {
        name: paymentMethod?.card_bank,
        number: paymentMethod?.card_number,
        branch: paymentMethod.card_bank_branch,
        type: paymentMethod.type,
        is_binding: paymentMethod.is_binding,
      },
    },
    {
      id: 4,
      title: "card-4",
    },
    {
      id: 5,
      title: "card-5",
    },
    {
      id: 6,
      title: "card-6",
    },
    {
      id: 7,
      title: "card-7",
    },
  ];

  return (
    <div className="withdraw-container">
      <div className="form-section">
        <WithdrawCardCarousel items={items} />
        {/* 提现精钻 */}
        <div className="form-group">
          <label className="form-label">提现精钻：</label>
          <div className="form-inputs">
            <input
              className="input"
              placeholder="输入可提现的精钻数量"
              onChange={handleWithdrawAmountChange}
            />
            <div className="summary">
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">-</span>
                  <span className="value">
                    {paymentMethod.fee}
                    {paymentMethod.fee_type === "percent" ? "%" : "元"}
                  </span>
                </div>
                <span className="label">手续费</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">=</span>
                  <span className="value">
                    {calculateWithdrawTotal(paymentMethod, withdrawAmount)}
                  </span>
                </div>
                <span className="label">总金额</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">x</span>
                  <span className="value">
                    {paymentMethod.money_exchange_rate}
                  </span>
                </div>
                <span className="label">汇率</span>
              </div>
            </div>

            <div className="input-row">
              <input
                className="input with-suffix"
                placeholder="123"
                readOnly
                value={calculateWithdrawTotal(
                  paymentMethod,
                  withdrawAmount,
                  true,
                )}
              />
              <span className="currency">
                {getCurrencyDisplay(paymentMethod.money_exchange_currncy)}
              </span>
              <Image
                className="flag"
                src="/images/profile/withdraw_us_flag.png"
                width={0}
                height={0}
                alt="US Flag"
              />
            </div>
          </div>
        </div>

        {/* 提现按钮 */}
        <div className="submit-container">
          <button
            className="submit-button"
            onClick={() =>
              onSubmit({
                money: withdrawAmount,
                pay_id: paymentMethod.id,
                address,
                mainnet,
              })
            }
          >
            提现
          </button>
        </div>

        {/* 提示信息 */}
        {isDesktop && (
          <p className="tip">
            <span className="tip-icon">※</span>{" "}
            提现精钻仅限通过实名认证的账号，点击账户信息页可申请提现
          </p>
        )}
      </div>
    </div>
  );
}
