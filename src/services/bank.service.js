import axios from "axios";

export const svCreateBank = (formData) => {
    return axios.post(`bank/create`, formData).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svDeleteBank = (_id) => {
    return axios.delete(`bank/delete/${_id}`).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svUpdateDisplayBank = (checked, _id) => {
    return axios.put(`bank/update/display/${_id}?checked=${checked}`).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svGetBankById = (_id) => {
    return axios.get(`get/bank/${_id}`).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svUpdateBank = (_id, formData) => {
    return axios.post(`bank/update/${_id}`, formData).then( 
      (res) => { return { status: true, data: res.data.data, setting: res.data.setting}} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}