import React, { useState, createContext } from 'react';

export const StaffActionContext = createContext();

export const StaffActionProvider = ({ children }) => {
  const [staffAction, setStaffAction] = useState('cancel');
  const [confirmedOrders, setConfirmedOrders] = useState([]);;
  
  return (
    <StaffActionContext.Provider value={{ staffAction, setStaffAction, confirmedOrders, setConfirmedOrders }}>
      {children}
    </StaffActionContext.Provider>
  );
};
