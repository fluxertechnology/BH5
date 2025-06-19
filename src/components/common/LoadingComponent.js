import React from "react";
import Image from "next/image";

const loading = "/images/shared/axiosLoading.svg";

const AxiosLoading = ({ isLoading }) => {
  return (
    <div
      id="axiosLoading"
      style={{
        opacity: isLoading ? 1 : 0,
        zIndex: 999,
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "40px",
        height: "40px",
        padding: "1px",
        backgroundColor: "#fff",
        border: "1px solid #bbb",
        borderRadius: "50%",
        transform: isLoading
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0)",
        transition: ".3s cubic-bezier(.20,-0.7,.80, 1.7)",
        pointerEvents: "none",
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
};

export default AxiosLoading;
