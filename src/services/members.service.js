import axios from 'axios';

export const svGetMembers = (search) => {
    return axios.get(`member?search=${search}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svGetMembersById = (id) => {
    return axios.get(`member/${id}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svDeleteMember = (id) => {
    return axios.delete(`member/${id}`).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}

export const svChangeStatusMember = (id, form) => {
    return axios.patch(`member/changestatus/${id}`, form).then(
    (res) => { return { status: true, data: res.data.data }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong":error.response.data.description }}
    )
}
