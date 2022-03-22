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
const SalesServices = require('./api/SalesServices');
app.use(cors());
app.use('/api/sale', SalesServices); //Use cors on single route, use //app.use(cors()); to enable every request

const ShopServices = require('./api/ShopServices');
app.use('/api/shop', ShopServices);


const server = app.listen(port, () => console.log(`API running on PORT ${port}!`));

module.exports = server;