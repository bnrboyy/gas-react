import React from "react";
import Chart from "react-apexcharts";

function DonutChart({ data, labelTitles }) {
  const colors = ["#005EA0", "#145C67", "#FF7D00", "#33AAFF", "#78290F"];
  const labels = labelTitles?.filter((item) => item !== "Total");

  return (
    <React.Fragment>
      <Chart
        type="donut"
        width={370}
        height={370}
        series={data}
        options={{
          colors: colors,
          chart: {
            // width: "100%"
          },
          labels: labels,

          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  total: {
                    show: true,
                    showAlways: false,
                  },
                },
              },
              expandOnClick: true,
              size: 299,
            },
          },
          responsive: [
            {
              breakpoint: 1670,
              options: {
                chart: {
                  width: 250,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
          dataLabels: {
            enabled: false,
          },
        }}
      />
    </React.Fragment>
  );
}

export default DonutChart;
