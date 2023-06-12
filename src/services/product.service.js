import axios from 'axios';

export const getProduct = ({pageId, language}) => {
    return axios.get(`productAll?pageId=${pageId}&language=${language}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svGetProductById = ({id, language}) => {
    return axios.get(`productOne?id=${id}&language=${language}`).then(
        (res) => { return { status: true, data: res.data.data }},
        (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.":error.response.data.description}}
    )
}

export const svUpdateProduct = (id, formData) => {
    return axios.post(`product/update/${id}`, formData).then(
        (res) => { return { status: true, data: res.data.data }},
        (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.":error.response.data.description}}
    )
}

export const svDeleteProduct = ({id, language}) => {
    return axios.delete(`product/delete?id=${id}&language=${language}`).then(
        (res) => { return { status: true, data: res.data.data }},
        (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.":error.response.data.description}}
    )
}

export const svCreateProduct = (formData) => {
    return axios.post(`product/create`, formData).then(
        (res) => { return { status: true, data: res.data.data }},
        (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.":error.response.data.description}}
    )
}

export const svProductCapacity = ({orders_number, product_id, page_id, cart_number}) => {
    return axios.get(`products/capacity?orders_number=${orders_number}&product_id=${product_id}&page_id=${page_id}&cart_number=${cart_number}`).then(
        (res) => { return { status: true, data: res.data.data }},
        (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.":error.response.data.description}}
    )
}