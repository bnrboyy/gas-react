import {
  faCircleCheck,
  faCircleXmark,
  faFolderOpen,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, TablePagination } from "@mui/material";
import { t } from "i18next";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  svCancelOrder,
  svDeleteOrder,
  svGetOrderByOrderNumber,
} from "../../services/orders.service";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import OrdersModal from "./orders-action/orders-modal";
import OrdersCard from "./orders-card";
import OrdersCardMobile from "./orders-card-mobile";
import PDFFile from "./orders-action/pdffile";

const OrdersTab = ({
  ordersModal,
  setOrdersModal,
  tabSelect,
  ordersData,
  setRefreshData,
  refreshData,
  setTabSelect,
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limited, setLimited] = useState({ begin: 0, end: rowsPerPage });
  const [page, setPage] = useState(0);
  const modalSwal = withReactContent(Swal);

  const [filteredData, setFilteredData] = useState(ordersData);
  const [totalData, setTotalData] = useState(0);
  const [orderShow, setOrderShow] = useState({});
  const [isWashing, setIsWashing] = useState(false);

  const tabLists = [
    {
      value: "0",
      title: "ทั้งหมด",
      icon: <FontAwesomeIcon icon={faFolderOpen} />,
    },
    {
      value: "2",
      title: "รอดำเนินการ",
      icon: <FontAwesomeIcon icon={faStopwatch} />,
    },
    {
      value: "3",
      title: "กำลังดำเนินการ",
      icon: <FontAwesomeIcon icon={faStopwatch} />,
    },
    {
      value: "4",
      title: "จัดส่งสำเร็จ",
      icon: <FontAwesomeIcon icon={faCircleCheck} />,
    },
    {
      value: "5",
      title: "จัดส่งไม่สำเร็จ",
      icon: <FontAwesomeIcon icon={faCircleXmark} />,
    },
  ];

  const handleChange = (event, newValue) => {
    setTabSelect(newValue);
    setLimited({ begin: 0, end: rowsPerPage });
    setPage(0);
  };

  const editHandler = (_ord_number, type) => {
    if (type === "washing") {
      setIsWashing(true);
    } else {
      setIsWashing(false);
    }
    svGetOrderByOrderNumber({ orders_number: _ord_number }).then(
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
        setOrdersModal(true);
      }
    );
  };

  const cancelHandler = (_orders_number) => {
    Swal.fire({
      background: "#fff",
      icon: "warning",
      title: "คุณต้องการยกเลิกคำสั่งซื้อนี้หรือไม่?",
      // text: "I want to delete this data!",
      confirmButtonText: "ยืนยัน",
      confirmButtonColor: "#e11d48",
      showCancelButton: true,
      cancelButtonText: "กลับ",
    }).then((result) => {
      if (result.isConfirmed) {
        svCancelOrder(_orders_number).then((res) => {
          SwalUI({ status: res.status, description: res.description });
          if (res.status) {
            setRefreshData((prev) => prev + 1);
          }
        });
      }
    });
  };

  /* Pagination */
  const handleChangePage = (event, newPage) => {
    setLimited({
      begin: newPage * rowsPerPage,
      end: (newPage + 1) * rowsPerPage,
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10);
    setRowsPerPage(rowPage);
    setLimited({ begin: 0, end: rowPage });
    setPage(0);
  };

  useEffect(() => {
    const result = ordersData?.filter((d) => {
      if (tabSelect != 0) {
        if (tabSelect == d.status_id) {
          return d;
        }
      } else {
        return d;
      }
    });
    if (result) {
      setTotalData(result.length);
      setFilteredData(result.slice(limited.begin, limited.end));
    }
  }, [tabSelect, ordersData, page, rowsPerPage]);

  return (
    <Fragment>
      <Box className="orders-tab-section" sx={{ width: "100%" }}>
        <TabContext value={tabSelect}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              className={`tab-header`}
              onChange={handleChange}
              aria-label="lab API tabs example"
            >
              {tabLists.map((tab) => (
                <Tab
                  className="orders-tab-head-field"
                  value={tab.value}
                  key={tab.value}
                  icon={tab.icon}
                  iconPosition="start"
                  label={t(tab.title)}
                />
              ))}
            </TabList>
          </Box>
          {tabLists.map((tab) => (
            <TabPanel
              className={`orders-tab-body asRow`}
              value={tab.value}
              key={tab.value}
            >
              <div className="item-list">
                <OrdersCard
                  items={filteredData}
                  setOrdersModal={setOrdersModal}
                  editHandler={editHandler}
                  cancelHandler={cancelHandler}
                />
                <OrdersCardMobile
                  items={filteredData}
                  setOrdersModal={setOrdersModal}
                  editHandler={editHandler}
                  cancelHandler={cancelHandler}
                />
              </div>
              <TablePagination
                component="div"
                count={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Box>
      {
        <OrdersModal
          orderShow={orderShow}
          setRefreshData={setRefreshData}
          refreshData={refreshData}
          isOpen={ordersModal}
          setClose={setOrdersModal}
          isWashing={isWashing}
          editHandler={editHandler}
          setOrderShow={setOrderShow}
        />
      }
    </Fragment>
  );
};

export default OrdersTab;
