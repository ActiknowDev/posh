const express = require("express");
const path = require('path');
const cors = require("cors");
require('dotenv').config();
const app = express();

var corsOptions = {
    origin: "*"
};
app.set("trust proxy", true);
app.use(cors(corsOptions));
// parse requests of content-type - application/json

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Actiknow POSH Compliance." });
});

// set port, listen for requests
const PORT = process.env.PORT || 5015;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

app.use('/static-assets', express.static(__dirname + '/assets'));
app.use('/profileImage', express.static(path.join(__dirname, 'assets/profileImages')));

require('./app/routes/user.routes')(app);

const db = require("./app/models");
db.sequelize.sync().then(async () => {
    console.log("Synced db.");
}).catch((err) => {
    console.log("Failed to sync db: " + err.message);
});