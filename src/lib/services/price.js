// 金币0；精钻0 前端则显示0精钻 @+886 910 327 760 你觉得要隐藏支付选项 还是要保留显示0精钻 用户解锁0精钻
// 金币0；精钻100 前端则显示100精钻 与原先一样
// 金币100；精钻0 前端显示1精钻(因金币不使用 金币单位以100:1的比例去转换为精钻)
// 金币1000；精钻100 前端显示100精钻(因金币不使用，则保留原始精钻价格显示)

import { get } from "http";

const MULTIPLIER = 100; // 金币转精钻的倍数

const formatPremiumDiamond = (amount) => {
  // return Math.floor(amount / MULTIPLIER);
  // return amount.toFixed(2);
  return amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
};

export const getPriceUnit = (t) => {
  return t("Global.premium_diamond");
};

export const getPremiumDiamond = (t, value, isCoins, withUnit = true) => {
  const priceUnit = getPriceUnit(t);
  const amount = parseFloat(value) || 0;
  const convertedAmount = isCoins ? amount / MULTIPLIER : amount;

  if (!withUnit) {
    return formatPremiumDiamond(convertedAmount);
  }
  return `${formatPremiumDiamond(convertedAmount)} ${priceUnit}`;
};

export const getPremiumDiamondWithBoth = (
  t,
  coins,
  diamonds,
  withUnit = true
) => {
  const coinAmount = parseFloat(coins) || 0;
  const diamondAmount = parseFloat(diamonds) || 0;

  if (diamondAmount > 0) {
    return `${getPremiumDiamond(t, diamondAmount, false, withUnit)}`;
  }
  if (coinAmount > 0) {
    return `${getPremiumDiamond(t, coinAmount, true, withUnit)}`;
  }
  return getPremiumDiamond(t, 0, false, withUnit);
};

export const getPremiumDiamondForSign = (t, sign, withUnit = true) => {
  const signAmount = parseFloat(sign) || 0;
  if (signAmount > 0) {
    return getPremiumDiamond(t, signAmount, true, withUnit);
  }
  return getPremiumDiamond(t, 0, true, withUnit);
};

export const getUserPremiumDiamond = (t, user, type = "sign") => {
  const totalMoney = parseFloat(user?.money) || 0; // 精钻
  if (totalMoney > 0) {
    return getPremiumDiamond(t, totalMoney, false);
  }
  if (type === "sign") {
    return getPremiumDiamondForSign(t, user?.sign ?? 0);
  }

  const total = parseFloat(user?.[type]) || 0;
  return getPremiumDiamond(t, total, true);
};

export const getPrice = (t, data) => {
  const limitFreeTime = parseFloat(data.limit_free_time) || 0; //限免时间
  const coin = parseFloat(data.need_jinbi) || parseFloat(data.jinbi) || 0; //金币
  const diamond = parseFloat(data.need_money) || parseFloat(data.money) || 0; //精钻

  if (limitFreeTime > 0) {
    return "";
  }

  if (diamond > 0) {
    return `${getPremiumDiamond(t, diamond, false)}`;
  }

  if (coin > 0) {
    return `${getPremiumDiamond(t, coin, true)}`;
  }

  return getPremiumDiamond(t, 0, false);
};

/*
 * /profile/invites
 */
export const getAvatarPrice = (t, data) => {
  const priceUnit = getPriceUnit(t);

  const isPay = data.is_pay;
  const isFree = data.is_free;
  const price = data.amount;
  const type = data.type; // 1: 金币, 2:  鑽石/精钻

  if (isFree || price === 0) {
    return t("Global.free");
  }
  if (isPay) {
    return t("Social.detail.info.label.unlocked");
  }

  if (type === 1) {
    return getPremiumDiamond(t, price, true);
  } else if (type === 2) {
    return getPremiumDiamond(t, price, false);
  }

  return getPremiumDiamond(t, price, false);
};

/*
 * /profile/invites
 * WebTopBar.js
 * /profile -> ProfileMainMissionCenter.js
 */
export const getProfileMissionPrice = (t, type, data) => {
  const priceUnit = getPriceUnit(t);

  if (type === "signin_everyday") {
    const signinBegin = getPremiumDiamond(t, data.signinbegin, true, false);
    const signinEnd = getPremiumDiamond(t, data.signinend, true, false);
    return `${signinBegin} - ${signinEnd} ${priceUnit}`;
  } else if (type === "invite_friend") {
    const sharefjb = getPremiumDiamond(t, data.sharefjb, true);
    return sharefjb;
  }

  return "";
};

/*
 * /profile/mission
 */
export const getProfileMissionRewardPrice = (
  t,
  type,
  reward,
  completed = false
) => {
  //1金幣 2精鑽 3 vip天數 4 商城優惠卷 5 個人頭像
  const priceUnit = getPriceUnit(t);
  const typeMap = {
    1: priceUnit,
    2: priceUnit,
    3: t("Profile.permission.vip_day"),
    4: t("Profile.permission.shop_coupon"),
    5: t("Profile.permission.personal_avatar"),
  };
  let reward_quantity = parseFloat(reward) || 0;
  if (type === 1) {
    reward_quantity = getPremiumDiamond(t, reward_quantity, true, false);
  }
  return `${completed ? "" : "+"}${reward_quantity} ${
    typeMap[type] ?? priceUnit
  }`;
};

/*
 * /profile/myorder
 * /profile/myorderDetail/[orderId]
 */
export const getMyOrderPrice = (t, data) => {
  const priceUnit = getPriceUnit(t);

  const amount = parseFloat(data.amount) || 0;
  const payType = data.paytype; // 1: 金币, 0: 精钻

  if (payType) {
    return {
      unit: priceUnit,
      amount: getPremiumDiamond(t, amount, true, false),
    };
  }
  return {
    unit: priceUnit,
    amount: getPremiumDiamond(t, amount, false, false),
  };
};

export const getOutOfQuotaPrice = (t, data) => {
  const unit = data.unit || "gold"; // 默认单位为金币
  const amount = parseFloat(data.gold) || 0;

  return getPremiumDiamond(t, amount, unit === "gold");
};
