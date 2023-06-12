import {
  faCircleCheck,
  faCircleXmark,
  faFolderOpen,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Tab,
  TablePagination,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import ReportsCard from "./reports-card";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import SwalUI from "../../components/ui/swal-ui/swal-ui";
import { svDeleteOrder, svGetOrderByOrderNumber } from "../../services/orders.service";
import { t } from "i18next";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ReportsTab = ({
  tabSelect,
  setTabSelect,
  reportsData,
  refreshData,
  setRefreshData,
  filteredItems,
}) => {
  const [filteredData, setFilteredData] = useState(reportsData);
  const [totalData, setTotalData] = useState(0);
  // Date Picker
  const [mode, setMode] = useState("date");
  const [dateValue, setDateValue] = useState(null);
  const [monthValue, setMonthValue] = useState(null);
  const [yearValue, setYearValue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleModeChange = (event) => {
    setMode(event.target.value);
    setDateValue(null);
    setMonthValue(null);
    setYearValue(null);
    setStartDate(null);
    setEndDate(null);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const tabLists = [
    {
      value: "0",
      title: "Condition Reports",
      icon: <FontAwesomeIcon icon={faFolderOpen} />,
    },
  ];

  const handleChange = (event, newValue) => {
    setTabSelect(newValue);
  };

  useEffect(() => {
    const result = reportsData?.filter((d) => d.status_id === 4);
    if (result) {
      setTotalData(result.length);
      setFilteredData(result);
    }
  }, [tabSelect, reportsData]);

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
                  style={{ textTransform: "initial" }}
                />
              ))}
            </TabList>
          </Box>
          <Box
            style={{
              marginTop: "24px",
              marginLeft: "24px",
              marginRight: "24px",
              marginBottom: "0",
              width: "96.5%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <LocalizationProvider dateAdapter={(AdapterDayjs, AdapterDateFns)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <RadioGroup name="mode" value={mode} onChange={handleModeChange} row>
                    <FormControlLabel value="date" control={<Radio />} label="Date" />
                  </RadioGroup>
                  <DatePicker
                    label="Select Date"
                    value={dateValue}
                    onChange={(newDateValue) => setDateValue(newDateValue)}
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: "100%" }} size="small" />
                    )}
                    disabled={mode !== "date"}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <RadioGroup name="mode" value={mode} onChange={handleModeChange} row>
                    <FormControlLabel value="month" control={<Radio />} label="Month" />
                  </RadioGroup>
                  <DatePicker
                    label="Select Month"
                    value={monthValue}
                    onChange={(newMonthValue) => setMonthValue(newMonthValue)}
                    views={["year", "month"]}
                    openTo="month"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: "100%" }} size="small" />
                    )}
                    disabled={mode !== "month"}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <RadioGroup name="mode" value={mode} onChange={handleModeChange} row>
                    <FormControlLabel value="year" control={<Radio />} label="Year" />
                  </RadioGroup>
                  <DatePicker
                    label="Select Year"
                    value={yearValue}
                    onChange={(newYearValue) => setYearValue(newYearValue)}
                    views={["year"]}
                    openTo="year"
                    renderInput={(props) => (
                      <TextField {...props} style={{ width: "100%" }} size="small" />
                    )}
                    disabled={mode !== "year"}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  gap: ".3rem",
                }}
              >
                <RadioGroup name="mode" value={mode} onChange={handleModeChange} row>
                  <FormControlLabel value="range" control={<Radio />} label="Range" />
                </RadioGroup>
                <DatePicker
                  label="Select Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  renderInput={(props) => (
                    <TextField {...props} style={{ width: "100%" }} size="small" />
                  )}
                  disabled={mode !== "range"}
                />
                <b style={{ fontWeight: "500", marginInline: ".7rem" }}>to</b>
                <DatePicker
                  label="Select End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  renderInput={(props) => (
                    <TextField {...props} style={{ width: "100%" }} size="small" />
                  )}
                  disabled={mode !== "range"}
                />
              </div>
            </LocalizationProvider>
          </Box>

          {tabLists.map((tab) => (
            <TabPanel className={`orders-tab-body asRow`} value={tab.value} key={tab.value}>
              <div className="item-list">
                <ReportsCard
                  items={filteredData}
                  setTotalData={setTotalData}
                  setFilteredData={setFilteredData}
        
                  dateValue={dateValue}
                  monthValue={monthValue}
                  yearValue={yearValue}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              {/* <TablePagination
                rowsPerPageOptions={[10,100,1000,10000,99999]}
                component="div"
                count={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Fragment>
  );
};

export default ReportsTab;
