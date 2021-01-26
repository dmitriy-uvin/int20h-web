const API_PRODUCTS_ENDPOINT = '/api/products';

export default {
    async fetchProducts(searchString) {
        const responsePromise = await fetch(API_PRODUCTS_ENDPOINT + `?searchString=${searchString}`);
        const response = await responsePromise.json();
        return response;
    }
}