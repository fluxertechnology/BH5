export default function USDTWithdraw({
  userBalance,
  withdrawableAmount,
  withdrawThreshold,
  paymentMethod = {},
}) {
  return (
    <div className="withdraw-container">
      <h1>USDT Withdraw</h1>
      <p>This is the USDT withdrawal page.</p>
      <p>User Balance: {userBalance}</p>
      <p>Withdrawable Amount: {withdrawableAmount}</p>
      <p>Withdraw Threshold: {withdrawThreshold}</p>
      <p>Payment Method Id {paymentMethod.id ?? "-"}</p>
    </div>
  );
}
