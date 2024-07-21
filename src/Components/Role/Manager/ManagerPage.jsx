import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import Chart from "react-apexcharts";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./style.css";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BuildIcon from "@mui/icons-material/Build";
import DiamondIcon from "@mui/icons-material/Diamond";
import AccountManagement from "./AccountManagement";
import LogoutIcon from "@mui/icons-material/Logout";
import LogoutButton from "../LogoutButton";
import { useNavigate } from "react-router-dom";
import { OrderHistory } from "./OrderHistory";
import HistoryIcon from "@mui/icons-material/History";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CardContent } from "@mui/material";

const Sidebar = styled(Box)(({ theme }) => ({
  height: "100vh",
  backgroundColor: "#3f51b5",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  padding: "20px 0px",
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  transition: "width 0.3s",
  overflowX: "hidden",
}));

const Content = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: "20px",
  backgroundColor: "#f4f6f8",
  marginLeft: "auto",
  transition: "margin-left 0.3s",
  height: "100vh",
  overflowY: "auto",
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: "20px",
  textAlign: "center",
  marginBottom: "20px",
  position: "relative",
  "&:hover .edit-button": {
    display: "block",
  },
}));

const EditButton = styled(Button)(({ theme }) => ({
  display: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const ManagerPage = () => {
  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEditClickProduct(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDeleteClick(params.row.ProductId)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
    { field: "ProductId", headerName: "Id", width: 150 },
    {
      field: "Image",
      headerName: "Image",
      width: 150,
      height: 130,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ width: "100%", height: "auto" }}
        />
      ),
    },
    { field: "ProductName", headerName: "Product Name", width: 150 },
    { field: "ProductCode", headerName: "Product Code", width: 150 },
    { field: "Description", headerName: "Description", width: 200 },
    { field: "Category", headerName: "Category", width: 150 },
    { field: "Material", headerName: "Material", width: 150 },
    { field: "GemOrigin", headerName: "Gem Origin", width: 150 },
    { field: "CaratWeight", headerName: "Carat Weight", width: 150 },
    { field: "Clarity", headerName: "Clarity", width: 150 },
    { field: "Color", headerName: "Color", width: 150 },
    { field: "Cut", headerName: "Cut", width: 150 },
    { field: "ProductSize", headerName: "Product Size", width: 150 },
    { field: "Status", headerName: "Status", width: 150 },
    { field: "UnitSizePrice", headerName: "Unit Size Price", width: 150 },
    { field: "Gender", headerName: "Gender", width: 150 },
    { field: "ProductPrice", headerName: "Product Price", width: 150 },
  ];

  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [cut, setCut] = useState("");
  const [clarity, setClarity] = useState("");
  const [color, setColor] = useState("");
  const [origin, setOrigin] = useState("");
  const [caratWeightRange, setCaratWeightRange] = useState([0.55, 1.75]);
  const [gemPriceList, setGemPriceList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [editedPrices, setEditedPrices] = useState({});
  const [editedDates, setEditedDates] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    ProductName: "",
    ProductCode: "",
    Description: "",
    CategoryID: "",
    GemCost: "",
    ProductionCost: "",
    PriceRate: "",
    ProductSize: "",
    Image: "",
    Status: "",
    Gender: "",
    GemId: "",
    MaterialId: "",
    Weight: "",
  });
  const [originalValues, setOriginalValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const fetchGemPriceList = async (filters) => {
    try {
      const response = await axios.get(
        "https://diamondstoreapi.azurewebsites.net/api/GemPriceList/FilterGemPriceList",
        {
          params: filters,
        }
      );
      setGemPriceList(response.data);
    } catch (error) {
      console.error("There was an error fetching the gem price list!", error);
    }
  };

  const fetchMaterialList = async () => {
    try {
      const response = await axios.get(
        "https://diamondstoreapi.azurewebsites.net/api/MaterialPriceLists"
      );
      setMaterialList(response.data);
    } catch (error) {
      console.error("There was an error fetching the material list!", error);
    }
  };

  const handleEditClickProduct = (row) => {
    setIsEdit(true);
    setFormValues(row);
    setOriginalValues(row);
    setOpen(true);
  };

  const handleDeleteClick = async (productId) => {
    const url = `https://diamondstoreapi.azurewebsites.net/api/Products/DeleteProduct/${productId}`;
    try {
      await axios.delete(url);
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (selectedMenu === "Diamond Management") {
      fetchGemPriceList({
        cut,
        clarity,
        color,
        origin,
        minCaratWeight: caratWeightRange[0],
        maxCaratWeight: caratWeightRange[1],
      });
    } else if (selectedMenu === "Material Management") {
      fetchMaterialList();
    }
  }, [selectedMenu, cut, clarity, color, origin, caratWeightRange]);

  const handleCutChange = (event) => {
    setCut(event.target.value);
  };

  const handleClarityChange = (event) => {
    setClarity(event.target.value);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleCaratWeightChange = (event, newValue) => {
    setCaratWeightRange(newValue);
  };

  const handleCloseClick = () => {
    setEditingCard(null);
  };

  const [customerRanking, setCustomerRanking] = useState([]);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);

  const { ordercount, setOrderCount } = useState([]);

  useEffect(() => {
    const fetchCustomerRanking = async () => {
      try {
        const response = await axios.get(
          "https://diamondstoreapi.azurewebsites.net/api/Accounts/CustomerRankingCount"
        );
        const data = response.data;

        // Extract labels and series data from response
        const fetchedLabels = Object.keys(data);
        const fetchedSeries = Object.values(data);

        setLabels(fetchedLabels);
        setSeries(fetchedSeries);
      } catch (error) {
        console.error("Error fetching customer ranking data:", error);
      }
    };

    fetchCustomerRanking();
  }, []);

  const [labels1, setLabels1] = useState([]);
  const [series1, setSeries1] = useState([]);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        const response = await axios.get(
          "https://diamondstoreapi.azurewebsites.net/api/Order/OrderCount"
        );
        const data = response.data;

        // Extract labels and series data from response
        const fetchedLabels = Object.keys(data);
        const fetchedSeries = Object.values(data);

        setLabels1(fetchedLabels);
        setSeries1(fetchedSeries);
      } catch (error) {
        console.error("Error fetching order count data:", error);
      }
    };

    fetchOrderCount();
  }, []);

  const [productCount, setProductCount] = useState({});

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axios.get(
          "https://diamondstoreapi.azurewebsites.net/api/Products/ProductCount"
        );
        const data = response.data;
        setProductCount(data);
      } catch (error) {
        console.error("Error fetching product count data:", error);
      }
    };

    fetchProductCount();
  }, []);

  const [series2, setSeries2] = useState([
    {
      name: "Revenue",
      data: [],
    },
  ]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get(
          "https://diamondstoreapi.azurewebsites.net/api/Order/GetRevenuePerMonthOfYear?year=2024"
        );
        const data = response.data;

        // Assuming the response data is an array of revenues for each month
        setSeries2([
          {
            name: "Revenue",
            data: data,
          },
        ]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const [mostSoldProduct, setMostSoldProduct] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [monthError, setMonthError] = useState("");

  const handleFetchData = async () => {
    if (month < 1 || month > 12) {
      setMonthError("Month must be between 1 and 12");
      return;
    } else {
      setMonthError("");
    }

    try {
      // Fetching most sold product data
      const productResponse = await axios.get(
        `https://diamondstoreapi.azurewebsites.net/api/Products/GetMostSoldProductCategoryMonthYear?Month=${month}&Year=${year}`
      );
      const productData = productResponse.data;
      setMostSoldProduct(productData);
      console.log(productData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [series3, setSeries3] = useState([
    {
      name: "Delivered Orders",
      data: [],
    },
  ]);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.get(
          `https://diamondstoreapi.azurewebsites.net/api/Order/GetNumberDeliveriedOrderPerMonthOfYear?year=2024`
        );
        const data = response.data;
        setSeries3([
          {
            name: "Delivered Orders",
            data: data,
          },
        ]);
        console.log();
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };

    fetchDeliveryData();
  }, []);

  // const options2 = {
  //   chart: {
  //     type: 'line',
  //     height: 'auto',
  //   },
  //   xaxis: {
  //     categories: [
  //       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  //     ],
  //   },
  //   yaxis: {
  //     labels: {
  //       formatter: (value) => value.toFixed(2),
  //     },
  //   },
  // };

  const options = {
    chart: {
      type: "line",
      height: "auto",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(2),
      },
    },
  };

  const handleEditClick = (item, type) => {
    setEditingCard(item.Id || item.materialID);
    setEditedPrices({
      [item.Id || item.materialID]: item.Price || item.UnitPrice,
    });
    setEditedDates({
      [item.Id || item.materialID]: new Date(
        item.EffDate || item.EffectedDate || Date.now()
      )
        .toISOString()
        .split("T")[0],
    });
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // Clear any stored data
    navigate("/login"); // Navigate to login page
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://diamondstoreapi.azurewebsites.net/api/Products"
      );
      const data = await response.json();

      // Log the data to see its structure
      console.log("API Data:", data);

      if (Array.isArray(data.Products)) {
        const formattedData = data.Products.map((item) => ({
          id: item.ProductId,
          CategoryID: item.CategoryID,
          GemCost: item.GemCost,
          ProductionCost: item.ProductionCost,
          GemId: item.GemId,
          Weight: item.Weight,
          PriceRate: item.PriceRate,
          MaterialId: item.MaterialId,
          ProductId: item.ProductId,
          ProductName: item.ProductName,
          ProductCode: item.ProductCode,
          Description: item.Description,
          Category: item.Category,
          Material: item.Material,
          GemOrigin: item.GemOrigin,
          CaratWeight: item.CaratWeight,
          Clarity: item.Clarity,
          Color: item.Color,
          Cut: item.Cut,
          ProductSize: item.ProductSize,
          Image: item.Image,
          Status: item.Status ? "Available" : "Unavailable",
          UnitSizePrice: item.UnitSizePrice,
          Gender: item.Gender,
          ProductPrice: item.ProductPrice,
        }));
        setRows(formattedData);
      } else {
        console.error("Expected an array but got:", data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveClickProduct = async () => {
    const updatedValues = {};

    for (const key in formValues) {
      if (formValues[key] !== originalValues[key]) {
        updatedValues[key] = formValues[key];
      }
    }

    // Log form values and updated values for debugging
    console.log("Form Values:", formValues);
    console.log("Original Values:", originalValues);
    console.log("Updated Values:", updatedValues);

    let url;
    try {
      url = isEdit
        ? `https://diamondstoreapi.azurewebsites.net/api/Products/UpdateProduct/${formValues.ProductId}`
        : "https://diamondstoreapi.azurewebsites.net/api/Products/CreateProduct";

      const response = await axios({
        method: isEdit ? "put" : "post",
        url: url,
        data: updatedValues,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setOpen(false);
      fetchData();
    } catch (error) {
      console.log("Response:", error.response);

      if (error.response) {
        console.error("Error response from server:", error.response.data); // Log detailed server error
        alert(`Error: ${JSON.stringify(error.response.data.errors, null, 2)}`); // Display error details
      } else {
        console.error("Error saving product:", error.message); // Log general error
        alert("Error saving product: " + error.message); // Display general error message
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file" && files && files.length > 0) {
      setFormValues({ ...formValues, [name]: files[0] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSaveClick = async (itemId, type) => {
    const url =
      type === "gem"
        ? "https://diamondstoreapi.azurewebsites.net/api/GemPriceList/UpdateGemPrice"
        : "https://diamondstoreapi.azurewebsites.net/api/MaterialPriceLists/UpdateUnitPrice";

    try {
      console.log(`Saving ${type} with ID ${itemId}`);
      console.log("New Price:", editedPrices[itemId]);
      console.log("Effective Date:", editedDates[itemId]);

      if (type === "gem") {
        await axios.put(url, {
          ID: itemId,
          NewPrice: editedPrices[itemId],
          EffectDate: new Date(editedDates[itemId]).toISOString(),
        });
      } else {
        await axios.put(url, {
          materialID: itemId,
          NewPrice: editedPrices[itemId],
          EffectDate: new Date(editedDates[itemId]).toISOString(),
        });
      }

      if (type === "gem") {
        setGemPriceList((prevList) =>
          prevList.map((item) =>
            item.Id === itemId
              ? {
                  ...item,
                  Price: editedPrices[itemId],
                  EffDate: new Date(editedDates[itemId]).toISOString(),
                }
              : item
          )
        );
      } else {
        setMaterialList((prevList) =>
          prevList.map((item) =>
            item.materialID === itemId
              ? {
                  ...item,
                  UnitPrice: editedPrices[item.materialID],
                  EffectedDate: new Date(
                    editedDates[item.materialID]
                  ).toISOString(),
                }
              : item
          )
        );
      }
      setEditingCard(null);
    } catch (error) {
      console.error(
        `There was an error updating the ${type} price list!`,
        error
      );
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6">Revenue</Typography>
                <Chart
                  options={options}
                  series={series2}
                  type="line"
                  height="auto"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6">Orders</Typography>
                <Chart
                  options={options}
                  series={series3}
                  type="line"
                  height="auto"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6">Order Count</Typography>
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                    },
                    labels: labels1,
                  }}
                  series={series1}
                  type="donut"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <Typography variant="h6">Customer Ranking</Typography>
                <Chart
                  options={{
                    chart: {
                      type: "donut",
                    },
                    labels: labels,
                  }}
                  series={series}
                  type="donut"
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box p={2}>
                <Typography variant="h6" gutterBottom>
                  Thông số chung
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <ShoppingCartIcon fontSize="large" />
                          <Box ml={2}>
                            <Typography variant="subtitle1">
                              Tổng Sản Phẩm
                            </Typography>
                            <Typography variant="h5">
                              {productCount.TotalProducts}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center">
                          <ShoppingCartIcon fontSize="large" />
                          <Box ml={2}>
                            <Typography variant="subtitle1">
                              Sản Phẩm Đã Bán
                            </Typography>
                            <Typography variant="h5">
                              {productCount.SoldProducts}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  {/* Add more cards as needed */}
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <Box
                  p={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControl
                    error={!!monthError}
                    style={{ marginRight: "16px" }}
                  >
                    <TextField
                      label="Month"
                      variant="outlined"
                      type="number"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      InputProps={{ inputProps: { min: 1, max: 12 } }}
                    />
                    {monthError && (
                      <FormHelperText>{monthError}</FormHelperText>
                    )}
                  </FormControl>
                  <TextField
                    label="Year"
                    variant="outlined"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{ marginRight: "16px" }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetchData}
                  >
                    Execute
                  </Button>
                </Box>
                <Box mt={4}>
                  <Card>
                    <Typography variant="h6" gutterBottom>
                      Most Sold Product
                    </Typography>
                    <Typography variant="body1">{mostSoldProduct}</Typography>
                  </Card>
                </Box>
              </Card>
            </Grid>
          </Grid>
        );
      case "Order History":
        return <OrderHistory />;
      case "Diamond Management":
        return (
          <div>
            <h1 style={{ color: "#333" }}>Gem Price List</h1>
            <FormControl fullWidth margin="normal">
              <InputLabel>Cut</InputLabel>
              <Select value={cut} onChange={handleCutChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Very Good">Very Good</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Clarity</InputLabel>
              <Select value={clarity} onChange={handleClarityChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="IF">IF</MenuItem>
                <MenuItem value="VVS1">VVS1</MenuItem>
                <MenuItem value="VVS2">VVS2</MenuItem>
                <MenuItem value="VS1">VS1</MenuItem>
                <MenuItem value="VS2">VS2</MenuItem>
                <MenuItem value="SI1">SI1</MenuItem>
                <MenuItem value="SI2">SI2</MenuItem>
                <MenuItem value="I1">I1</MenuItem>
                <MenuItem value="I2">I2</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Color</InputLabel>
              <Select value={color} onChange={handleColorChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="E">E</MenuItem>
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="G">G</MenuItem>
                <MenuItem value="H">H</MenuItem>
                <MenuItem value="I">I</MenuItem>
                <MenuItem value="J">J</MenuItem>
                <MenuItem value="K">K</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="M">M</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Origin</InputLabel>
              <Select value={origin} onChange={handleOriginChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Synthetic">Synthetic</MenuItem>
                <MenuItem value="Natural">Natural</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ width: "30%", marginTop: "16px" }}>
              <Typography id="range-slider" gutterBottom sx={{ color: "#333" }}>
                Carat Weight Range
              </Typography>
              <Slider
                value={caratWeightRange}
                onChange={handleCaratWeightChange}
                valueLabelDisplay="auto"
                min={0.55}
                max={1.75}
                step={0.01}
              />
            </Box>
            <Grid container spacing={3}>
              {gemPriceList.map((gem, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    {editingCard === gem.Id ? (
                      <Box>
                        <TextField
                          label="Price"
                          variant="outlined"
                          value={editedPrices[gem.Id] || ""}
                          onChange={(e) =>
                            setEditedPrices({
                              ...editedPrices,
                              [gem.Id]: e.target.value,
                            })
                          }
                          fullWidth
                          margin="normal"
                        />
                        <TextField
                          label="Effective Date"
                          variant="outlined"
                          type="date"
                          value={editedDates[gem.Id] || ""}
                          onChange={(e) =>
                            setEditedDates({
                              ...editedDates,
                              [gem.Id]: e.target.value,
                            })
                          }
                          fullWidth
                          margin="normal"
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveClick(gem.Id, "gem")}
                        >
                          Save
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="h6">{`ID: ${gem.Id}`}</Typography>
                        <Typography variant="body1">{`Origin: ${gem.Origin}`}</Typography>
                        <Typography variant="body1">{`Carat Weight: ${gem.CaratWeight}`}</Typography>
                        <Typography variant="body1">{`Color: ${gem.Color}`}</Typography>
                        <Typography variant="body1">{`Cut: ${gem.Cut}`}</Typography>
                        <Typography variant="body1">{`Clarity: ${gem.Clarity}`}</Typography>
                        <Typography variant="body1">{`Price: $${gem.Price}`}</Typography>
                        <Typography variant="body1">{`Effective Date: ${new Date(
                          gem.EffDate
                        ).toLocaleDateString()}`}</Typography>
                        <EditButton
                          className="edit-button"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEditClick(gem, "gem")}
                        >
                          Edit
                        </EditButton>
                      </>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        );
      case "Material Management":
        return (
          <Grid container spacing={3}>
            {materialList.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  {editingCard === item.materialID ? (
                    <Box>
                      <TextField
                        label="Unit Price"
                        variant="outlined"
                        value={editedPrices[item.materialID] || ""}
                        onChange={(e) =>
                          setEditedPrices({
                            ...editedPrices,
                            [item.materialID]: e.target.value,
                          })
                        }
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Effective Date"
                        variant="outlined"
                        type="date"
                        value={editedDates[item.materialID] || ""}
                        onChange={(e) =>
                          setEditedDates({
                            ...editedDates,
                            [item.materialID]: e.target.value,
                          })
                        }
                        fullWidth
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleSaveClick(item.materialID, "material")
                        }
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloseClick}
                      >
                        Close
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6">{`ID: ${item.materialID}`}</Typography>
                      <Typography variant="body1">{`Name: ${item.materialName}`}</Typography>
                      <Typography variant="body1">{`Unit Price: ${item.UnitPrice}`}</Typography>
                      <Typography variant="body1">{`Effective Date: ${new Date(
                        item.EffectedDate
                      ).toLocaleDateString()}`}</Typography>
                      <EditButton
                        className="edit-button"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEditClick(item, "material")}
                      >
                        Edit
                      </EditButton>
                    </>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        );
      case "Product Management":
        return (
          <Box sx={{ height: "90vh", width: "100%" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{ marginBottom: "10px" }}
            >
              Add Product
            </Button>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              loading={loading}
              rowHeight={125}
              getRowId={(row) => row.ProductId}
            />
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                {isEdit ? "Edit Product" : "Add Product"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  name="ProductName"
                  label="Product Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.ProductName}
                  onChange={handleInputChange}
                />

                <TextField
                  margin="dense"
                  name="ProductCode"
                  label="Product Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.ProductCode}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="Description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.Description}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="CategoryID"
                  label="Category ID"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.CategoryID}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="GemCost"
                  label="Gem Cost"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.GemCost}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="ProductionCost"
                  label="Production Cost"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.ProductionCost}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="PriceRate"
                  label="Price Rate"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.PriceRate}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="ProductSize"
                  label="Product Size"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.ProductSize}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="Status"
                  label="Status"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.Status}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="Gender"
                  label="Gender"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.Gender}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="GemId"
                  label="Gem ID"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.GemId}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="MaterialId"
                  label="Material ID"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.MaterialId}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="Weight"
                  label="Weight"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.Weight}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="dense"
                  name="Image"
                  label="Image"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.Image}
                  onChange={handleInputChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSaveClickProduct} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        );

      case "Account Management":
        return <AccountManagement />;

      default:
        return null;
    }
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar
        sx={{
          width: sidebarOpen ? 250 : 60,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            p: 1,
          }}
        >
          {sidebarOpen && (
            <Typography variant="h6" component="div">
              My-Task
            </Typography>
          )}
          <IconButton onClick={toggleSidebar} sx={{ mr: 0.5 }}>
            {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <List>
          <ListItem button onClick={() => setSelectedMenu("Dashboard")}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Dashboard" />}
          </ListItem>
          <ListItem button onClick={() => setSelectedMenu("Order History")}>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Order History" />}
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedMenu("Diamond Management")}
          >
            <ListItemIcon>
              <DiamondIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Diamond Management" />}
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedMenu("Material Management")}
          >
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Material Management" />}
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedMenu("Product Management")}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Product Management" />}
          </ListItem>
          <ListItem
            button
            onClick={() => setSelectedMenu("Account Management")}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            {sidebarOpen && <ListItemText primary="Account Management" />}
          </ListItem>

          <LogoutButton
            sidebarOpen={sidebarOpen}
            style={{
              background: "#fff",
              marginTop: "47vh",
              border: "1px solid #445c3d",
              color: "black",
              cursor: "pointer",
              width: "100%",
            }}
            buttonText="Logout"
          />
        </List>
      </Sidebar>
      <Content sx={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        {renderContent()}
      </Content>
    </Box>
  );
};

export default ManagerPage;
