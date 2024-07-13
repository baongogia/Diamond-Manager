import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function Hide({ children }) {
  const location = useLocation();
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    if (
      location.pathname.startsWith("/AdminPage") ||
      location.pathname.startsWith("/DeliStaffPage") ||
      location.pathname.startsWith("/ManagerPage") ||
      location.pathname.startsWith("/SaleStaffPage") ||
      location.pathname.startsWith("/ManageListProduct")
    ) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [location]);

  return <div>{showNav && children}</div>;
}
