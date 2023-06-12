import React from "react";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

import "./dashboard.scss";

function DatePickerComponent({
  state,
  setStartDate,
  setEndDate,
  label,
  setDateDisable,
  dateDisable,
  minDate,
  setMin,
  maxDate,
  setMax,
}) {
  const [value, setValue] = useState(dayjs());

  const onChangeHanble = (value) => {
    setDateDisable(false);
    setValue(value);
    if (state) {
      setStartDate(value.toISOString().substring(0, 10))
      setMin(dayjs(value).add(1, "day"));
      setMax(dayjs(value).add(31, "day")); /*  */
    } else {
      setEndDate(value.toISOString().substring(0, 10));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={dateDisable}
        label={label}
        views={["year", "month", "day"]}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        inputFormat="YYYY-MM-DD"
        onChange={onChangeHanble}
        renderInput={(props) => (
          <TextField
            size="small"
            {...props}
            sx={{
              width: "160px",
            }}
            inputProps={{ ...props.inputProps, readOnly: true }}
          />
        )}
        size="small"
      />
    </LocalizationProvider>
  );
}

export default DatePickerComponent;
