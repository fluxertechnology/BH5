"use client";

import styled from "styled-components";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getUserWithdrawHistory,
  getUserTransferLog,
} from "@/hooks/useWithdraw";

import TopBarContainer from "@/components/layout/Header/TopBarContainer";
import TopTitleBar from "@/components/common/TopTitleBar";

export default function WithdrawHistoryPage() {
  const { state } = useGlobalContext();
  const { isMobile } = useMediaQuery();

  const [withdrawLog, setWithdrawLog] = useState([]);
  const [transactionLog, setTransactionLog] = useState([]);
  const [activeTab, setActiveTab] = useState("withdraw"); // withdraw, transfer-in, transfer-out

  useEffect(() => {
    (async () => {
      const withdrawLog = await getUserWithdrawHistory(state);
      console.log("Withdraw Log:", withdrawLog);
      setWithdrawLog(withdrawLog || []);

      const transferLog = await getUserTransferLog(state);
      setTransactionLog(transferLog || []);
    })();
  }, [state.user.id]);

  useEffect(() => {
    const activeTabLabel =
      tabs.find((tab) => tab.id === activeTab)?.label || "记录";
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title={activeTabLabel}
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, [activeTab]);

  const tabs = [
    {
      id: "withdraw",
      label: "提领记录",
      count: withdrawLog.length,
      icon: "withdraw_history_type_1.png",
    },
    // {
    //   id: "transfer-in",
    //   label: "转入记录",
    //   count: transactionLog.filter((t) => t.type === "in").length,
    // },
    // {
    //   id: "transfer-out",
    //   label: "转出记录",
    //   count: transactionLog.filter((t) => t.type === "out").length,
    // },
    // {
    //   id: "transfer-in",
    //   label: "转入记录",
    //   count: transactionLog.filter((t) => t.type === "in").length,
    // },
    {
      id: "transfer-all",
      label: "转入转出记录",
      count: transactionLog.length,
      icon: "withdraw_history_type_2.png",
    },
  ];

  const renderWithdrawTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm table-contain">
        <thead>
          <tr className="border-b">
            <th className="text-left">时间</th>
            <th className="text-left">提领方式</th>
            <th className="text-left">提领类型</th>
            {/* <th className="text-left">地址</th> */}
            <th className="text-left">提领金額</th>
            {/* <th className="text-left">订单号</th> */}
            <th className="text-left">订单状态</th>
          </tr>
        </thead>
        <tbody>
          {withdrawLog.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-8 text-center text-gray-500">
                暂无提领记录
              </td>
            </tr>
          ) : (
            withdrawLog.map((record) => (
              <>
                <tr
                  key={record.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="text-gray-600">{record.create_time}</td>
                  <td className="">{record.payment_method}</td>
                  <td className="text-gray-600">虚拟货币</td>
                  {/* <td className="">
                  <span className="break-all max-w-xs block text-center m-auto">
                    {record.addess}
                  </span>
                </td> */}
                  <td className="font-medium">{record.withdraw_money}</td>
                  {/* <td className="text-xs">{record.reference_no}</td> */}
                  <td className="">
                    <span
                      className={`px-2 py-1 rounded ${
                        record.status === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : record.status === 1
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.status === 0
                        ? "未处理"
                        : record.status === 1
                        ? "处理中"
                        : "已撥款"}
                    </span>
                  </td>
                </tr>
                {withdrawLog.length < 3 &&
                  [...Array(3 - withdrawLog.length)].map((_, i) => (
                    <tr key={`filler-${i}`}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j}>&nbsp;</td>
                      ))}
                    </tr>
                  ))}
              </>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderTransferTable = (type) => {
    const filteredData =
      type === "all"
        ? transactionLog
        : transactionLog.filter((t) => t.type === type);

    const title =
      type === "in" ? "转入记录" : type === "out" ? "转出记录" : "转入转出记录";

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-contain">
          <thead>
            <tr className="border-b">
              <th className="text-left">时间</th>
              <th className="text-left">精钻</th>
              <th className="text-left">钱包</th>
              {/* <th className="text-left">订单号</th> */}
              <th className="text-left">订单状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  暂无{title}
                </td>
              </tr>
            ) : (
              filteredData.map((transfer) => (
                <>
                  <tr
                    key={transfer.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="text-gray-600">{transfer.create_time}</td>
                    <td className="font-medium">
                      <span
                        className={
                          (
                            type === "all"
                              ? transfer.type === "in"
                              : type === "in"
                          )
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {transfer.transaction_money}
                      </span>
                    </td>
                    <td className="">{transfer.game_wallet}</td>
                    {/* <td className="text-xs">{transfer.reference_no}</td> */}
                    <td className="">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {transfer.transaction_status}
                      </span>
                    </td>
                  </tr>
                  {filteredData.length < 3 &&
                    [...Array(3 - filteredData.length)].map((_, i) => (
                      <tr key={`filler-${i}`}>
                        {[...Array(4)].map((_, j) => (
                          <td key={j}>&nbsp;</td>
                        ))}
                      </tr>
                    ))}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "withdraw":
        return renderWithdrawTable();
      case "transfer-in":
        return renderTransferTable("in");
      case "transfer-out":
        return renderTransferTable("out");
      case "transfer-all":
        return renderTransferTable("all");
      default:
        return null;
    }
  };

  return (
    <ProfileWithDrawHistoryComponent main_height={state.navbar.mainHeight}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6 type-container">
        <nav className="flex type-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`type-item ${
                activeTab === tab.id
                  ? "active"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Image
                className="type-icon"
                src={`/images/profile/${tab.icon}`}
                width={0}
                height={0}
                alt="US Flag"
              />
              {tab.label}
              {/* {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )} */}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="table-container">{renderActiveTabContent()}</div>
    </ProfileWithDrawHistoryComponent>
  );
}

const ProfileWithDrawHistoryComponent = styled.section.withConfig({
  shouldForwardProp: (prop) => !["main_height"].includes(prop),
})`
  ${({ main_height }) => `
    position: relative;
    overflow: hidden;
    margin-top: ${main_height}px;
    background-image: url('/images/profile/topup_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 16.65vw;
    background-position: top;
    min-height: 100vh;
    

    .type-container{
      display:flex;
      justify-content:center;
      margin: 2.35vw 0 1.84vw;

      .type-list{
        padding: 5px;
        gap: 0.39vw;
        .type-item{
          position: relative;
          background: #fff;
          border-radius: 5px;
          padding: 5px;
          height: 2.6vw;
          transition: all 0.3s ease;
          font-size: 0.94vw;
          font-weight: 700;
          min-width: 9.38vw;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;

          .type-icon{
            height: 1.04vw;
            width: auto;
            margin-right: 0.68vw;
          }
        }

        .type-item.active {
          color: #ff4479;
        }
        .type-item.active::before {
          content: "";
          position: absolute;
          bottom: -0.68vw;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 0.68vw solid transparent;
          border-right: 0.68vw solid transparent;
          border-top: 0.68vw solid #fff; /* 三角形颜色与背景一致 */
          z-index: 2;
        }
      }
    }

    .table-container{
      position:relative;
      width: 95.94vw;
      margin: auto;
      border-radius: 10px;
      background: #fff;
      border: 1px solid #cecccd;

      .table-contain{
        width: 64.79vw;
        margin:auto;

        th,
        td {
          border-right: 1px solid #cdcdcd;
          position: relative;
          text-align: center;
          vertical-align: middle;
        }

        thead{
          tr{
            height: 4.36vw;
            font-weight: 700;
          }
        }

        tbody {
          tr:first-child{
            border-top: 1px solid #cdcdcd;
          }
          tr:not(:last-child){
            border-bottom: 1px solid #cdcdcd;
          }

          tr{
            color: #676767;
            height: 4.5vw;
            font-size: 0.73vw;
          }
        }

        /* 最后一列不需要右边框 */
        tr > th:first-child,
        tr > td:first-child {
          border-left: 1px solid #cdcdcd;
        }
      }
    }


    @media (max-width: 768px) {
      padding: 0 16px;
      background-size: 100% 27.75vw;
      
      .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
      }

      .type-container{
        display:flex;
        justify-content:center;
        margin: 7.2vw 0 5.35vw;

        .type-list{
          padding: 5px;
          gap: 1.2vw;
          .type-item{
            position: relative;
            background: #fff;
            border-radius: 5px;
            padding: 5px;
            transition: all 0.3s ease;
            font-size: 3.2vw;
            font-weight: 700;
            min-width: 33.33vw;
            height: 8.93vw;

            .type-icon{
              height: 3.6vw;
              width: auto;
              margin-right: 2.67vw;
            }
          }

          .type-item.active {
            color: #ff4479;
          }
          .type-item.active::before {
            content: "";
            position: absolute;
            bottom: -2.7vw;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 2.8vw solid transparent;
            border-right: 2.8vw solid transparent;
            border-top: 2.8vw solid #fff; 
            z-index: 2;
          }
        }
      }

      .table-container{
        position:relative;
        width: 90.67vw;
        margin: auto;
        border-radius: 10px;
        background: #fff;
        border: 1px solid #cecccd;

        .table-contain{
          width: 100%;
          margin:auto;

          th,
          td {
            border-right: 1px solid #cdcdcd;
            position: relative;
            text-align: center;
            vertical-align: middle;
            width: 18.53vw;
          }

          thead{
            tr{
              height: 12.4vw;
              font-weight: 700;
              font-size: 2.93vw;
            }
          }

          tbody {
            tr:first-child{
              border-top: 1px solid #cdcdcd;
            }
            tr:not(:last-child){
              border-bottom: 1px solid #cdcdcd;
            }

            tr{
              color: #676767;
              height: 15.07vw;
              font-size: 2.13vw;
            }
          }

          tr > th:first-child,
          tr > td:first-child {
            border-left: none;
            width: 14.67vw;
          }

          tr > th:last-child,
          tr > td:last-child {
            border-right: none;
          }
        }
      }
    }
  `}
`;
