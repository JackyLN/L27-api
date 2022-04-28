const express = require('express');

const app = express();
const cors = require('cors');
const config = require('./config');
const port = config.server.APPLICATION_PORT;
const bodyParser = require('body-parser')

//MongoDB
var mongoose = require('mongoose');
// mongoose.connect(config.server.APPLICATION_MONGOOSE, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).catch(error => console.log(error));
// var db = mongoose.connection;
// db.once('open', () => console.log('connected to database'));
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.mongoConnection = mongoose.createConnection(config.server.APPLICATION_MONGOOSE, {
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.json())


app.get('/', (req, res) => {
  res.status(200).json({
    greet: "Hello"
  });
})

//API routing
//Sale routing
const SalesController = require('./controller/SalesController');
app.use(cors());
app.use('/sale', SalesController); //Use cors on single route, use //app.use(cors()); to enable every request

const ShopController = require('./controller/ShopController');
app.use('/shop', ShopController);

const AuthController = require('./controller/AuthController');
app.use('/login', AuthController);


const server = app.listen(port, () => console.log(`API running on PORT ${port}!`));

module.exports = server;