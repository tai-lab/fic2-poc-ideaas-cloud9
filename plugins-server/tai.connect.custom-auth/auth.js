//tai.connect.custom-auth

var assert = require("assert");
var fs = require("fs");
var Path = require('path');
//var crypto = require('crypto');
var bcrypt = require('bcryptjs');


module.exports = function (options, imports, register) {
    var connect = imports.connect;
    var log = imports.log;
    log.info("Custom init");
    var path = Path.resolve(__dirname, "../../configs/", "auth.json");
    debugger;
    assert(!options.username, "Option 'username' forbiden");
    assert(!options.password, "Option 'password' forbiden");

    function f(user, pass) {
	log.info("user=" + user + "; pass=" + pass + " VS username=" + options.username
		+ "; password=" + options.password);
	if (!user && !pass)
	    return false;
	if (!options.username && !options.password) {
	    log.info("Initial setup");
	    var salt = bcrypt.genSaltSync(5);
	    var hash = bcrypt.hashSync(pass, salt);
	    log.info("dkey=" + hash);
	    var data = {
		username: user,
		hash: hash,
		password: pass,
		salt: salt
	    };
	    if (fs.writeFile(path, JSON.stringify(data))) {
		log.error("error with: " + path);	
	    }
	    log.error("wrote auth in: " + path);	
	    options.username = data.username;
	    options.password = data.hash;
	    options.salt = data.salt;
	    return false;
	} else {
	    //var tmp = bcrypt.hashSync(pass, options.salt);
	    var res = (options.username == user &&
		       bcrypt.compareSync(pass, options.password));
	    //log.info("Mainstream auth: " + res);
	    return res;
	};
    };
    connect.useSetup(connect.getModule().basicAuth(f));
    
    console.log("Using custom authentication");

    register();
};