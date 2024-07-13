import React from "react";
import Feature from "./Feature";
import Chart from "./Chart";
import Welcome from "./Welcome";

export default function UserAction() {
  return (
    <div className="">
      <Welcome />
      <Feature />
      <Chart />
    </div>
  );
}
