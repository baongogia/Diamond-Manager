import React from "react";
import money from "../DeliStaff/money.png";

export default function Money() {
  return (
    <div className="absolute z-[-10] left-[35%] bottom-2 w-[30.5vw] h-[68vh] flex justify-center items-center">
      <div className="w-[94%] h-[95%] flex justify-center items-center bg-main rounded-2xl">
        <div className="w-[95%] h-[95%]">
          <img src={money} alt="" className="w-full h-[40%]" />
          <div className="w-full h-[40%] flex flex-col justify-between mt-10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full"></div>
              <div className="ml-4">Order number delivered: 100</div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-400 rounded-full"></div>
              <div className="ml-4">Delivered successfully: 88</div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-400 rounded-full"></div>
              <div className="ml-4">Order is cancelled: 100</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
