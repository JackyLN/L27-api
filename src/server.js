const express = require('express');


const app = express();
const cors = require('cors');
const config = require('./config');
const port = config.server.APPLICATION_PORT;

app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.status(200).json({
    greet: "Hello"
  });
})

const server = app.listen(port, () => console.log(`API running on PORT ${port}!`));

module.exports = server;