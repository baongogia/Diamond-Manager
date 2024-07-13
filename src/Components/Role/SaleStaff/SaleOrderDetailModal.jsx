import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Modal,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { PDFDocument, rgb } from "pdf-lib";
import fontKit from "@pdf-lib/fontkit";
import TPLeMajor from "./TP Le Major.ttf"; // Adjust the path according to your file structure

const SaleOrderDetailModal = ({ open, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrls, setPdfUrls] = useState({});
  const [pdfLoading, setPdfLoading] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [open, orderId]);

  useEffect(() => {
    if (order) {
      order.products.forEach((product) => {
        const savedPdfBase64 = localStorage.getItem(
          `pdfBase64_${product.OrderDetailID}`
        );
        if (savedPdfBase64) {
          const byteCharacters = atob(savedPdfBase64);
          const byteNumbers = new Array(byteCharacters.length)
            .fill(0)
            .map((_, i) => byteCharacters.charCodeAt(i));
          const byteArray = new Uint8Array(byteNumbers);
          const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrls((prevUrls) => ({
            ...prevUrls,
            [product.OrderDetailID]: pdfUrl,
          }));
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
        `https://diamondstoreapi.azurewebsites.net/api/Warranty/CreateWarranty`,
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
        `https://diamondstoreapi.azurewebsites.net/api/Warranty/WarrantyInfo?orderDetailID=${OrderDetailID}`
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

  const handleExportClick = async (OrderDetailID) => {
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
                  {
                    field: "Export",
                    headerName: "Export",
                    width: 150,
                    renderCell: (params) => (
                      <>
                        {pdfLoading[params.row.OrderDetailID] ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : pdfUrls[params.row.OrderDetailID] ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              window.open(pdfUrls[params.row.OrderDetailID])
                            }
                          >
                            View PDF
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleExportClick(params.row.OrderDetailID)
                            }
                          >
                            Export
                          </Button>
                        )}
                      </>
                    ),
                  },
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
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

export default SaleOrderDetailModal;
