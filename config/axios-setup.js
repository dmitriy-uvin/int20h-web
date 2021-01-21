const axios = require('axios');

axios.interceptors.request.use(
    function (config) {
        config.headers['Accept-Language']='uk';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

module.exports = axios;