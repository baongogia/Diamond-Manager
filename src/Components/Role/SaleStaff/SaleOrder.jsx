import React, { useEffect, useState, useContext } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import { StaffActionContext } from "./StaffActionProvider";
import { useNavigate } from "react-router-dom";

export const SaleOrder = () => {
  const { confirmedOrders, setConfirmedOrders, setStaffAction } =
    useContext(StaffActionContext);
  const [rows, setRows] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { field: "OrderID", headerName: "ID", width: 40 },
    { field: "CustomerName", headerName: "Customer", width: 120 },
    { field: "CustomerPhone", headerName: "Phone", width: 130 },
    { field: "OrderDate", headerName: "Order Date", width: 109 },
    { field: "Payment", headerName: "Payment", width: 105 },
    { field: "OrderStatus", headerName: "Status", width: 100 },
    { field: "SaleStaff", headerName: "Staff", width: 100 },
    { field: "Shipper", headerName: "Shipper", width: 130 },
    { field: "OrderNote", headerName: "Note", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" width="100%">
          {params.row.OrderStatus === "Processing" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  handleConfirmOrder(params.id);
                }}
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
              <Button variant="contained" disabled>
                Ready
              </Button>
              <Button variant="contained" disabled>
                Cancel
              </Button>
            </>
          )}
        </Box>
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
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sale Orders
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            label="Search by Order Date"
            variant="outlined"
            value={searchDate}
            onChange={handleSearchChange}
            sx={{ width: "30%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSearchDate("")}
          >
            Reset
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ height: 500, width: "100%", p: 2 }}>
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
      </Paper>
    </Box>
  );
};
