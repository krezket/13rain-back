const express = require('express');
const allRoutes = require('./controllers');
const sequelize = require('./config/connection');
const http = require("http");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Serve static assets (client build folder)
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

// Define API routes
app.use('/', allRoutes);

// Catch all other routes and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const server = http.createServer(app);

sequelize.sync({ force: false }).then(function() {
    server.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});