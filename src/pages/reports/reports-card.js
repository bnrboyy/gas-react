import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  TablePagination,
  TextField,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  Modal,
} from "@mui/material";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import DateMoment from "../../components/ui/date-moment/date-moment";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import ReportsTab from "./reports-tab";

const ReportsCard = ({ items, dateValue, monthValue, yearValue, startDate, endDate }) => {
  const [summaryValues, setSummaryValues] = useState({
    num: 0,
    productPrice: 0,
    deliveryPrice: 0,
    totalPrice: 0,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filteredItems, setFilteredItems] = useState([]);

  const [selectedOrderTypeId, setSelectedOrderTypeId] = useState("");

  const [wadType, setWadType] = useState("all");
  const handleChangeWadType = (event) => {
    setWadType(event.target.value);
  };

  useEffect(() => {
    let updateProductPrice = 0;
    let updateDeliveryPrice = 0;
    let updateTotalPrice = 0;

    // Show Report Condition
    const filteredItems = items.filter((row) => {
      if (row.status_id === 4) {
        const transactionDate = new Date(row.transaction_date);

        if (startDate && endDate) {
          return (
            transactionDate >= startDate &&
            transactionDate <= new Date(endDate.getTime() + 86400000) &&
            (selectedOrderTypeId === "" || row.type_order === selectedOrderTypeId)
          );
        } else if (dateValue) {
          const year = dateValue.getFullYear();
          const month = dateValue.getMonth();
          const day = dateValue.getDate();
          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() === month &&
            transactionDate.getDate() === day &&
            (selectedOrderTypeId === "" || row.type_order === selectedOrderTypeId)
          );
        } else if (monthValue) {
          const year = monthValue.getFullYear();
          const month = monthValue.getMonth();
          return (
            transactionDate.getFullYear() === year &&
            transactionDate.getMonth() === month &&
            (selectedOrderTypeId === "" || row.type_order === selectedOrderTypeId)
          );
        } else if (yearValue) {
          const year = yearValue.getFullYear();
          return (
            transactionDate.getFullYear() === year &&
            (selectedOrderTypeId === "" || row.type_order === selectedOrderTypeId)
          );
        }
      }
      return false;
    });

    filteredItems.forEach((row) => {
      wadType === "all"
        ? (updateProductPrice += row.total_price)
        : wadType === "wash"
        ? (updateProductPrice += row.washing_price)
        : (updateProductPrice += row.drying_price);

      updateDeliveryPrice += row.delivery_price;

      wadType === "all"
        ? (updateTotalPrice += row.total_price + row.delivery_price)
        : wadType === "wash"
        ? (updateTotalPrice += row.washing_price + row.delivery_price)
        : (updateTotalPrice += row.drying_price + row.delivery_price);
    });

    setSummaryValues({
      productPrice: updateProductPrice,
      deliveryPrice: updateDeliveryPrice,
      totalPrice: updateTotalPrice,
    });

    setFilteredItems(filteredItems);
  }, [items, startDate, endDate, dateValue, monthValue, yearValue, selectedOrderTypeId, wadType]);

  // Update the displayed items based on the page and rowsPerPage
  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const displayedItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangeSelect = (event) => {
    const selectedId = event.target.value;
    const result = items.filter((item) => item.type_order === selectedId);
    setFilteredItems(result);
    setSelectedOrderTypeId(selectedId); // Update the selected category ID state
    if (selectedId !== "washing") {
      setWadType("all");
      setPage(0);
    } else {
      setPage(0);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add headers to the worksheet Summary
    const headerRow2 = worksheet.addRow(["Summary Product Price", "Delivery Price", "Total Price"]);
    headerRow2.font = { bold: true };

    // Add data to the worksheet Summary
    worksheet.addRow([
      summaryValues.productPrice + " THB",
      summaryValues.deliveryPrice + " THB",
      summaryValues.totalPrice + " THB",
    ]);

    // Add headers to the worksheet
    const headerRow = worksheet.addRow([
      "Order Number",
      "Customer Name",
      "Branch",
      "Order Type",
      "Transaction Date",
      "Product Price",
      "Delivery Price",
      "Total Price",
    ]);
    headerRow.font = { bold: true };

    // Add data to the worksheet
    filteredItems.forEach((row) => {
      let price = "";
      let t_price = "";
      let t_order = "";
      if (selectedOrderTypeId === "washing" && wadType === "all") {
        t_order = "Washing and Drying";
        price = row.total_price + " THB";
        t_price = row.total_price + row.delivery_price + " THB";
      } else if (selectedOrderTypeId === "washing" && wadType === "wash") {
        t_order = "Washing";
        price = row.washing_price + " THB";
        t_price = row.washing_price + row.delivery_price + " THB";
      } else if (selectedOrderTypeId === "washing" && wadType === "dry") {
        t_order = "Drying";
        price = row.drying_price + " THB";
        t_price = row.drying_price + row.delivery_price + " THB";
      } else if (selectedOrderTypeId !== "washing") {
        if (row.type_order === "washing") {
          t_order = "Washing and Drying";
          price = row.total_price + " THB";
          t_price = row.total_price + row.delivery_price + " THB";
        } else {
          t_order = "Foods";
          price = row.total_price + " THB";
          t_price = row.total_price + row.delivery_price + " THB";
        }
      }
      worksheet.addRow([
        row.orders_number,
        row.member_name,
        row.branch_name,
        t_order,
        row.transaction_date,
        price,
        row.delivery_price + " THB",
        t_price,
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = Math.max(12, column.width);
    });

    // Generate the Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Reports.xlsx`);
    });
  };

  const [selectedOrdersNumber, setSelectedOrdersNumber] = useState(null);
  const [selectedProductsName, setSelectedProductsName] = useState(null);
  const [selectedTypesOrder, setSelectedTypesOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTableRowClick = (ordersNumber, productsName, typesOrder) => {
    setSelectedOrdersNumber(ordersNumber);
    setSelectedProductsName(productsName);
    setSelectedTypesOrder(typesOrder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {filteredItems.length !== 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: "1.2rem",
            marginBottom: "24px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <p style={{ fontWeight: "400", fontSize: "1rem" }}>Order Type</p>
            <Select
              value={selectedOrderTypeId}
              onChange={handleChangeSelect}
              style={{ width: "326.05px" }}
              size="small"
              displayEmpty
            >
              <MenuItem value="">{t("All")}</MenuItem>
              <MenuItem value="foods">{t("Foods")}</MenuItem>
              <MenuItem value="washing">{t("Washing and Drying")}</MenuItem>
            </Select>
          </div>
          {selectedOrderTypeId === "washing" ? (
            <>
              <RadioGroup
                name="mode"
                value={wadType}
                onChange={handleChangeWadType}
                row
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "1rem",
                  marginLeft: "0.4rem",
                }}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel value="wash" control={<Radio />} label="Washing" />
                <FormControlLabel value="dry" control={<Radio />} label="Drying" />
              </RadioGroup>
            </>
          ) : (
            <></>
          )}
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={exportToExcel}
            style={{
              textTransform: "initial",
              width: "150px",
              height: "40px",
              position: "absolute",
              top: "0",
              right: "0",
            }}
          >
            Export to Excel
          </Button>
        </div>
      )}
      <TableContainer component={Paper} className="card-desktop" style={{ marginBottom: "24px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Summary Product Price</TableCell>
              <TableCell align="left">Summary Delivery Price</TableCell>
              <TableCell align="left">Summary Total Price</TableCell>
            </TableRow>
          </TableHead>
          {summaryValues.productPrice !== 0 &&
          summaryValues.deliveryPrice !== 0 &&
          summaryValues.totalPrice !== 0 ? (
            <TableBody>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="left">{summaryValues.productPrice} THB</TableCell>
                <TableCell align="left">{summaryValues.deliveryPrice} THB</TableCell>
                <TableCell align="left">{summaryValues.totalPrice} THB</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            false
          )}
        </Table>
      </TableContainer>
      <TableContainer component={Paper} className="card-desktop">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Order Number</TableCell>
              <TableCell align="left">Customer Name</TableCell>
              <TableCell align="left">Branch</TableCell>
              <TableCell align="left">Order Type</TableCell>
              <TableCell align="left">Transaction Date</TableCell>
              <TableCell align="left">Product Price</TableCell>
              <TableCell align="left">Delivery Price</TableCell>
              <TableCell align="left">Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedItems.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleTableRowClick(row.orders_number, row.product_name, row.type_order)
                }
              >
                <TableCell align="left">{row.orders_number}</TableCell>
                <TableCell align="left">{row.member_name}</TableCell>
                <TableCell align="left">{row.branch_name}</TableCell>
                {selectedOrderTypeId === "washing" && wadType === "all" ? (
                  <TableCell align="left">Washing and Drying</TableCell>
                ) : selectedOrderTypeId === "washing" && wadType === "wash" ? (
                  <TableCell align="left">Washing</TableCell>
                ) : selectedOrderTypeId === "washing" && wadType === "dry" ? (
                  <TableCell align="left">Drying</TableCell>
                ) : row.type_order === "washing" ? (
                  <TableCell align="left" style={{ textTransform: "capitalize" }}>
                    {row.type_order} and Drying
                  </TableCell>
                ) : (
                  <TableCell align="left" style={{ textTransform: "capitalize" }}>
                    {row.type_order}
                  </TableCell>
                )}
                <TableCell align="left">
                  <DateMoment format={"LLL"} date={row.transaction_date} />
                </TableCell>
                {wadType === "all" ? (
                  <TableCell align="left">{row.total_price} THB</TableCell>
                ) : wadType === "wash" ? (
                  <TableCell align="left">{row.washing_price} THB</TableCell>
                ) : (
                  <TableCell align="left">{row.drying_price} THB</TableCell>
                )}
                <TableCell align="left">{row.delivery_price} THB</TableCell>
                {wadType === "all" ? (
                  <TableCell align="left">{row.total_price + row.delivery_price} THB</TableCell>
                ) : wadType === "wash" ? (
                  <TableCell align="left">{row.washing_price + row.delivery_price} THB</TableCell>
                ) : (
                  <TableCell align="left">{row.drying_price + row.delivery_price} THB</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                outline: "none",
                maxWidth: 768,
                borderRadius: "10px",
              }}
            >
              <div
                id="modal-title"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "20px",
                }}
              >
                <p style={{ fontWeight: "bold" }}>Orders Number :</p>
                <p>{selectedOrdersNumber}</p>
              </div>
              <div
                id="modal-description"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "0.25rem",
                  fontSize: "20px",
                  width: "100%",
                }}
              >
                <div>
                  <p style={{ fontWeight: "bold" }}>Product : </p>
                </div>
                <div>
                  {selectedTypesOrder && selectedTypesOrder === "washing" ? (
                    <p>
                      Washing {selectedProductsName[0]} {selectedProductsName[1]}, Drying{" "}
                      {selectedProductsName[2]}
                    </p>
                  ) : selectedProductsName && selectedProductsName.length > 1 ? (
                    <p style={{ maxWidth: "360px" }}>{selectedProductsName.join(", ")}</p>
                  ) : (
                    <p style={{ maxWidth: "360px" }}>{selectedProductsName}</p>
                  )}
                </div>
              </div>
            </Box>
          </Modal>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 100, 1000, 10000, 50000, 99999]}
        component="div"
        count={filteredItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
};

export default ReportsCard;
