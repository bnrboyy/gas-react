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
import { useEffect } from "react";

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "#",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "วันที่ทำรายการ",
  },
  {
    id: "carbs",
    numeric: false,
    disablePadding: false,
    label: "เปลี่ยนถัง/สั่งสินค้า",
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: "ค่าจัดส่ง",
  },
  {
    id: "carbs",
    numeric: false,
    disablePadding: false,
    label: "ส่วนลด",
  },
  {
    id: "protein",
    numeric: false,
    disablePadding: false,
    label: "รายได้หลังหักส่วนลด",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "สถานะคำสั่งซื้อ",
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
  const [filteredData, setFilteredData] = useState(orderList);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });

  const handleChangePage = (event, newPage) => {
    setLimited({
      begin: newPage * rowsPerPage,
      end: (newPage + 1) * rowsPerPage,
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10);
    setRowsPerPage(parseInt(rowPage));
    setLimited({ begin: 0, end: rowPage });
    setPage(0);
  };

  useEffect(() => {
    const result = orderList?.filter((item) => item);
    if (result) {
      setTotalData(result.length);
      setFilteredData(result.slice(limited.begin, limited.end));
    }
  }, [orderList, page, rowsPerPage]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    orders_number: "",
    customer_name: "",
    status_id: "",
    status: "",
    total_gross: 0,
    discount: 0,
    transaction_date: "",
    date_drop: "",
  });

  const handleTableRowClick = (row) => {
    const details = {
      orders_number: row.orders_number,
      customer_name: row.customer_name,
      status_id: row.status_id,
      status:
        row.status_id === 4
          ? "จัดส่งสำเร็จ"
          : row.status_id === 5
          ? "จัดส่งไม่สำเร็จ"
          : "",
      total_gross: row.total_price + row.delivery_price,
      discount: row.discount,
      transaction_date: row.transaction_date,
      date_drop: row.date_drop,
    };
    setProductDetails(details);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const modalTitleStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "20px",
  };

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
              {filteredData?.map((row, index) => {
                return (
                  <TableRow
                    tabIndex={-1}
                    key={index}
                    onClick={() => handleTableRowClick(row)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" scope="row" padding="normal">
                      {row.orders_number}
                    </TableCell>
                    <TableCell align="left">{row.transaction_date}</TableCell>
                    <TableCell align="left">{row.total_price} THB</TableCell>
                    <TableCell align="left">{row.delivery_price} THB</TableCell>
                    <TableCell align="left">{row.discount} THB</TableCell>
                    <TableCell
                      align="left"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.total_price + row.delivery_price - row.discount} THB
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
              {/* {emptyRows > 0 && (
                <TableRow
                  style={
                    {
                      // height: (dense ? 33 : 53) * emptyRows,
                    }
                  }
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
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
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>เลขคำสั่งซื้อ :</p>
                  <p>{productDetails.orders_number}</p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>ชื่อลูกค้า :</p>
                  <p>{productDetails.customer_name}</p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>สถานะคำสั่งซื้อ :</p>
                  <p
                    style={{
                      color: productDetails.status_id === 4 ? "green" : "red",
                    }}
                  >
                    {productDetails.status}
                  </p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>วันที่ทำรายการ :</p>
                  <p>{productDetails.transaction_date}</p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>วันเวลาที่จัดส่ง :</p>
                  <p>{productDetails.date_drop}</p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>
                    ราคาสินค้า(รวมค่าจัดส่ง) :
                  </p>
                  <p>{productDetails.total_gross} บาท</p>
                </div>
                <div id="modal-title" style={modalTitleStyle}>
                  <p style={{ fontWeight: "500" }}>ส่วนลด :</p>
                  <p>{productDetails.discount} บาท</p>
                </div>
              </Box>
            </Modal>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={totalData}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
