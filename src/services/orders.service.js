import axios from 'axios';

export const svGetOrders = (search) => {
    return axios.get(`order/data?search=${search}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svGetOrderByOrderNumber = ({orders_number, type}) => {
    return axios.get(`order/data/ordernum?orders_number=${orders_number}&type=${type}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svUpdateOrderStatus = (data) => {
    return axios.patch(`order/status`, data).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svDeleteOrder = (orders_number) => {
    return axios.delete(`order/${orders_number}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svApproveOrder = (data) => {
    return axios.post(`order/approve`, data).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svSendOrder = (data) => {
    return axios.post(`order/send`, data).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svVerifiedPayment = (orders_number) => {
    return axios.patch(`order/payment/verified/${orders_number}`, ).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svVerifiedItem = (formBody) => {
    return axios.put(`order/item/verified`, formBody).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svUpdateProductList = (quantity, id, orders_number) => {
    return axios.post(`order/product/update/${id}`, {quantity: quantity, orders_number: orders_number}).then(
    (res) => { return { status: true, data: res.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svDeleteProductItem = (id, orders_number) => {
    return axios.delete(`order/product/delete/item/${id}/${orders_number}`).then(
    (res) => { return { status: true, data: res.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}


export const svGetOrderPending = () => {
    return axios.get(`order/data/pending`)
}
