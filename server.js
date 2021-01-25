const express = require('express');
const app = express();
const port = process.env.PORT || 3333;
const grabJson = require('./services/apiService');

app.get('/api/products', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    let products;
    if(req.query.searchString != "")  products = await grabJson(req.query.searchString);
    else products = await grabJson();
    res.status(200).json({
        products
    });
});

app.use('/', express.static('./client/dist'));

app.listen(port, () => {
    console.log(`Server started, port: ${port}`);
});
