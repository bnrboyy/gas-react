import React, { useEffect, useState } from "react";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector, useDispatch } from "react-redux";
import "./orders-modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowRightFromBracket,
  faCheck,
  faMapLocationDot,
  faRandom,
  faXmark,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import { Chip, Menu, MenuItem, Modal, Button } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ListTable from "./lists-table";
import { LoadingButton } from "@mui/lab";
import {
  svApproveOrder,
  svSendOrder,
  svUpdateOrderStatus,
  svVerifiedItem,
  svVerifiedPayment,
  svGetOrderPending,
  svGetOrderByOrderNumber,
} from "../../../services/orders.service";
import { appActions } from "../../../store/app-slice";
import { pdf } from "@react-pdf/renderer";
import PDFFile from "./pdffile";
import DiscountModal from "./DiscountModal";

const OrdersModal = ({
  isOpen,
  setClose,
  orderShow,
  isWashing,
  setRefreshData,
  refreshData,
  editHandler,
  setOrderShow,
}) => {
  const statusLists = [
    {
      value: 3,
      title: "กำลังดำเนินการ",
    },
    {
      value: 4,
      title: "จัดส่งสำเร็จ",
    },
    {
      value: 5,
      title: "จัดส่งไม่สำเร็จ",
    },
  ];
  const images = orderShow.upload_images?.split(",");
  const dispatch = useDispatch();
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const modalSwal = withReactContent(Swal);
  const srcError = "/images/no-image.png";
  const [imgError, setImgError] = useState({ pickup: false, drop: false });
  const isSuperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  const [showDialog, setShowDialog] = useState(false);
  const [discountShow, setDiscountShow] = useState(false);
  const [discount, setDiscount] = useState(orderShow.discount);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [approveForm, setApproveForm] = useState({
    orders_number: "",
    weight: "",
    product_id: null,
    cart_number: 0,
    page_id: 0,
    add_price: 0,
  });

  const imageError = (e, type) => {
    if (type === "pickup") {
      setImgError((prev) => {
        return { ...prev, pickup: true };
      });
    }
    if (type === "drop") {
      setImgError((prev) => {
        return { ...prev, drop: true };
      });
    }
    e.target.setAttribute("src", srcError);
  };

  const handlerShowImage = (imgPath, type) => {
    if (type === "pickup" && imgError.pickup) return false;
    if (type === "drop" && imgError.drop) return false;
    modalSwal.fire({
      imageUrl: imgPath,
      imageHeight: 400,
      showConfirmButton: false,
    });
  };

  const getDataEdit = () => {
    editHandler(orderShow.orders_number, orderShow.type_order);
  };

  const handlerShowPayment = (imgPath) => {
    if (orderShow.type_payment === "cash") {
      Swal.fire({
        title: "ชำระเงินปลายทาง",
        text: "ยืนยันการตรวจสอบ",
        background: "#fff",
        showCancelButton: true,
        confirmButtonColor: "rgb(71 192 195)",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showLoaderOnConfirm: true,
        preConfirm: (isConfirmed) => {
          svVerifiedPayment(orderShow.orders_number);
          getDataEdit();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    } else {
      Swal.fire({
        title: "โอนจ่าย",
        html: `
        <figure class="preview-img-verify" >
          <img src='${imgPath}' id="img_preview" />
        </figure>`,
        background: "#fff",
        showCancelButton: true,
        confirmButtonColor: "rgb(71 192 195)",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        showLoaderOnConfirm: true,
        preConfirm: (isConfirmed) => {
          svVerifiedPayment(orderShow.orders_number);
          getDataEdit();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    }
  };

  useEffect(() => {
    if (!isOpen) setImgError({ pickup: false, drop: false });
  }, [isOpen]);

  const handlerShowLocation = (locationPath) => {
    window.open(
      `https://www.google.co.th/maps/place/${locationPath}`,
      "_blank"
    );
  };

  const handleUpdate = async (_status) => {
    const data = {
      orders_number: orderShow.orders_number,
      status_id: _status,
    };
    svUpdateOrderStatus(data).then((res) => {
      setAnchorEl(null);
      setClose(false);
      setRefreshData(refreshData + 1);
    });
  };

  const handleApprove = async (_orders_number) => {
    const _data = {
      orders_number: _orders_number,
      pickup_image: null,
      drop_image: null,
    };
    onApprove(_data);
  };

  const handleValidateWashing = () => {
    svVerifiedItem(approveForm)
      .then((res) => {
        setRefreshData(refreshData + 1);
        setShowDialog(false);
        getDataEdit();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSendOrder = async (_orders_number) => {
    Swal.fire({
      title: "โปรดอัพโหลดรูปภาพจัดส่ง!",
      html: `
        <figure class="preview-img-confirm" >
          <img src='${srcError}' id="img_preview" />
          <input type="file" id="drop_image" />
          <svg
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
          >
            <path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"/>
          </svg>
          <div class="circle"></div>
        </figure>
        <span id="error-message" style="color:red;display:none;">โปรดอัพโหลดรูปภาพจัดส่ง!!!</span>`,
      background: "#fff",
      showCancelButton: true,
      confirmButtonColor: "rgb(71 192 195)",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
      didOpen: () => {
        const file_el = document.querySelector("#drop_image");
        const img_preview = document.querySelector("#img_preview");
        if (file_el) {
          file_el.addEventListener("change", () => {
            img_preview.setAttribute(
              "src",
              URL.createObjectURL(file_el.files[0])
            );
            const figure_el = document.querySelector(".preview-img-confirm");
            figure_el.classList.remove("error");
            const error_el = document.querySelector("#error-message");
            error_el.style.display = "none";
          });
        }
      },
      showLoaderOnConfirm: true,
      preConfirm: (isConfirmed) => {
        const file_el = document.querySelector("#drop_image");
        if (file_el.files.length === 0) {
          const figure_el = document.querySelector(".preview-img-confirm");
          figure_el.classList.add("error");
          const error_el = document.querySelector("#error-message");
          error_el.style.display = "block";
          return false;
        }
        const _data = {
          orders_number: _orders_number,
          pickup_image: null,
          drop_image: file_el.files[0],
        };
        onSendOrder(_data);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
    return false;
  };

  const onApprove = async (_param) => {
    const formData = new FormData();
    formData.append("orders_number", _param.orders_number);
    if (_param.pickup_image) {
      formData.append("pickup_image", _param.pickup_image);
    }
    if (_param.drop_image) {
      formData.append("drop_image", _param.drop_image);
    }

    svApproveOrder(formData).then((res) => {
      if (res.status) {
        setAnchorEl(null);
        setClose(false);
        setRefreshData(refreshData + 1);
        svGetOrderPending().then((res) => {
          dispatch(appActions.setNewOrders(res.data.data));
        });
        modalSwal.fire({
          background: "#fff",
          position: "center",
          width: 450,
          icon: "success",
          title: "Successful",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        modalSwal.fire({
          background: "#fff",
          position: "center",
          width: 450,
          icon: "error",
          title: "Failed.",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const onSendOrder = async (_param) => {
    const formData = new FormData();
    formData.append("orders_number", _param.orders_number);
    if (_param.pickup_image) {
      formData.append("pickup_image", _param.pickup_image);
    }
    if (_param.drop_image) {
      formData.append("drop_image", _param.drop_image);
    }

    svSendOrder(formData).then((res) => {
      if (res.status) {
        setAnchorEl(null);
        setClose(false);
        setRefreshData(refreshData + 1);
        modalSwal.fire({
          background: "#fff",
          position: "center",
          width: 450,
          icon: "success",
          title: "Successful",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        modalSwal.fire({
          background: "#fff",
          position: "center",
          width: 450,
          icon: "error",
          title: "Failed.",
          text: res.description,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const openPDF = async () => {
    const blob = await pdf(
      <PDFFile
        order_number={orderShow.orders_number}
        order_date={orderShow.transaction_date}
        order_list={orderShow.orderList}
        order_delivery_price={orderShow.delivery_price}
        order_total_price={orderShow.totalPrice}
      />
    ).toBlob();
    const pdfURL = URL.createObjectURL(blob);
    window.open(pdfURL, "_blank");
  };

  const editDiscount = () => {
    svGetOrderByOrderNumber({ orders_number: orderShow.orders_number })
      .then(({ data: d }) => {
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
        setDiscount(result.discount);
      })
      .then(() => setDiscountShow(true));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        open={isOpen}
        onClose={(e) => setClose(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="orders-modal">
          <section id="orders-modal-page">
            <div className="card-control">
              <div className="card-head">
                <div className="head-action">
                  <h2 className="head-title">
                    <FontAwesomeIcon icon={faAdd} /> รายละเอียดคำสั่งซื้อ
                  </h2>
                  <h3>
                    #{orderShow.orders_number}{" "}
                    <Chip
                      label={orderShow.status_name}
                      size="small"
                      color={
                        orderShow.status_id === 1
                          ? "secondary"
                          : orderShow.status_id === 2
                          ? "warning"
                          : orderShow.status_id === 3
                          ? "primary"
                          : orderShow.status_id === 4
                          ? "success"
                          : "error"
                      }
                    />
                  </h3>
                  {!orderShow.payment_verified ? (
                    <LoadingButton
                      className="btn"
                      color="warning"
                      size="small"
                      variant="outlined"
                      onClick={(e) =>
                        handlerShowPayment(
                          `${uploadPath + orderShow.slip_image}`
                        )
                      }
                    >
                      {"ตรวจสอบการชำระเงิน"}
                    </LoadingButton>
                  ) : (
                    <div>
                      {/* <h4 style={{ color: "green" }}>
                        การชำระเงินได้รับการยืนยันแล้ว
                      </h4> */}
                    </div>
                  )}
                </div>
                {isSuperAdmin && (
                  <div
                    className="status"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".5rem",
                    }}
                  >
                    {isSuperAdmin &&
                      (orderShow.status_id === 2 ||
                        orderShow.status_id === 3) && (
                        <div className="column-top">
                          <Button
                            onClick={() => editDiscount()}
                            variant="contained"
                            startIcon={<FontAwesomeIcon icon={faTag} />}
                            style={{
                              backgroundColor: "#52a742",
                              height: "36px",
                              width: "133.7px",
                            }}
                          >
                            ส่วนลด
                          </Button>
                        </div>
                      )}
                    {/* {orderShow.status_id !== 5 && (
                      <Button
                        onClick={() => openPDF()}
                        size="small"
                        color="error"
                        variant="contained"
                        style={{ display: "flex", gap: "0.5rem" }}
                      >
                        <FontAwesomeIcon icon={faBook} />
                        Open PDF
                      </Button>
                    )} */}

                    <LoadingButton
                      className="btn"
                      size="small"
                      variant="contained"
                      id="basic-button"
                      aria-controls={"basic-menu"}
                      aria-haspopup="true"
                      aria-expanded={"true"}
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      startIcon={<FontAwesomeIcon icon={faRandom} />}
                    >
                      {"อัปเดตสถานะ"}
                    </LoadingButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={(e) => setAnchorEl(null)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      {statusLists.map((el, index) => (
                        <MenuItem
                          key={index}
                          onClick={() => handleUpdate(el.value)}
                        >
                          {el.title}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                )}
              </div>
              <div className="card-body">
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
                >
                  <Box className="box-top">
                    <div className="box-rows">
                      <div className="column-top">
                        <p>
                          <strong>ชื่อลูกค้า</strong>
                        </p>
                        <label htmlFor="">{orderShow.customer_name}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>เบอร์โทรศัพท์</strong>
                        </p>
                        <label htmlFor="">{orderShow.phone_number}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>เบอร์โทรศัพท์ สำรอง</strong>
                        </p>
                        <label htmlFor="">{orderShow.phone_number}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>ระยะทาง</strong>
                        </p>
                        <label htmlFor="">
                          {parseFloat(orderShow.distance).toFixed(2)} KM.
                        </label>
                      </div>
                    </div>
                    <div className="box-rows">
                      <div className="column-top">
                        <p>
                          <strong>รายละเอียดคำสั่งซื้อ</strong>
                        </p>
                        <label htmlFor="">{orderShow.details}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>
                            ราคารวม (ส่วนลด {orderShow.discount} บาท)
                          </strong>
                        </p>
                        <label htmlFor="">
                          {orderShow.totalPrice +
                            orderShow.delivery_price -
                            orderShow.discount}{" "}
                          บาท
                        </label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>ค่าจัดส่ง</strong>
                        </p>
                        <label htmlFor="">
                          {orderShow.delivery_price || 0} บาท
                        </label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>ที่อยู่จัดส่ง</strong>
                        </p>
                        <p className="location">
                          {orderShow.delivery_drop_address}
                        </p>
                        <p>
                          <strong>รายละเอียดที่อยู่</strong>
                        </p>
                        <p className="location">
                          {orderShow.delivery_drop_address_more}
                        </p>
                        <label
                          className="location"
                          htmlFor=""
                          onClick={(e) =>
                            handlerShowLocation(orderShow.delivery_drop)
                          }
                        >
                          <FontAwesomeIcon icon={faMapLocationDot} />
                          {" แสดงที่อยู่จัดส่ง (click)"}
                        </label>
                      </div>
                    </div>
                    <div
                      className={isWashing ? "box-rows" : "box-rows foods"}
                      style={{ justifyContent: "space-between" }}
                    >
                      {/* {isWashing && (
                        <div className="column-top">
                          <p>
                            <strong>Pickup Image</strong>
                          </p>
                          <figure
                            onClick={(e) =>
                              handlerShowImage(`${uploadPath + orderShow.pickup_image}`, "pickup")
                            }
                          >
                            <img
                              src={
                                orderShow.pickup_image
                                  ? `${uploadPath + orderShow.pickup_image}`
                                  : ""
                              }
                              alt=""
                              onError={(e) => imageError(e, "pickup")}
                            />
                          </figure>
                        </div>
                      )} */}
                      <div className="column-top">
                        <p>
                          <strong>รูปภาพการจัดส่ง</strong>
                        </p>
                        <figure
                          onClick={(e) =>
                            handlerShowImage(
                              `${uploadPath + orderShow.drop_image}`,
                              "drop"
                            )
                          }
                        >
                          <img
                            src={
                              orderShow.drop_image
                                ? `${uploadPath + orderShow.drop_image}`
                                : ""
                            }
                            alt=""
                            onError={(e) => imageError(e, "drop")}
                          />
                        </figure>
                      </div>
                    </div>
                  </Box>
                  <div
                    style={{
                      maxHeight: "430px",
                      marginTop: "1rem",
                    }}
                  >
                    <ListTable
                      orderShow={orderShow}
                      orderList={orderShow.orderItemList}
                      setOrderShow={setOrderShow}
                    />
                  </div>
                </Box>
              </div>
              <div className="card-footer">
                <div className="btn-action">
                  {orderShow.payment_verified && orderShow.status_id === 2 && (
                    <ButtonUI
                      onClick={() => handleApprove(orderShow.orders_number)}
                      icon={<FontAwesomeIcon icon={faCheck} />}
                      className="btn-save"
                      on="save"
                      width="md"
                    >
                      ยืนยันรับออเดอร์
                    </ButtonUI>
                  )}
                  {orderShow.payment_verified && orderShow.status_id === 3 && (
                    <ButtonUI
                      onClick={() => handleSendOrder(orderShow.orders_number)}
                      icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                      className="btn-save"
                      on="save"
                      width="md"
                    >
                      ส่งออเดอร์
                    </ButtonUI>
                  )}
                  <ButtonUI
                    onClick={() => setClose(false)}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                    className="btn-cancel"
                    on="cancel"
                    width="md"
                  >
                    ปิด
                  </ButtonUI>
                </div>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
      <DiscountModal
        discount={discount}
        setDiscount={setDiscount}
        open={discountShow}
        setOpen={setDiscountShow}
        orderShow={orderShow}
        setOrderShow={setOrderShow}
        refreshData={refreshData}
        setRefreshData={setRefreshData}
      />
    </LocalizationProvider>
  );
};

export default OrdersModal;
