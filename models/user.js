const mongodb = require('mongodb');

// Get access to the database connection
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    /**
     * Accept User data in the constructor
     * @param {*} username - username
     * @param {*} email - user email address
     * @param {*} cart - store the cart in our JS object, which will be based on the data stored in the database
     * @param {*} id - user Id
     */
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // {items: []}
        this._id = id;
    }

    // Save user to the database
    save() {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();

        return db
            // Save users in 'users' collection 
            .collection('users')
            // "this" is an object I am in, where we have name and an email property
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            })
    }


    /**
     * Add products to the Cart
     * 
     * For every user I have, I want to store a cart, and that user will have a cart and 
     * that cart will hold the products
     * @param {*} product 
     */
    addToCart(product) {
        /**
         * Add to cart will be called on a User object and will create that object 
         * with data we fetched from the database with the help of findById
         * 
         * Use cart items and find the index of a product in that cart with the same Id as the product we're trying to add again
         */
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            // Return true if the product Id in items array matches the Id of the product I'm trying to insert
            return cartProduct.productId.toString() === product._id.toString();
        });

        // Default quantity is 1 for new added product in cart
        let newQuantity = 1;
        
        // Get the updated cart items by copying it all in a new array
        const updatedCartItems = [...this.cart.items];

        // If product already exists in cart
        if (cartProductIndex >= 0) {
            // Update / Increase quantity of cart item for given identified index product
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            
            // Access cart item with the cart product index I found, and update the quantity for that existing product item
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            /**
             * If item did not exist before, add a new cart item
             */
            updatedCartItems.push({ 
                productId: new ObjectId(product._id), 
                quantity: newQuantity 
            });
        }

        const updatedCart = { 
            /**
             * Here for updatedCart I will set my items is equal to the update of the cart because that will always
             * be an array with all the old elements, because I copy it first and then added updated product data
             */
            items: updatedCartItems
        };

        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();

        // Update the user in user collection
        return db
            .collection('users')
            .updateOne( 
                { _id: new ObjectId(this._id) },

                /**
                 * Cart which I expect to have in a user database will receive updated cart
                 * so this object as a new value will overwrites the old one
                 */
                { $set: { cart: updatedCart } } 
            )
    }


    /**
     * Get list of the cart product with respective quantities and other product details
     * 
     * Cart will exist only for user who already has cart property and
     * not for users who does not have items in cart
     */
    getCart() {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();

        /**
         * Array of object that have a productId (reference to the product) and quantity for that product
         * 
         * Mapping an array of items where every item is a javascript object in an array of strings of the product Id
         */
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        
        // Return the result from a database
        return db
            // Reach out to the product collection because in products collection I have all the user and cart data
            .collection('products')
            // Find all products that are in my cart and where the Id of that product is equal to the Id from productIds array
            .find({ _id: { $in: productIds }})
            // Method returns an array that contains all the documents from a cursor
            .toArray()
            .then(products => {
                /**
                 * Return array of all products data for the products that were in cart
                 */
                return products.map(p => {
                    return { 
                        // Distribute all the existing properties - keep all the old data I retrieved
                        ...p, 
                        // Add quantity property populates with data I have on that product
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                })
            })
            // Catch and log any potential error we might have
            .catch(err => {
                console.log(err);
            })
    }


    /**
     * Delete product item from the cart
     * @param {*} productId - Id of product that I want to delete from cart
     */
    deleteItemFromCart(productId) {
        /**
         * Filter all existing cart items in the array 
         * and return a new array with all the filtered items
         */
        const updatedCartItems = this.cart.items.filter(item => {
            /**
             * Return true if we want to keep the item in the new array,
             * or false if we want to get rid of it
             * 
             * Keep all items except for the item which we're deleting
             */
            return item.productId.toString() !== productId.toString(); // will return false
        });
        
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();

        // Update the cart items execept one that I deleted
        return db
            .collection('users')
            .updateOne( 
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } } 
            )
    }


    /**
     * Add order(s)
     */
    addOrder() {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();
        return this.getCart().then(products => {
            // Order which I want to save
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name 
                }
            };
            return db
                // Store the orders in a new 'orders' collection
                .collection('orders')
                // Insert a new order, and the order will be the users cart
                .insertOne(order)
        })
         // When order is successfully set
         .then(result => {
            // Empty user cart 
            this.cart = { items: [] };
            // Also empty user cart in from the 'users' collection
            return db
                .collection('users')
                .updateOne( 
                    { _id: new ObjectId(this._id) },
                    { $set: { cart: { items: [] } } } 
            )
        })
        // Catch and log any potential error we might have 
        .catch(err => {
            console.log(err);
        })           
    }


    /**
     * Ger order(s)
     */
    getOrders() {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();

        return db
            // Find all orders for a given user
            .collection('orders')
            // All users order 
            .find({'user._id': new ObjectId(this._id) })
            .toArray();
    }


    // Find a user by Id
    static findUserById(userId) {
        // Get access to database, so now we have a connection which allows us to interact with the database
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                console.log(user);
                // Return the user from the database
                return user;
            })
            // Catch and log any potential error we might have
            .catch(err => {
                console.log(err);
            });
    }
}


// Exports the User module
module.exports = User;