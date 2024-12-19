"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import PopupDialogLogin from "@/components/login/PopupComponentLogin";
import PopupDialogRegister from "@/components/login/PopupComponentRegister";

const PopupDialog = ({ type }) => {
  const t = useTranslations();

  const [popupType, setPopupType] = useState("");

  const toLogin = () => {
    // useGlobalDispatch(pushRoutes(login));
    setPopupType("login");
  };

  const toRegister = () => {
    // useGlobalDispatch(pushRoutes(login));
    setPopupType("register");
  };

  const closePopup = () => {
    document.getElementById("popup-dialog").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPopupType(type);
    }
  }, []);

  return (
    <>
      {popupType == "register" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closePopup}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.register")}</h3>
              <p className="subtitle-text">
                {t("Register.have_acc")}
                <span className="green cursor-pointer" onClick={toLogin}>
                  {t("Login.login")}
                </span>
              </p>
            </div>

            <PopupDialogRegister />
          </div>
        </PopupDialogWrapper>
      )}
      {popupType == "login" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closePopup}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.login")}</h3>
              <p className="subtitle-text">
                {t("Register.no_acc")}
                <span className="green cursor-pointer" onClick={toRegister}>
                  {t("Login.register")}
                </span>
              </p>
            </div>
            <PopupDialogLogin popupType={popupType} setPopupType={setPopupType} />
          </div>
        </PopupDialogWrapper>
      )}
      {popupType == "forget" && (
        <PopupDialogWrapper>
          <div className="card-container">
            <div className="close-cont" onClick={closePopup}>
              <FontAwesomeIcon
                className="close-icon"
                icon={faX}
                style={{ color: "#434343" }}
              />
            </div>
            <div className="card-header">
              <h3 className="title-text">{t("Login.forget_password")}</h3>
              <p className="subtitle-text">
                {t("Register.have_acc")}
                <span className="green cursor-pointer" onClick={toLogin}>
                  {t("Login.login")}
                </span>
              </p>
            </div>
          </div>
        </PopupDialogWrapper>
      )}
    </>
  );
};

export default PopupDialog;

export const PopupDialogWrapper = styled.div`
  /*  */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .card-container{
    width: 20.667vw;
    max-height: 37.458vw;
    overflow: auto;
    background-color: #fff;
    padding: 2.542vw 1.75vw 2.542vw;
    position: relative;

    .close-cont{
      position: absolute;
      top: 0;
      right: 0;
      margin: 0.7vw 0.5vw;
      cursor: pointer;
   
      .close-icon{
        width: 0.938vw;
        height: 0.938vw;
      }
    }

    .card-header{
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .title-text{
      margin-bottom: 0.417vw;
      line-height: 1;
      font-size: 1.25vw;
      color: #464656;
      font-weight: 700 !important;
    }

    .subtitle-text{
      margin-bottom: 1.042vw;
      line-height: 1;
      font-size: 0.729vw;
      color: #464656;
    }
    
    .form-item{
      position: relative;
      margin-bottom: 0.833vw;

      .form-label-cont{
        display: flex;
        justify-content: space-between;
      }
    }

    .form-label{
      line-height: 1;
      font-size: 0.625vw;
      color: #464656;
      font-weight: 700 !important;
      display: inline-block;
      margin-bottom: 0.26vw;
      min-width: 2vw;

    }

    .forget{
      color: #a6a6a6;
      cursor: pointer;
    }

    label{
      border: none;
    }

    .form-item input{
      height: 2.083vw;
      min-height: 2.083vw;
      margin-top: 0.833vw;
      padding: 0.417vw;
      border: 0.052vw solid #d6d6d6;
      border-radius: 0.208vw;
      outline: none;
      width: 100%;
      margin: 0;
      font-size: 0.833vw;
      color: #060616;
      position: relative;

      &:disabled{
        background-color: #EBEBE4;
      }
    }

    .green{
      color: #56c676;
      font-weight: 700;
    }

    .eye-cont{
      position: absolute;
      right: 0;
      bottom: 0;
      line-height: 0;
      margin: 0.573vw;
      z-index: 6;
      cursor: pointer;
    }

    .eye-icon{
      display: flex;
      width: 1.25vw;
      height: 0.938vw;
    }

    .submit-btn{
      width: 100%;
      margin-bottom: 0.625vw;
      line-height: 2.083vw;
      height: 2.083vw;
      border-radius: 0.104vw !important;
      background-color: #c6c6c6;
      text-transform: none;
      display: inline-flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 0.833vw;
      font-weight: 700 !important;
      padding: 0;
      color: #fff;
      transition: background-color .2s linear;

      &:hover{
        background-color: #8b8b8b;
      }
    }
  }

  .edit-btn{
    width: 100%;
    margin-bottom: 0.625vw;
    line-height: 2.083vw;
    height: 2.083vw;
    border-radius: 0.104vw !important;
    background-color: #f2f2f2;
    text-transform: none;
    display: inline-flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 0.833vw;
    font-weight: 700 !important;
    padding: 0;
    color: #000;
    transition: background-color .2s linear;
    border: 0.104vw solid #f2f2f2;

    &:hover{
      background-color: #fff;
    }
  }

  .fast-register{
    margin-top: 2vw;
    
    .title-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;

      h3{
        font-size: 2.5vw;
        margin-bottom: 0.26vw;
      }

      p{
        font-size: 0.833vw;
      }
    }

    .user-register{
      border: 0.104vw solid #f2f2f2;
      width: 100%;
      height: 2.083vw;
      padding: 0.66vw 0.817vw;
      display: flex;
      align-items: center;
      margin-top: 2vw;
      cursor: pointer;
      transition: background-color .2s linear;
  
      .mail-icon{
        width: 0.825vw;
        height: 0.825vw;
        margin-right: 4.475vw;
      }

      p{
        font-size: 0.729vw;
      }

      &:hover{
        background-color: #f2f2f2;
      }
    }
  }

  .email-verify-box {
    display: flex;
    align-items: center;
    margin-bottom: 1vw !important;
    
    label{
      margin-bottom: 0 !important;
      margin-right: 1vw;
    }
  }

  .email-verify input{
    font-size: 0.729vw;
  }
  
  .verify-btn{
    width:  5vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #ffc44b;
    font-size: 0.729vw;
  }

  .t-and-c{
    margin-bottom: 0;
    font-size: 0.729vw;
    color: #666676;
    line-height: 1.2;
    text-align: center;

    strong{
      font-weight: 700;
    }
  }

  .fast-login{
    margin-top: 2vw;
    
    .title-wrapper{
      display: flex;
      flex-direction: column;
      align-items: center;

      h3{
        font-size: 2.5vw;
        margin-bottom: 0.26vw;
      }

      p{
        font-size: 0.833vw;
      }
    }
  
    .user-login{
      border: 0.104vw solid #f2f2f2;
      width: 100%;
      height: 2.083vw;
      padding: 0.66vw 0.817vw;
      display: flex;
      align-items: center;
      margin-top: 2vw;
      cursor: pointer;
      transition: background-color .2s linear;
  
      .mail-icon{
        width: 0.825vw;
        height: 0.825vw;
        margin-right: 4.475vw;
      }
  
      p{
        font-size: 0.729vw;
      }
  
      &:hover{
        background-color: #f2f2f2;
      }
    }
  }
}
`;
