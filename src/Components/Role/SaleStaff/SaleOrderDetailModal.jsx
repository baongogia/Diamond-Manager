import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Snackbar, CircularProgress } from '@mui/material';
import { PDFDocument, rgb } from 'pdf-lib';
import fontKit from '@pdf-lib/fontkit'; // Assuming fontkit is installed
import TPLeMajor from './TP Le Major.ttf'; // Update with actual font path
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Correct import

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [pdfUrls, setPdfUrls] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});

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
      console.log("Order data:", response.data); // Debug: Print API response
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order details:", err); // Debug: Print error
      setSnackbar({
        open: true,
        message: "Error fetching order details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const createWarranty = async (OrderDetailID) => {
    try {
      const response = await axios.post(
        `https://localhost:7292/api/Warranty/CreateWarranty`,
        {
          OrderDetailID: OrderDetailID,
          OrderDate: order.OrderDate,
        }
      );
      setSnackbar({
        open: true,
        message: "Warranty created successfully",
        severity: "success",
      });
      return response.data;
    } catch (error) {
      console.error("Error creating warranty:", error);
      setSnackbar({
        open: true,
        message: "Error creating warranty",
        severity: "error",
      });
      throw error;
    }
  };

  const fetchWarrantyInfo = async (OrderDetailID) => {
    try {
      const response = await axios.get(
        `https://localhost:7292/api/Warranty/WarrantyInfo?orderDetailID=${OrderDetailID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching warranty info:", error);
      setSnackbar({
        open: true,
        message: "Error fetching warranty info",
        severity: "error",
      });
      throw error;
    }
  };

  const generatePdf = async (warrantyInfo, OrderDetailID) => {
    try {
      setPdfLoading((prevLoading) => ({
        ...prevLoading,
        [OrderDetailID]: true,
      }));

      // Fetch the PDF template
      const existingPdfBytes = await fetch("./warranty.pdf").then((res) =>
        res.arrayBuffer()
      );

      // Create a PDFDocument and register the fontkit
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontKit);

      // Load custom font directly from import
      const fontBytes = await fetch(TPLeMajor).then((res) => res.arrayBuffer());

      // Embed custom font
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Get the first page of the PDF
      const firstPage = pdfDoc.getPages()[0];
      const startDate = warrantyInfo.StartDate.slice(0, 10);
      const endDate = warrantyInfo.EndDate.slice(0, 10);
      const productName = warrantyInfo.ProductName.toLowerCase();

      // Draw text on the PDF
      firstPage.drawText(`${warrantyInfo.WarrantyID}`, {
        x: 150,
        y: 488,
        size: 18,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(
        `A special thank to Mr/Mrs ${warrantyInfo.CustomerName}`,
        {
          x: 140,
          y: 420,
          size: 13,
          font: customFont,
          color: rgb(1, 1, 1),
        }
      );
      firstPage.drawText(`Warranty information`, {
        x: 140,
        y: 390,
        size: 13,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(`Product ID: ${warrantyInfo.ProductID}`, {
        x: 140,
        y: 360,
        size: 12,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(`Product name: ${productName}`, {
        x: 140,
        y: 330,
        size: 12,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(`Category: ${warrantyInfo.Category}`, {
        x: 140,
        y: 300,
        size: 12,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(
        `Material: ${warrantyInfo.Material} ${warrantyInfo.MaterialWeight}g, ${warrantyInfo.GemCaratWeight} Carat`,
        {
          x: 140,
          y: 270,
          size: 12,
          font: customFont,
          color: rgb(1, 1, 1),
        }
      );
      firstPage.drawText(`Gem Origin: ${warrantyInfo.GemOrigin}`, {
        x: 140,
        y: 240,
        size: 12,
        font: customFont,
        color: rgb(1, 1, 1),
      });
      firstPage.drawText(`Warranty period from: ${startDate} to: ${endDate}`, {
        x: 140,
        y: 210,
        size: 13,
        font: customFont,
        color: rgb(1, 1, 1),
      });

      // Save the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();

      // Convert the bytes to base64
      const pdfBase64 = btoa(
        pdfBytes.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // Save the base64 string to local storage
      localStorage.setItem(`pdfBase64_${OrderDetailID}`, pdfBase64);

      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create an object URL from the blob
      const url = URL.createObjectURL(pdfBlob);

      setPdfUrls((prevUrls) => ({
        ...prevUrls,
        [OrderDetailID]: url,
      }));
      setSnackbar({
        open: true,
        message: "PDF generated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbar({
        open: true,
        message: "Error generating PDF",
        severity: "error",
      });
    } finally {
      setPdfLoading((prevLoading) => ({
        ...prevLoading,
        [OrderDetailID]: false,
      }));
    }
  };

  const handleCreateWarranty = async (orderDetailId) => {
    try {
      const warrantyInfo = await createWarranty(orderDetailId);
      generatePdf(warrantyInfo, orderDetailId);
    } catch (error) {
      console.error("Error handling create warranty:", error);
    }
  };

  const handleFetchWarrantyInfo = async (orderDetailId) => {
    try {
      const warrantyInfo = await fetchWarrantyInfo(orderDetailId);
      generatePdf(warrantyInfo, orderDetailId);
    } catch (error) {
      console.error("Error handling fetch warranty info:", error);
    }
  };

  const theme = createTheme({
    palette: {
      background: {
        paper: '#fff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
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
                {order && (<List>
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
                </List>)}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Chi tiết đơn hàng</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (<List>
                  {order?.products.map((detail) => (
                    <ListItem key={detail.OrderDetailID}>
                      <ListItemAvatar>
                        <Avatar src={detail.Image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={detail.ProductName}
                        secondary={`Đơn giá: ${detail.Price.toFixed(2)}$ | Số lượng: ${detail.Quantity}`}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCreateWarranty(detail.OrderDetailID)}
                        disabled={pdfLoading[detail.OrderDetailID]}
                      >
                        {pdfLoading[detail.OrderDetailID] ? <CircularProgress size={24} /> : "Create Warranty"}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleFetchWarrantyInfo(detail.OrderDetailID)}
                        disabled={pdfLoading[detail.OrderDetailID]}
                      >
                        {pdfLoading[detail.OrderDetailID] ? <CircularProgress size={24} /> : "Fetch Warranty Info"}
                      </Button>
                    </ListItem>
                  ))}
                </List>)}
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

export default OrderDetail;
