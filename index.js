const express = require('express');
const allRoutes = require('./controllers');
const sequelize = require('./config/connection');
const http = require("http");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.use('/',allRoutes);

const server = http.createServer(app);

sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});