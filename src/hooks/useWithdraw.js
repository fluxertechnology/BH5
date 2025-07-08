import { useState, useEffect } from "react";
import { nowLang } from "@/i18n/Metronici18n";
import { apiUrl } from "@/lib/constants";
import toastCall from "@/lib/services/toastCall";
import { useGlobalContext } from "@/store";

const currencyDisplay = {
  USD: "US$",
};

const useWithdraw = () => {
  const { state } = useGlobalContext();

  const [withDrawData, setWithDrawData] = useState({});
  const [withdrawFee, setWithdrawFee] = useState(0);
  // 手續費單位(percent:百分比,price:金額)
  const [withdrawFeeUnit, setWithdrawFeeUnit] = useState("percent");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [exchangeCurrency, setExchangeCurrency] = useState("USD");
  const [exchangeCurrencyDisplay, setExchangeCurrencyDisplay] = useState("US$");

  const [userBalance, setUserBalance] = useState(0);
  const [withdrawMoney, setWithdrawMoney] = useState(0);
  const [withdrawThreshold, setWithdrawThreshold] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawData = async () => {
      const withdrawData = await getUserWithdraw(state);
      setWithDrawData(withdrawData);
      setWithdrawFee(withdrawData?.fee || 0);
      setWithdrawFeeUnit(withdrawData?.fee_type || "percent");
      setExchangeRate(withdrawData?.money_exchange_rate || 0);
      setExchangeCurrency(withdrawData?.money_exchange_currncy || "USD");
      setExchangeCurrencyDisplay(
        currencyDisplay[withdrawData?.money_exchange_currncy] || "US$",
      );
      setUserBalance(withdrawData?.money || 0);
      setWithdrawMoney(withdrawData?.withdraw_money || 0);
      setWithdrawThreshold(withdrawData?.withdraw_threshold || 0);
      setPaymentMethods(withdrawData?.payment_method || []);
      setLoading(false);
    };

    fetchWithdrawData();
  }, [state.user.id]);

  return {
    withDrawData,
    fee: withdrawFee,
    feeUnit: withdrawFeeUnit,
    exchangeRate,
    exchangeCurrency,
    exchangeCurrencyDisplay,
    userBalance,
    withdrawMoney,
    withdrawThreshold,
    paymentMethods,
    loading,
  };
};

export const calculateWithdrawTotal = (
  withdrawData,
  withdrawAmount,
  exchange = false,
) => {
  if (withdrawAmount <= 0) {
    return 0;
  }
  const fee = withdrawData.fee || 0;
  const feeUnit = withdrawData.fee_type || "percent";
  const exchangeRate = withdrawData.money_exchange_rate || 0;
  let amount = withdrawAmount;
  if (fee <= 0) {
    return parseFloat(amount.toFixed(2));
  }
  if (feeUnit === "percent") {
    const feeAmount = (withdrawAmount * fee) / 100;
    amount -= feeAmount;
  } else if (feeUnit === "price") {
    amount -= fee;
  }
  if (exchange && exchangeRate > 0) {
    amount *= exchangeRate;
  }
  return parseFloat(amount.toFixed(2));
};

export const isValidWithdrawAmount = (withdrawData, withdrawAmount) => {
  if (!/^\d*\.?\d*$/.test(withdrawAmount)) {
    return false;
  }
  if (withdrawAmount > withdrawData.money) {
    toastCall("提现金额不能超过账户余额");
    return false;
  }
  if (withdrawAmount < withdrawData.withdraw_threshold) {
    toastCall(
      `提现金额不能低于最低提现金额 ${withdrawData.withdraw_threshold}`,
    );
    return false;
  }
  return true;
};

export default useWithdraw;

const getUserWithdraw = async (state) => {
  try {
    const response = await fetch(`${apiUrl}/appapi/tcg/get_user_withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Language": ["sc", "tc"].includes(nowLang) ? "zh" : "en",
      },
      body: JSON.stringify({
        uid: state.user.id,
      }),
    });

    const data = await response.json();

    if (data.code === 0) {
      toastCall(data.msg || "获取提领数据失败");
      return {};
    }

    return data.data || {};
  } catch (error) {
    console.error("Error fetching withdrawal data:", error);
    return {};
  }
};

export const postUserWithdraw = async (state, params) => {
  try {
    const response = await fetch(`${apiUrl}/appapi/tcg/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Language": ["sc", "tc"].includes(nowLang) ? "zh" : "en",
      },
      body: JSON.stringify({
        uid: state.user.id,
        ...params,
      }),
    });

    const data = await response.json();

    if (data.code === 0) {
      toastCall(data.msg || "提交提领申请失败");
      return {
        isSuccess: false,
        error: data.msg || "提交提领申请失败",
      };
    }

    toastCall(data.msg || "提交提领申请成功");
    return {
      isSuccess: true,
      data: data.data || {},
    };
  } catch (error) {
    toastCall("提交提领申请时发生错误");
    console.error("Error submitting withdrawal request:", error);
    return {
      isSuccess: false,
      error: "提交提领申请时发生错误",
    };
  }
};

export const getUserWithdrawHistory = async (state) => {
  try {
    const response = await fetch(`${apiUrl}/appapi/tcg/get_withdraw_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Language": ["sc", "tc"].includes(nowLang) ? "zh" : "en",
      },
      body: JSON.stringify({
        uid: state.user.id,
      }),
    });

    const data = await response.json();

    if (data.code === 0) {
      toastCall(data.msg || "获取提领历史失败");
      return [];
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    return [];
  }
};
