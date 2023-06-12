import { faCheck, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import ButtonUI from "../../../components/ui/button/button";

const WashingTable = ({
  orderList,
  showDialog,
  setShowDialog,
  setApproveForm,
  setOrderShow,
  orderShow,
}) => {
  const uploadPath = useSelector((state) => state.app.uploadPath);

  const handleShowDialog = (
    orders_number,
    product_id,
    page_id,
    cart_number
  ) => {
    setApproveForm((prev) => {
      return {
        ...prev,
        orders_number: orders_number,
        product_id: product_id,
        page_id: page_id,
        cart_number: cart_number,
      };
    });
    setShowDialog(true);
  };
  return (
    <Table
      sx={{ minWidth: 650 }}
      aria-label="simple table"
      style={{ backgroundColor: "rgb(233 233 233)" }}
    >
      <TableHead>
        <TableRow>
          <TableCell>Cart No.</TableCell>
          <TableCell align="left">Product Image</TableCell>
          <TableCell align="left">Product Name</TableCell>
          <TableCell align="left">Title</TableCell>
          <TableCell align="left">Price</TableCell>
          {/* <TableCell align="left">Minutes</TableCell> */}
          <TableCell align="left">Minutes Add</TableCell>
          {/* <TableCell align="left">Weight</TableCell> */}
          <TableCell align="center">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orderList?.map((row, index) => (
          <React.Fragment key={index}>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell align="left">{row.cart_number}</TableCell>
              <TableCell
                className="product-image"
                component="th"
                scope="row"
                align="center"
              >
                <figure>
                  {row.page_id === 10 ? (
                    <img
                      src={`${uploadPath}img/wash&drylist/washing.png`}
                      alt="washingIcon"
                    />
                  ) : (
                    <img
                      src={`${uploadPath}img/wash&drylist/drying.png`}
                      alt="washingIcon"
                    />
                  )}
                </figure>
              </TableCell>
              <TableCell component="th" scope="row" align="left">
                <p>{row.page_id === 10 ? "Washing" : "Drying"}</p>
              </TableCell>
              <TableCell align="left">{row.title}</TableCell>
              <TableCell align="left">{row.totalPrice + " " + orderShow.currency_symbol}</TableCell>
              {/* <TableCell align="left">
                {row.page_id === 11
                  ? row.default_minutes + " minutes"
                  : "0"}
              </TableCell> */}
              <TableCell align="left">
                {(row.page_id === 11 && row.minutes_add > 0) ? (
                  <Chip
                    label={`+${row.minutes_add} minutes`}
                    color="success"
                    variant="outlined"
                  />
                ) : (
                  "0"
                )}
              </TableCell>
              {/* <TableCell align="left">{row.weight ? row.weight + " KG." : ""}</TableCell> */}
              <TableCell align="center">
                {!!!row.verified && (
                  <ButtonUI
                    onClick={() =>
                      handleShowDialog(
                        row.orders_number,
                        row.product_id,
                        row.page_id,
                        row.cart_number
                      )
                    }
                    icon={<FontAwesomeIcon icon={faSyncAlt} />}
                    className="btn-update"
                    on="edit"
                    width="md"
                  >
                    Check
                  </ButtonUI>
                )}
              </TableCell>
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

export default WashingTable;
