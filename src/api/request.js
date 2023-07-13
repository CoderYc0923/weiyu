const request = (config) => {
    const baseUrl = 'http://172.18.13.165:8888';
    config.url = baseUrl + config?.url || ''
    config.data = config?.data || {}
    return new Promise((resolve, reject) => {
        uni.request(config).then(res  => {
            console.log('22',res);
            if (res.statusCode === 200) {
                let data = res.data
                resolve(data)
            } else {
                reject({message: '请求出错'})
            }
        }).catch(error => {
            reject(error)
        })
    })
}

export default request