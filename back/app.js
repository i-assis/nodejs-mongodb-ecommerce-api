// We start by requiring packages:

// TODO: Define criteria to require
// TODO: packages in the best order.

// 'dotenv' package
require('dotenv/config');
// This is here so we can get
// environment variables from a
// local file.
// local = at folder 'back'
const api = process.env.API_URL;

// 'body-parser' package
const bodyParser = require('body-parser');

// 'morgan' package
const morgan = require('morgan'); 

// 'mongoose' package
const mongoose = require('mongoose');
// 'require' works like 'import'
// Above procedure is equivalent to
// importing a package and storing
// it in a constant variable.

// Connection to the database
// is generally set-up before the
// server starts up:
mongoose.connect(process.env.CONNECTION_STRING, {
// This is inside an 'option' object.
useNewUrlParser: true, // option added
useUnifiedTopology: true, // server searching
dbName: 'ox-shop-db'
// If after this, it is still not working,
// go to MongoDB Atlas, and provide 'Network
// Access'. If everything fails, create new
// user, and so on..
}
)
// 'mongoose.connect' returns a promise:
// 1. getting executed
// 2. returning two methods:
// 'then' when it succeeds.
// 'error' when it fails.
.then( () => {
console.log('MongoDB connection is ready ...')
}
)
.catch( (err) => {
console.log(err)
}
);
// If 'current URL string parser is deprecated'
// message appears, implement
// implement option '{ useNewUrlParser: true }'
// to 'MongoClient.connect'.


// 'express' package
const express = require('express');
const app = express();
// This server requires listening 
// to a specific port.
app.listen(3000,()=>
// '()=>' must be at same line

// Now, a callback that will be
// executed once the server has
// been succesfully created:
{
console.log('API currently at: ' + api);
console.log('Server now running at http://localhost:3000 !');
}
);
// If the program had nothing more
// than minimum for server config,
// you'go to:
// http://localhost:3000 and it
// would return 'Cannot GET/'.
// That's because we didn't define
// any initial route for the app.
// At this moment, we get to the
// beggining of this code, and start
// adding a 1st route.

// TODO: This is a middleware section: START
// TODO: Find out the best place to put this:

// MIDDLEWARE METHOD using 'body-parser'.
// Putting this before all 'http' methods
// seemed to work best.

app.use(bodyParser.json());
// 'morgan' is 'middleware' library,
// so we have to add:

app.use(morgan('tiny'));
// 'tiny' means default option at 'morgan'
// On saving these logs into a .txt file,
// check the 'morgan' library documentation.


// TODO: This is a middleware section: END

// Now, we start to experiment with
// a 'product' MongoDB schema:
const productSchema = mongoose.Schema(
// This is an object with several fields:
{
name: String,
image: String, // URL of image
countClients: {
type: Number,
required: true
}
// If 'required' is set to 'true',
// the submission of a key/value
// structure that has no 'countClients'
// value will return HTTP 500 - error.

// 'mongoose' documentation specifies
// all types of variables.
}
);
// A NodeJS model starts with
// 'capital' letter:
const Product = mongoose.model('Product', 
productSchema);
    

// 'routes' setup
// examples:
// @ /api/v1
// @ http://localhost:3000/api/v1/
app.get('/api/v1', (req, res) => {
// 'get' as in above, is a "method"
res.send('Hello, API !')
}
);

// We need to have an API and a
// version. We'll adress that
// using environment variables.


// Now we need the following set-up:
// with a posting request, we need to
// receive post data like this from the
// front-end:
// const product = {
//     id: 1,
//     name: 'OxPenses',
//     image: 'some_url'
//     }
// Doesn't matter if this request comes
// from Postman, REACT, Angular, ...
// This data needs to be received
// by the back-end, analyzed and pushed
// into the database.


// Simulating 'product' API with 'get':
// 'get' is an 'http' method.
app.get(`${api}/products`,
// At above line, usage of ``
// is absolutely crucial.
async (req, res) => { 
const productList = await Product.find();
// 'find' method is returning a promess.
// When you are sending the response
// below, maybe 'productList' isn't ready
// as of yet.
// So the above 'await' ensures the 'send'
// only ocurres after 'Product.find()'
// is ready.
// 'await' requires 'async' method before
// '(req, res).

// Now, send 'productList' to front
// end with an 'if' for error detection
// purposes:
if(!productList){
res.status(500).json({success: false})
}
res.send(productList);
// Do note that all key/values at
// 'product' must be retrieved from
// a database.
}
);

// Simulating 'product' API with 'post':
// 'post' is an 'http' method.
app.post(`${api}/products`,
// At above line, usage of ``
// is absolutely crucial.
(req, res) => {
// Now, data for 'post' comes from
// front-end by 'req.body':
const product = new Product ( {
// 'product' NOT EQUAL TO 'Product' !
name: req.body.name,
image: req.body.image,
countClients: req.body.countClients
// Now the model is ready, we just need
// to send it into the database.
} )
// To send/save into the database, we write:
product.save().then( (createdProduct => {
// 'createdProduct' refers to a promise
// that takes place after the product was
// "created" in the database. 
res.status(201).json(createdProduct)
// '201' means this went well.
// 'save' is the method we just created.
// We're returning 'createdProduct' as a .json
// file as the frontend will interpret it !
}
)
)
// Now, if anything goes wrong:
.catch((err) => {
res.status(500).json(
// '500' means something went badly.
// We are returning an error message as a
// .json file as the frontend will interpret
// it.
{
error: err,
success: false
// Maybe we can use this variable in the
// front-end to end some loading process,
// to send the user back to the homepage ...
// in case there is some failure. 
}
) 
}
// What we did here with 'catch' could
// be done with 'async'/'await' as well.
)
// Now, send 'product' to front
// end, we could use:
// res.send(newProduct);
// Do note that all key/values at
// 'product' must be retrieved from
// a database.
}
);

// If we tested this API using Postman,
// sending from Postman a 'product'
// object, Postman would return '1'
// while the console would return
// 'undefined'.

// This means that 'body' isn't parsed
// well. We need MIDDLEWARE. It will
// control the request 'req' and response
// 'res' of any API.
// So, when the front-end sends a '.json'
// object, we need the back-end to
// be able to interpret said '.json'.
// This interpretation requires installation
// of 'bodyparser' library properly called
// using a 'require' method.

// Finally, after stting up 'body-parser',
// and making the 'post' request from postman,
// console provides something like:
// {
//     "id": 1,
//     "name": "OxPenses",
//     "image": "some_url"
// }
// which is an example of 'product'.


// In order to log all API requests, we use
// a library called 'morgan'. Don't forget to
// require it at the beggining.
// Check the beginning of this program and its
// middleware section, to see how the 'morgan'
// library is being used.

// No special software is required to usage  of
// mongoDB. We just need to log into the cloud
// database.
// Now, to integrate the variable 'product' to
// an actual mongoDB database, we need to install
// library 'mongoose'.

// We need to create a 'model' using 'mongoose'.
// A 'model' is the same thing as a 'collection'.
// So we can say:
// COLLECTION (Mongo DB idiom) = MODEL (NodeJS idiom)

// TODO: REFACTORING - 'routes.js' file
// TODO: REFACTORING - 'models.js' file

