const urls = require('../constants/urls');
const axios = require('../config/axios-setup');
const productMapper = require('../mapper/productMapper');

async function grabProducts(queryParameter = 'крупа гречана') {
    const queryParam = encodeURI(queryParameter);
    const productsArray = [];
    let filters = {};
    let id = 0;
    for (let index = 0; index < urls.length; index++) {
        const response = await axios.get(urls[index] + queryParam);
        filters = response.data.filters;
        const products = response.data.results;
        products.map(product => {
            const productObject = productMapper(product);
            if (product.unit === 'pcs') {
                productObject.weight = Number(product.weight);
            } else if (product.unit === 'kg') {
                productObject.weight = 1000;
            }
            productObject.pricePerGramm = productObject.price / productObject.weight;
            
            id += 1;
            productObject.id = id;
            productsArray.push(productObject);
        });
    }
    productsArray.sort((a, b) => a.pricePerGramm - b.pricePerGramm);
    return {
        products: productsArray,
        filters: filters
    };
}

module.exports = grabProducts;
