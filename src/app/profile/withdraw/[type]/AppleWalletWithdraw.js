export default function AppleWalletWithdraw({
  userBalance,
  withdrawableAmount,
  withdrawThreshold,
  paymentMethod = {},
}) {
  return (
    <div className="withdraw-container">
      <h1>Alipay Withdraw</h1>
      <p>This is the Alipay withdrawal page.</p>
      <p>User Balance: {userBalance}</p>
      <p>Withdrawable Amount: {withdrawableAmount}</p>
      <p>Withdraw Threshold: {withdrawThreshold}</p>
      <p>Payment Method Id {paymentMethod.id ?? "-"}</p>
    </div>
  );
}
