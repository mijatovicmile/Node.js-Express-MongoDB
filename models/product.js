const mongodb = require('mongodb');
// Get access to the database connection
const getDb = require('../util/database').getDb;

// In this class I want to find the shape of a single shop product
class Product {
    /**
     * I want to receive a title, uploaded image, description and price of the product which will then create from inside my controller
     * So in the constructor I want to store the title, image url, description and product price of the product when it gets created
     * @param {*} title - product title property
     * @param {*} image - product Image Url
     * @param {*} description - product description property
     * @param {*} price - product price property
     * @param {*} id - id of the product
     */
    constructor(title, image, description, price, id) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    // With save() method we will save our product in database
    save() {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();
        let dbOperation;

        // Check if ID is set and if it is set 
        if (this._id) {
            // If is true update the product
            dbOperation = db
                // Connect to the 'products' collection
                .collection('products')
                // Update product with previously set id in database
                // I am looking for a document where the ID matches the ID I have here in my product I'm currently working
                .updateOne({ _id: this._id }, { $set: this });
        } else {
            // If id is not set, insert a new document (product) into the 'products' collection into shop database
            dbOperation = db
                .collection('products')
                .insertOne(this);
        }
        
        return dbOperation 
            .then(result => {
                console.log('Result', result);
            })
            .catch(err => {
                console.log('Error', err);
            });
    }

    // Get all products from database
    static fetchAll() {
        // Get access and interact with database to fetch all products from 'products' collection
        const db = getDb();
        // Return the result of an operation 
        return db
            .collection('products')
            // Find all products data from 'products' collection and returns a cursor to the selected documents
            .find() 
            // Returns an array that contains all the documents from a cursor
            .toArray() 
            .then(products => {
                console.log(products);
                // Return all fetched products from database
                return products; 
            })
            // Catch and log any potential error we might have
            .catch(err => {
                console.log(err);
            })
    }

    // Fetch a single product from database based on product Id
    static findById(prodId) {
        // Get access and interact with database to fetch single products from 'products' collection
        const db = getDb();
        // Return the result of an operation 
        return db
            // Use and interact 'product' collection from 'shop' database to fetch single product by Id
            .collection('products') 
            // db.collection.find() method method in this case allows us to find product where are the ID stored in Database is equal to that _id
            .find({ _id: new mongodb.ObjectId(prodId) }) 
            // The next document in the cursor returned by the db.collection.find() method
            .next()
            .then(product => {
                console.log(product);
                // Return fetched product from database
                return product;
            })
            // Catch and log any potential error we might have
            .catch(err => {
                console.log(err);
            });
    }

    // Deleting product from database by ID as an argument
    static deleteById(prodId) {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();
        return db
            // Connect to the 'products' collection
            .collection('products')
            /**
             * Removes a single document from a collection, by specify an _id filter as an object
             * Will be deleted the first element that has this criteria fulfilled
             */
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted');
            })
            // Catch and log any potential error we might have
            .catch(err => {
                console.log(err);
            });
    }
}

// Export the Product module
module.exports = Product;