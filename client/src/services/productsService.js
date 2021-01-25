const API_PRODUCTS_ENDPOINT = 'http://localhost:3333/api/products';

export default {
    async fetchProducts(searchString) {
        const responsePromise = await fetch(API_PRODUCTS_ENDPOINT + `?searchString=${searchString}`);
        return await responsePromise.json();
    }
}