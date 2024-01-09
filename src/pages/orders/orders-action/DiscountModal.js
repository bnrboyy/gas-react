import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  svGetOrderByOrderNumber,
  svUpdateDiscount,
} from "../../../services/orders.service";

const modalSwal = withReactContent(Swal);
const ToastModal = modalSwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function DiscountModal({
  setOpen,
  open,
  orderShow,
  setOrderShow,
  discount,
  setDiscount,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const freshData = (_orderNumb) => {
    svGetOrderByOrderNumber({ orders_number: _orderNumb }).then(
      ({ data: d }) => {
        const result = {
          orders_number: d.orders_number,
          delivery_drop_address: d.delivery_drop_address,
          delivery_drop_address_more: d.delivery_drop_address_more,
          delivery_pickup_address: d.delivery_pickup_address,
          delivery_pickup_address_more: d.delivery_pickup_address_more,
          details: d.details,
          phone_number: d.phone_number,
          second_phone_number: d.second_phone_number,
          status_name: d.status_name.toLowerCase(),
          transaction_date: d.transaction_date,
          shipping_date: d.shipping_date,
          date_pickup: d.date_pickup,
          date_drop: d.date_drop,
          drop_image: d.drop_image,
          customer_name: d.customer_name,
          delivery_pickup: d.delivery_pickup,
          delivery_drop: d.delivery_drop,
          orderItemList: d.orderItemList,
          totalPrice: d.totalPrice,
          delivery_price: d.delivery_price,
          status_id: d.status_id,
          slip_image: d.slip_image,
          type_payment: d.type_payment,
          payment_verified: !!d.payment_verified,
          upload_images: d.upload_images,
          distance: d.distance,
          discount: d.discount,
        };

        setOrderShow(result);
      }
    );
  };

  const handleSaveDiscount = (_orderNumb) => {
    if (discount >= orderShow.totalPrice + orderShow.delivery_price)
      return false;
    handleClose();
    svUpdateDiscount(_orderNumb, discount)
      .then((res) => {
        if (res.status) {
          ToastModal.fire({
            icon: "success",
            title: "บันทึกส่วนลดสำเร็จ",
          });
          freshData(_orderNumb);
        } else {
        }
      })
      .catch((err) => console.log(err));
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
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
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{
            display: "flex",
            gap: ".5rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon icon={faTags} />
          ส่วนลด
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          ชื่อลูกค้า : {orderShow.customer_name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          เบอร์โทรศัพท์ : {orderShow.phone_number}
        </Typography>
        <TextField
          label="กรอกส่วนลด (บาท) "
          id="outlined-size-small"
          value={discount}
          size="small"
          sx={{ mt: 2 }}
          onChange={(e) => {
            setDiscount(() =>
              !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0
            );
          }}
        />
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
            style={{
              backgroundColor: "#52a742",
              height: "30px",
              width: "100%",
            }}
            variant="contained"
            onClick={(e) => handleSaveDiscount(orderShow.orders_number)}
            sx={{ height: "30px" }}
          >
            บันทึก
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default DiscountModal;
