const express = require('express');
const app = express();
const port = process.env.PORT || 3333;
const grabJson = require('./services/apiService');

app.get('/api/products', async (req, res) => {
    const products = await grabJson();
    res.status(200).json({
        products
    });
});

app.use('/', express.static('./client/dist'));

app.listen(port, () => {
    console.log(`Server started, port: ${port}`);
});