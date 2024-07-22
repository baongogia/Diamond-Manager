import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Typography, Paper } from "@mui/material";
import axios from "axios";
import { ClimbingBoxLoader } from "react-spinners";
import OrderIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AddressIcon from "@mui/icons-material/Home";
import DiscountIcon from "@mui/icons-material/LocalOffer";
import PriceIcon from "@mui/icons-material/AttachMoney";
import DepositIcon from "@mui/icons-material/AccountBalance";
import ShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiveIcon from "@mui/icons-material/EventAvailable";
import TransactionIcon from "@mui/icons-material/Payment";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";

const SaleOrderDetailModal = ({ open, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [open, orderId]);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://diamondstoreapi.azurewebsites.net/api/Order/GetOrderInfo?id=${orderId}`
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
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
      sx={{
        display: "flex",
        p: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={modalStyle}>
        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <ClimbingBoxLoader size={34} color="#38970f" />
          </div>
        ) : error ? (
          <Typography>Error: {error}</Typography>
        ) : order ? (
          <>
            <Typography
              id="order-detail-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Order Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <OrderIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Order ID: {order.OrderID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <PersonIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Customer Name: {order.CustomerName}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <PhoneIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Customer Phone: {order.CustomerPhone}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <AddressIcon />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      ml: 1,
                    }}
                  >
                    Address: {order.Address}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <DiscountIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Discount Rate: {order.DiscountRate * 100}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <PriceIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Final Price: {order.FinalPrice.toFixed(2)}$
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <DepositIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Deposits: {order.Deposits.toFixed(2)}$
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <ShippingIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Shipping Date: {order.ShippingDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <ReceiveIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Receive Date: {order.ReceiveDate}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <TransactionIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Transaction ID: {order.TransactionID}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <EmailIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Payer Email: {order.PayerEmail}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center">
                  <PaymentIcon />
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    Payment Status: {order.PaymentStatus}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
              Products
            </Typography>
            <div style={{ height: 250, width: "100%" }}>
              <DataGrid
                rows={order.products.map((product, index) => ({
                  ...product,
                  id: index,
                }))}
                columns={[
                  {
                    field: "Image",
                    headerName: "Product Image",
                    width: 115,
                    renderCell: (params) => (
                      <img
                        src={params.value}
                        alt="Product"
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                          margin: "5px auto",
                        }}
                      />
                    ),
                  },
                  {
                    field: "ProductName",
                    headerName: "Product Name",
                    width: 190,
                  },
                  { field: "Material", headerName: "Material", width: 100 },
                  {
                    field: "CustomizedSize",
                    headerName: "Customized Size",
                    width: 140,
                  },
                  { field: "Quantity", headerName: "Quantity", width: 100 },
                  {
                    field: "Price",
                    headerName: "Price (USD)",
                    width: 100,
                  },
                ]}
                pageSize={5}
                rowHeight={80}
                rowsPerPageOptions={[5]}
              />
            </div>
          </>
        ) : (
          <Typography id="order-detail-description" sx={{ mt: 2 }}>
            No order details available.
          </Typography>
        )}
      </Paper>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default SaleOrderDetailModal;
