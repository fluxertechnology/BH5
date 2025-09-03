import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState, useEffect } from "react";
import {
  calculateWithdrawTotal,
  getCurrencyDisplay,
} from "@/hooks/useWithdraw";

export default function USDTWithdraw({
  paymentMethod = {},
  onSubmit = () => {},
}) {
  const { isDesktop } = useMediaQuery();

  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const [mainnet, setMainnet] = useState(paymentMethod?.mainnet?.[0] || "");

  const [address, setAddress] = useState("");

  const handleWithdrawAmountChange = async (e) => {
    setWithdrawAmount(parseInt(e.target.value));
  };

  useEffect(() => {
    setMainnet(paymentMethod?.mainnet?.[0] || "");
  }, [paymentMethod]);

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

        {/* 主网 */}
        <div className="form-group">
          <label className="form-label">主网：</label>
          <div className="form-inputs">
            <select
              className="select"
              value={mainnet}
              onChange={(e) => {
                console.log(e.target.value);
                setMainnet(e.target.value);
              }}
            >
              <option value="" disabled>
                选择主网
              </option>
              {paymentMethod.mainnet?.map((value) => (
                <option key={value} value={value} selected={mainnet === value}>
                  {value}
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
              value={address || paymentMethod.address}
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
