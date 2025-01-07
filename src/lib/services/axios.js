// axiosItem
import axios from "axios";


import { apiUrl } from "@/lib/constants";
import callToast from "@/lib/services/toastCall";
import Image from "next/image";

const loading = "/images/shared/axiosLoading.svg";
import { nowLang } from "@/i18n/Metronici18n";
const axiosItem = axios.create({
  baseURL: apiUrl,
  // headers: { "Content-Type": "multipart/form-data"},
  headers: {
    "Content-Type": "multipart/form-data",
    // "Content-Language": nowLang.selectedLang || nowLang || "en",
    "Content-Language": nowLang || "en",
  }, // 這裡沒改好本地API 沒事 正式會掛
});
axiosItem.defaults.timeout = 50000;
// axiosItem.defaults.timeout = 30000;

axiosItem.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosItem.interceptors.response.use(
  (res) => {
    if (res.status !== 200) {
      return Promise.reject("伺服器连线失败");
    }
    if (
      parseInt(res.data.code) === 1 ||
      !res.data.hasOwnProperty("code") ||
      res.data.msg === "馀额不足" ||
      Array.isArray(res.data)
    ) {
      if (res.data.hasOwnProperty("data")) {
        return res.data.data;
      }
      if (res.data.hasOwnProperty("ts_status")) {
        return {
          ts_status: res.data.ts_status,
          ts_type: res.data.ts_type,
        };
      }

      return (
        res.data.data ||
        res.data.xiaoxi ||
        res.data.msg ||
        res.data.pingtai ||
        res.data.type ||
        res.data.status ||
        res.data.zhubo ||
        res.data.shop ||
        res.data
      );
    }
    return Promise.reject(res.data.msg || res.data.data || "页面加载中 请稍后");
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

class AxiosCenter {
  constructor(axiosItem) {
    this.axios = axiosItem;
    this.loadingQueue = [];
  }

  static getInstance(axiosItem) {
    if (!this.instance) {
      this.instance = new this(axiosItem);
    }
    return this.instance;
  }

  static RenderLoadingElement() {
    return (
      <div
        id="axiosLoading"
        style={{
          opacity: 0,
          zIndex: "999",
          position: "fixed",
          top: "50%",
          left: "50%",
          width: "40px",
          height: "40px",
          padding: "1px",
          backgroundColor: "#fff",
          border: "1px solid #bbb",
          borderRadius: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          transition: ".3s cubic-bezier(.20,-0.7,.80, 1.7)",
        }}
      >
        <Image
          src={loading}
          width={0}
          height={0}
          style={{
            width: "100%",
            height: "100%",
            verticalAlign: "middle",
          }}
          alt="loading"
        />
      </div>
    );
  }

  _showLoading() {
    if (typeof window === 'undefined') return;
    this.loadingQueue.push("true");
    let axiosLoading = document.getElementById("axiosLoading");
    if (axiosLoading) {
      axiosLoading.style.opacity = "1";
      axiosLoading.style.transform = "translate(-50%, -50%) scale(1)";
    }
  }

  _hideLoading() {
    if (typeof window === 'undefined') return;

    this.loadingQueue.splice(0, 1);
    if (this.loadingQueue.length === 0) {
      let axiosLoading = document.getElementById("axiosLoading");
      if (axiosLoading) {
        axiosLoading.style.opacity = "0";
        axiosLoading.style.transform = "translate(-50%, -50%) scale(0)";
      }
    }
  }

  get(url, params, errMsg = null) {
    let vm = this;
    return new Promise((resolve, reject) => {
      vm._showLoading();
      vm.axios({
        url,
        method: "get",
        params,
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          if (errMsg !== "no") if (errMsg !== "no") callToast(errMsg || error);
          reject(error);
        })
        .finally(() => {
          vm._hideLoading();
        });
    });
  }

  getArraybuffer(url, params, errMsg = null) {
    let vm = this;
    return new Promise((resolve, reject) => {
      vm._showLoading();
      vm.axios({
        url,
        method: "get",
        params,
        responseType: "arraybuffer",
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          if (errMsg !== "no") callToast(errMsg || error);
          reject(error);
        })
        .finally(() => {
          vm._hideLoading();
        });
    });
  }

  /**
   * @description post撈取資料用
   *
   * @param {string} url 網址
   * @param {FormData} formData 包好的資料
   * @param {string} [errMsg=null] 沒有就顯示 "系统忙碌 请稍后再试"或伺服器回傳的錯誤
   * @return {Promise}
   * @memberof AxiosCenter
   */
  post(url, formData, errMsg = null, passMsg = false) {
    let vm = this;
    return new Promise((resolve, reject) => {
      vm._showLoading();
      vm.axios({
        url,
        method: "post",
        data: formData,
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          if (errMsg !== "no")
            if (!passMsg)
              if (error !== "B次元: 付費贴文每日上限5篇, 超过待明日操作")
                if (error !== "illegal token") callToast(errMsg || error);

          if (
            error === "B次元: 付費贴文每日上限5篇, 超过待明日操作" ||
            passMsg
          ) {
            resolve(error);
          } else {
            reject(error);
          }
        })
        .finally(() => {
          vm._hideLoading();
        });
    });
  }
}

const axiosRequest = AxiosCenter.getInstance(axiosItem);

export default axiosRequest;
export { AxiosCenter };
