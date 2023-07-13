import request from "./request";
export const submitEmail = (data) => {
    return request({
        method: 'post',
        url: '/email/save',
        data: data
    })
}

export const linkTest = (data) => {
    return request({
        method: 'get',
        url: '/email/test',
        data: data
    })
}