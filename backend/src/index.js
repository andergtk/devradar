const express = require('express');
const mongoose = require('mongoose');
const config = require('dotenv').config();

const routes = require('./routes');

const app = express();

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT);