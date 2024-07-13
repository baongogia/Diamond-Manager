import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Typography } from "@mui/material";
import axios from "axios";

const DeliStaffDetailModal = ({ open, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [open, orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://diamondstoreapi.azurewebsites.net/api/Order/GetOrderInfo?id=${orderId}`
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="order-detail-title"
      aria-describedby="order-detail-description"
    >
      <Box sx={modalStyle}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography>Error: {error}</Typography>
        ) : order ? (
          <>
            <Typography id="order-detail-title" variant="h6" component="h2">
              Order Details
            </Typography>
            <Typography variant="subtitle1">
              Order ID: {order.OrderID}
            </Typography>
            <Typography variant="subtitle1">
              Customer Name: {order.CustomerName}
            </Typography>
            <Typography variant="subtitle1">
              Customer Phone: {order.CustomerPhone}
            </Typography>
            <Typography variant="subtitle1">
              Address: {order.Address}
            </Typography>
            <Typography variant="subtitle1">
              Discount Rate: {order.DiscountRate * 100}%
            </Typography>
            <Typography variant="subtitle1">
              Final Price: {order.FinalPrice}$
            </Typography>
            <Typography variant="subtitle1">
              Deposits: {order.Deposits}$
            </Typography>
            <Typography variant="subtitle1">
              Shipping Date: {order.ShippingDate}
            </Typography>
            <Typography variant="subtitle1">
              Receive Date: {order.ReceiveDate}
            </Typography>
            <div style={{ height: 500, width: "100%", marginTop: "16px" }}>
              <DataGrid
                rows={order.products.map((product, index) => ({
                  ...product,
                  id: index,
                }))}
                columns={[
                  {
                    field: "Image",
                    headerName: "Image",
                    width: 150,
                    renderCell: (params) => (
                      <img
                        src={params.value}
                        alt="Product"
                        style={{ width: "100%", height: "auto" }}
                      />
                    ),
                  },
                  {
                    field: "ProductName",
                    headerName: "Product Name",
                    width: 196,
                  },
                  { field: "Material", headerName: "Material", width: 196 },
                  {
                    field: "CustomizedSize",
                    headerName: "Customized Size",
                    width: 196,
                  },
                  { field: "Quantity", headerName: "Quantity", width: 196 },
                  { field: "Price", headerName: "Price", width: 196 },
                ]}
                pageSize={5}
                rowHeight={130}
                rowsPerPageOptions={[5]}
              />
            </div>
          </>
        ) : (
          <Typography id="order-detail-description" sx={{ mt: 2 }}>
            No order details available.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default DeliStaffDetailModal;
