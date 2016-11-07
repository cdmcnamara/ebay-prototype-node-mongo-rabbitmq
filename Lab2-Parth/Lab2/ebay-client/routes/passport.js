/**
 * Created by Parth on 01-11-2016.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mq_client = require('../rpc/client');

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password'

    }, function (username, password, done) {

        var msg_payload={"username":username,"password":password}
        mq_client.make_request('signin_queue',msg_payload, function(err,results) {
            if (err)
            {
                return done(err);
            }
            if(results)
            {
                console.log(results);
                done(null, results);
            }

        });

    }));
};