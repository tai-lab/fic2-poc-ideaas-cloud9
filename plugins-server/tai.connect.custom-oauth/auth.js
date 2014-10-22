var assert = require("assert");
var utils = require("util");
var Plugin = require("../cloud9.core/plugin");
var ERROR = require("http-error");
var Url = require("url");
var request = require('request');

var name = "custom-oauth";

module.exports = function (options, imports, register) {

    var connect = imports.connect;
    var IdeRoutes = imports["ide-routes"];
    var SESSION = imports.session;

    if (!options.containerId || !options.oauth) {
	throw new Error("The custom oauth plugin cannot run without the proper configuration options");
    }

    // { authorizationURL: 'https://192.168.103.116:3000/oauth/authorize',
    //   tokenURL: 'https://172.17.42.1:3000/oauth/token',
    //   clientID: 'a8881bba94348cde6f10530cca55167d3251031f7b185801d63081496ae73b95',
    //   clientSecret: 'd41d990536244639e5657d890f7c6d5ab4929a411ea17fd2f2a354668d8a682e',
    //   callbackURL: 'https://192.168.103.116/rewire'
    // }

    var validationEndpoint = options.oauth.validationEndpoint;
    var authorizedId = options.authorizedId;
    var passport = require('passport')
    , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
    connect.useSession(passport.initialize());
    connect.useSession(passport.session());
    passport.use('provider', new OAuth2Strategy(options.oauth,
						function(accessToken, refreshToken, profile, done) {
						    console.log("+++++++++++ verif A " + JSON.stringify(validationEndpoint));
						    var endpoint = validationEndpoint;
						    console.log("+++++++++++ verif B " + accessToken);
						    var options = {strictSSL: false, json:true};
						    if (endpoint.indexOf("{}") > -1) {
							endpoint = endpoint.replace("{}", accessToken);
						    } else {
							options.headers = {"Authorization": "Bearer " + accessToken};
						    }
						    options.url = endpoint;
						    function callback(err, response, body) {
							if (err) {
							    return done(err);
							}
							if (response.statusCode != 200 || !body || !body['id']) {
							    return done(null, false);
							} else {
							    var user = body['id'] + "|" + accessToken + "|" + endpoint;
							    if (body['id'] == authorizedId) {
								return done(null, user);   	
							    } else {
								console.log("!!! Unauthorized access by: " + user);
								return done(null, false);
							    }
							}
						    }
						    request.get(options, callback);
						}
					       ));
    passport.serializeUser(function(user, done) {
			       //console.log("... passport.serializeUser " + JSON.stringify(user));
			       done(null, user);
			   });
    passport.deserializeUser(function(id, done) {
				 //console.log("... passport.deserializeUser " + id);
				 done(null, id);
			     });

    var CustomOAuthPlugin = function(ide, workspace) {
	Plugin.call(this, ide, workspace);
        this.name = name;
        this.processCount = 0;
        this.ws = ide.workspace.workspaceId;

	var self = this;
	IdeRoutes.use("/coauth",
		      connect.getModule().router(function(app) {
						     app.get("/authorize", passport.authenticate('provider'),
							     function(req, res) {
								 req.session['toto'] = req.user;
								 // Successful authentication, redirect home.
								 res.statusCode = 302;
								 res.setHeader('Location', '/' + options.containerId);
								 return res.end('Redirecting to ' + '/' + options.containerId);
							     });
						}));
   	
    };

    utils.inherits(CustomOAuthPlugin, Plugin);	
    

    connect.useSession(
	function (req, res, next) {
	    console.log(">>> coauth >>> " + req.method + ": " + req.url);
	    var payload = {};
	    if (options.containerId && options.containerId != "") {
		payload['state'] = options.containerId;
	    };
	    if (req.url.indexOf('/api/coauth/authorize') == 0) {
		return next();
	    };
	    if (!req.user || req.user == "") {
		console.log("!!! " + req.method + ": " + req.url + " unauthorized, starting oauth protocol");
		return passport.authenticate('provider', payload)(req, res, next);
	    };
	    console.log(">>>>>> " + req.method + ": " + req.url + "! authorized as " + req.user);
	    next();
	    console.log("<<< " + res.statusCode + " <<< " + req.method + ": " + req.url);
	}
    );

    // connect.useSession(
    // 	function (req, res, next) {
    // 	    console.log(">>> useSession >>> " + req.method + ": " + req.url);
    // 	    var payload = {};
    // 	    if (options.containerId && options.containerId != "") {
    // 		payload['state'] = options.containerId;
    // 	    }
    // 	    getSession(req.session.uid,
    // 		       function(err, session) {
    // 			   if (err) {
    // 			       if (err.code == "401") {
    // 				   console.log("!!! " + req.method + ": " + req.url + " unauthorized, starting oauth protocol");
    // 				   return passport.authenticate('provider', payload)(req, res, next);
    // 			       } else {
    // 				   res.statusCode = 406;
    // 				   return res.end();
    // 			       }
    // 			   }
    // 			   if (req.url.indexOf('/api/coauth/authorize') == 0) {
    // 			       return next();
    // 			   }
    // 			   if (!req.user || req.user == "") {
    // 			       res.statusCode = 404;
    // 			       return res.end();
    // 			   }
    // 			   console.log(">>>>>> " + req.method + ": " + req.url + "! authorized as " + req.user);
    // 			   next();
    // 			   console.log("<<< " + res.statusCode + " <<< " + req.method + ": " + req.url);
    // 		       });
    // 	}
    // );

    function getSession(sessionId, callback) {
	SESSION.get(
	    sessionId,
	    function(err, session) {
		if (err) {
		    return callback(new ERROR.InternalServerError(err));
		}
		if (!session || !(session.uid || session.anonid)) {
		    return callback(new ERROR.Unauthorized("Session ID missing"));	
		}
		return callback(null, session);
	    });
    }

    console.log("Using custom oauth authentication with containerId= " + options.containerId + " and oauth= " + JSON.stringify(options.oauth));
    
    imports.ide.register(name, CustomOAuthPlugin, register);
};