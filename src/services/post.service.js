import axios from "axios";

export const getPosts = (language) => {
    return axios.get(`content/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getMenuList =  (language) => {
    return  axios.get(`category/menu?language=${language}`).then( 
      (res) => { return { status: true, menu: res.data.menu , category: res.data.category }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreatePost = (formData) => {
  return axios.post(`content/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdatePost = (id, formData) => {
  return axios.post(`content/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeletePostByToken = (token,language) => {
  return axios.delete(`content/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
