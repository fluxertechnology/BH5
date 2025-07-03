export default function USDTWithdraw({
  userBalance,
  withdrawableAmount,
  withdrawThreshold,
  paymentMethod = {},
}) {
  return (
    <div className="withdraw-container">
      <div className="form-section">
        {/* 提现精钻 */}
        <div className="form-group">
          <label className="form-label">提现精钻：</label>
          <div className="form-inputs">
            <input className="input" placeholder="输入可提现的精钻数量" />
            <div className="summary">
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">-</span>
                  <span className="value">1</span>
                </div>
                <span className="label">手续费</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">=</span>
                  <span className="value">123</span>
                </div>
                <span className="label">总金额</span>
              </div>
              <div className="summary-item">
                <div className="value-with-bullet">
                  <span className="bullet">x</span>
                  <span className="value">6.97</span>
                </div>
                <span className="label">汇率</span>
              </div>
            </div>

            <div className="input-row">
              <input className="input with-suffix" placeholder="123" />
              <span className="currency">US$</span>
              <img src="/us_flag.png" className="flag" alt="US Flag" />
            </div>
          </div>
        </div>

        {/* 主网 */}
        <div className="form-group">
          <label className="form-label">主网：</label>
          <div className="form-inputs">
            <select className="select">
              <option>Tron(TRC20)</option>
            </select>
          </div>
        </div>

        {/* 接收地址 */}
        <div className="form-group">
          <label className="form-label">接收地址：</label>
          <div className="form-inputs">
            <input className="input" placeholder="输入您的接收钱包地址" />
          </div>
        </div>

        {/* 提现按钮 */}
        <div className="submit-container">
          <button className="submit-button">提现</button>
        </div>

        {/* 提示信息 */}
        <p className="tip">
          <span className="tip-icon">※</span>{" "}
          提现精钻仅限通过实名认证的账号，点击账户信息页可申请提现
        </p>
      </div>
    </div>
  );
}
