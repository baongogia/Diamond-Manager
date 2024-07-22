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
  Button,
  Snackbar,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { PDFDocument, rgb } from "pdf-lib";
import fontKit from "@pdf-lib/fontkit";
import TPLeMajor from "./TP Le Major.ttf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ClimbingBoxLoader } from "react-spinners";

const OrderDetail = () => {
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
  const [pdfUrls, setPdfUrls] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});

  useEffect(() => {
    fetchOrderDetails(id);
  }, [id]);

  useEffect(() => {
    // Load the PDF URLs from local storage
    const storedPdfUrls = JSON.parse(localStorage.getItem("pdfUrls")) || {};
    setPdfUrls(storedPdfUrls);
  }, []);

  useEffect(() => {
    if (order) {
      order.products.forEach(async (product) => {
        try {
          const warrantyInfo = await fetchWarrantyInfo(product.OrderDetailID);
          if (warrantyInfo) {
            await generatePdf(warrantyInfo, product.OrderDetailID);
          }
        } catch (error) {
          console.error(
            "No existing warranty info found for product:",
            product.ProductName
          );
        }
      });
    }
  }, [order]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://diamondstoreapi.azurewebsites.net/api/Order/GetOrderInfo?id=${orderId}`
      );
      console.log("Order data:", response.data);
      setOrder(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order details:", err);
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
        `https://diamondstoreapi.azurewebsites.net/api/Warranty/CreateWarranty`,
        {
          OrderDetailID: OrderDetailID,
          OrderDate: order.OrderDate,
        }
      );
      setSnackbar({
        open: true,
        message: "Warranty created successfully !!",
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
        `https://diamondstoreapi.azurewebsites.net/api/Warranty/WarrantyInfo?orderDetailID=${OrderDetailID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching warranty info:", error);
      throw error;
    }
  };

  const generatePdf = async (warrantyInfo, OrderDetailID) => {
    try {
      // Fetch the PDF template
      const existingPdfBytes = await fetch("/warranty.pdf").then((res) =>
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
      // Warranty ID
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

      // Create a blob from the PDF bytes
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // Create an object URL from the blob
      const url = URL.createObjectURL(pdfBlob);

      setPdfUrls((prevUrls) => {
        const newUrls = { ...prevUrls, [OrderDetailID]: url };
        localStorage.setItem("pdfUrls", JSON.stringify(newUrls));
        return newUrls;
      });
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

  const handleCreateWarranty = async (OrderDetailID) => {
    setPdfLoading((prevLoading) => ({
      ...prevLoading,
      [OrderDetailID]: true,
    }));
    try {
      await createWarranty(OrderDetailID);
      const warrantyInfo = await fetchWarrantyInfo(OrderDetailID);
      await generatePdf(warrantyInfo, OrderDetailID);
    } catch (error) {
      console.error("Error during export process:", error);
      setPdfLoading((prevLoading) => ({
        ...prevLoading,
        [OrderDetailID]: false,
      }));
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
        <ClimbingBoxLoader size={35} color="#38970f" />
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
            {/* Information */}
            <Grid item xs={12}>
              <Paper className="-translate-y-16" sx={{ p: 2 }}>
                <Typography variant="h6">General Information</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Customer"
                        secondary={order.CustomerName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone number"
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
                        secondary={new Date(
                          order.OrderDate
                        ).toLocaleDateString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Payment method"
                        secondary={order.Payment}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Order Status"
                        secondary={order.OrderStatus}
                      />
                    </ListItem>
                  </List>
                )}
              </Paper>
            </Grid>
            {/* Order */}
            <Grid item xs={12}>
              <Paper className="-translate-y-20" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">Order Details</Typography>
                <Divider sx={{ my: 2 }} />
                {order && (
                  <List>
                    {order.products.map((detail) => (
                      <ListItem key={detail.OrderDetailID}>
                        <ListItemAvatar>
                          <Avatar src={detail.Image} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={detail.ProductName}
                          secondary={`Price: ${detail.Price.toFixed(
                            2
                          )}$ | Quantity: ${detail.Quantity}`}
                        />
                        {pdfUrls[detail.OrderDetailID] ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              window.open(
                                pdfUrls[detail.OrderDetailID],
                                "_blank"
                              )
                            }
                          >
                            View PDF
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleCreateWarranty(detail.OrderDetailID)
                            }
                            disabled={pdfLoading[detail.OrderDetailID]}
                          >
                            {pdfLoading[detail.OrderDetailID] ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Export PDF"
                            )}
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              bgcolor: snackbar.severity === "success" ? "#034008" : "#592617",
              color: "white",
              opacity: "20%",
            }}
          >
            {snackbar.severity === "success" ? (
              <Typography>
                <span></span>
                {snackbar.message}
              </Typography>
            ) : (
              <Typography>
                <span></span>
                {snackbar.message}
              </Typography>
            )}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default OrderDetail;
