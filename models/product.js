// Create constant "products" where we will receive new products as an array
const products = [];

module.exports = class Product {
    constructor(productTitle, productDescription) {
        this.title = productTitle;
        this.description = productDescription;
    }
    // Save Method
    save() {
        products.push(this);
    }

    static fetchAll() {
        return products;
    }
}