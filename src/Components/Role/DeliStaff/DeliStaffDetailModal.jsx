import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Grid, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Button, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const DeliStaffDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchOrderDetails(id);
  }, [id]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://localhost:7292/api/Order/GetOrderInfo?id=${orderId}`
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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: "background.paper" }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2 }} startIcon={<ArrowBackIcon />}>
          Return
        </Button>
        <Typography variant="h4" gutterBottom>
          Order detail #{id}
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Thông tin chung</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <List>
                    <ListItem>
                      <ListItemText primary="Khách hàng" secondary={order.CustomerName} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Điện thoại" secondary={order.CustomerPhone} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Địa chỉ" secondary={order.Address} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ngày đặt hàng" secondary={order.OrderDate} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Phương thức thanh toán" secondary={order.Payment} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Tình trạng thanh toán" secondary={order.OrderStatus} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Giảm giá" secondary={`${order.DiscountRate * 100}%`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Giá cuối cùng" secondary={`${order.FinalPrice}$`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Tiền cọc" secondary={`${order.Deposits}$`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ngày giao hàng" secondary={order.ShippingDate} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Ngày nhận hàng" secondary={order.ReceiveDate} />
                    </ListItem>
                  </List>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Chi tiết đơn hàng</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <div style={{ height: 500, width: "100%" }}>
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
