// Copyright 2011 Design by Front. All Rights Reserved.


/**
 * @fileoverview Holds all configuration options for the app.
 * @author aaron.falloon@designbyfront.com (Aaron Falloon)
 */

/*
 * ############################################################
 * 
 * If you need to edit this file, please update all environment
 * config files with the correspoding value.
 * These are the "config.js" files found at:
 *  /var/www/vhosts/typecastapp/httpdocs/core/expressionengine/configs
 * 
 * ############################################################
*/


// Set up environment for use on Node server
// @author alistair.brown@designbyfront.com (Alistair Brown)
if (typeof exports !== 'undefined') {
	var app = {
		temp: {
			config: {
			}
		}
	};
	exports.app = app;
} else {
	app.namespace('app.temp.config.env');
}

// -----------

app.temp.config.env = {
	
	domain: 'typecast.com',
	exceptionHubDetails: {
		projectId: '276538242f7f7a01051f7f4dbb0c00d9',
		number: 642
	},
	locations: {
		templates: '/js/src/views/templates/'
	},
	socketio: {
		protocol: 'https',
		domain: 'node.typecast.com',
		// Options for socket.io - https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
		// Client options only please
		options: {
			'connect timeout': 2500, // Set timeout between transport types - default: 5000
			//'force new connection': true,
			'reconnection delay': 100,
			'max reconnection attempts': 104
		},
		reconnection: {
			exponentialBackoff: true,
			exponentialThreshold: 3000, // 3 seconds. Set to 0 to disable
		},
		fatalDisconnectionTimeout: 150000 // 2.5 minutes
	},
	authentionToken: {
		requestTimeout: 10000,
	},
	masterFontList: {
		domain: 'typecast.com',
		retrieveFontDetails: {
			actionId: 113
		},
		fullFontSearch: {
			actionId: 111
		}
	}
};
