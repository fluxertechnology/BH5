'use client';
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { padding, REG_SET, requestUrlConstants } from "@/lib/constants";
import IconInput, { input_margin } from "@/components/login/IconInputComponent";
import IconSelect from "@/components/login/IconSelectComponent";
// import PropTypes from "prop-types";

import axiosRequest from "@/lib/services/axios";
import callToast from "@/lib/services/toastCall";
import { useGlobalContext, useGlobalDispatch } from "@/store";
import { initAreaCode } from "@/store/actions/areaCode";
import { verifyResetPassword } from "@/store/actions/pages/loginRecoverPasswordAction";

const { postGetVerify } = requestUrlConstants;

const { qqReg, emailReq, alphanumericReq } = REG_SET;


const PopupDialogRecoverPassword = () => {
  const t = useTranslations();
  const { state } = useGlobalContext();
  const stateAreaCode = state.areaCode;

  const resetPassword = (data, callback) => {
    useGlobalDispatch(verifyResetPassword(data, callback));
  };

  const loginTypeList = [
    {
      name: t("Register.general"),
    },
    {
      name: t("Register.qq"),
    },
    {
      name: t("Register.email"),
    },
    {
      name: t("Register.phone"),
    },
  ];
  const phoneNemberRef = useRef(null);
  const verifyRef = useRef(null);
  const qqAccRef = useRef(null);
  const emailRef = useRef(null);

  const [loginType, setLoginType] = useState(0);
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [generalAccount, setGeneralAccount] = useState("");
  const [verifyNumber, setVerifyNumber] = useState("");
  const [qqAcc, setQqAcc] = useState("");
  const [email, setEmail] = useState("");

  const clearFormInput = (loginType) => {
    setAreaCode("");
    setPhoneNumber("");
    setGeneralAccount("");
    setVerifyNumber("");
    setQqAcc("");
    setEmail("");

    setLoginType(loginType);
  };

  useEffect(() => {
    useGlobalDispatch(initAreaCode())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function phoneNumberEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setPhoneNumber(e.target.value);
    if (key === 13) {
      verifyRef.current.focus();
    }
  }

  function qqAccEvent(e) {
    setQqAcc(e.target.value);
  }
  function emailEvent(e) {
    setEmail(e.target.value);
  }

  function verifyNumberEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setVerifyNumber(e.target.value);
    if (key === 13) {
      verifyRef.current.focus();
    }
  }

  function areaCodeEvent(e) {
    setAreaCode(e.target.dataset.value);
  }

  function getUserVerify() {
    if (areaCode && phoneNumber) {
      let formData = new FormData();
      formData.append("country_code", areaCode);
      formData.append("username", phoneNumber);
      axiosRequest
        .post(postGetVerify, formData)
        .then((data) => {})
        .catch((e) => {});
    } else {
      callToast(t("Login.tip_error_must"));
    }
  }
  function accountEvent(e) {
    var key = window.event ? e.keyCode : e.which;
    setGeneralAccount(e.target.value);
    if (key === 13) {
      verifyRef.current.focus();
    }
  }

  function userRevise() {
    switch (loginType) {
      case 0:
        if (generalAccount) {
          resetPassword({
            username: generalAccount,
            reg_type: ["fast", "qq", "email", "mobile"][loginType],
          });
        } else {
          toastCall(t("Login.tip_error_must"));
        }
        break;
      case 1:
        if (qqAcc) {
          resetPassword({
            username: qqAcc,
            reg_type: ["fast", "qq", "email", "mobile"][loginType],
          });
        } else {
          toastCall(t("Login.tip_error_must"));
        }
        break;
      case 2:
        if (email) {
          resetPassword({
            username: email,
            reg_type: ["fast", "qq", "email", "mobile"][loginType],
          });
        } else {
          toastCall(t("Login.tip_error_must"));
        }
        break;
      case 3:
        if (areaCode && phoneNumber && verifyNumber) {
          resetPassword(
            {
              country_code: areaCode,
              username: phoneNumber,
              sms_code: verifyNumber,
              reg_type: ["fast", "qq", "email", "mobile"][loginType],
            },
            true
          );
        } else {
          toastCall(t("Login.tip_error_must"));
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className="card-body">
      {loginType === 0 && (
        <div>
          <div className="form-item">
            <label className="form-label">{ t("Register.general") }</label>
            <IconInput
              className="input_content_box_input"
              value={generalAccount}
              callback={accountEvent}
              placeholder={t("Login.placeholder_account")}
              enterKeyHint="next"
              reg={alphanumericReq}
              regErrStr={t("Login.tip_error_account")}
            />
          </div>

          <div className="btn-wrapper" onClick={userRevise}>
            <button className="submit-btn">{ t("Login.revise") }</button>
          </div>

          <div className="fast-login">
            {/* <div className="user-login flex justify-center" onClick={() => clearFormInput(0)}>
              <p>{ t("Register.general") }</p>
            </div> */}
            <div className="user-login flex justify-center" onClick={() => clearFormInput(1)}>
              <p>{ t("Register.qq") }</p>
            </div>
            <div className="user-login flex justify-center" onClick={() => clearFormInput(2)}>
              <p>{ t("Register.email") }</p>
            </div>
            <div className="user-login flex justify-center" onClick={() => clearFormInput(3)}>
              <p>{ t("Register.phone") }</p>
            </div>
          </div>
        </div>
      )}
      {loginType === 1 && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{ t("Register.qq") }</label>
              <IconInput
                className="input_content_box_input"
                ref={qqAccRef}
                inputType="number"
                value={qqAcc}
                callback={qqAccEvent}
                placeholder={t("Login.placeholder_qq")}
                enterKeyHint="next"
                reg={qqReg}
                regErrStr={t("Login.tip_error_qq")}
              />
            </div>

            <div className="btn-wrapper" onClick={userRevise}>
              <button className="submit-btn">{ t("Login.revise") }</button>
            </div>

            <div className="fast-login">
              <div className="user-login flex justify-center" onClick={() => clearFormInput(0)}>
                <p>{ t("Register.general") }</p>
              </div>
              {/* <div className="user-login flex justify-center" onClick={() => clearFormInput(1)}>
                <p>{ t("Register.qq") }</p>
              </div> */}
              <div className="user-login flex justify-center" onClick={() => clearFormInput(2)}>
                <p>{ t("Register.email") }</p>
              </div>
              <div className="user-login flex justify-center" onClick={() => clearFormInput(3)}>
                <p>{ t("Register.phone") }</p>
              </div>
            </div>
          </div>        
        </>
      )}
      {loginType === 2 && (
        <>
          <div>
            <div className="form-item">
              <label className="form-label">{ t("Register.email") }</label>
              <IconInput
                className="input_content_box_input"
                ref={emailRef}
                inputType="email"
                value={email}
                callback={emailEvent}
                placeholder={t("Login.placeholder_mail")}
                enterKeyHint="next"
                reg={emailReq}
                regErrStr={t("Login.tip_error_mail")}
              />
            </div>

            <div className="btn-wrapper" onClick={userRevise}>
              <button className="submit-btn">{ t("Login.revise") }</button>
            </div>

            <div className="fast-login">
              <div className="user-login flex justify-center" onClick={() => clearFormInput(0)}>
                <p>{ t("Register.general") }</p>
              </div>
              <div className="user-login flex justify-center" onClick={() => clearFormInput(1)}>
                <p>{ t("Register.qq") }</p>
              </div>
              {/* <div className="user-login flex justify-center" onClick={() => clearFormInput(2)}>
                <p>{ t("Register.email") }</p>
              </div> */}
              <div className="user-login flex justify-center" onClick={() => clearFormInput(3)}>
                <p>{ t("Register.phone") }</p>
              </div>
            </div>
          </div>        
        </>
      )}
      {loginType === 3 && (
        <div>
          <div className="form-item">
            <label className="form-label">{ t("Register.phone") }</label>
            <IconSelect
              className="input_content_box_input"
              icon={"/images/icons/flag.png"}
              placeholder={t("Login.placeholder_select_code")}
              optionsPreFix="+"
              options={stateAreaCode}
              callback={areaCodeEvent}
              value={areaCode}
            />
          </div>
          <div className="form-item">
            <div className="input_content_box">
              <IconInput
                className="input_content_box_input"
                ref={phoneNemberRef}
                icon={"/images/icons/phone.png"}
                inputType="tel"
                value={phoneNumber}
                callback={phoneNumberEvent}
                placeholder={t("Login.placeholder_phone")}
                enterKeyHint="next"
              />
            </div>
          </div>
          <div className="form-item flex justify-between">
            <div className="input_content_box phone-verify">
              <IconInput
                className="input_content_box_input"
                ref={verifyRef}
                icon={"/images/icons/shield.png"}
                inputType="number"
                value={verifyNumber}
                callback={verifyNumberEvent}
                placeholder={t("Login.placeholder_input_letter")}
                enterKeyHint="done"
              />
            </div>
            <div className="phone-verify-btn" onClick={getUserVerify}>
              <p className="input_content_box_btn_text">
                {t("Login.placeholder_get_letter")}
              </p>
            </div>
          </div>

          <div className="btn-wrapper" onClick={userRevise}>
            <button className="submit-btn">{ t("Login.revise") }</button>
          </div>

          <div className="fast-login">
            <div className="user-login flex justify-center" onClick={() => clearFormInput(0)}>
              <p>{ t("Register.general") }</p>
            </div>
            <div className="user-login flex justify-center" onClick={() => clearFormInput(1)}>
              <p>{ t("Register.qq") }</p>
            </div>
            <div className="user-login flex justify-center" onClick={() => clearFormInput(2)}>
              <p>{ t("Register.email") }</p>
            </div>
            {/* <div className="user-login flex justify-center" onClick={() => clearFormInput(3)}>
              <p>{ t("Register.phone") }</p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupDialogRecoverPassword;
