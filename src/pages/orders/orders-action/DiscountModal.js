import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus, faTags } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";

import { svUpdateDiscount } from "../../../services/orders.service";

function DiscountModal({ setOpen, open, orderShow }) {
  console.log(orderShow.discount);
  const [discount, setDiscount] = useState(orderShow.discount);

  const handleClose = () => {
    setOpen(false);
    setDiscount(orderShow.discount);
  };

  const handleSaveDiscount = (_orderNumb) => {
    if (discount >= (orderShow.totalPrice + orderShow.delivery_price)) return false;
    svUpdateDiscount(_orderNumb, discount).then(res => {
        // console.log(res.status)
        if (res.status) {

        } else {

        }
    }).catch(err => console.log(err))
  }

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
          value={discount ? discount : 0}
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
              width: "100%"
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
