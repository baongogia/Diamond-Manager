import React from "react";
export default function Overview() {
  return (
    <div className="absolute left-1/3 bottom-2 w-[33vw] h-[68vh] flex justify-center items-center">
      <div className="w-[90%] h-[95%] flex justify-center items-center bg-main rounded-2xl">
        <div className="w-[90%] h-[95%]">
          <div className="relative w-full h-full">
            <div className="">Overview of sales results</div>
            <div className="w-full h-1/2 mt-5 bg-search rounded-lg flex flex-col justify-around items-center">
              <div className="flex h-20 w-full justify-around items-center">
                <div className="h-full flex flex-col justify-between mb-4">
                  <div className="">Orders</div>
                  <div className="text-[0.7em]">
                    Overall orders are higher than last week
                  </div>
                  <div className="text-[0.6em] bg-green-700 border-[0.1em] w-20 p-2 ">
                    32% Higher
                  </div>
                </div>
                <div className="text-green-700 mb-6">
                  <ion-icon name="send-outline"></ion-icon>
                </div>
              </div>
              <div className="w-40 h-40 border-[0.4em] border-r-green-700 border-y-green-700 border-l-unit flex flex-col justify-center items-center rounded-full">
                <div className="">Orders</div>
                <div className="text-green-400">70%</div>
              </div>
              <div className="absolute bottom-20 w-full flex justify-around items-center">
                <div className="flex flex-col justify-between items-center">
                  <div className="">
                    <ion-icon name="cube-outline"></ion-icon>
                  </div>
                  <div className="">24</div>
                  <div className="text-green-400">Done</div>
                </div>
                <div className="flex flex-col justify-between items-center">
                  <div className="">
                    <ion-icon name="cube-outline"></ion-icon>
                  </div>
                  <div className="">56</div>
                  <div className="text-yellow-400">Pending</div>
                </div>
                <div className="flex flex-col justify-between items-center">
                  <div className="">
                    <ion-icon name="cube-outline"></ion-icon>
                  </div>
                  <div className="">36</div>
                  <div className="text-orange-400">New</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
