import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import styled from "styled-components";
import { colors, requestUrlConstants } from "@/lib/constants";
import axiosRequest from "@/lib/services/axios";

export const ReportType = {
  comic: 0,
  anime: 1,
  video: 2,
  0: "comic",
  1: "anime",
  2: "video",
};

const ReportCoverComponent = ({
  report_type = 0,
  reportId,
  reportEp,
  setReportCoverShow,
}) => {
  const [toShowEnd, setToShowEnd] = useState(true);
  const [reportOptions, setReportOptions] = useState([]);
  const [reportValue, setReportValue] = useState(1);
  const [reportTextValue, setReportTextValue] = useState("");

  const t = useTranslations();
  function sumbitReport() {
    const formData = new FormData();
    formData.append("type", ReportType[report_type]);
    formData.append("uid", store.getState().user.id);
    formData.append("problem_id", reportId);
    if (reportEp) formData.append("episode", reportEp);
    formData.append("report_id", reportValue);
    if (reportTextValue && parseInt(reportValue) === 14)
      formData.append("message", reportTextValue);
    axiosRequest
      .post(requestUrlConstants.postReportProblem, formData)
      .then((data) => {
        setToShowEnd(false);
      });
  }

  useEffect(() => {
    const formData = new FormData();
    formData.append("type", ReportType[report_type]);
    axiosRequest
      .post(requestUrlConstants.postGetReportOptionList, formData)
      .then((data) => {
        setReportOptions(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReportCoverElement
      onClick={() => {
        setReportCoverShow(false);
      }}
    >
      <div
        className="report_container py-3"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="g-end cursor">
          <CloseIcon
            className="mr-2 "
            onClick={() => setReportCoverShow(false)}
          />
        </div>
        {!toShowEnd ? (
          <>
            <h4 className="report_container_title ">
              {t("Report.label.report.success")}
            </h4>
            <p className="report_container_text">
              {t("Report.label.report.thanks")}
            </p>
            <p className="report_container_text">
              {t("Report.label.report.fast_process")}
            </p>
            <div className="report_container_options_buttons">
              <button
                type="button"
                onClick={() => {
                  setReportCoverShow(false);
                }}
              >
                {t("Global.action.confirm")}
              </button>
            </div>
          </>
        ) : (
          <>
            <h4 className="report_container_title mb-3">
              {t("Report.label.report.problem")}x{" "}
            </h4>
            <div className="report_container_options">
              {reportOptions.map((option, index) => {
                // eslint-disable-next-line array-callback-return
                if (option.id === 14) return;
                return (
                  <label
                    className="report_container_options_option pl-3"
                    key={`${option}-${index}`}
                  >
                    <input
                      defaultChecked={index === 0}
                      className="report_container_options_option_radio "
                      type="radio"
                      name="reportOption"
                      value={option.id}
                      onChange={(e) => {
                        setReportValue(e.target.value);
                      }}
                    />
                    <p className="report_container_options_option_label ">
                      {option.message}
                    </p>
                  </label>
                );
              })}
              <label className="report_container_options_option pl-3">
                <input
                  className="report_container_options_option_radio"
                  type="radio"
                  name="reportOption"
                  value="14"
                  onChange={(e) => {
                    setReportValue(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="report_container_options_option_label inputtext"
                  placeholder={t("Report.label.report.problem_other")}
                  value={reportTextValue}
                  onChange={(e) => {
                    setReportTextValue(e.target.value);
                  }}
                />
              </label>
            </div>
            <div className="report_container_options_buttons">
              <button type="button" onClick={sumbitReport}>
                {t("Global.action.confirm")}
              </button>
            </div>
          </>
        )}
      </div>
    </ReportCoverElement>
  );
};

export default ReportCoverComponent;

export const ReportCoverElement = styled.div`
  /*  */
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #0009;
  margin: auto;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  .report_container {
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
    width: 80%;
    @media (min-width: 599px) {
      width: 20%;
    }

    &_title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      + .report_container_text {
        margin-top: 10px;
      }
    }
    &_text {
      color: ${colors.text_grey};
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      line-height: 1.4em;
      & + .report_container_options_buttons {
        button {
          margin-top: 10px;
        }
      }
    }
    &_options {
      &_option {
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        padding: 12px 0;
        border-bottom: 1px solid #a8a8a8;
        font-size: 18px;
        &_radio {
          flex-shrink: 0;
          position: relative;
          appearance: none;
          border: 1px solid #a8a8a8;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          &:checked:after {
            position: absolute;
            content: "";
            background: ${colors.dark_pink} !important;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
          }
        }
        &_label {
          color: #646464;
          width: 100%;
          &.inputtext {
            outline: none;
            font-size: 18px;
            border: none;
            color: #a8a8a8;
          }
        }
      }
      &_buttons {
        text-align: center;
        button {
          cursor: pointer;
          margin-top: 30px;
          display: inline-block;
          width: 80%;
          max-width: 328px;
          box-sizing: border-box;
          padding: 10px 0;
          border-radius: 30px;
          font-size: 20px;
          font-weight: 700;
          border: none;
          outline: none;
          color: #fff;
          background: linear-gradient(to right, #fa719a 0, #f24c7c 100%);
        }
      }
    }
  }
`;
