import {
  faBan,
  faBook,
  faEye,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { t } from "i18next";
import React from "react";
import { useSelector } from "react-redux";

import ButtonUI from "../../components/ui/button/button";
import DateMoment from "../../components/ui/date-moment/date-moment";


const OrdersCard = ({ items, editHandler, cancelHandler }) => {
  const uPermission = useSelector((state) => state.auth.userPermission);

  return (
    <TableContainer component={Paper} className="card-desktop">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell align="left">เลขคำสั่งซื้อ</TableCell>
            <TableCell align="left">ชื่อลูกค้า</TableCell>
            <TableCell align="left">เบอร์โทร</TableCell>
            <TableCell align="left">สถานะคำสั่งซื้อ</TableCell>
            <TableCell align="left">การชำระเงิน</TableCell>
            <TableCell align="left">สถานะการชำระเงิน</TableCell>
            <TableCell align="left">วันที่ดำเนินการ</TableCell>
            <TableCell align="left">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items &&
            items.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {++index}
                </TableCell>
                <TableCell align="left">{row.orders_number}</TableCell>
                <TableCell align="left">{row.customer_name}</TableCell>
                <TableCell align="left">{row.phone_number}</TableCell>
                {/* <TableCell align="left">{row.branch_name}</TableCell> */}
                {/* {row.type_order === "washing" ? (
                <TableCell align="left">Washing and Drying</TableCell>
              ) : (
                <TableCell align="left">Foods</TableCell>
              )} */}
                <TableCell align="left">
                  <Chip
                    label={row.status_name}
                    size="small"
                    color={
                      row.status_id === 1
                        ? "secondary"
                        : row.status_id === 2
                        ? "warning"
                        : row.status_id === 3
                        ? "primary"
                        : row.status_id === 4
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell align="left">
                  {row.type_payment === "cash" ? "ชำระเงินปลายทาง" : "โอนจ่าย"}
                </TableCell>
                <TableCell
                  align="left"
                  style={{
                    color: row.payment_verified ? "#2e7d32" : "#ed6c02",
                  }}
                >
                  {row.payment_verified ? "ตรวจสอบแล้ว" : "รอการตรวจสอบ"}
                </TableCell>
                <TableCell align="left">
                  <DateMoment format={"LLL"} date={row.transaction_date} />
                </TableCell>
                <TableCell
                  align="left"
                  className="column-action"
                  style={{ display: "flex" }}
                >
                  <ButtonUI
                    onClick={(e) =>
                      editHandler(row.orders_number, row.type_order)
                    }
                    on="show"
                    className="btn-custom onShow"
                    icon={<FontAwesomeIcon icon={faEye} />}
                  >
                    {"แสดง"}
                  </ButtonUI>
                  { row.status_id !== 5 && row.status_id !== 4 && uPermission.superAdmin &&
                    <ButtonUI
                      onClick={(e) => cancelHandler(row.orders_number)}
                      on="edit"
                      className="btn-custom onDelete"
                      icon={<FontAwesomeIcon icon={faBan} />}
                    >
                      {"ยกเลิก"}
                    </ButtonUI>
                  }
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersCard;
