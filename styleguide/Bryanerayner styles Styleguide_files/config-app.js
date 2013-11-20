// Copyright 2011 Design by Front. All Rights Reserved.
/**
 * @fileoverview Holds all configuration options for the app.
 * @author aaron.falloon@designbyfront.com (Aaron Falloon)
 */

// Set up environment for use on Node server
// @author alistair.brown@designbyfront.com (Alistair Brown)
if (typeof exports !== 'undefined') {
	var app = {
		temp: {
			config: {
				env: require('./config-env')
			}
		}
	};
	exports.app = app;
} else {
	app.namespace('app.temp.config.app');
}

// -----------
app.temp.config.app = {

	asyncTimeout: 20000,
	commandHistoryLength: 50,
	changeFunctionsToGet: {
		// Style declaration model methods
		'changeBackgroundColor': {
			type: 'substitute-value',
			command: {
				name: 'getBackgroundColor'
			}
		},
		'changeColor': {
			type: 'substitute-value',
			command: {
				name: 'getColor'
			}
		},
		'changeClear': {
			type: 'substitute-value',
			command: {
				name: 'getClear'
			}
		},
		'changeFontFamily': {
			type: 'substitute-value',
			command: {
				name: 'getFontFamily'
			}
		},
		'changeFontFeatureSettings': {
			type: 'toggle-value',
			// command: {
			// 	name: 'getFontFeatureSettings'
			// }
		},
		'changeFontSize': {
			type: 'substitute-value',
			command: {
				name: 'getFontSize'
			}
		},
		'changeFontStyle': {
			type: 'substitute-value',
			command: {
				name: 'getFontStyle'
			}
		},
		'changeFontWeight': {
			type: 'substitute-value',
			command: {
				name: 'getFontWeight'
			}
		},
		'changeFontWeightAndStyle': {
			type: 'substitute-value',
			command: {
				name: 'getFontWeightAndStyle'
			}
		},
		'changeFloat': {
			type: 'substitute-value',
			command: {
				name: 'getFloat'
			}
		},
		'changeLetterSpacing': {
			type: 'substitute-value',
			command: {
				name: 'getLetterSpacing'
			}
		},
		'changeLineHeight': {
			type: 'substitute-value',
			command: {
				name: 'getLineHeight'
			}
		},
		'changeMargin': {
			type: 'substitute-value',
			command: {
				name: 'getMargin'
			}
		},
		'changeMarginTop': {
			type: 'substitute-value',
			command: {
				name: 'getMarginTop'
			}
		},
		'changeMarginRight': {
			type: 'substitute-value',
			command: {
				name: 'getMarginRight'
			}
		},
		'changeMarginBottom': {
			type: 'substitute-value',
			command: {
				name: 'getMarginBottom'
			}
		},
		'changeMarginLeft': {
			type: 'substitute-value',
			command: {
				name: 'getMarginLeft'
			}
		},
		'changePadding': {
			type: 'substitute-value',
			command: {
				name: 'getPadding'
			}
		},
		'changePaddingTop': {
			type: 'substitute-value',
			command: {
				name: 'getPaddingTop'
			}
		},
		'changePaddingRight': {
			type: 'substitute-value',
			command: {
				name: 'getPaddingRight'
			}
		},
		'changePaddingBottom': {
			type: 'substitute-value',
			command: {
				name: 'getPaddingBottom'
			}
		},
		'changePaddingLeft': {
			type: 'substitute-value',
			command: {
				name: 'getPaddingLeft'
			}
		},
		'changeBorderColor': {
			type: 'substitute-value',
			command: {
				name: 'getBorderColor'
			}
		},
		'changeBorder': {
			type: 'substitute-value',
			command: {
				name: 'getBorder'
			}
		},
		'changeBorderTop': {
			type: 'substitute-value',
			command: {
				name: 'getBorderTop'
			}
		},
		'changeBorderRight': {
			type: 'substitute-value',
			command: {
				name: 'getBorderRight'
			}
		},
		'changeBorderBottom': {
			type: 'substitute-value',
			command: {
				name: 'getBorderBottom'
			}
		},
		'changeBorderLeft': {
			type: 'substitute-value',
			command: {
				name: 'getBorderLeft'
			}
		},
		'changeTextAlign': {
			type: 'substitute-value',
			command: {
				name: 'getTextAlign'
			}
		},
		'changeTextShadow': {
			type: 'substitute-value',
			command: {
				name: 'getTextShadow'
			}
		},
		'changeTextDecoration': {
			type: 'substitute-value',
			command: {
				name: 'getTextDecoration'
			}
		},
		'changeTextIndent': {
			type: 'substitute-value',
			command: {
				name: 'getTextIndent'
			}
		},
		'changeTextTransform': {
			type: 'substitute-value',
			command: {
				name: 'getTextTransform'
			}
		},
		'changeWidth': {
			type: 'substitute-value',
			command: {
				name: 'getWidth'
			}
		},
		'setToInheritFromParents': {
			type: 'substitute-value',
			grouping: 'batch',
			command: {
				name: 'getPropertyValues'
			}
		},
	},
	cssEditor: {
		topIdentifier: '#top#',
	},
	colorHistoryLength: 20,
	confirmMessages: {
		deleteFragment: 'Are you sure you want to delete this container?'
	},
	container: '#fragments',
	commands: {
		origins: {
			local: 'local',
			remote: 'remote'
		}
	},
	debugMode: false,
	defaultElementTypes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
	defaultInlineTypes: ['a', 'em', 'strong'],
	defaultInlineTypesTranslation: {
		'b': 'strong',
		'i': 'em',
	},

	editableCssProperties: {

		'color': {

			defaultUnit: '',
			defaultValue: 'rgb(51, 51, 51)'

		},

		'font-family': {

			defaultUnit: '',
			defaultValue: 'Comic Sans MS'

		},

		'font-size': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},
			maximum: 120,
			minimum: 8

		},

		'width': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			}

		},

		'letter-spacing': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
			},
			maximum: 8,
			minimum: -8

		},

		'text-indent': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
			},
			maximum: 9999,
			minimum: -9999

		},

		'line-height': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},
			maximum: 200,
			minimum: 10

		},

		'margin-top': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},

		},

		'margin-bottom': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},

		},

		'margin-right': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},

		},

		'margin-left': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},

		},

		'margin': {

			defaultUnit: 'px',
			defaultStep: {
				'px': 1,
				'em': 0.1,
				'%':  5
			},

		}
	},
	editableValuesDefaultOptions: {

		maximumLength: 10,
		size: 5

	},
	elementHistoryLength: 5,
	fontHistoryLength: 6,
	genericFontFamilies: {
		'fantasy'   : true,
		'sans-serif': true,
		'serif'     : true,
		'monospace' : true,
		'cursive'   : true,
	},
	webFont: {
		google: {
			cssUrl: '//fonts.googleapis.com/css?family=',
			cssExtension: ''
		},
		typekit: {
			// No css for you!
			loader: {
				authId: 'typc',
				authToken: '3bb2a6e53c9684ffdc9a98f6185b2a62c91558083b789ab73fbbe67c348d99d61361563896158de7cdb45829c7afa81860a880c4d77cd3ddb0b3452bf1d07606aa020db06164b7c1dff5940da12f3f351dacb4855e259c3f21433bf400da9518f1114e6f0972c2e9495203c8c44c99804e1ff6492d5cc80786012ad45f67b0fa1d37ceb63bf9bdc456a21cb64d7913b4e8ca730d3b0dcafb006d558035e857967752abf50997d3ff912581cc99b448ce73b518251f6d5bdff52935fbaf50a7c256d367632ec5012ab0a7',
				subset: 'all'
			}
		},
		fontdeck: {
			cssUrl: '//f.fontdeck.com/s/css//',
			cssExtension: '.css'
		},
		monotype: {
			cssUrl: '//' + app.temp.config.env.domain + '/project/css/',
			cssExtension: ''
		},
		myfonts: {
			cssUrl: '//easy.myfonts.net/v1/css?',
			cssExtension: ''
		},
		webtype: {
			cssUrl: '//cloud.webtype.com/css/',
			cssExtension: '.css'
		},
		providerNames: {

			'google': 'Google web fonts',
			'typekit': 'Typekit',
			'fontdeck': 'Fontdeck',
			'monotype': 'Fonts.com',
			'webtype': 'Webtype',
			'system': 'System'

		},
		loadingTimeout: 10000,
		// 10 seconds
	},
	fragmentControls: {
		'step': 1,
		'lowerLimit': 10,
	},
	fragmentIdPrefix: 'fragment-',
	fragmentWidth: '480px',
    maximumNumberOfFragments: 50,
	modelTypes: {

		styleDeclaration: 'style_declarations',
		element: 'elements',
		fragment: 'fragments',
		style: 'styles',
		project: 'projects'

	},
	mockContainer: 'mockContainer',
	newFragmentContent: 'Type or paste text here. Press ENTER to create a new element',
	regExps: {

		validClass: '([a-z0-9\-]+)$',
		validSelector: '^([a-z1-9]+)\.([a-z0-9\-]+)$',
		validNumber: '^[0-9]+(.[0-9]*)?$',
		scriptTag: '<script[^>]*>.*?<\/script[^>]*>',

	},
	typecastClassPrefix: 'typecast-',

	errorTypes: {
		information: 'i',
		warning:     'w',
		error:       'e'
	},

	server: {
		communication: {
			timeout: 20000,
			// 20 seconds
		}
	},

	uris: {
		// Used to store EE urls and pull them into JS
	}
};

// ----- Error messages -----------
app.errorMessages = {
	elementTypeAlreadyExists: 'That element type already exists',
	invalidFragmentName: 'Use only valid characters: a to z, 0 to 9 and - (hyphens)',
	oneDifferentiator: 'Only one differentiator is allowed',
	noDifferentiator: 'Please enter a valid differentiator',
	noValue: 'Please enter a value',
	validCharacters: 'Use only valid characters: a to z, 0 to 9 and hyphens (-) - separated by a full stop',
	validBaseElement: 'Your element type must be based on a valid base element e.g. h1 or p',

	outOfRangeFontSize: {
		message: 'Please enter a value between ' + app.temp.config.app.editableCssProperties['font-size'].minimum + ' and ' + app.temp.config.app.editableCssProperties['font-size'].maximum,
		severity: 'warning'
	},
	outOfRangeLetterSpacing: {
		message: 'Please enter a value between ' + app.temp.config.app.editableCssProperties['letter-spacing'].minimum + ' and ' + app.temp.config.app.editableCssProperties['letter-spacing'].maximum,
		severity: 'warning'
	},
	outOfRangeTextIndent: {
		message: 'Please enter a value between ' + app.temp.config.app.editableCssProperties['letter-spacing'].minimum + ' and ' + app.temp.config.app.editableCssProperties['letter-spacing'].maximum,
		severity: 'warning'
	},
	outOfRangeLineHeight: {
		message: 'Please enter a value between ' + app.temp.config.app.editableCssProperties['line-height'].minimum + ' and ' + app.temp.config.app.editableCssProperties['line-height'].maximum,
		severity: 'warning'
	},
	invalidHex: {
		message: 'Please enter a valid HEX value',
		severity: 'warning'
	},
	catchAll: {
		message: 'Sorry, an error has occurred in the application.<br />Your latest change may not have been saved successfully',
		severity: 'fatal',
		totangoActivity: 'Client exception'
	},
	invalidNumber: {
		message: 'Please enter a valid number',
		severity: 'warning'
	},

	// --- Client errors
	'client#authentication#status': {
		message: 'Sorry, we have been unable to authenticate you in the application.<br />Please log out and then log in again.',
		severity: 'fatal',
		totangoActivity: 'Client authentication'
	},

	'client#command#validation': {
		message: 'Sorry, we didn\'t understand that last change.<br />Your change has not been saved. Please refresh your project and try it again.',
		severity: 'fatal',
		totangoActivity: 'Command validation'
	},

	'client#system#connect': {
		message: 'Sorry, we can\'t contact our server to get your project.<br />The server could be down or you might not be connected to the internet.',
		severity: 'fatal',
		totangoActivity: 'Client connect'
	},

	'client not handshaken': {
		message: 'Sorry, we\'re having trouble communicating with the server correctly.<br />Please refresh your project to try it again.',
		severity: 'fatal',
		totangoActivity: 'Client not handshaken'
	},

	'client#projectrequest#status': {
		message: 'Sorry, we\'re having trouble communicating with the server correctly to get your project<br />Could you try reloading your project to help us retrieve it?',
		severity: 'fatal',
		totangoActivity: 'Client project request'
	},

	'client#authenticationrequest#status': {
		message: 'Sorry, we\'re having trouble communicating with the server correctly to authenticate you.<br />Please refresh your project to try it again.',
		severity: 'fatal',
		totangoActivity: 'Client authentication'
	},

	// --- Datastore Server errors ------
	// Session errors
	'server#session#deleted': {
		message: 'Sorry, you have logged out on another page.<br />In order to use typecast you must be logged in. Please go to the dashboard and log in again.',
		severity: 'fatal',
		totangoActivity: 'Serssion deleted'
	},
	// System errors
	'server#system#offline': {
		message: 'Sorry, our server has gone offline.<br />You will not be able to use Typecast until it is back online, but all of your changes are saved.',
		severity: 'fatal',
		totangoActivity: 'Server offline'
	},
	'server#system#fault': {
		message: 'Sorry, our server is having some internal difficulties.<br />Your latest changes may not have been saved successfully.',
		severity: 'fatal',
		totangoActivity: 'Server fault'
	},
	'server#system#validation': {
		message: 'Sorry, our server is having some internal difficulties.<br />Your latest changes may not have been saved successfully.',
		severity: 'fatal',
		totangoActivity: 'Server fault'
	},
	'server#system#connect': {
		message: 'Sorry, we can\'t contact our server to get your project.<br />The server could be down or you might not be connected to the internet.',
		severity: 'fatal',
		totangoActivity: 'Server connect'
	},
	'server#system#disconnect': {
		message: 'Sorry, we have been disconnected from the server.<br />Any changes you have made in the last few seconds will <strong>not</strong> have been saved. Could you check your internet connection?',
		severity: 'fatal',
		totangoActivity: 'Server disconnect'
	},
	'server#system#reconnect': {
		message: 'Hang on while we try to reconnect you<br />The connection to our server has been dropped. We\'re trying to reconnect now.',
		severity: 'fatal',
		totangoActivity: 'Server reconnect'
	},

	// Authentication errors
	'server#authentication#validation': {
		message: 'Sorry, we have been unable to authenticate you in the application.<br />Please refresh your project and if this fails, log out and then log in again.',
		severity: 'fatal',
		totangoActivity: 'Server authentication'
	},
	'server#authentication#status': {
		message: 'Sorry, we have been unable to authenticate you in the application.<br />Please log out and then log in again.',
		severity: 'fatal',
		totangoActivity: 'Server authentication'
	},

	// Datastore errors
	'server#datastore#fault': {
		message: 'Sorry, we\'re having trouble retrieving your project from the database.<br />The latest changes which you have made may not have been saved successfully.',
		severity: 'fatal',
		totangoActivity: 'Server datastore'
	},

	// Project errors
	'server#project#permission': {
		message: 'Sorry, you don\'t have permission to make that change on this project.<br />Your change has not been saved. Please ask the project owner for to allow you the necessary permissions.',
		severity: 'fatal',
		totangoActivity: 'Project permissions'
	},
	'server#project#validation': {
		message: 'Sorry, the request made for this project was not recognised.<br />Could you try reloading your project to help us retrieve it?',
		severity: 'fatal',
		totangoActivity: 'Project request'
	},
	'server#project#status': {
		message: 'We can\'t seem to find this project.<br />Could you try reloading your project to help us retrieve it?',
		severity: 'fatal',
		totangoActivity: 'Project status'
	},
	'server#project#deleted': {
		message: 'The project you are working on has been deleted by a member of your team.<br />Please go to your dashboard and select a new project to work on.',
		severity: 'fatal',
		totangoActivity: 'Project deleted'
	},
	'server#project#reverted': {
		message: 'The project has been reverted by someone in your team.<br />Please refresh your browser to reload the project.',
		severity: 'fatal',
		totangoActivity: 'Project reverted'
	},
	'server#project#locked': {
		message: 'This project has been temporarily locked by a member of your team.<br />Could you try reloading your project to check if has been unlocked?',
		severity: 'fatal',
		totangoActivity: 'Project locked'
	},

	// Command errors
	'server#command#validation': {
		message: 'Sorry, we didn\'t understand that last change.<br />Your change has not been saved. Please refresh your project and try it again.',
		severity: 'fatal',
		totangoActivity: 'Command issued'
	},
	'server#command#unsafe': {
		message: 'Sorry, we couldn\'t make that last change as it was determined to be unsafe.<br />Your change has not been saved. Please refresh you project and try it again.',
		severity: 'fatal',
		totangoActivity: 'Command issued'
	},

	// Persistant datastore errors
	'server#persistantdatastore#fault': {
		message: 'Sorry, we\'re having trouble retrieving your project from the database.<br />The latest changes which you have made may not have been saved successfully.',
		severity: 'fatal',
		totangoActivity: 'Server persistent datastore'
	},
	'server#persistantdatastore#status': {
		message: 'Sorry, we\'re having trouble communicating with the database.<br />The latest changes which you have made may not have been saved successfully.',
		severity: 'fatal',
		totangoActivity: 'Server persistent datastore'
	},

	// Naughty function, remove me please!
	remove: function() {
		app.eventAggregator.trigger('error-dialog:close');
		$('.faded-overlay').each(function() {
			($(this).css('display') === 'block' ? $(this).css('display', 'none') : null)
		});
	}
};

app.correctionRules = {
    customElementTypeDifferentiator: {
        'convert spaces and underscores to dashes': {
            pattern: '( |_)+',
            substitute: '-'
        },
        'translate all uppercase characters to lowercase': {
            pattern: '[A-Z]',
            substitute: function (match) {
                return match.toLowerCase();
            }
        },
        'remove all invalid characters': {
            pattern: '[^a-z0-9-]',
            substitute: ''
        },
        'remove leading numbers': {
            pattern: '^[0-9]+',
            substitute: ''
        },
        'remove leading dashes': {
            pattern: '^-+',
            substitute: ''
        }
    }
};
