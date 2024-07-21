import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Button,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ClimbingBoxLoader } from "react-spinners";

const DeliStaffDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchOrderDetails(id);
  }, [id]);

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
      setSnackbar({
        open: true,
        message: "Error fetching order details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      background: {
        paper: "#fff",
      },
    },
  });

  if (loading) {
    return (
      <div className="w-screen h-screen bg-white absolute top-0 left-0 flex items-center justify-center">
        <ClimbingBoxLoader size={25} color="#38970f" />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: "background.paper" }}>
        <Button
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Return
        </Button>
        <Typography variant="h4" gutterBottom>
          Order detail #{id}
        </Typography>
        {loading ? (
          <div className=""></div>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className="-translate-y-16" sx={{ p: 2 }}>
                <Typography variant="h6">General Information</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Customer"
                            secondary={order.CustomerName}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Phone Number"
                            secondary={order.CustomerPhone}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Address"
                            secondary={order.Address}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Order date"
                            secondary={order.OrderDate}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Payment method"
                            secondary={order.Payment}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Order Status"
                            secondary={order.OrderStatus}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Discount"
                            secondary={`${order.DiscountRate * 100}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Final price"
                            secondary={`${order.FinalPrice.toFixed(2)}$`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Deposit"
                            secondary={`${order.Deposits.toFixed(2)}$`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Shipping date"
                            secondary={order.ShippingDate}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Receive date"
                            secondary={order.ReceiveDate}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className="-translate-y-20" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Order Details</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <div style={{ height: 243, width: "100%" }}>
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
                              style={{
                                width: "100%",
                                height: "auto",
                                borderRadius: "50%",
                              }}
                            />
                          ),
                        },
                        {
                          field: "ProductName",
                          headerName: "Product Name",
                          width: 250,
                        },
                        {
                          field: "Material",
                          headerName: "Material",
                          width: 196,
                        },
                        {
                          field: "CustomizedSize",
                          headerName: "Customized Size",
                          width: 196,
                        },
                        {
                          field: "Quantity",
                          headerName: "Quantity",
                          width: 196,
                        },
                        { field: "Price", headerName: "Price", width: 196 },
                      ]}
                      pageSize={5}
                      rowHeight={130}
                      rowsPerPageOptions={[5]}
                    />
                  </div>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Box>
    </ThemeProvider>
  );
};

export default DeliStaffDetailPage;
