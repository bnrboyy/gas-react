import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";

import {
  svGetOrderBar,
  svGetOrderCompleted,
} from "../../services/dashboard.service";

const Chart = ({
  colorRGB,
  barTitle,
  refreshData,
  views,
  setTotalGross,
  setTotalDelivery,
  orders,
}) => {
  const [orderBar, setOrderBar] = useState([]);
  const [orderLabel, setOrderLabel] = useState([]);
  const [orderComplete, setOrderComplete] = useState(orders);

  function setWeekLabels() {
    let labelArr = [];
    for (let i = 6; i >= 0; i--) {
      labelArr.push(dayjs().subtract(i, "day").toISOString().substring(0, 10));
    }
    setOrderLabel(labelArr);
    return labelArr;
  }

  function setMountLabels() {
    const labelArr = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
    ];
    setOrderLabel(labelArr);
    return labelArr;
    // "January",
    // "February",
    // "March",
    // "April",
    // "May",
    // "June",
    // "July",
    // "August",
    // "September",
    // "October",
    // "November",
    // "December",
  }

  function setYearLabels() {
    const labelArr = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    setOrderLabel(labelArr);
    return labelArr;
  }

  useEffect(() => {
    let tt = 0;
    let data = [];
    if (views === "week") {
      const labelArr = setWeekLabels();
      if (barTitle === "totalGross") {
        orderComplete.map((order) => {
          if (labelArr.includes(order.shipping_date)) {
            data.push(order);
            tt += order.total_price;
          }
        });
        setOrderBar(data);
        setTotalGross(tt);
      } else if (barTitle === "Delivery") {
        orderComplete.map((order) => {
          if (labelArr.includes(order.shipping_date)) {
            data.push(order);
            tt += order.delivery_price;
          }
        });
        setOrderBar(data);
        setTotalDelivery(tt);
      }
    } else if (views === "month") {
      const labelArr = setMountLabels();
      if (barTitle === "totalGross") {
        orderComplete.map((order) => {
          if (dayjs(order.shipping_date).month() + 1 === dayjs().month() + 1) {
            data.push(order);
            tt += order.total_price;
          }
        });
        let dd = data?.map((item) => {
          return {
            ...item,
            shipping_date: `0${dayjs(item.shipping_date).date()}`,
          };
        });
        setOrderBar(dd);
        setTotalGross(tt)
      } else if (barTitle === "Delivery") {
        orderComplete.map((order) => {
          if (dayjs(order.shipping_date).month() + 1 === dayjs().month() + 1) {
            data.push(order);
            tt += order.delivery_price;
          }
        });
        let dd = data?.map((item) => {
          return {
            ...item,
            shipping_date: `0${dayjs(item.shipping_date).date()}`,
          };
        });
        setOrderBar(dd);
        setTotalDelivery(tt)
      }
    } else if (views === "year") {
      const labelArr = setYearLabels();
      if (barTitle === "totalGross") {
        orderComplete.map((order) => {
          if (dayjs(order.shipping_date).year() === dayjs().year()) {
            data.push(order);
            tt += order.total_price;
          }
        });
        let dd = data?.map((item) => {
          return {
            ...item,
            shipping_date: `0${dayjs(item.shipping_date).month() + 1}`,
          };
        });
        setOrderBar(dd);
        setTotalGross(tt);
      } else if (barTitle === "Delivery") {
        orderComplete.map((order) => {
          if (dayjs(order.shipping_date).year() === dayjs().year()) {
            data.push(order);
            tt += order.delivery_price;
          }
        });
        let dd = data?.map((item) => {
          return {
            ...item,
            shipping_date: `0${dayjs(item.shipping_date).month() + 1}`,
          };
        });
        setOrderBar(dd);
        setTotalDelivery(tt);
      }
    }
  }, [views, refreshData]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: `${barTitle}`,
      },
    },
    scales: {
      y: {
        grid: {
          drawBorder: false, // <-- this removes y-axis line
          lineWidth: function (context) {
            return context?.index === 0 ? 0 : 1; // <-- this removes the base line
          },
        },
      },
      x: {
        grid: {
          drawBorder: false,
          lineWidth: 0, // <-- this removes vertical lines between bars
        },
      },
    },
  };

  const labels = orderLabel

  const data = {
    labels,
    datasets: [
      {
        label: "Total ",
        // data: labels.map(() => Math.random(1, 1000) * 100),
        data: labels?.map((item, ind) => {
          let tt = 0;
          for (let i of orderBar) {
            if (i.shipping_date === item) {
              if (barTitle === "Delivery") {
                tt += i.delivery_price;
              } else {
                tt += i.total_price;
              }
            }
          }
          return tt;
        }),
        backgroundColor: `rgba(${colorRGB})`,
        borderWidth: 1,
        borderRadius: 5,
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => Math.floor(Math.random() * 100)),
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
    ],
  };

  return <Bar key={barTitle} options={options} data={data} />;
};

export default Chart;
