const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'products.json'
);

// Refactoring the file storage code
const getProductsFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    })
}

// In this class I want to find the shape of a single shop product
module.exports = class Product {
    /**
     * I want to receive a title and description of the product which will then create from inside my controller.
     * This allows me to create an object on this class where I can pass the title and description to the constructor 
     * which we call with "new Product"
     * @param {*} id id of the product
     * @param {*} title product title property
     * @param {*} image product Image Url
     * @param {*} description product description property
     * @param {*} price product price property
     */
    constructor(id, title, image, description, price) {
        this.id = id; 
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }
    
    /**
     * With save() method we will store our product into data folder
     */
    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString().substring(2);
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err) {
                    Cart.deleteProduct(id, product.price);
                }
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

    static findById(id, callback) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
}