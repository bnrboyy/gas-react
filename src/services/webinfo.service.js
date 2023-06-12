import axios from "axios";

export const getWebinfo = (language) => {
  return axios.get(`webinfo/data?language=${language}`).then( 
    (res) => { return { status: true, data: res.data.data }} , 
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const webinfoDetailUpdate = (formData) => {
    return axios.post(`webinfo/details`, formData).then( 
      (res) =>  { return { status: true, description: res.data.description }},
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const webinfoCreate = (data) => {
  return axios.post(`webinfo/create`, data).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}
export const webinfoAdd = (token, data) => {
  return axios.post(`webinfo/token/${token}`, data).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}
export const webinfoUpdate = (token, data) => {
  return axios.patch(`webinfo/token/${token}`, data).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
} 

export const webinfoDisplayToggle = (data) => {
  return axios.patch(`webinfo/display/toggle`, data).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const webinfoDelete = (language,token) => {
  return axios.delete(`webinfo/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
