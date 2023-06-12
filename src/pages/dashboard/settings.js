import { FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import FieldsetUI from "../../components/ui/fieldset/fieldset";
import "./setting.scss";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ButtonUI from "../../components/ui/button/button";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { bookingCreateSetting } from "../../services/booking.service";
import SwalUI from "../../components/ui/swal-ui/swal-ui";

const BookingSettings = (props) => {
    const { settings } = props;
    const [numberPeople, setNumberPeople] = useState(1);
    const [timeAvailable, setTimeAvailable] = useState("");
    const [dayDisabled, setDayDisabled] = useState("");
    const [dateDisabled, setDateDisabled] = useState("");
    const [holidayDate, setHolidayDate] = useState(null)
    const [holidayDisabled, setHolidayDisabled] = useState([]);
    const [buttonIsLoading, setButtonIsLoading ] = useState(false)
    const [isValid, setIsValid ] = useState({
      times: true,
      day: true,
      date: true,
    })

   
  useEffect( ()=> {
    if(settings) {
        if(settings.disabledHoliday && settings.disabledHoliday !== "") {
          const result = settings.disabledHoliday.split(",").map(d => {
            return {
                value: moment(d).format("M-D"), 
                text: moment(d).format("D MMMM") 
            }
          })
          setHolidayDisabled(result)
        }
        
   
        setNumberPeople(settings.numberPeople)
        setTimeAvailable(settings.timesAvailable)
        setDayDisabled(settings.disabledDay)
        setDateDisabled(settings.disabledDate)
    }
  },[settings])

  const removeDateHanlder = (i) => {
    const result = holidayDisabled.filter((d, index) => (i !== index))
    setHolidayDisabled(result);
  }

  const createSettings = (e) => {
    setButtonIsLoading(true)
    const holidayText =  holidayDisabled.reduce((o,n) => o +  n.value + ",", ",")
    const _data = {
      people_number: numberPeople,
      available_time:  `,${timeAvailable},`, 
      disable_by_day: `,${dayDisabled},`,
      disable_by_date: `,${dateDisabled},`,  
      special_holiday: holidayText,
   }

    setIsValid({
      times: (timeAvailable.length > 0)?true:false,
      day: (dayDisabled.length > 0)?true:false,
      date: (dateDisabled.length > 0)?true:false,
    })

    if(timeAvailable.length === 0 || dayDisabled.length === 0 || dateDisabled.length === 0 ){
      return false
    }
    
    if( settings.numberPeople === _data.people_number 
        && settings.timesAvailable === timeAvailable 
        && settings.disabledDay === dayDisabled 
        && settings.disabledDate === dateDisabled 
        && `,${settings.disabledHoliday},` === holidayText 
    ){
      SwalUI({status: 200, description: "Nothing Updated"})
      setButtonIsLoading(false)
      return
    }
  
    bookingCreateSetting(_data).then(res => {
      if(res.status) {
          props.setRefreshData(prev => prev + 1)
      }
      setButtonIsLoading(false)
      SwalUI({status: res.status, description: res.description})
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <section id="settings-booking">
        <FieldsetUI
          className="bookings-settings-fieldset"
          label={"Reserve Controls"} >
          <div className="setting-left">
            <div className="setting-person">
              <FormControl
                className="setting-form-control"
                sx={{ width: "150px" }} >
                <TextField
                  onChange={(e) =>
                    setNumberPeople(e.target.value > 1 ? e.target.value : 1)
                  }
                  value={numberPeople}
                  size="small"
                  id="number-people"
                  label="Number of people"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
            <div className="setting-time-available">
              <FormControl
                className="setting-form-control"
                sx={{ width: "350px" }} >
                <TextField
                  onChange={(e) => setTimeAvailable(e.target.value)}
                  value={timeAvailable}
                  error={!isValid.times}
                  size="small"
                  placeholder="10:10,12:30,13:30"
                  id="number-people"
                  label="Times available"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
            <div className="setting-day-disabled">
              <FormControl
                className="setting-form-control"
                sx={{ width: "200px" }} >
                <TextField
                  onChange={(e) => setDayDisabled(e.target.value)}
                  value={dayDisabled}
                  error={!isValid.day}
                  size="small"
                  placeholder="Su,Mo,Tu,We,Th,Fr,Sa"
                  id="number-people"
                  label="Disable By Day"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
            <div className="setting-date-disabled">
              <FormControl
                className="setting-form-control"
                sx={{ width: "300px" }} >
                <TextField
                  onChange={(e) => setDateDisabled(e.target.value)}
                  value={dateDisabled}
                  error={!isValid.date}
                  size="small"
                  placeholder="1,2,3,4 ..."
                  id="number-people"
                  label="Disable By Date "
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className="setting-holiday-disabled">
            <label className="holiday-label">Holiday</label>
            <div className="date-selected">
              {holidayDisabled.map((d, index) => (
                <p className="date" key={index}>
                  <span>{d.text}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeDateHanlder(index)}  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </p>
              ))}
              <FormControl
                className="setting-form-control"
                sx={{ width: "170px" }} >
                <DatePicker
                  size="small"
                  disableFuture
                  className="setting-input-date"
                  label="Add Holiday"
                  openTo="month"
                  views={["month", "day"]}
                  value={holidayDate}
                  onChange={(newValue) => {
                    if(holidayDate !== null &&  moment(newValue).format("D MMMM") !== "Invalid date") {
                        let Dvalue = moment(newValue).format("M-D")
                        const found = holidayDisabled.filter(t => Dvalue === t.value)
                        if(found.length === 0) {
                            setHolidayDisabled([
                                ...holidayDisabled,
                                {
                                  value: Dvalue,
                                  text: moment(newValue).format("D MMMM"),
                                }
                            ]);
                        }
                        setHolidayDate(null)
                    } else {
                        setHolidayDate(newValue)
                    }
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
            </div>
          </div>
          <FormControl className="setting-form-control" sx={{ width: "120px" }}>
            <ButtonUI 
                onClick={createSettings} 
                on="save" 
                loader={true}
                isLoading={buttonIsLoading}
            >Save</ButtonUI>
          </FormControl>
        </FieldsetUI>
      </section>
    </LocalizationProvider>
  );
};

export default BookingSettings;
