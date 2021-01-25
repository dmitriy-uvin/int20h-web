const express = require('express');
const app = express();
const port = process.env.PORT || 3333;
const grabProducts = require('./services/apiService');

app.get('/api/products', async (req, res) => {
    let products;
    if(req.query.searchString) {
        products = await grabProducts(req.query.searchString);
    } else {
        products = await grabProducts();
    }

    res.status(200).json({
        products
    });
});

app.use('/', express.static('./client/dist'));

app.listen(port, () => {
    console.log(`Server started, port: ${port}`);
});
