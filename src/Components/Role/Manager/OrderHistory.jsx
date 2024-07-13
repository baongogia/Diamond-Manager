import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@mui/material";
import axios from "axios";
import SaleOrderDetailModal from "./SaleOrderDetailModal";

export const OrderHistory = () => {
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
    { field: "SaleStaff", headerName: "Staff", width: 130 },
    { field: "Shipper", headerName: "Shipper", width: 130 },
    { field: "OrderNote", headerName: "Note", width: 200 },
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
  }, []);

  const handleSearchChange = (event) => {
    setSearchDate(event.target.value);
  };

  const handleRowClick = (params) => {
    setSelectedOrder(params.row.OrderID);
    setModalOpen(true);
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
      <SaleOrderDetailModal
        open={modalOpen}
        handleClose={handleCloseModal}
        orderId={selectedOrder}
      />
    </div>
  );
};

export default OrderHistory;
