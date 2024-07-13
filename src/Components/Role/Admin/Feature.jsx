import React from "react";
import RouteBox from "./RouteBox";

export default function Feature() {
  return (
    <div className="absolute left-0 bottom-2 w-[36vw] h-[68vh] flex justify-center items-center">
      <div className="w-[90%] h-[95%] flex justify-center items-center bg-main rounded-2xl">
        <div className="w-[90%] h-[95%]">
          <div className="flex justify-between items-center mb-5">
            <div className="">
              <div className="">User Features</div>
              <div className="text-unit">Features</div>
            </div>
            <div className="text-[1.3em]">
              <ion-icon name="construct-outline"></ion-icon>
            </div>
          </div>
          {/* Routers */}
          <div className="w-full h-[85%] flex flex-col justify-around items-center">
            <RouteBox
              title="User Management"
              detail="Assign or change employee roles"
              icon="person-outline"
              to="/features"
            />

            <RouteBox
              title="Product Management"
              detail="Diamonds, settings, and gems"
              icon="diamond-outline"
              to="/ManageListProduct"
            />

            <RouteBox
              title="Price Management"
              detail="Based on diamond properties"
              icon="cash-outline"
              to="/features"
            />

            <RouteBox
              title="Warranty Management"
              detail="Warranty and certification"
              icon="checkbox-outline"
              to="/features"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
