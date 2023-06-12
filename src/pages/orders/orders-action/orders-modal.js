import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import ButtonUI from "../../../components/ui/button/button";
import { useSelector, useDispatch } from "react-redux";
import "./orders-modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowRightFromBracket,
  faBook,
  faCheck,
  faMapLocationDot,
  faRandom,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import {
  Chip,
  Dialog,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Input,
  Select,
  Button,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import DateMoment from "../../../components/ui/date-moment/date-moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import WashingTable from "./washing-table";
import FoodsTable from "./foods-table";
import { LoadingButton } from "@mui/lab";
import {
  svApproveOrder,
  svSendOrder,
  svUpdateOrderStatus,
  svVerifiedItem,
  svVerifiedPayment,
  svGetOrderPending,
} from "../../../services/orders.service";
import { svProductCapacity } from "../../../services/product.service";
import { appActions } from "../../../store/app-slice";
import {
  PDFViewer,
  PDFDownloadLink,
  Document,
  Page,
  Text,
  BlobProvider,
  pdf,
} from "@react-pdf/renderer";
import PDFFile from "./pdffile";

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
      title: "Inprogress",
    },
    {
      value: 4,
      title: "Complete",
    },
    {
      value: 5,
      title: "Failed",
    },
  ];
  const images = orderShow.upload_images?.split(",");
  const dispatch = useDispatch();
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const modalSwal = withReactContent(Swal);
  const { t } = useTranslation("orders-page");
  const language = useSelector((state) => state.app.language);
  const srcError = "/images/no-image.png";
  const [imgError, setImgError] = useState({ pickup: false, drop: false });
  const isSuperAdmin = useSelector((state) => state.auth.userPermission.superAdmin);
  const [showDialog, setShowDialog] = useState(false);
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
        title: "Confirm to verify payment!",
        background: "#fff",
        showCancelButton: true,
        confirmButtonColor: "rgb(71 192 195)",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: (isConfirmed) => {
          svVerifiedPayment(orderShow.orders_number);
          getDataEdit();
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    } else {
      Swal.fire({
        title: "Confirm to verify payment!",
        html: `
        <figure class="preview-img-verify" >
          <img src='${imgPath}' id="img_preview" />
        </figure>`,
        background: "#fff",
        showCancelButton: true,
        confirmButtonColor: "rgb(71 192 195)",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
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
    window.open(`https://www.google.co.th/maps/place/${locationPath}`, "_blank");
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

  const handleApprove = async (_orders_number, type_order) => {
    if (type_order === "washing") {
      // for washing
      Swal.fire({
        title: "Please upload pickup image!",
        html: `
        <figure class="preview-img-confirm" >
          <img src='${srcError}' id="img_preview" />
          <input type="file" id="pickup_image" />
          <svg
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512"
          >
            <path d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"/>
          </svg>
          <div class="circle"></div>
        </figure>
        <span id="error-message" style="color:red;display:none;">please upload pickup image!!!</span>`,
        background: "#fff",
        showCancelButton: true,
        confirmButtonColor: "rgb(71 192 195)",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        didOpen: () => {
          const file_el = document.querySelector("#pickup_image");
          const img_preview = document.querySelector("#img_preview");
          if (file_el) {
            file_el.addEventListener("change", () => {
              img_preview.setAttribute("src", URL.createObjectURL(file_el.files[0]));
              const figure_el = document.querySelector(".preview-img-confirm");
              figure_el.classList.remove("error");
              const error_el = document.querySelector("#error-message");
              error_el.style.display = "none";
            });
          }
        },
        showLoaderOnConfirm: true,
        preConfirm: (isConfirmed) => {
          const file_el = document.querySelector("#pickup_image");
          if (file_el.files.length === 0) {
            const figure_el = document.querySelector(".preview-img-confirm");
            figure_el.classList.add("error");
            const error_el = document.querySelector("#error-message");
            error_el.style.display = "block";
            return false;
          }
          const _data = {
            orders_number: _orders_number,
            pickup_image: file_el.files[0],
            drop_image: null,
          };
          onApprove(_data);
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
    } else {
      Swal.fire({
        background: "#fff",
        icon: "warning",
        title: "Are you sure?",
        text: "You want to approve this order!",
        confirmButtonText: "Yes, approve it",
        confirmButtonColor: "rgb(71 192 195)",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          const _data = {
            orders_number: _orders_number,
            pickup_image: null,
            drop_image: null,
          };
          onApprove(_data);
        }
      });
    }
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
      title: "Please upload drop image!",
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
        <span id="error-message" style="color:red;display:none;">please upload drop image!!!</span>`,
      background: "#fff",
      showCancelButton: true,
      confirmButtonColor: "rgb(71 192 195)",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      didOpen: () => {
        const file_el = document.querySelector("#drop_image");
        const img_preview = document.querySelector("#img_preview");
        if (file_el) {
          file_el.addEventListener("change", () => {
            img_preview.setAttribute("src", URL.createObjectURL(file_el.files[0]));
            const figure_el = document.querySelector(".preview-img-confirm");
            figure_el.classList.remove("error");
            const error_el = document.querySelector("#error-message");
            error_el.style.display = "none";
          });
        }
      },
      showLoaderOnConfirm: true,
      preConfirm: (isConfirmed) => {
        console.log("ok");
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
                    <FontAwesomeIcon icon={faAdd} /> {t("OrdersDetails")}
                  </h2>
                  <h3>
                    #{orderShow.orders_number}{" "}
                    <Chip
                      label={orderShow.status}
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
                      onClick={(e) => handlerShowPayment(`${uploadPath + orderShow.slip_image}`)}
                    >
                      {"Verify Payment"}
                    </LoadingButton>
                  ) : (
                    <div>
                      <h4 style={{ color: "green" }}>Payment has been verified.</h4>
                    </div>
                  )}
                </div>
                {isSuperAdmin && (
                  <div
                    className="status"
                    style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                  >

                    {orderShow.status_id !== 5 && (
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
                    )}

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
                      {"Update Status"}
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
                        <MenuItem key={index} onClick={() => handleUpdate(el.value)}>
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
                          <strong>Customer Name</strong>
                        </p>
                        <label htmlFor="">{orderShow.member_name}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Branch</strong>
                        </p>
                        <label htmlFor="">{orderShow.branch_name}</label>
                      </div>
                      <div className="column-top">
                        {isWashing && (
                          <React.Fragment>
                            <p>
                              <strong>Pickup Date</strong>
                            </p>
                            <label htmlFor="">
                              <DateMoment format={"LLL"} date={orderShow.date_pickup} />
                            </label>
                          </React.Fragment>
                        )}
                        <p>
                          <strong>Shipping Date</strong>
                        </p>
                        <label htmlFor="">
                          <DateMoment format={"LLL"} date={orderShow.shipping_date} />
                        </label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Phone Number</strong>
                        </p>
                        <label htmlFor="">{orderShow.phone_number}</label>
                      </div>
                    </div>
                    <div className="box-rows">
                      <div className="column-top">
                        <p>
                          <strong>Line ID</strong>
                        </p>
                        <label htmlFor="">{orderShow.line_id}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>WeChat</strong>
                        </p>
                        <label htmlFor="">{orderShow.wechat}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Telegram</strong>
                        </p>
                        <label htmlFor="">{orderShow.telegram}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Distance</strong>
                        </p>
                        <label htmlFor="">{parseFloat(orderShow.distance).toFixed(2)} KM.</label>
                      </div>
                    </div>
                    <div className="box-rows">
                      <div className="column-top">
                        <p>
                          <strong>Type Order</strong>
                        </p>
                        <label htmlFor="">{orderShow.type_order}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Order Details</strong>
                        </p>
                        <label htmlFor="">{orderShow.details}</label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Total Price (including shipping fee)</strong>
                        </p>
                        <label htmlFor="">
                          {orderShow.totalPrice + orderShow.delivery_price}{" "}
                          {orderShow.currency_symbol}
                        </label>
                      </div>
                      <div className="column-top">
                        <p>
                          <strong>Delivery Price</strong>
                        </p>
                        <label htmlFor="">
                          {orderShow.delivery_price || 0} {orderShow.currency_symbol}
                        </label>
                      </div>
                    </div>
                    <div className={isWashing ? "box-rows" : "box-rows foods"}>
                      {isWashing && (
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
                      )}
                      <div className="column-top">
                        <p>
                          <strong>Drop Image</strong>
                        </p>
                        <figure
                          onClick={(e) =>
                            handlerShowImage(`${uploadPath + orderShow.drop_image}`, "drop")
                          }
                        >
                          <img
                            src={orderShow.drop_image ? `${uploadPath + orderShow.drop_image}` : ""}
                            alt=""
                            onError={(e) => imageError(e, "drop")}
                          />
                        </figure>
                      </div>
                      {isWashing && (
                        <div className="column-top">
                          <p>
                            <strong>Delivery Pickup</strong>
                          </p>
                          <p className="location">{orderShow.delivery_pickup_address}</p>
                          <p>
                            <strong>Pickup Details</strong>
                          </p>
                          <p className="location">{orderShow.delivery_pickup_address_more}</p>

                          <label
                            className="location"
                            htmlFor=""
                            onClick={(e) => handlerShowLocation(orderShow.delivery_pickup)}
                          >
                            <FontAwesomeIcon icon={faMapLocationDot} />
                            {" show location (click)"}
                          </label>
                        </div>
                      )}
                      <div className="column-top">
                        <p>
                          <strong>Delivery Drop</strong>
                        </p>
                        <p className="location">{orderShow.delivery_drop_address}</p>
                        <p>
                          <strong>Drop Details</strong>
                        </p>
                        <p className="location">{orderShow.delivery_drop_address_more}</p>
                        <label
                          className="location"
                          htmlFor=""
                          onClick={(e) => handlerShowLocation(orderShow.delivery_drop)}
                        >
                          <FontAwesomeIcon icon={faMapLocationDot} />
                          {" show location (click)"}
                        </label>
                      </div>
                    </div>
                    <div className={isWashing ? "box-rows" : "box-rows foods"}>
                      {true && (
                        <div
                          className="column-image"
                          style={{
                            width: "100%",
                            marginTop: "1rem",
                            color: "rag(131,131,131)",
                          }}
                        >
                          <p
                            style={{
                              marginBottom: "1rem",
                              color: "rgb(68,68,68)",
                            }}
                          >
                            <strong>Image Details</strong>
                          </p>
                          <div className="image-details" style={{ display: "flex", gap: "1rem" }}>
                            {images?.map((item, index) => (
                              <figure
                                onClick={(e) => {
                                  handlerShowImage(`${uploadPath + item}`, "");
                                }}
                                key={index}
                                style={{ width: "112px", height: "112px" }}
                              >
                                <img
                                  src={`${uploadPath + item}`}
                                  alt=""
                                  style={{ width: "112px", height: "112px" }}
                                />
                              </figure>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Box>
                  <div
                    style={{
                      maxHeight: "430px",
                      marginTop: "1rem",
                    }}
                  >
                    {isWashing ? (
                      <WashingTable
                        orderShow={orderShow}
                        orderList={orderShow.orderList}
                        showDialog={showDialog}
                        setShowDialog={setShowDialog}
                        setApproveForm={setApproveForm}
                        setOrderShow={setOrderShow}
                      />
                    ) : (
                      <FoodsTable
                        orderShow={orderShow}
                        orderList={orderShow.orderList}
                        setOrderShow={setOrderShow}
                      />
                    )}
                  </div>
                </Box>
              </div>
              <div className="card-footer">
                <div className="btn-action">
                  {orderShow.payment_verified && orderShow.status_id === 2 && (
                    <ButtonUI
                      onClick={() => handleApprove(orderShow.orders_number, orderShow.type_order)}
                      icon={<FontAwesomeIcon icon={faCheck} />}
                      className="btn-save"
                      on="save"
                      width="md"
                    >
                      Approve
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
                      Send Order
                    </ButtonUI>
                  )}
                  <ButtonUI
                    onClick={() => setClose(false)}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                    className="btn-cancel"
                    on="cancel"
                    width="md"
                  >
                    Close
                  </ButtonUI>
                </div>
              </div>
            </div>
          </section>
        </Box>
      </Modal>
      {
        <ApproveModel
          handleValidateWashing={handleValidateWashing}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          approveForm={approveForm}
          setApproveForm={setApproveForm}
        />
      }
    </LocalizationProvider>
  );
};

const ApproveModel = ({
  handleValidateWashing,
  showDialog,
  setShowDialog,
  approveForm,
  setApproveForm,
}) => {
  const [capacity, setCapacity] = useState([]);
  const [currentCapa, setCurrentCapa] = useState({});
  const [capaId, setCapaId] = useState(0);
  const [diff, setDiff] = useState(0);
  const [currency, setCurrency] = useState("");

  useEffect(() => {
    if (showDialog) {
      setApproveForm((prev) => {
        return {
          ...prev,
          weight: "",
        };
      });
      setDiff(0);
      svProductCapacity(approveForm)
        .then((res) => {
          setCapacity(res.data.capacity);
          setCurrentCapa(res.data.current);
          setCurrency(res.data.currency);
          setCapaId(res.data.current.product_id);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [showDialog]);

  const handleConfirm = () => {
    handleValidateWashing();
  };

  const handleChange = (e) => {
    setApproveForm((prev) => {
      return {
        ...prev,
        product_id: e.target.value,
        weight: "",
        add_price: diff,
      };
    });
    setCapaId(e.target.value);
    const capa = capacity.find((el) => el.id == e.target.value);
    setDiff(capa.price - currentCapa.totalPrice);
  };

  return (
    <Dialog
      open={showDialog}
      onClose={() => setShowDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog"
    >
      {/* <div className="details">
        <FormControl error={!!!approveForm.weight} variant="standard">
          <InputLabel htmlFor={`weight`}>Weight (kg)</InputLabel>
          <Input
            size="small"
            id={`weight`}
            type="number"
            value={approveForm.weight}
            onChange={(e) =>
              setApproveForm((prev) => {
                return { ...prev, weight: e.target.value };
              })
            }
          />
        </FormControl>
      </div> */}

      <div className="details">
        <FormControl variant="standard">
          <InputLabel id="select-capacity">Capacity</InputLabel>
          <Select
            labelId="select-filter-page"
            id="filter-page-control"
            label="Page Control"
            className="input-page"
            size="small"
            onChange={(e) => handleChange(e)}
            value={capaId}
          >
            <MenuItem value="" disabled>
              Select Capacity
            </MenuItem>
            {capacity?.map((menu) => (
              <MenuItem key={menu.id} value={menu.id}>
                {menu.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="details">
        {diff !== 0 && (
          <Chip
            label={diff > 0 ? `+ ${diff} ${currency}` : `${diff} ${currency}`}
            color={diff > 0 ? "success" : "error"}
            variant="outlined"
          />
        )}
      </div>

      <div className="btn">
        <ButtonUI
          onClick={() => handleConfirm()}
          icon={<FontAwesomeIcon icon={faCheck} />}
          className="btn-save"
          on="save"
          width="md"
        >
          Confirm
        </ButtonUI>
      </div>
    </Dialog>
  );
};

export default OrdersModal;
