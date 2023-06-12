import axios from 'axios';

export const svGetOrderBar = (startDate, endDate, type) => {
    return axios.get(`dashboard/order?startdate=${startDate}&enddate=${endDate}&type=${type}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svGetOrderDonut = () => {
    return axios.get(`dashboard/order/chart/donut`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svGetOrderList = () => {
    return axios.get(`dashboard/order/list`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}
