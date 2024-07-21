import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { StaffActionContext } from "./StaffActionProvider";
import SaleOrderDetailModal from "./SaleOrderDetailModal";
import { useNavigate } from "react-router-dom";

export const SaleOrder = () => {
  const { confirmedOrders, setConfirmedOrders, setStaffAction } =
    useContext(StaffActionContext);
  const [rows, setRows] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { field: "OrderID", headerName: "ID", width: 70 },
    { field: "CustomerName", headerName: "Customer", width: 130 },
    { field: "CustomerPhone", headerName: "Phone", width: 130 },
    { field: "OrderDate", headerName: "Order Date", width: 130 },
    { field: "Payment", headerName: "Payment", width: 130 },
    { field: "OrderStatus", headerName: "Status", width: 130 },
    { field: "SaleStaff", headerName: "Staff ", width: 130 },
    { field: "Shipper", headerName: "Shipper ", width: 130 },
    { field: "OrderNote", headerName: "Note" },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.OrderStatus === "Processing" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleConfirmOrder(params.id);
                }}
                style={{ marginRight: "10px" }}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCancelOrder(params.id);
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {params.row.OrderStatus === "Accepted" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleReadyOrder(params.id);
                }}
                style={{ marginRight: "10px" }}
              >
                Ready
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCancelOrder(params.id);
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {["Pending Delivery", "Delivering", "Canceled", "Delivered"].includes(
            params.row.OrderStatus
          ) && (
            <>
              <Button
                variant="contained"
                disabled
                style={{ marginRight: "10px" }}
              >
                Ready
              </Button>
              <Button variant="contained" disabled>
                Cancel
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://diamondstoreapi.azurewebsites.net/api/Order/GetOrderInfoListForSaleStaff"
        );
        const ordersWithId = response.data.map((order) => ({
          ...order,
          id: order.OrderID,
        }));
        setRows(ordersWithId);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    const storedConfirmedOrders = localStorage.getItem("confirmedOrders");
    if (storedConfirmedOrders) {
      setConfirmedOrders(JSON.parse(storedConfirmedOrders));
    }
  }, [setConfirmedOrders]);

  useEffect(() => {
    localStorage.setItem("confirmedOrders", JSON.stringify(confirmedOrders));
  }, [confirmedOrders]);

  const handleStatusChange = (id, newStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.OrderID === id ? { ...row, OrderStatus: newStatus } : row
      )
    );
  };

  const handleConfirmOrder = async (id) => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    try {
      const response = await axios.put(
        "https://diamondstoreapi.azurewebsites.net/api/Order/UpdateOrderStatus",
        {
          orderID: id,
          buttonValue: "CONFIRM",
          username,
          role,
          shippingdate: new Date(),
          receievedate: new Date(),
        }
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.OrderID === id ? { ...row, OrderStatus: "Accepted" } : row
          )
        );
        setConfirmedOrders((prev) => [...prev, id]);
        setStaffAction("confirm");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleReadyOrder = async (id) => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    try {
      const response = await axios.put(
        "https://diamondstoreapi.azurewebsites.net/api/Order/UpdateOrderStatus",
        {
          orderID: id,
          buttonValue: "READY",
          username,
          role,
          shippingdate: new Date(),
          receievedate: new Date(),
        }
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.OrderID === id
              ? { ...row, OrderStatus: "Pending Delivery" }
              : row
          )
        );
        setConfirmedOrders((prev) => [...prev, id]);
        setStaffAction("ready");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelOrder = async (id) => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    try {
      const response = await axios.put(
        "https://diamondstoreapi.azurewebsites.net/api/Order/UpdateOrderStatus",
        {
          orderID: id,
          buttonValue: "CANCEL",
          username,
          role,
        }
      );

      if (response.status === 200) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.OrderID === id ? { ...row, OrderStatus: "Canceled" } : row
          )
        );
        setConfirmedOrders((prev) => prev.filter((orderId) => orderId !== id));
        setStaffAction("cancel");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
  };
  const navigate = useNavigate();
  const handleRowClick = (params) => {
    navigate(`SaleOrderDetailModal/${params.row.OrderID}`);
    setSelectedOrder(params.row.OrderID);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredRows = rows.filter((row) => row.OrderDate.includes(searchDate));

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search by Order Date"
          variant="outlined"
          value={searchDate}
          onChange={handleSearchChange}
        />
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        onRowClick={handleRowClick}
      />
    </div>
  );
};
