import React from "react";
import NavBar from "./NavBar";
import List from "./List";

export default function ManageListProduct() {
  return (
    <div>
      <div className="w-full flex items-center justify-center">
        <NavBar />
      </div>
      <List />
    </div>
  );
}
