/**
 * @description get transferMoneyRule
 *
 * @param {*} [state=[]]
 * @param {*} action INIT_TRANSFERMONEY
 * @return {*}
 */
const getTransferMoney = function (state = [], action) {
  switch (action.type) {
    case "INIT_TRANSFERMONEY":
      return [...action.data];
    default:
      return state;
  }
};

export default getTransferMoney;
