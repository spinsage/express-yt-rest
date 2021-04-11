const express = require('express');
const fs = require('fs');
const port = 8081;

const productsJson = fs.readFileSync(__dirname + '/data/products.json');
const products = JSON.parse(productsJson);

app = express();
app.use(express.json());

app.get('/products', (req, res) => {
    res.json(products.productList);
});

app.get('/products/:productId', (req, res) => {
    const filteredProducts = products.productList.filter((product) => {
        if (product.id == req.params.productId) {
            return product;
        }
    }); 

    if (filteredProducts.length > 0) {
        res.json(filteredProducts[0]);
    } else {
        res.status(404)
        res.json(JSON.parse('{}'));
    }
});

app.post('/products', (req, res) => {
   let newProduct = req.body;
   let maxId = 0; 

    for (let i =0 ; i < products.productList.length; i++) {
        if (products.productList[i].id > maxId) {
            maxId = products.productList[i].id;
        }
    }

    newProduct.id = maxId + 1;
    products.productList.push(newProduct);

    res.status(201);
    res.json(newProduct);
});

app.put('/products/:productId', (req, res) => {
    let updatedProduct = req.body;
    let productFound = false;

    for (let i = 0; i < products.productList.length; i++) {
        console.log(products.productList[i].id);
        if (products.productList[i].id == req.params.productId) {
            updatedProduct.id = products.productList[i].id;
            productFound = true;

            products.productList[i] = updatedProduct;
        }
    }

    if (productFound) {
        res.json(updatedProduct);
    } else {
        res.status(404).json(JSON.parse('{}'));
    }
});

app.delete('/products/:productId', (req, res) => {
    let deletedProduct;

    for (let i = 0; i < products.productList.length; i++) {
        if (products.productList[i].id == req.params.productId) {
            deletedProduct = products.productList[i];
            products.productList.splice(i, 1);
            break;
        }
    }

    if (deletedProduct) {
        res.json(deletedProduct);
    } else {
        res.status(404);
        res.json(JSON.parse('{}'));
    }
});

app.all('*', (req, res) => {
    const notFoundResponse = {
        errCode : 404,
        errMessage : 'The operation could not be fulfilles'
    }

    res.status(404).json(notFoundResponse);
});

app.listen(port, () => {
    console.log(`Spinsage Server listening on port ${port}`);
});