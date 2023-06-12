import axios from "axios";

export const getBookingList = (language) => {
    return axios.get(`booking/data`).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const bookingCreateSetting = (param) => {
  return axios.post(`bookingsetting/create`, param).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const bookingConfirm = (id) => {
  return axios.patch(`booking/approve`,{id}).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const bookingDelete = (id) => {
  return axios.delete(`booking/delete/${id}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 