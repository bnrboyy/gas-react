import React from "react";
import Chart from "react-apexcharts";

function DonutChart({ data, labelTitles }) {
  const colors = ["#005EA0", "#FF7D00"];
  const labels = labelTitles?.filter((item) => item !== "Total");
  console.log(data)

  return (
    <React.Fragment>
      <Chart
        type="donut"
        width={550}
        height={550}
        series={[100,40]}
        // series={data}
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
              size: 250,
            },
          },
          responsive: [
            {
              breakpoint: 1670,
              options: {
                chart: {
                  width: 350,
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
