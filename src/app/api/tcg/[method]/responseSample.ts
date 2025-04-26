// references: https://doc.tc-gaming.com/TW/
export const responseSample = {
  createUser: { status: 0, "error_ desc": null },
  updatePassword: { status: 0, "error_ desc": null },
  kickOutLottoMember: { status: 0, "error_ desc": null },
  getBalance: { status: 0, balance: 100, "error_ desc": null },
  userTransfer: {
    status: 0,
    error_desc: null,
    transaction_status: "SUCCESS",
  },
  fundTransferOutAll: { status: 0, "error_ desc": null, amount: 36 },
  checkTransfer: {
    status: 0,
    error_desc: "null",
    transaction_status: "SUCCESS",
    transaction_details: {
      transId: "string",
      refId: "string",
      userName: "string",
      status: "P",
      amount: 0,
      fundType: "DEPOSIT",
    },
  },
  getLaunchGameRng: {
    status: 0,
    error_desc: null,
    error_message: null,
    game_url: "https://gci...[略]...",
  },
  getGameList: {
    status: 0,
    games: [
      {
        displayStatus: 0,
        gameType: "RNG",
        gameName: "Big fish eat small fish_大鱼吃小鱼",
        tcgGameCode: "G00005",
        productCode: "GG",
        productType: "7",
        platform: "flash,html5",
        gameSubType: "SM",
        trialSupport: true,
      },
    ],
    error_desc: null,
    page_info: { totalPage: 1, currentPage: 1, totalCount: null },
  },
};
