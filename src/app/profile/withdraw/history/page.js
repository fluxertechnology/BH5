"use client";

import styled from "styled-components";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState, useEffect } from "react";
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
    useGlobalDispatch({
      type: "INIT_NAVBAR",
      data: {
        customComponent: () => (
          <TopBarContainer>
            <TopTitleBar
              title="转入记录"
              showBack={true}
              color="#000"
              back_color="#fff"
            />
          </TopBarContainer>
        ),
      },
    });
  }, []);

  const tabs = [
    { id: "withdraw", label: "提领记录", count: withdrawLog.length },
    {
      id: "transfer-in",
      label: "转入记录",
      count: transactionLog.filter((t) => t.type === "in").length,
    },
    {
      id: "transfer-out",
      label: "转出记录",
      count: transactionLog.filter((t) => t.type === "out").length,
    },
  ];

  const renderWithdrawTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-3 px-4 text-left">支付方式</th>
            <th className="py-3 px-4 text-left">地址</th>
            <th className="py-3 px-4 text-left">金額</th>
            <th className="py-3 px-4 text-left">订单号</th>
            <th className="py-3 px-4 text-left">状态</th>
            <th className="py-3 px-4 text-left">时间</th>
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
              <tr
                key={record.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-4">{record.payment_method}</td>
                <td className="py-4 px-4">
                  <span className="text-xs break-all max-w-xs block">
                    {record.addess}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">
                  {record.withdraw_money}
                </td>
                <td className="py-4 px-4 text-xs">{record.reference_no}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
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
                <td className="py-4 px-4 text-xs text-gray-600">
                  {record.create_time}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderTransferTable = (type) => {
    const filteredData = transactionLog.filter((t) => t.type === type);
    const title = type === "in" ? "转入记录" : "转出记录";

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left">时间</th>
              <th className="py-3 px-4 text-left">精钻</th>
              <th className="py-3 px-4 text-left">钱包</th>
              <th className="py-3 px-4 text-left">订单号</th>
              <th className="py-3 px-4 text-left">订单状态</th>
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
                <tr
                  key={transfer.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 px-4 text-xs text-gray-600">
                    {transfer.create_time}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    <span
                      className={
                        type === "in" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {transfer.transaction_money}
                    </span>
                  </td>
                  <td className="py-4 px-4">{transfer.game_wallet}</td>
                  <td className="py-4 px-4 text-xs">{transfer.reference_no}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {transfer.transaction_status}
                    </span>
                  </td>
                </tr>
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
      default:
        return null;
    }
  };

  return (
    <ProfileWithDrawHistoryComponent main_height={state.navbar.mainHeight}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {renderActiveTabContent()}
      </div>
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
    padding: 0 20px;
    
    @media (max-width: 768px) {
      padding: 0 16px;
      
      .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
      }
      
      table {
        min-width: 600px;
      }
      
      th, td {
        padding: 12px 8px;
        font-size: 12px;
      }
    }
  `}
`;
