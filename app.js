const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');


const app = express();

app.use(bodyParser.json());

app.use(usersRoutes);
app.use(authRoutes);





mongoose.connect('mongodb+srv://thirdweek:196SsR9V1OvXKYxS@cluster0-ibwkk.mongodb.net/restapi?retryWrites=true&w=majority')
    .then(result => {
        app.listen(8080);
    }).catch(err => {
        console.log(err);
    })

