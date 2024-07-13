import React from "react";
import ListItems from "./ListItems";

export default function List() {
  return (
    <div className="fixed z-10 w-[100vw] h-[90vh] flex flex-col justify-center items-center bg-main">
      <div className="w-[90%] h-[90%] overflow-y-auto overflow-x-hidden flex flex-col items-start ">
        <div className="text-[1.5em] mb-8">List Products</div>
        <div className="flex flex-col w-full">
          <ListItems />
          <ListItems />
          <ListItems />
          <ListItems />
        </div>
      </div>
    </div>
  );
}
