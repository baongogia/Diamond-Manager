import React from "react";
import { Link } from "react-router-dom";

export default function RouteBox({ title, detail, icon, to }) {
  return (
    <Link
      to={to}
      className="w-full h-[20%] flex justify-around items-center bg-box rounded-3xl cursor-pointer"
    >
      <div className="w-10 h-10 bg-box hover:bg-opacity-20 border-white border-[0.1em] border-opacity-30 rounded-full flex justify-center items-center">
        <ion-icon name={icon}></ion-icon>
      </div>
      <div className="w-80">
        <div className="">{title}</div>
        <div className="text-unit">{detail}</div>
      </div>
      <div className="w-3">
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </div>
    </Link>
  );
}
