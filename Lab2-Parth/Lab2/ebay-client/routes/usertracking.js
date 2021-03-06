/**
 * Created by Parth on 15-10-2016.
 */
var winston = require('winston');
winston.emitErrs = true;

var winstonLogger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});



module.exports = winstonLogger;
module.exports.stream = {
    write: function(message, encoding){
        winstonLogger.info(message);
    }
};