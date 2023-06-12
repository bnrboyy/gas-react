import axios from "axios";

export const getSlides = (language) => {
    return axios.get(`slide/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data, positionList: res.data.positionList }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getSlidesById = (id) => {
    return axios.get(`slide/data/${id}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreateSlide = (formData) => {
  return axios.post(`slide/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateSlide = (id, formData) => {
  return axios.post(`slide/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteSlideByToken = (token,language) => {
  return axios.delete(`slide/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
