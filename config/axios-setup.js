const axios = require('axios');

axios.interceptors.request.use(
    config => {
        config.headers['Accept-Language']= 'uk';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

module.exports = axios;