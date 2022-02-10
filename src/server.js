const express = require('express');


const app = express();
const cors = require('cors');
const config = require('./config');
const port = config.server.APPLICATION_PORT;
const bodyParser = require('body-parser')



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


const server = app.listen(port, () => console.log(`API running on PORT ${port}!`));

module.exports = server;