import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState, useEffect } from "react";
import {
  calculateWithdrawTotal,
  getCurrencyDisplay,
} from "@/hooks/useWithdraw";

export default function PaypalWithdraw({
  paymentMethod = {},
  onSubmit = () => { },
}) {
  const { isDesktop } = useMediaQuery();

  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const [mainnet, setMainnet] = useState(paymentMethod?.mainnet?.[0] || "");

  const [account, setAccount] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [contactNo, setContactNo] = useState("");

  const [countryCode, setCountryCode] = useState("");
  const [countryCodeDummy, setCountryCodeDummy] = useState([
    {
      code: 886,
      name: "台湾"
    },
    {
      code: 86,
      name: "中国"
    },
  ]);

  const handleWithdrawAmountChange = async (e) => {
    setWithdrawAmount(parseInt(e.target.value));
  };

  useEffect(() => {
    setMainnet(paymentMethod?.mainnet?.[0] || "");
    
    setCountryCode(countryCodeDummy[0]?.code || "");
  }, [paymentMethod]);

  return (
    <div className="withdraw-container paypal">
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

        {/* 邮箱 */}
        <div className="form-group">
          <label className="form-label">邮箱：</label>

          {isDesktop && (
            <div className="warning-wrapper">
              <div className="warning-cont">
                <p>请妥善填写地址信息,<br />绑定后不可更改</p>
                <div className="bind-container">
                  <button
                    className="bind-button"
                    onClick={() =>
                      onSubmit({
                        email,
                        account,
                        realname: {
                          firstName,
                          lastName
                        },
                      })
                    }
                  >
                    绑定
                  </button>
                </div>
                <div className="bind-cancel-container">
                  <button
                    className="bind-cancel-button"
                    onClick={() =>
                      alert("user cancel")
                    }
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="form-inputs">
            <input
              className="input"
              placeholder="输入收款人的Paypal邮箱"
              value={email || paymentMethod.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* 账户 */}
        <div className="form-group">
          <label className="form-label">账户：</label>
          <div className="form-inputs">
            <input
              className="input"
              placeholder="输入账户"
              value={account || paymentMethod.account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
        </div>

        {/* 实名 */}
        <div className="form-group">
          <label className="form-label">真实姓名：</label>
          <div className="form-inputs">
            <div className="g-flex gap-3">
              
              <input
                className="input"
                placeholder="First name/名"
                value={firstName || paymentMethod.firstName}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <input
                className="input"
                placeholder="Last name/姓"
                value={lastName || paymentMethod.lastName}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>
        </div>

         {/* 电话 */}
        <div className="form-group">
          <label className="form-label">电话：</label>
          <div className="form-inputs">
            <div className="g-flex phone-input-wrapper">
              <select
                className="select"
                value={countryCode}
                onChange={(e) => {
                  console.log(e.target.value);
                  setCountryCode(e.target.value);
                }}
              >
                <option value="" disabled>
                  选择国家
                </option>
                {countryCodeDummy?.map((country) => (
                  <option key={country.name} value={country.code} selected={countryCode === country.code}>
                    {`+${country.code} (${country.name})`}
                    {/* {country.code} */}
                  </option>
                ))}
              </select>
              <input
                className="input"
                placeholder="输入电话"
                type="tel"
                value={contactNo || paymentMethod.contactNo}
                onChange={(e) => setContactNo(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="paypal-btn-wrapper g-flex-center gap-[1rem] xl:gap-3 g-flex-column-center xl:flex-row">
          {/* 绑定按钮 */}
          <div className="bind-container">
            <button
              className="bind-button"
              onClick={() =>
                onSubmit({
                  email,
                  account,
                  realname: {
                    firstName,
                    lastName
                  },
                })
              }
            >
              绑定
            </button>
          </div>
          <div className="submit-container">
            <button
              className="submit-button"
              onClick={() =>
                onSubmit({
                  money: withdrawAmount,
                  pay_id: paymentMethod.id,
                  email,
                  account,
                  realname: {
                    firstName,
                    lastName
                  },
                  mainnet,
                })
              }
            >
              提现
            </button>
          </div>
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
