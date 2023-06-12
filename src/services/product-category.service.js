import axios from 'axios';

export const getProductCategory = (language) => {
    return axios.get(`productcateAll?language=${language}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const getProductCategoryById = ({id, language}) => {
    return axios.get(`productcateOne?id=${id}&language=${language}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svCreateProductCate = (formData) => {
    return axios.post(`productcate/create`, formData).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svUpdateProductCate = (id, formData) => {
    return axios.post(`productcate/update/${id}`, formData).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svDeleteProductCate = ({id, language}) => {
    return axios.delete(`productcate/delete?id=${id}&language=${language}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}