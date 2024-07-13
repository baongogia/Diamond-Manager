import React from "react";
import NavBar from "./NavBar";
import UserProfile from "./UserProfile";
import UserAction from "./UserAction";

export default function AdminPage() {
  return (
    <div className="">
      <NavBar />
      <UserProfile role={"Admin"} />
      <UserAction />
    </div>
  );
}
