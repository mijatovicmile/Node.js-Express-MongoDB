const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

// Refactoring the file storage code
const getProductsFromFile = callback => {
    fs.readFile(p, (err, data) => {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(data));
        }
    })
}

// In this class I want to find the shape of a single shop product
module.exports = class Product {
    /**
     * I want to receive a title and description of the product which will then create from inside my controller.
     * This allows me to create an object on this class where I can pass the title and description to the constructor 
     * which we call with "new Product"
     * @param {*} title product title property
     * @param {*} image product Image Url
     * @param {*} description product description property
     * @param {*} price product price property
     */
    constructor(title, image, description, price) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }
    
    /**
     * With save() method we will store our product into data folder
     */
    save() {
        // Get the application path to the data folder, and product.json file into that folder
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    /**
     * Retrieve products from an array (fetch data)
     * 
     * static -> make sure that I can call this method directly on the Product class itself and not on an instantiated object
     */
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}