
const mongoose = require('mongoose');
const logger = require('../helper/logger')

const loggerInfo = logger('Info');
const loggerError = logger('Error');


const connect = async () => {

    return mongoose.
        connect(process.env.monggoConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => loggerInfo('Connected to database...'))
        .catch(error => loggerError(error));
}

module.exports = connect;