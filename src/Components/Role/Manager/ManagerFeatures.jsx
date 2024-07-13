import React from "react";
import RouteBox from "../Admin/RouteBox";

export default function ManagerFeatures() {
  return (
    <div className="absolute left-0 bottom-2 w-[36vw] h-[68vh] flex justify-center items-center">
      <div className="w-[94%] h-[95%] flex justify-center items-center bg-search rounded-2xl">
        <div className="w-[90%] h-[95%]">
          <div className="w-full h-[90%] overflow-y-hidden overflow-x-hidden flex flex-col items-start">
            <div className="flex w-full justify-between items-center mb-5">
              <div className="">
                <div className="">Manager Features</div>
                <div className="text-unit">Features</div>
              </div>
              <div className="text-[1.3em]">
                <ion-icon name="construct-outline"></ion-icon>
              </div>
            </div>
            <div className="w-full h-[85%] flex flex-col justify-around items-center">
              <RouteBox
                title={"Inventory status"}
                detail={"Access inventory status"}
                icon={"bag-handle-outline"}
                to={"/"}
              />
              <RouteBox
                title={"Manage promotions"}
                detail={"Promotions and customer loyalty"}
                icon={"sparkles-outline"}
                to={"/"}
              />
              <RouteBox
                title={"Monitor order fulfillment."}
                detail={"Order fulfillment."}
                icon={"swap-horizontal-outline"}
                to={"/"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
