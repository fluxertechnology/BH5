import { useState, useEffect } from "react";
import { nowLang } from "@/i18n/Metronici18n";
import { apiUrl } from "@/lib/constants";
import toastCall from "@/lib/services/toastCall";
import { useGlobalContext } from "@/store";

const useWithdraw = () => {
  const { state } = useGlobalContext();

  const [userBalance, setUserBalance] = useState(0);
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const [withdrawThreshold, setWithdrawThreshold] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawData = async () => {
      const withdrawData = await getUserWithdraw(state);
      setUserBalance(withdrawData?.money || 0);
      setWithdrawableAmount(withdrawData?.withdraw_money || 0);
      setWithdrawThreshold(withdrawData?.withdraw_threshold || 0);
      setPaymentMethods(withdrawData?.payment_method || []);
      setLoading(false);
    };

    fetchWithdrawData();
  }, [state.user.id]);

  return {
    userBalance,
    withdrawableAmount,
    withdrawThreshold,
    paymentMethods,
    loading,
  };
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
