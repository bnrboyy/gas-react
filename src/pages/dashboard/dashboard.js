import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { faGamepad, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";

import "./dashboard.scss";
import DatePickerComponent from "./DatePicker";
import ButtonUI from "../../components/ui/button/button";
import HeadPageComponent from "../../components/layout/headpage/headpage";
import { appActions } from "../../store/app-slice";
import Chart from "./chart";
import DonutChart from "./DonutChart";
import TableTab from "./TableTab";
import { svGetOrderCompleted } from "../../services/dashboard.service";

const DashboardPage = () => {
  const { t } = useTranslation(["dashboard-page"]);
  const dispatch = useDispatch();
  const [refreshData, setRefreshData] = useState(0);
  const [settings, setSettings] = useState({
    numberPeople: 1,
    timesAvailable: "",
    disabledDay: "",
    disabledDate: "",
    disabledHoliday: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPriceWash, setTotalPriceWash] = useState(0);
  const [totalPriceFood, setTotalPriceFood] = useState(0);
  const [mountChecked, setMountChecked] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [views, setViews] = useState("week");
  const [viewsList, setViewsList] = useState("all");
  const [title, setTitle] = useState("");
  const [orderDonut, setOrderDonut] = useState([]);
  const [donut, setDonut] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderListTable, setOrderListTable] = useState([]);
  const [dateTitle, setDateTitle] = useState("");

  const date = dayjs();
  const formatDate = date.format("YYYY-MM-DD");
  console.log(formatDate)

  function setDate() {
    let date = dayjs().get("date");
    let month = new Date().toLocaleString("default", { month: "long" });
    let year = dayjs().get("year");
    let dd = date + " " + month + " " + year;
    setDateTitle(dd);
  }

  useEffect(() => {
    if (views === "week") {
      setStartDate(dayjs().subtract(6, "day").toISOString().substring(0, 10));
      setEndDate(dayjs().toISOString().substring(0, 10));
      setTitle("7 วันหลังสุด");
    } else if (views === "month") {
      const today = new Date();
      const currentYear = today.getFullYear();
      today.toLocaleString("default", { month: "long" });
      setTitle(
        today.toLocaleString("default", { month: "long" }) + " " + currentYear
      );
    } else if (views === "year") {
      setTitle("2023");
    }
  }, [views]);

  useEffect(() => {
    dispatch(appActions.isSpawnActive(true));
    svGetOrderCompleted().then((res) => {
      let priceDetails = [];
      let listDetails = [];
      let orderTable = [];
      let donutArr = [];
      let ttWash = 0;
      let ttDry = 0;
      let ttFoods = 0;
      let ttIron = 0;
      let ttDelivery = 0;
      let ttAll = 0;
      let orderComplete = 0;
      let orderFails = 0;

      console.log(res.data);
      return;

      if (res.status) {
        res.data?.map((item, ind) => {
          if (item.status_id === 4) {
            if (item.type_order === "washing") {
              ttWash += item.washing_price;
              ttDry += item.drying_price;
            } else if (item.type_order === "foods") {
              ttFoods += item.total_price;
            } else {
              ttIron += item.total_price;
            }
            orderComplete += 1;
            ttDelivery += item.delivery_price;
          } else if (item.status_id === 5) {
            orderFails += 1;
          }
          if (item.status_id === 4 || item.status_id === 5) {
            orderTable.push(item);
          }
          ttAll = ttDelivery + ttWash + ttDry + ttFoods;
        });
        priceDetails.push(ttWash);
        priceDetails.push(ttDry);
        priceDetails.push(ttFoods);
        priceDetails.push(ttIron);
        priceDetails.push(ttDelivery);
        priceDetails.push(ttAll);
        donutArr = priceDetails.filter(
          (item, ind) => ind !== priceDetails.length - 1
        );

        listDetails.push(orderComplete);
        listDetails.push(orderFails);
        listDetails.push(ttWash + ttDry + ttFoods);
        listDetails.push(ttDelivery);
        listDetails.push(ttAll);

        setOrderDonut(priceDetails);
        setOrderList(listDetails);
        setOrderListTable(orderTable);
        setDonut(donutArr);
      }
      dispatch(appActions.isSpawnActive(false));
    });

    setDate();
  }, [refreshData]);

  useEffect(() => {
    svGetOrderCompleted().then((res) => {
      let data = [];
      if (res.status) {
        if (viewsList === "all") {
          data = res.data?.filter(
            (item) => item.status_id === 4 || item.status_id === 5
          );
        } else if (viewsList === "wash&dry") {
          data = res.data?.filter((item) => item.type_order === "washing");
        } else if (viewsList === "food") {
          data = res.data?.filter((item) => item.type_order === "foods");
        } else if (viewsList === "fails") {
          data = res.data?.filter((item) => item.status_id === 5);
        } else {
          data = res.data?.filter((item) => item.status_id === 4);
        }
      }
      setOrderListTable(data);
    });
  }, [viewsList]);

  const handleChange = (e) => {
    if (
      e.target.value !== "week" &&
      e.target.value !== "month" &&
      e.target.value !== "year"
    ) {
      setViewsList(e.target.value);
    } else {
      setViews(e.target.value);
    }
  };

  const thumbnailType = [
    "/images/dashboard/washing.png",
    "/images/dashboard/drying.png",
    "/images/dashboard/food.png",
    "/images/dashboard/iron.png",
    "/images/dashboard/delivery.png",
    "/images/dashboard/total.png",
  ];

  const labelTitles = ["เปลี่ยนถัง/สั่งสินค้า", "ค่าจัดส่ง"];

  const detailsStyle = [
    {
      backgroundColor: "rgb(0, 94, 160)",
      boxShadow: "-1px 20px 20px 0px rgba(0, 94, 160, 0.2)",
    },
    {
      backgroundColor: "rgb(20, 92, 103)",
      boxShadow: "-1px 20px 20px 0px rgba(20, 92, 103, 0.4)",
    },
    {
      backgroundColor: "rgb(255, 125, 0)",
      boxShadow: "-1px 20px 20px 0px rgba(255, 125, 0, 0.4)",
    },
    {
      backgroundColor: "rgb(51, 170, 255)",
      boxShadow: "-1px 20px 20px 0px rgba(51, 170, 255, 0.4)",
    },
    {
      backgroundColor: "rgb(120, 41, 15)",
      boxShadow: "-1px 20px 20px 0px rgba(120, 41, 15, 0.4)",
    },
    {
      backgroundColor: "rgb(137, 0, 58)",
      boxShadow: "-1px 20px 20px 0px rgba(137, 0, 58, 0.4)",
    },
  ];

  const orderListStyle = [
    {
      style: {
        backgroundColor: "#0FB900",
      },
      title: "Complete",
      thumbnail: "images/dashboard/complete.png",
      unit: "List",
    },
    {
      style: {
        backgroundColor: "#E32900",
      },
      title: "Fails",
      thumbnail: "images/dashboard/fails.png",
      unit: "List",
    },
    {
      style: {
        backgroundColor: "#001524",
      },
      title: "Product and Services",
      thumbnail: "images/dashboard/store.png",
      unit: "THB",
    },
    {
      style: {
        backgroundColor: "#78290F",
      },
      title: "Delivery",
      thumbnail: "images/dashboard/delivery.png",
      unit: "THB",
    },
    {
      style: {
        backgroundColor: "#89003A",
      },
      title: "Total",
      thumbnail: "images/dashboard/total.png",
      unit: "THB",
    },
  ];

  return (
    <section id="dashboard-page">
      <HeadPageComponent
        h1={"dashboardPage"}
        icon={<FontAwesomeIcon icon={faGamepad} />}
        breadcrums={[{ title: "dashboardPage", link: false }]}
      />
      <div className="action-header">
        <ButtonUI
          onClick={() => setRefreshData(refreshData + 1)}
          on="create"
          isLoading={false}
          icon={<FontAwesomeIcon icon={faRedo} />}
        >
          {t("Fetch")}
        </ButtonUI>
      </div>
      <div className="main-content">
        <div className="chart-section">
          <div className="donut-chart">
            <div className="head-title">
              <Typography variant="subtitle1" gutterBottom>
                รายได้ / วัน
              </Typography>
              <Typography variant="h6" gutterBottom>
                {dateTitle}
              </Typography>
            </div>
            <div className="chart-content">
              <div className="content-left">
                <DonutChart data={donut} labelTitles={labelTitles} />
              </div>
            </div>
          </div>

          <div className="bar-chart">
            <div className="bar-chart-head">
              <div
                className="head-title"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img src="images/dashboard/barchart.png" alt="" width={30} />
                <Typography variant="subtitle1" gutterBottom sx={{ mb: "0" }}>
                  รายได้ / สัปดาห์ / เดือน / ปี
                </Typography>
              </div>
              <div className="date-picker">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={"week"}
                  >
                    <FormControlLabel
                      value="week"
                      onChange={handleChange}
                      control={<Radio />}
                      label="7 วันหลังสุด"
                    />
                    <FormControlLabel
                      value="month"
                      onChange={handleChange}
                      control={<Radio />}
                      label="รายเดือน"
                    />
                    <FormControlLabel
                      value="year"
                      onChange={handleChange}
                      control={<Radio />}
                      label="รายปี"
                    />
                  </RadioGroup>
                </FormControl>

                {/* <div className="date-picker">
                <DatePickerComponent
                  state={true}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  label={"Start Date"}
                  setDateDisable={setDateDisable}
                  dateDisable={false}
                  minDate={minDate}
                  setMin={setMin}
                  maxDate={maxDate}
                  setMax={setMax}
                />
                --
                <DatePickerComponent
                  state={false}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  label={"End Date"}
                  setDateDisable={setDateDisable}
                  dateDisable={dateDisable}
                  minDate={min}
                  setMin={setMin}
                  maxDate={max}
                  setMax={setMax}
                />
              </div> */}
              </div>
            </div>

            <div className="card-chart-control">
              <div className="head-title">
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{ color: "rgb(0, 94, 160)" }}
                >
                  เปลี่ยนถัง/สั่งสินค้า
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  รวม: {totalPriceWash} บาท
                </Typography>
              </div>
              <div className="card-body">
                <Chart
                  colorRGB={"0, 94, 160, 1"}
                  barTitle={"Wash&Dry"}
                  setMountChecked={setMountChecked}
                  setRefreshData={setRefreshData}
                  refreshData={refreshData}
                  views={views}
                  startDate={startDate}
                  endDate={endDate}
                  setTotalPriceFood={setTotalPriceFood}
                  setTotalPriceWash={setTotalPriceWash}
                  setTotalPrice={setTotalPrice}
                />
              </div>
            </div>
            <div className="card-chart-control">
              <div className="head-title">
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  style={{ color: "rgb(255, 125, 0)" }}
                >
                  ค่าจัดส่ง
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  รวม: {totalPriceFood} บาท
                </Typography>
              </div>
              <div className="card-body">
                <Chart
                  colorRGB={"255, 125, 0, 1"}
                  barTitle={"Vending&Cafe"}
                  setMountChecked={setMountChecked}
                  refreshData={refreshData}
                  setRefreshData={setRefreshData}
                  views={views}
                  dateStart={startDate}
                  dateEnd={endDate}
                  setTotalPriceFood={setTotalPriceFood}
                  setTotalPriceWash={setTotalPriceWash}
                  setTotalPrice={setTotalPrice}
                />
              </div>
            </div>
            {/* <div className="card-chart-control">
              <div className="head-title">
                <Typography variant="subtitle1" gutterBottom style={{color: "rgb(120, 41, 15)"}}>ค่าจัดส่ง</Typography>
                <Typography variant="subtitle1" gutterBottom>{title}</Typography>
                <Typography variant="subtitle1" gutterBottom>รวม: {totalPrice} บาท</Typography>
              </div>
              <div className="card-body">
                <Chart
                  colorRGB={"120, 41, 15, 1"}
                  barTitle={"Delivery"}
                  setMountChecked={setMountChecked}
                  setRefreshData={setRefreshData}
                  refreshData={refreshData}
                  views={views}
                  startDate={startDate}
                  endDate={endDate}
                  setTotalPriceFood={setTotalPriceFood}
                  setTotalPriceWash={setTotalPriceWash}
                  setTotalPrice={setTotalPrice}
                />
              </div>
            </div> */}
          </div>
        </div>
        <div className="table-section">
          <div className="header">
            <div
              className="head-title"
              style={{ display: "flex", gap: ".5rem" }}
            >
              <img src="images/dashboard/orderlist.png" alt="" width={30} />
              <Typography variant="subtitle1" gutterBottom sx={{ mb: "0" }}>
                รายงาน / รายวัน
              </Typography>
            </div>
            <div className="head-checkbox">
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue={"all"}
                >
                  <FormControlLabel
                    value="all"
                    onChange={handleChange}
                    control={<Radio />}
                    label="ทั้งหมด"
                  />
                  <FormControlLabel
                    value="comlete"
                    onChange={handleChange}
                    control={<Radio />}
                    label="่จัดส่งสำเร็จ"
                  />
                  <FormControlLabel
                    value="fails"
                    onChange={handleChange}
                    control={<Radio />}
                    label="จัดส่งไม่สำเร็จ"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          {/* <div className="price-details">
            {orderListStyle.map((item, ind) => (
              <div key={ind} className="details-list" style={item.style}>
                <div className="content-left">
                  <p>{item.title}</p>
                  <Typography variant="subtitle2" gutterBottom>
                    {orderList[ind]} {item.unit}
                  </Typography>
                </div>
                <div className="content-right">
                  <img src={item.thumbnail} alt="" width={40} />
                </div>
              </div>
            ))}
          </div> */}
          <div className="table-tab">
            <TableTab orderList={orderListTable} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
