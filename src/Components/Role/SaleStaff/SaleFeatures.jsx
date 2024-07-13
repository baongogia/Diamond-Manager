import React from "react";
import SaleOrder from "./SaleOrder";

export default function SaleFeatures() {
  return (
    <div className="absolute left-0 bottom-2 w-[36vw] h-[68vh] flex justify-center items-center">
      <div className="w-[94%] h-[95%] flex justify-center items-center bg-main rounded-2xl">
        <div className="w-[90%] h-[95%]">
          <div className="w-full h-[90%] overflow-y-hidden overflow-x-hidden flex flex-col items-start">
            <div className="">Customer Orders</div>
            <div className="flex flex-col w-full space-y-4">
              <SaleOrder />
              <SaleOrder />
              <SaleOrder />
              <SaleOrder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
