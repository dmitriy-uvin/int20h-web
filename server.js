const express = require('express');
const app = express();
const port = process.env.PORT || 3333;
const grabJson = require('./services/apiService');

app.get('/api/products', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try{
        const result = await grabJson(req.query.searchString?req.query.searchString:undefined);
        res.status(200).json(result);
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
});

app.use('/', express.static('./client/dist'));

app.listen(port, () => {
    console.log(`Server started, port: ${port}`);
});
