import React from "react";
import { RiseLoader } from "react-spinners";

export default function Welcome() {
  return (
    <div>
      {/* Welcome */}
      <div className="w-[59%] flex justify-between items-center">
        <div className="">
          <div className="mt-5 ml-5 text-[3em] text-unit">Hey Bao!</div>
          <div className="ml-5 text-[3em] font-bold">Welcome Back</div>
        </div>
        <div className="flex">
          <RiseLoader color="#0f840f" />
          <RiseLoader color="#0f840f" />
          <RiseLoader color="#0f840f" />
        </div>
      </div>
    </div>
  );
}
