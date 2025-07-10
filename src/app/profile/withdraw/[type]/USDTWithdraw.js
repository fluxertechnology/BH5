import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import { calculateWithdrawTotal } from "@/hooks/useWithdraw";

export default function USDTWithdraw({
  withDrawData = {},
  fee,
  feeUnit = "percent",
  exchangeRate = 0,
  exchangeCurrencyDisplay,
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

  return (
    <div className="withdraw-container">
      <div className="form-section">
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
                    {fee}
                    {feeUnit === "percent" ? "%" : "元"}
                  </span>
                </div>
                <span className="label">手续费</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">=</span>
                  <span className="value">
                    {calculateWithdrawTotal(withDrawData, withdrawAmount)}
                  </span>
                </div>
                <span className="label">总金额</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">x</span>
                  <span className="value">{exchangeRate}</span>
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
                  withDrawData,
                  withdrawAmount,
                  true,
                )}
              />
              <span className="currency">{exchangeCurrencyDisplay}</span>
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

        {/* 主网 */}
        <div className="form-group">
          <label className="form-label">主网：</label>
          <div className="form-inputs">
            <select
              className="select"
              value={mainnet}
              onChange={(e) => setMainnet(e.target.value)}
            >
              {mainetOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  selected={mainnet === option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 接收地址 */}
        <div className="form-group">
          <label className="form-label">接收地址：</label>
          <div className="form-inputs">
            <input
              className="input"
              placeholder="输入您的接收钱包地址"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
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
