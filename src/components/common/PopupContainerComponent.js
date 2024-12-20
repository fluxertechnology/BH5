"use client";
import { useState, useEffect } from "react";
import PopupDialog from "@/components/login/PopupComponent";
import { dialogType } from "@/store/actions/user";


const PopupContainer = () => {

  const [type, setType] = useState(dialogType);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setType(dialogType);
    }
  }, [dialogType]);
  
  return (
    <>
      <div id="popup-dialog" style={{display: 'none'}}>
        <PopupDialog type={type} />
      </div>
    </>
  );
};

export default PopupContainer;
