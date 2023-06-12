import React from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Modal } from "@mui/material/";
import { useState } from "react";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Order List",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Transaction Date",
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: "Delivery",
  },
  {
    id: "carbs",
    numeric: false,
    disablePadding: false,
    label: "Wash&Dry/Food",
  },
  {
    id: "protein",
    numeric: false,
    disablePadding: false,
    label: "Total Price",
  },
  {
    id: "payment",
    numeric: false,
    disablePadding: false,
    label: "Payment Type",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Order Status",
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "left"}
            padding={headCell.disablePadding ? "normal" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function TableTab({ orderList }) {
  // const [dense, setDense] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const [selectedOrdersNumber, setSelectedOrdersNumber] = useState(null);
  const [selectedProductsName, setSelectedProductsName] = useState([]);
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

  let productWashingCap, productWashingTemp, productDryingCap, productFoods;

  if (selectedProductsName && typeof selectedProductsName === "string") {
    const productsArray = selectedProductsName.split(",");
    productWashingCap = productsArray[0];
    productWashingTemp = productsArray[1];
    productDryingCap = productsArray[2];
    productFoods = selectedProductsName.replace(/,/g, ", ")
  }


  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            // size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead />
            <TableBody>
              {orderList?.map((row, index) => {
                return (
                  <TableRow
                    tabIndex={-1}
                    key={index}
                    onClick={() =>
                      handleTableRowClick(row.orders_number, row.product_name, row.type_order)
                    }
                    style={{cursor: "pointer"}}
                  >
                    <TableCell component="th" scope="row" padding="normal">
                      {row.type_order === "washing" ? "Washing and Drying" : "Foods"}
                    </TableCell>
                    <TableCell align="left">{row.transaction_date}</TableCell>
                    <TableCell align="left">{row.delivery_price} THB</TableCell>
                    <TableCell align="left">{row.total_price} THB</TableCell>
                    <TableCell align="left">{row.total_price + row.delivery_price} THB</TableCell>
                    <TableCell align="left" style={{ textTransform: "capitalize" }}>
                      {row.type_payment}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        color: row.status_id === 4 ? "#0FB900" : "#E32900",
                      }}
                    >
                      {row.status_id === 4 ? "Complete" : "Fails"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={
                    {
                      // height: (dense ? 33 : 53) * emptyRows,
                    }
                  }
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
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
                    {selectedTypesOrder === "washing" ? (
                      <p>
                        Washing {productWashingCap} {productWashingTemp}, Drying {productDryingCap}
                      </p>
                    ) : (
                      <p>{productFoods}</p>
                    )}
                  </div>
                </div>
              </Box>
            </Modal>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={orderList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
