import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
} from "@mui/material";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import ButtonUI from "../../../components/ui/button/button";
import "./foods-table.scss";
import { svUpdateProductList } from "../../../services/orders.service";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { svGetOrderByOrderNumber } from "../../../services/orders.service";
import { svDeleteProductItem } from "../../../services/orders.service";

import { useState } from "react";

const FoodsTable = ({ orderList, orderShow, setOrderShow, }) => {
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const [open, setOpen] = React.useState(false);
  const [productList, setProductList] = useState({});
  const [orderProductList, setOrderProductList] = useState(orderList);
  const status_id = orderShow.status_id;
  const modalSwal = withReactContent(Swal);
  const uPermission = useSelector((state) => state.auth.userPermission);

  const editHandle = (row) => {
    setProductList(row);
    setOpen(true);
  };

  const deleteHandle = (row) => {
    modalSwal
      .fire({
        icon: "warning",
        title: "Are you sure?",
        text: "I want to delete this item!",
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: "#e11d48",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      })
      .then((result) => {
        if (result.isConfirmed) {
          svDeleteProductItem(row.id, row.orders_number).then((res) => {
            SwalUI({ status: res.status, description: res.data.data });
            if (res.status) {
              svGetOrderByOrderNumber({
                orders_number: row.orders_number,
                type: "foods",
              }).then(({ data: d }) => {
                const result = {
                  orders_number: d.orders_number,
                  delivery_drop_address: d.delivery_drop_address,
                  delivery_drop_address_more: d.delivery_drop_address_more,
                  delivery_pickup_address: d.delivery_pickup_address,
                  delivery_pickup_address_more: d.delivery_pickup_address_more,
                  details: d.details,
                  phone_number: d.phone_number,
                  status: d.status_name.toLowerCase(),
                  transaction_date: d.transaction_date,
                  shipping_date: d.shipping_date,
                  type_order: d.type_order,
                  date_pickup: d.date_pickup,
                  date_drop: d.date_drop,
                  pickup_image: d.pickup_image,
                  drop_image: d.drop_image,
                  member_name: d.member_name,
                  branch_name: d.branch_name,
                  branch_id: d.branch_id,
                  delivery_pickup: d.delivery_pickup,
                  delivery_drop: d.delivery_drop,
                  orderList: d.orderList,
                  totalPrice: d.totalPrice,
                  delivery_price: d.delivery_price,
                  status_id: d.status_id,
                  slip_image: d.slip_image,
                  type_payment: d.type_payment,
                  payment_verified: !!d.payment_verified,
                  line_id: d.line_id,
                  wechat: d.wechat,
                  telegram: d.telegram,
                  upload_images: d.upload_images,
                  distance: d.distance,
                  currency_symbol: d.currency,
                };
                setOrderShow(result);
                setOrderProductList(result.orderList);
              });
            }
          });
        }
      });
  };

  // console.log(orderList)

  return (
    <Table
      sx={{ minWidth: 650 }}
      aria-label="simple table"
      style={{ backgroundColor: "rgb(233 233 233)" }}
    >
      <TableHead>
        <TableRow>
          <TableCell>No.</TableCell>
          <TableCell align="left">Product Image</TableCell>
          <TableCell align="left">Product Name</TableCell>
          <TableCell align="left">Category</TableCell>
          <TableCell align="left">Price</TableCell>
          <TableCell align="left">Quantity</TableCell>
          <TableCell align="left">Microwave</TableCell>
          <TableCell align="left">Sweetness</TableCell>
          <TableCell align="left">Requirements</TableCell>
          {(status_id === 2 || status_id === 3) &&
            (uPermission.superAdmin || uPermission.admin) && (
              <TableCell align="center">Action</TableCell>
            )}
        </TableRow>
      </TableHead>
      <TableBody>
        {orderProductList?.map((row, index) => (
          <React.Fragment key={index}>
            <TableRow
              sx={{
                "&:last-child td, &:last-child th": {
                  border: 0,
                },
              }}
            >
              <TableCell align="left">{++index}</TableCell>
              <TableCell className="product-image" align="center">
                <figure>
                  <img
                    src={`${uploadPath + row.thumbnail_link}`}
                    alt="washingIcon"
                  />
                </figure>
              </TableCell>
              <TableCell align="left">{row.product_name}</TableCell>
              <TableCell align="center">{row.cate_title}</TableCell>
              <TableCell align="center">{row.price + " " + orderShow.currency_symbol}</TableCell>
              <TableCell align="center">X{row.quantity}</TableCell>
              <TableCell align="center">{row.microwave_name}</TableCell>
              <TableCell align="center">{row.sweetness_name}</TableCell>
              <TableCell align="center" sx={{fontWeight: "600"}} >{row.requirements}</TableCell>
              {(status_id === 2 || status_id === 3) &&
                (uPermission.superAdmin || uPermission.admin) && (
                  <TableCell
                    align="center"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={(e) => editHandle(row)}
                    >
                      Edit
                    </Button>
                    {orderProductList.length > 1 && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => deleteHandle(row)}
                      >
                        Del
                      </Button>
                    )}
                  </TableCell>
                )}
            </TableRow>
          </React.Fragment>
        ))}
      </TableBody>
      <ModalEdit
        open={open}
        setOpen={setOpen}
        productList={productList}
        setProductList={setProductList}
        setOrderProductList={setOrderProductList}
        setOrderShow={setOrderShow}
        orderProductList={orderProductList}
      />
    </Table>
  );
};

const ModalEdit = ({
  setOpen,
  open,
  productList,
  setProductList,
  setOrderProductList,
  orderProductList,
  setOrderShow,
}) => {
  const handleClose = () => setOpen(false);

  const quantityHandle = (isAdding) => {
    if (isAdding) {
      if (productList.quantity >= 10) return false;
      setProductList((prev) => {
        return { ...prev, quantity: productList.quantity + 1 };
      });
    } else {
      if (productList.quantity <= 1) return false;
      setProductList((prev) => {
        return { ...prev, quantity: productList.quantity - 1 };
      });
    }
  };

  const saveHandle = (_id, quantity) => {
    svUpdateProductList(quantity, _id, productList.orders_number).then(
      (res) => {
        if (res.status) {
          console.log(res);
          SwalUI({ status: res.status, description: res.data.description });
          svGetOrderByOrderNumber({
            orders_number: productList.orders_number,
            type: "foods",
          }).then(({ data: d }) => {
            const result = {
              orders_number: d.orders_number,
              delivery_drop_address: d.delivery_drop_address,
              delivery_drop_address_more: d.delivery_drop_address_more,
              delivery_pickup_address: d.delivery_pickup_address,
              delivery_pickup_address_more: d.delivery_pickup_address_more,
              details: d.details,
              phone_number: d.phone_number,
              status: d.status_name.toLowerCase(),
              transaction_date: d.transaction_date,
              shipping_date: d.shipping_date,
              type_order: d.type_order,
              date_pickup: d.date_pickup,
              date_drop: d.date_drop,
              pickup_image: d.pickup_image,
              drop_image: d.drop_image,
              member_name: d.member_name,
              branch_name: d.branch_name,
              branch_id: d.branch_id,
              delivery_pickup: d.delivery_pickup,
              delivery_drop: d.delivery_drop,
              orderList: d.orderList,
              totalPrice: d.totalPrice,
              delivery_price: d.delivery_price,
              status_id: d.status_id,
              slip_image: d.slip_image,
              type_payment: d.type_payment,
              payment_verified: !!d.payment_verified,
              line_id: d.line_id,
              wechat: d.wechat,
              telegram: d.telegram,
              upload_images: d.upload_images,
              distance: d.distance,
              currency_symbol: d.currency,
            };
            setOrderShow(result);
            setOrderProductList(result.orderList);
          });
        } else {
          SwalUI({ status: false, description: "Error!" });
        }
        setOpen(false);
      }
    );
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Edit Product Item
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {productList.product_name}
          <div className="input-group">
            <ButtonUI color="error" onClick={(e) => quantityHandle(false)}>
              <FontAwesomeIcon icon={faMinus} />
            </ButtonUI>
            <Typography component={"span"}>
              Quantity {productList.quantity}
            </Typography>
            {/* <span className="title"></span> */}
            <ButtonUI onClick={(e) => quantityHandle(true)}>
              <FontAwesomeIcon icon={faAdd} />
            </ButtonUI>
          </div>
        </Typography>
        <div
          className="button-footer"
          style={{
            width: "100%",
            display: "flex",
            gap: ".5rem",
            justifyContent: "end",
            marginTop: "2rem",
          }}
        >
          <Button
            variant="contained"
            onClick={(e) => saveHandle(productList.id, productList.quantity)}
            sx={{ height: "30px" }}
          >
            save
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default FoodsTable;
