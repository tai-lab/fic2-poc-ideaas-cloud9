/*global require process module __dirname*/
/**
 * Default/vanilla Cloud9 ("OS") configuration.
 */
"use strict";

var os = require("os");
var crypto = require('crypto');
var fs = require("fs");
var argv = require('optimist').argv;
var path = require("path");

var clientExtensions = {};
var clientDirs = fs.readdirSync(__dirname + "/../plugins-client");
for (var i = 0; i < clientDirs.length; i++) {
    var dir = clientDirs[i];
    if (dir.indexOf("ext.") !== 0)
        continue;

    var name = dir.split(".")[1];
    clientExtensions[name] = __dirname + "/../plugins-client/" + dir;
}

var projectDir = (argv.w && path.resolve(process.cwd(), argv.w)) || process.cwd();
var fsUrl = "/workspace";
var vfsUrl = "/vfs";

var port = argv.p || process.env.PORT || 3131;
var host = argv.l || process.env.IP || "localhost";
var debugPort = argv.b || process.env.DEBUG_PORT || 5858;

var useAuth = argv.username && argv.password;

var trace = argv.trace || false;
var containerId = argv.containerid || "";
require("util").print("*** " + "containerId=" + containerId + " ***\n");

var config = [
    {
        packagePath: "./connect",
        port: port,
        host: host,
	debug: trace
    }, {
        packagePath: "./connect.static",
        prefix: "/static"
    },
    "./cloud9.alive",
    "./cloud9.debug",

    // Client libraries
    "./../plugins-client/cloud9.core",
    "./../plugins-client/lib.ace",
    "./../plugins-client/lib.apf",
    "./../plugins-client/lib.treehugger",
    "./../plugins-client/lib.v8debug",
    "./../plugins-client/lib.requirejs",
    "./c9.smith.io",
    {
        packagePath: "./c9.smith.io.ide",
        messageRegex: /(\/smith.io-ide)/
    },
    // server plugins
    {
        packagePath: "./cloud9.sandbox",
        projectDir: projectDir,
        workspaceId: "Cloud9",
        userDir: null, // is this always there??
        unixId: null,
        host: host
    }, {
        packagePath: "./cloud9.core",
        debug: true,
        fsUrl: fsUrl,
        smithIo: {
            port: port,
            prefix: "/smith.io-ide"
        },
        hosted: false,
        bundledPlugins: [
            "helloworld"
        ],
        packed: false,
        packedName: "",
	c9cfend: process.env.C9CFEND || "https://api.cfapps.tailab.eu",
	c9cfusr: process.env.C9CFUSR || "foo",
	c9cfpass: process.env.C9CFPASS || "xxx",
	c9cforg: process.env.C9CFORG || "org",
	c9cfspc: process.env.C9CFSPC || "spc",
        clientPlugins: [
            "ext/filesystem/filesystem",
            "ext/settings/settings",
            "ext/editors/editors",
            //"ext/connect/connect",
            "ext/themes/themes",
            "ext/themes_default/themes_default",
            "ext/panels/panels",
            "ext/dockpanel/dockpanel",
            "ext/openfiles/openfiles",
            "ext/tree/tree",
            "ext/save/save",
            "ext/recentfiles/recentfiles",
            "ext/gotofile/gotofile",
            "ext/newresource/newresource",
            "ext/undo/undo",
            "ext/clipboard/clipboard",
            "ext/searchinfiles/searchinfiles",
            "ext/searchreplace/searchreplace",
            "ext/quickwatch/quickwatch",
            "ext/gotoline/gotoline",
            "ext/preview/preview",
            // "ext/deploy/deploy",
            "ext/log/log",
            "ext/help/help",
            "ext/linereport/linereport",
            "ext/linereport_php/linereport_php",
            "ext/linereport_python/linereport_python",
            //"ext/ftp/ftp",
            "ext/code/code",
            "ext/statusbar/statusbar",
            "ext/imgview/imgview",
            //"ext/preview/preview",
            "ext/extmgr/extmgr",
            //"ext/run/run", //Add location rule
            "ext/runpanel/runpanel", //Add location rule
            "ext/debugger/debugger", //Add location rule
            "ext/dbg-node/dbg-node",
            "ext/noderunner/noderunner", //Add location rule
            "ext/console/console",
            "ext/consolehints/consolehints",
            "ext/tabbehaviors/tabbehaviors",
            "ext/tabsessions/tabsessions",
            //"ext/keybindings/keybindings",
            "ext/keybindings_default/keybindings_default",
            "ext/watcher/watcher",
            "ext/dragdrop/dragdrop",
            "ext/menus/menus",
            "ext/tooltip/tooltip",
            "ext/sidebar/sidebar",
            "ext/filelist/filelist",
            "ext/beautify/beautify",
            "ext/offline/offline",
            "ext/stripws/stripws",
            //"ext/testpanel/testpanel",
            //"ext/nodeunit/nodeunit",
            "ext/zen/zen",
            "ext/codecomplete/codecomplete",
            "ext/vim/vim",
            "ext/anims/anims",
            "ext/guidedtour/guidedtour",
            "ext/quickstart/quickstart",
            "ext/jslanguage/jslanguage",
            "ext/csslanguage/csslanguage",
            "ext/htmllanguage/htmllanguage",
            "ext/autotest/autotest",
            "ext/closeconfirmation/closeconfirmation",
            "ext/codetools/codetools",
            "ext/colorpicker/colorpicker",
            "ext/gitblame/gitblame",
            //"ext/githistory/githistory",
            "ext/autosave/autosave",
            "ext/revisions/revisions",
            "ext/language/liveinspect",
            "ext/splitview/splitview"
        ]
    }, {
        packagePath: "vfs-architect/local",
        root: "/"
    }, {
        packagePath: "vfs-architect/http-adapter",
        mount: vfsUrl,
        httpRoot: "http://localhost:" + port + vfsUrl
    }, {
        packagePath: "./cloud9.fs",
        urlPrefix: fsUrl
    },
    {
        packagePath: "./cloud9.socket",
        socketPath: "/smith.io-ide"
    },
    {
        packagePath: "./connect.session",
        key: "cloud9.sid." + crypto.createHash('md5').update(os.hostname()).digest('hex') + "." + crypto.randomBytes(Math.ceil(8)).toString('hex'),
        secret: "v1234" + crypto.randomBytes(Math.ceil(8)).toString('hex')
    },
    {
        packagePath: "./connect.session.memory",
        sessionsPath: __dirname + "/../.sessions",
	maxAge: 60 * 1000
    },
    "./cloud9.permissions",
    {
        packagePath: "./cloud9.client-plugins",
        plugins: clientExtensions
    },
    "./cloud9.eventbus",
    "./cloud9.process-manager",
    "./cloud9.routes",
    "./cloud9.run.shell",
    {
        packagePath: "./cloud9.run.node",
        listenHint: "Important: in your scripts, use 'process.env.PORT' as port and '0.0.0.0' as host."
    },
    {
        packagePath: "./cloud9.run.node-debug",
        listenHint: "Important: in your scripts, use 'process.env.PORT' as port and '0.0.0.0' as host.",
        debugPort: debugPort
    },
    "./cloud9.run.npm",
    "./cloud9.run.npmnode",
    "./cloud9.run.ruby",
    "./cloud9.run.python",
    "./cloud9.run.apache",
    "./cloud9.run.php",
    "architect/plugins/architect.log",
    "./cloud9.ide.auth",
    "./cloud9.ide.git",
    "./cloud9.ide.gittools",
    "./cloud9.ide.hg",
    "./cloud9.ide.npm",
    "./cloud9.ide.filelist",
    "./cloud9.ide.search",
    "./cloud9.ide.run-node",
    {
        packagePath: "./cloud9.ide.run-npm-module",
        allowShell: true
    },
    "./cloud9.ide.run-python",
    "./cloud9.ide.run-apache",
    "./cloud9.ide.run-ruby",
    "./cloud9.ide.run-php",
    "./cloud9.run.python",
    "./cloud9.ide.revisions",
    {
        packagePath: "./cloud9.ide.settings",
        settingsPath: ".settings"
    },
    "./cloud9.ide.shell",
    "./cloud9.ide.state",
    "./cloud9.ide.watcher"
];

if (useAuth) {
    var util = require("util");
    util.print("*** Enabling Auth ***\n");
    config.push({
        //packagePath: "./cloud9.connect.basic-auth",
	packagePath: "./tai.connect.custom-oauth",
        username: argv.username,
        password: argv.password,
	containerId: containerId
    });
} else {
    var util = require("util");
    util.print("*** Disabling Auth ***\n");
}

if (process.env.C9EXTRACONFIG) {
    util.print("*** Processing C9EXTRACONFIG ***\n");
    var extra = null;
    try {
	var src = new Buffer(process.env.C9EXTRACONFIG, 'base64').toString('utf8');
	util.print("*** Got extra configuration:" + src );
	extra = JSON.parse(src);
	if (typeof(extra) != "object") {
	    throw "Error: config is not an object";
	}
	for (var index = 0; index < config.length; ++index) {
	    var elt = config[index];
	    var inject = extra[elt.packagePath];
	    if (inject) {
		for (var ij in inject) {
		    elt[ij] = inject[ij];
		}
	    }
	}
    } catch (x) {
	util.print("*** Ignoring C9EXTRACONFIG ***\n");
    }
}

module.exports = config;
