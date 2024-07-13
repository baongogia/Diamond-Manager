import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="w-[64vw] h-[10vh] pl-8 flex justify-between items-center overflow-hidden">
      {/* Logo */}
      <Link to="/" className="w-1/3">
        <img
          src="https://freight.cargo.site/t/original/i/2eb8f2737412d4142bdbe6d635889404da43800c4485f4192aa99592eaa163c5/Cartier_logo.png"
          alt=""
          className="w-full mb-2"
        />
      </Link>
      {/* Search */}
      <div className="relative w-[90%] flex justify-center items-center h-10">
        <input
          type="text"
          placeholder="Search here"
          className="w-[80%] h-full bg-search rounded-full indent-10"
        />
        <div className="text-white text-[1.3em] absolute left-11 top-2">
          <ion-icon name="search-outline"></ion-icon>
        </div>
      </div>

      {/* Menu */}
      <div className="w-full">
        <ul className="flex w-full justify-between">
          <NavLink
            to="/AdminPage"
            className="hover:text-green-700 cursor-pointer"
          >
            Home
          </NavLink>
          <NavLink
            to="/Insight"
            className="hover:text-green-700 cursor-pointer"
          >
            Insight
          </NavLink>
          <NavLink to="/Signal" className="hover:text-green-700 cursor-pointer">
            Signal
          </NavLink>
          <NavLink
            to="/Entities"
            className="hover:text-green-700 cursor-pointer"
          >
            Entities
          </NavLink>
        </ul>
      </div>
    </div>
  );
}
