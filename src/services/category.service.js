import axios from "axios";

export const getCategory = (language) => {
    return axios.get(`category/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data, menu: res.data.menu }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getCategoryProduct = (language) => {
  return axios.get(`category/type/product?language=${language}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Sonething went wrong.": error.response.data.description }}
  )
}

export const svCreateCategory = (formData) => {
  return axios.post(`category/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateCategory = (id, formData) => {
  return axios.post(`category/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteCategoryByToken = (token,language) => {
  return axios.delete(`category/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { 
      return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
