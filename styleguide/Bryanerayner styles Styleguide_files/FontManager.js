// Copyright 2011 Design by Front. All Rights Reserved.
/**
 * @fileoverview Provides a consistant interface to loading full font files from
 *    multiple separate web font providers
 *
 * External Dependancies:
 *  - webFont        :: Font loader with callback functionality
 *                      [http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js]
 *  - TypekitPreview :: Object for loading single Typekit fonts
 *
 * @author alistair.brown@designbyfront.com (Alistair Brown)
 *
 */


/**
 * FontManager for allowing easy loading for web fonts
 */

function FontManager() {

	var self = this,
		ErrorHandler = app.ErrorHandler,
		fontProviderCounts = app.fontProviderCounts,
		availableFonts = {};

	//Check that WebFontLoader is available (for loading fonts)
	if(typeof WebFont === 'undefined') {
		// EH temp raise
		ErrorHandler.raise({
			msg: 'WebFontLoader is not defined'
		});

		throw new Error('WebFontLoader is not defined');
	}

	//Check that TypekitPreview is available (for loading Typekit fonts)
	if(typeof TypekitPreview === 'undefined') {
		// EH temp raise
		ErrorHandler.raise({
			msg: 'TypekitPreview is not defined'
		});

		throw new Error('TypekitPreview is not defined');
	}

	var typekitLoader = TypekitPreview;
	typekitLoader.setup({
		'auth_id': app.config.webFont.typekit.loader.authId,
		'auth_token': app.config.webFont.typekit.loader.authToken,
		'default_subset': app.config.webFont.typekit.loader.subset
	});

	if (app && app.eventAggregator && app.eventAggregator.bind) {
		app.eventAggregator.bind('typecast:loading:finished', function() {
			setTimeout(function() {
				forceBrowserRedraw();
			}, 1000);
		});
	}

	// Public methods
	/**
	 * Converts a font weight to a numerical value
	 * @param {String} fontWeight A string representing the font-weight
	 * @return {Object} A numerical value representing the font-weight
	 */
	this.fontWeightStringToNumerical = function(fontWeight) {
		if( !! isNaN(+fontWeight)) {
			fontWeight = fontWeight.toLowerCase();
			var translation = {
				'normal': 400,
				'bold': 700,
			};
			return translation[fontWeight] || false;
		}
		return +fontWeight;
	};

	/**
	 * Loads a list of web fonts in full. Fonts can be from a different providers.
	 * @param {Array} fontList An array containing font objects {font-family, provider}.
	 * @param {Function} callback A callback function on completion of font loading.
	 * @return {Object} The possible variations of each of the fonts to be loaded.
	 */
	this.loadFonts = function(fontList, callback) {
		if(typeof fontList === 'undefined' || !fontList instanceof Array) {
			return false;
		}

		// Load the fonts which are in use
		var fontLoadSettings = {
			externalCssDependancies: []
		};
		var fontsVariationDetails = {};
		var fontsCssFamilies = {};
		var promises = [];

		_.each(fontList, function(font) {
			if(font && font.cssFontFamily === 'Arial') {
				font.fontFamily = 'Arial';
			}
			promises.push(
			(function() {
				var dfd = $.Deferred();
				getFontDetailsGlobalLookup(font, function(fontDetails) {
					if(fontDetails === null) {
						dfd.resolve();
						return;
					}

					fontLoadSettings = settingsFontLoadMax(font, fontLoadSettings);

					if(fontLoadSettings === false) {
						return;
					}

					fontsVariationDetails[font.fontFamily] = variationDetailsSanitation(fontDetails.variation);

					var variationFontCssFamily = fontDetails.variation[fontDetails.defaultVariation].cssFontFamily;
					if(typeof variationFontCssFamily === 'undefined') {
						fontsCssFamilies[font.fontFamily] = fontDetails.cssFontFamily;
					} else {
						fontsCssFamilies[font.fontFamily] = variationFontCssFamily;
					}
					dfd.resolve();
				});
				return dfd.promise();
			})());
		});

		$.when.apply($, promises).then(function() {
			loadExternalCssDependancies(_.unique(fontLoadSettings.externalCssDependancies));
			delete fontLoadSettings.externalCssDependancies;

			loadWebFonts(fontList, fontLoadSettings, function() {
				if(typeof callback !== 'undefined') {
					window.setTimeout(function() {
						callback(fontsCssFamilies, fontsVariationDetails);
					}, 1000);
				}
			});

		}).fail(function() {
			for(var i = 0, l = fontList.length; i < l; i++) {
				app.eventAggregator.trigger('error:font-manager:loading-failed', fontList[i]);
			}
		});
	};



	/**
	 * Loads the variations of a font from a single provider.
	 * @param {Object} font A font object {font-family, provider}.
	 * @param {Array} variationList A list of string which represent the required variations to load.
	 * @param {Function} callback A callback function on completion of font loading.
	 * @return {Boolean} Whether the variations have been set to load.
	 */
	this.loadFontVariations = function(font, variationList, callback) {
		if(typeof font === 'undefined' || !font instanceof Object) {
			return false;
		}

		var chosenFont = availableFonts[font.fontFamily].providers[font.provider];
		if(typeof chosenFont === "undefined" || !chosenFont.variation[chosenFont.defaultVariation].loaded) {
			return false;
		}

		// Load the variations of the fonts which are in use
		var fontLoadVariationSettings = {};
		var fontLoadVariationSettings = {
			externalCssDependancies: []
		};
		_.each(variationList, function(variation) {
			fontLoadVariationSettings = settingsFontLoadVariationMax(font, variation, fontLoadVariationSettings);
			if(fontLoadVariationSettings === false) return false;
		});
		if (font.provider === "myfonts") {
			loadExternalCssDependancies(_.unique(fontLoadVariationSettings.externalCssDependancies));
		}
		delete fontLoadVariationSettings.externalCssDependancies;

		if(!_.isEmpty(fontLoadVariationSettings)) {
			loadWebFonts([font], fontLoadVariationSettings, function() {
				forceBrowserRedraw();
				if(typeof callback !== 'undefined') {
					callback();
				}
			});
		}

		return true;
	};



	// Getters
	/**
	 * Returns a font object for the corresponding cssFontFamily using the
	 *     generated internal reverse lookups.
	 * @param {string} cssFontFamily A string of the css font family.
	 * @return {Object} A font object containing {font-family, provider}.
	 */
	this.getFontObject = function(cssFontFamily) {
		cssFontFamily = cssFontFamily.replace(/['"<>]/g, '');
		var fontObject = generatedViews.reverseFontLookup[cssFontFamily];
		if(!fontObject) {
			var isSystemFontAdded = this.addSystemFont(cssFontFamily);
			if(isSystemFontAdded) {
				fontObject = generatedViews.reverseFontLookup[cssFontFamily];
			}
		}
		return fontObject;
	};


	/**
	 * Returns an object keyed with provider name and has the total
	 *     fonts available in that collcetion
	 * @return {Object} An object {provider-name, total-count}.
	 */
	this.getFontProviderCounts = function() {
		return generatedViews.fontProviderCounts;
	};


	/**
	 * Returns a font-family name for the corresponding cssFontFamily using the
	 *     generated internal reverse lookups.
	 * @param {string} cssFontFamily A string of the css font family.
	 * @return {string} The font-family name.
	 */
	this.getFontName = function(cssFontFamily) {
		var reverseFontLookup = generatedViews.reverseFontLookup[cssFontFamily]
		return(typeof reverseFontLookup !== 'undefined' ? reverseFontLookup.fontFamily : undefined);
	};

	this.getInternalAvailableFonts = function() {
		return availableFonts;
	};

	this.addSystemFont = function(cssFontFamily) {
		if(!isSystemFontInstalled(cssFontFamily)) {
			return false;
		}
		cssFontFamily = cssFontFamily.replace(/['"<>]/g, '');
		if(typeof availableFonts[cssFontFamily] === 'undefined') {
			var fontEntry = generateBaseFontEntry(cssFontFamily);
			if(fontEntry) {
				availableFonts[cssFontFamily] = fontEntry;
			}
		}
		updateGeneratedViews({
			fontFamily: cssFontFamily,
			cssFontFamily: cssFontFamily,
			provider: 'system',
		}, availableFonts[cssFontFamily]);

		return true;
	};

	/**
	 * Returns a variation name for the corresponding cssFontFamily, weight and style
	 *     using the generated internal reverse lookups.
	 * @param {string} cssFontFamily A string of the css font-family.
	 * @param {string} fontWeight A string of the css font-weight.
	 * @param {string} fontStyle A string of the css font style.
	 * @return {string} The variation name.
	 */
	this.reverseVariationLookup = function(cssFontFamily, fontWeight, fontStyle) {
		fontWeight = this.fontWeightStringToNumerical(fontWeight);
		var variation = generatedViews.reverseVariationLookup[cssFontFamily + '' + fontWeight + '' + fontStyle];
		// Small tweak for variations which do not have weight or style defined (but which are set here from inheritance)
		if(typeof variation === 'undefined') {
			variation = generatedViews.reverseVariationLookup[cssFontFamily + '' + undefined + '' + undefined];
		}
		return variation;
	};


	/**
	 * Returns a list of the fonts available.
	 * @return {Object} List of used fonts.
	 */
	this.getListOfFontsAvailable = function() {
		return generatedViews.fontsAvailable;
	};


	/**
	 * Returns an array of the font providers.
	 * @return {array} Font providers.
	 */
	this.getArrayOfFontProviders = function() {
		return generatedViews.fontProviders;
	};

	/**
	 * Returns data about the font (variations, css font-family name, etc) for the provider.
	 * @param {Object} font A font object {font-family, provider}.
	 * @return {Object} Details for the font (and provider).
	 */
	this.getFontDetails = function(font) {
		if(typeof font === 'undefined' || !font instanceof Object) {
			return false;
		}

		var fontDetailsAllProviders = availableFonts[font.fontFamily];
		if(typeof fontDetailsAllProviders === 'undefined') {
			return false;
		}

		var fontDetails = fontDetailsAllProviders.providers[font.provider];
		if(typeof fontDetails === 'undefined') {
			return false;
		}

		var isValidFontDetails = validateFontDetails(fontDetails);
		if (!isValidFontDetails || !isValidFontDetails.success) {
			var msg = isValidFontDetails ? isValidFontDetails.message : 'isValidFontDetails is invalid';
			ErrorHandler.raise({
				data: {
					font: font
				},
				level: 'w',
				msg: 'getFontDetails(): fontDetails is not valid: '+ msg
			});
		}

		return fontDetails;
	};

	// Source: http://lucassmith.name/2009/05/test-if-a-font-is-installed-via-javascript.html
	var isSystemFontInstalled = function(cssFontFamily) {
			if(app.config.genericFontFamilies[cssFontFamily.toLowerCase()]) {
				return true;
			}
			cssFontFamily = cssFontFamily.replace(/['"<>]/g, '');
			var body = document.body,
				test = document.createElement('div'),
				installed = false,
				template = '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',sans-serif !important">ii</b>' + '<b style="display:inline !important; width:auto !important; font:normal 10px/1 \'X\',monospace !important">ii</b>',
				ab;
			if(cssFontFamily) {
				test.innerHTML = template.replace(/X/g, cssFontFamily);
				test.style.cssText = 'position: absolute; visibility: hidden; display: block !important';
				body.insertBefore(test, body.firstChild);
				ab = test.getElementsByTagName('b');
				installed = ab[0].offsetWidth === ab[1].offsetWidth;
				body.removeChild(test);
			}
			return installed;
		};

	var forceBrowserRedraw = function() {
		$('head').prepend('<style id="forceBrowserRedraw">body { margin-bottom: ' + $('body').css('margin-bottom') + '; }</style>');
		$('#forceBrowserRedraw').remove();
		return true;
	};

	var validateFontDetails = function(fontDetails) {
			if (typeof fontDetails.cssFontFamily !== 'string') {
				return { success: false, message: "cssFontFamily should be a string, but is: "+ JSON.stringify(fontDetails.cssFontFamily) };
			}
			if (typeof fontDetails.defaultVariation !== 'string') {
				return { success: false, message: "defaultVariation should be a string, but is: "+ JSON.stringify(fontDetails.defaultVariation) };
			}
			if (typeof fontDetails.variation !== 'object') {
				return { success: false, message: "variation is not an object, but is: "+ JSON.stringify(fontDetails.variation) };
			}

			return { success: true };
		};


	/**
	 * Returns data about the font (variations, css font-family name, etc) for the provider.
	 * @param {Object} font A font object {font-family, provider}.
	 * @return {Object} Details for the font (and provider).
	 */
	var getFontDetailsGlobalLookup = function(font, callback) {
			if(typeof font === 'undefined' || !font instanceof Object) {
				return false;
			}

			var fontDetailsAllProviders = availableFonts[font.fontFamily];

			var checkAndReturnFontDetails = function(fontDetailsAllProviders, callback) {
					if(typeof fontDetailsAllProviders === 'undefined') {
						callback(null);
						return;
					}
					var fontDetails = fontDetailsAllProviders.providers[font.provider];
					if(typeof fontDetails === 'undefined') {
						callback(null);
						return;
					}
					if(typeof callback === 'function') {
						callback(fontDetails);
					}
				};

			if(typeof fontDetailsAllProviders === 'undefined' || typeof fontDetailsAllProviders.providers[font.provider] === 'undefined') {
				// Font is not available locally, go to master
				getFontDetailsFromMaster(font, function(fontDetailsAllProviders) {
					if(fontDetailsAllProviders === false) {
						app.eventAggregator.trigger('error:font-manager:loading-failed', font);
						callback(null);
					} else {
						checkAndReturnFontDetails(fontDetailsAllProviders, callback);
					}
				});
			} else {
				checkAndReturnFontDetails(fontDetailsAllProviders, callback);
			}

		};


	// ### For testing purposes only!
	this.getListOfLoadedWebfonts = function() {
		_.each(availableFonts, function(fontDetails, fontName) {
			_.each(fontDetails.providers, function(providerFontDetails, providerName) {
				_.each(providerFontDetails.variation, function(variationDetails, variationName) {
					if(variationDetails.loaded === true && providerName !== 'system') {}
				});
			});
		});
	};

	// -------------------------
	// Private methods
	/**
	 * Provides a wrapper for loading fonts and provides singular callback function availability.
	 * @param {Array} fontList An array containing font objects {font-family, provider}.
	 * @param {Object} fontLoadSettings Setting object for the WebFont loader.
	 * @param {Function} callback A callback function on completion of font loading.
	 */
	var loadWebFonts = function(fontList, fontLoadSettings, callback) {
			if(_.isEmpty(fontLoadSettings)) {
				if(typeof callback !== 'undefined') {
					callback();
				}
			} else {

				var fontLoadingTimeout = {};
				for(var i = 0, l = fontList.length; i < l; i++) {
					if(typeof fontList[i].fontFamily === 'undefined') {
						fontList[i].fontFamily = fontList[i].cssFontFamily;
					}
					var cssFontFamilyDetails = self.getFontDetails(fontList[i]);
					if(cssFontFamilyDetails === false) {
						continue;
					}

					var variationCssFontFamily = cssFontFamilyDetails.variation[cssFontFamilyDetails.defaultVariation].cssFontFamily;
					if(typeof variationCssFontFamily !== 'undefined' && variationCssFontFamily !== '') {
						var cssFontFamilyTimeout = variationCssFontFamily;
					} else {
						var cssFontFamilyTimeout = cssFontFamilyDetails.cssFontFamily;
					}

					if(fontList[i].provider !== 'system') {
						var fontLoadingFailedCallback = function() {
								var cssFontFamily = cssFontFamilyTimeout;
								return function() {
									app.eventAggregator.trigger('error:font-manager:loading-failed', cssFontFamily);
								}
							}();
						fontLoadingTimeout[cssFontFamilyTimeout] = window.setTimeout(fontLoadingFailedCallback, app.config.webFont.loadingTimeout);
					}
				}

				// We aren't using the webfont loader for typekit; we get special API access :P
				var typekitFontLoadSettings = '';
				if(typeof fontLoadSettings["typekit"] !== 'undefined') {
					typekitFontLoadSettings = fontLoadSettings["typekit"];
					delete fontLoadSettings["typekit"];
				}

				var webFontActive = function(cssFontFamily, fontDescription) {
						clearTimeout(fontLoadingTimeout[cssFontFamily]);
						var identificationDetails = {};
						var styleWeight = lengthenMinifiedStyleWeight(fontDescription);
						var variationName = generatedViews.reverseVariationLookup[cssFontFamily + styleWeight.weight + styleWeight.style];
						if (variationName) {
							variationName = generatedViews.reverseVariationLookup[cssFontFamily + undefined + undefined];
						}
						if (variationName) {
							identificationDetails.variationName = variationName;
						}
						setFontLoaded(cssFontFamily, fontDescription, identificationDetails);
					};

				var loadTypekitFonts = function(typekitFontLoadSettings) {
						var dfd = $.Deferred();
						if(_.isEmpty(typekitFontLoadSettings)) {
							dfd.resolve();
							return dfd.promise();
						}
						var fontLoadFunctions = {
							fontactive: webFontActive,
							active: dfd.resolve,
							inactive: dfd.fail
						};
						// Use typekit api loader
						typekitLoader.load(typekitFontLoadSettings.webFonts, fontLoadFunctions);
						return dfd.promise();
					};

				var loadStandardisedWebFonts = function(fontLoadSettings) {
						var dfd = $.Deferred();
						if(_.isEmpty(fontLoadSettings)) {
							dfd.resolve();
							return dfd.promise();
						}
						fontLoadSettings.fontactive = webFontActive;
						fontLoadSettings.active = dfd.resolve;
						fontLoadSettings.inactive = dfd.fail;
						// Use webfont loader
						WebFont.load(fontLoadSettings);
						return dfd.promise();
					};

				$.when(loadStandardisedWebFonts(fontLoadSettings), loadTypekitFonts(typekitFontLoadSettings)).then(function() {
					if(typeof callback !== 'undefined') {
						callback();
					}
				}).fail(function() {
					for(var i = 0, l = fontList.length; i < l; i++) {
						app.eventAggregator.trigger('error:font-manager:loading-failed', fontList[i]);
					}
				});

			}
		};


	/**
	 * Generates the correct settings for loading a full font.
	 * @param {Object} font A font object {font-family, provider}.
	 * @param {Object} fontLoadSettings Current settings object for the WebFont loader.
	 * @return {object} modified current settings object.
	 */
	var settingsFontLoadMax = function(font, fontLoadSettings) {

			var fontDetails = self.getFontDetails(font);
			var chosenFont = fontDetails.variation[fontDetails.defaultVariation];
			if(!chosenFont.loaded) {
				switch(font.provider) {
				case 'google':
					if(typeof fontLoadSettings.custom === 'undefined') {
						fontLoadSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadSettings.externalCssDependancies.push(createCssUrl(font.provider, chosenFont.collectionId));
					fontLoadSettings.custom.families.push(fontDetails.cssFontFamily);
					return fontLoadSettings;

				case 'typekit':
					if(typeof fontLoadSettings.typekit === 'undefined') {
						fontLoadSettings.typekit = {
							webFonts: []
						};
					}
					var addNew = true;
					// Make sure the font has not already been added
					for(var i = 0, l = fontLoadSettings.typekit.webFonts.length; i < l; i++) {
						if(fontLoadSettings.typekit.webFonts[i].id === fontDetails.typekitId) {
							addNew = false;
							fontLoadSettings.typekit.webFonts[i].variations.push(minifyStyleWeight(chosenFont["font-style"], chosenFont["font-weight"]));
						}
					}
					// If not already added, add the font details
					if(addNew) {
						fontLoadSettings.typekit.webFonts.push({
							id: fontDetails.typekitId,
							variations: [minifyStyleWeight(chosenFont["font-style"], chosenFont["font-weight"])],
							css_name: fontDetails.cssFontFamily,
							subset: app.config.webFont.typekit.loader.subset,
						});
					}
					return fontLoadSettings;

				case 'fontdeck':
					if(typeof fontLoadSettings.custom === 'undefined') {
						fontLoadSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadSettings.externalCssDependancies.push(createCssUrl(font.provider, chosenFont.collectionId));
					var cssFontFamily = fontDetails.variation[fontDetails.defaultVariation].cssFontFamily;
					if(cssFontFamily !== null && typeof cssFontFamily !== 'undefined' && cssFontFamily !== '') {
						fontLoadSettings.custom.families.push(cssFontFamily);
					}
					return fontLoadSettings;

				case 'monotype':
					if(typeof fontLoadSettings.custom === 'undefined') {
						fontLoadSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadSettings.externalCssDependancies.push(createCssUrl(font.provider, chosenFont.fontId));
					var cssFontFamily = fontDetails.variation[fontDetails.defaultVariation].cssFontFamily;
					if(cssFontFamily !== null && typeof cssFontFamily !== 'undefined' && cssFontFamily !== '') {
						fontLoadSettings.custom.families.push(cssFontFamily);
					}
					return fontLoadSettings;

				case 'myfonts':
					if(typeof fontLoadSettings.custom === 'undefined') {
						fontLoadSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadSettings.externalCssDependancies.push(createCssUrl(font.provider, chosenFont.collectionId));
					var cssFontFamily = fontDetails.variation[fontDetails.defaultVariation].cssFontFamily;
					if(cssFontFamily !== null && typeof cssFontFamily !== 'undefined' && cssFontFamily !== '') {
						fontLoadSettings.custom.families.push(cssFontFamily);
					}
					return fontLoadSettings;

				case 'webtype':
					if(typeof fontLoadSettings.custom === 'undefined') {
						fontLoadSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadSettings.externalCssDependancies.push(createCssUrl(font.provider, chosenFont.collectionId));
					fontLoadSettings.custom.families.push(fontDetails.cssFontFamily);
					return fontLoadSettings;

				case 'system':
					return fontLoadSettings;

				default:
					var fontString;
					try {
						fontString = JSON.stringify(font);
					} catch(e) {
						fontString = 'Unable to stringify font object';
					}
					// EH temp raise
					ErrorHandler.raise({
						msg: 'Unsupported provider "' + font.provider + '" for font "' + font.fontFamily + '"',
						data: {
							font: fontString
						}
					});

					return false;
				}
			} else {}
			return fontLoadSettings;
		};

	/**
	 * Generates the correct settings for loading a full font variation.
	 * @param {Object} font A font object {font-family, provider}.
	 * @param {String} variation String name of the variation to be loaded.
	 * @param {Object} fontLoadVariationSettings Current settings object for the WebFont loader.
	 * @return {object} modified current settings object.
	 */
	var settingsFontLoadVariationMax = function(font, variation, fontLoadVariationSettings) {
			var fontDetails = self.getFontDetails(font),
				variationDetails;

			if (!fontDetails && Object.prototype.toString.call( font.variations ) === '[object Array]') {
				var variationDetailsArray = _.getFontDetailsFromMaster(font.variations, function(variation) {
					return variation.name === variation;
				});
				if (variationDetailsArray.length === 1) {
					variationDetails = variationDetailsArray[0];
				}
			} else {
				variationDetails = fontDetails.variation[variation];
			}

			if(!variationDetails) {
				var try_default = fontDetails.defaultVariation;
				if(try_default && try_default !== variation) variationDetails = fontDetails.variation[try_default];
				if(!variationDetails && variation !== 'Normal' && try_default !== 'Normal') variationDetails = fontDetails.variation['Normal'];
				if(!variationDetails) {
					// EH temp raise
					ErrorHandler.raise({
						msg: 'variationDetails is not defined in settingsFontLoadVariationMax'
					});

					return false;
				}
			}
			if(!variationDetails.loaded) {
				switch(font.provider) {
				case 'google':
					// Do nothing - variations are already loaded
					return fontLoadVariationSettings;

				case 'typekit':
					if(typeof fontLoadVariationSettings.typekit === 'undefined') {
						fontLoadVariationSettings.typekit = {
							webFonts: []
						};
					}
					var addNew = true;
					// Make sure the font has not already been added
					for(var i = 0, l = fontLoadVariationSettings.typekit.webFonts.length; i < l; i++) {
						if(fontLoadVariationSettings.typekit.webFonts[i].id === fontDetails.typekitId) {
							addNew = false;
							fontLoadVariationSettings.typekit.webFonts[i].variations.push(minifyStyleWeight(variationDetails["font-style"], variationDetails["font-weight"]));
						}
					}
					// If not already added, add the font details
					if(addNew) {
						fontLoadVariationSettings.typekit.webFonts.push({
							id: fontDetails.typekitId,
							variations: [minifyStyleWeight(variationDetails["font-style"], variationDetails["font-weight"])],
							css_name: fontDetails.cssFontFamily,
							subset: app.config.webFont.typekit.loader.subset,
						});
					}
					return fontLoadVariationSettings;

				case 'fontdeck':
					if(typeof fontLoadVariationSettings.custom === 'undefined') {
						fontLoadVariationSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadVariationSettings.externalCssDependancies.push(createCssUrl(font.provider, variationDetails.collectionId));
					fontLoadVariationSettings.custom.families.push(variationDetails.cssFontFamily);
					return fontLoadVariationSettings;

				case 'monotype':
					if(typeof fontLoadVariationSettings.custom === 'undefined') {
						fontLoadVariationSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadVariationSettings.externalCssDependancies.push(createCssUrl(font.provider, variationDetails.collectionId));
					fontLoadVariationSettings.custom.families.push(variationDetails.cssFontFamily);
					return fontLoadVariationSettings;

				case 'myfonts':
					if(typeof fontLoadVariationSettings.custom === 'undefined') {
						fontLoadVariationSettings.custom = {
							families: [],
							urls: [ /*Empty - leave to URL loading to me*/ ]
						};
					}
					fontLoadVariationSettings.externalCssDependancies.push(createCssUrl(font.provider, variationDetails.collectionId));
					fontLoadVariationSettings.custom.families.push(variationDetails.cssFontFamily);
					return fontLoadVariationSettings;

				case 'webtype':
					// Do nothing - variations are already loaded
					return fontLoadVariationSettings;

				case 'system':
					return fontLoadVariationSettings;

				default:
					var fontString;
					try {
						fontString = JSON.stringify(font);
					} catch(e) {
						fontString = 'Unable to stringify font object';
					}
					// EH temp raise
					ErrorHandler.raise({
						msg: 'Unsupported provider "' + font.provider + '" for font "' + font.fontFamily + '"',
						data: {
							font: fontString
						}
					});

					return false;
				}
			}
			return fontLoadVariationSettings;
		};


	var loadExternalCssDependancies = function(cssUrlList) {
			var head = $('head');
			for(var i = 0, l = cssUrlList.length; i < l; i++) {
				// If you want a speed increase, use ids instead
				if(head.children('link[href="' + cssUrlList[i] + '"]').length === 0) {
					head.append('<link href="' + cssUrlList[i] + '" rel="stylesheet" />');
				}
			}
		};


	var getFontDetailsFromMaster = function(font, callback) {
			// Check we have the right data
			if(!font.provider || !font.fontFamily) {
				return false;
			}

			$.ajax({
				url: '//' + app.config.masterFontList.domain,
				data: {
					ACT: app.config.masterFontList.retrieveFontDetails.actionId,
					provider: font.provider,
					font_family: font.fontFamily,
					font_id: font.id
				},
				success: function(data) {
					fontDetailsFromMasterApi.success(data, font, callback);
				},
				error: function() {
					fontDetailsFromMasterApi.error(callback);
				},
				dataType: 'text',
				type: 'POST',
				timeout: 5000
			});

		};


	var fontDetailsFromMasterApi = {

		success: function(data, font, callback) {
			// Interpret response
			try {
				var response = JSON.parse(data);
			} catch(e) {
				ErrorHandler.raise({
					data: {
						url: '//' + app.config.masterFontList.domain,
						payload: {
							ACT: app.config.masterFontList.retrieveFontDetails.actionId,
							provider: font.provider,
							font_family: font.fontFamily
						},
					},
					level: 'e',
					msg: 'AJAX call to font master list returned invalid JSON'
				});
				callback(false);
				return;
			}

			if(response.status !== 'success' && font.provider === 'system') {
				var buildResponse = generateBaseFontEntry(font.cssFontFamily);
				if(buildResponse) {
					response = {
						"success": true,
						"status": "success",
						"font": {}
					}
					response.font[font.cssFontFamily] = buildResponse;
				}
			}
			// Make sure status was good
			if(response.status !== 'success') {
				ErrorHandler.raise({
					level: 'w',
					msg: 'FontManager::fontDetailsFromMasterApi returned status => failure'
				});
				return;
			}

			// check response is valid
			var fontDetails = response.font[font.fontFamily];
			if(typeof fontDetails !== 'undefined') {
				// Add to availableFonts
				if(typeof availableFonts[font.fontFamily] === 'undefined') {
					availableFonts[font.fontFamily] = {
						providers: {}
					};
				}
				availableFonts[font.fontFamily].providers[font.provider] = fontDetails.providers[font.provider];
				updateGeneratedViews(font, fontDetails);
				callback(fontDetails);
			} else {
				callback(false);
			}
		},

		error: function(callback) {
			callback(false);
		}

	};

	// ----- Helper functions ----------------
	var generateViews = function(availableFontList) {

			var fontPhoneBook = {};
			var collectionPhoneBook = {};
			var fontList = [];
			var providerList = {};
			var variationPhoneBook = {};
			var googleFontListString = '';

			_.each(availableFontList, function(fontDetails, fontName) {
				_.each(fontDetails.providers, function(providerDetails, providerName) {
					providerList[providerName] = true;
					if(providerName === 'google') {
						googleFontListString += fontName.replace(/\s/g, '+') + ':';
					}
					fontPhoneBook[providerDetails.cssFontFamily] = {
						fontFamily: fontName,
						provider: providerName
					};
					var fontListEntry = {
						fontFamily: fontName,
						provider: providerName,
						cssFontFamily: providerDetails.cssFontFamily,
						preview: providerDetails.preview || {}
					};

					// A font has OpenType features if it has any values for features, swashes or stylesets.
					fontListEntry.hasOpentypeFeatures = false;
					if(providerDetails && typeof providerDetails !== 'undefined' && providerDetails instanceof Object) {
						var opentype = providerDetails.opentype || [];
						var opentypeFeatures = opentype.features || [];
						var opentypeSwashes = opentype.swashes || [];
						var opentypeStylesets = opentype.stylesets || [];
						if(opentypeFeatures.length || opentypeSwashes.length || opentypeStylesets.length) {
							fontListEntry.hasOpentypeFeatures = true;
							fontListEntry.opentype = opentype;
						}
					}

					_.each(providerDetails.variation, function(variationDetails, variationName) {
						if(providerName === 'google') {
							googleFontListString += variationDetails['font-weight'] + '' + (variationDetails['font-style'] !== 'normal' ? variationDetails['font-style'] : '') + ',';
						}
						// Catch FontDeck fonts
						if(variationName === providerDetails.defaultVariation && typeof variationDetails.cssFontFamily !== 'undefined' && variationDetails.cssFontFamily !== '') {
							fontListEntry.cssFontFamily = variationDetails.cssFontFamily;
						}
						if(typeof variationDetails.cssFontFamily !== 'undefined') {
							fontPhoneBook[variationDetails.cssFontFamily] = fontPhoneBook[providerDetails.cssFontFamily];
						}
						if(typeof variationDetails.collectionId !== 'undefined') {
							if(typeof collectionPhoneBook[variationDetails.collectionId] === 'undefined') {
								collectionPhoneBook[variationDetails.collectionId] = [];
							}
							collectionPhoneBook[variationDetails.collectionId].push({
								fontFamily: fontName,
								provider: providerName,
								variation: variationName
							});
						}
						if(typeof variationDetails.cssFontFamily !== 'undefined' && variationDetails.cssFontFamily !== '') {
							var lookupCssFontFamily = variationDetails.cssFontFamily;
						} else {
							var lookupCssFontFamily = providerDetails.cssFontFamily;
						}
						variationPhoneBook[lookupCssFontFamily + '' + variationDetails['font-weight'] + '' + variationDetails['font-style']] = variationName;
					});
					if(providerName === 'google') {
						googleFontListString = googleFontListString.slice(0, -1) + '|';
					}
					fontList.push(fontListEntry);
				});
			});

			var fontProviders;
			if(typeof fontProviderCounts === 'object') {
				fontProviders = _.sortBy(_.filter(_.keys(fontProviderCounts), function(providerName) {
					return providerName !== 'staff-pics' && providerName !== 'all';
				}), function(providerName) {
					return providerName;
				});
			}

			return {
				// cssFontFamily to Font family and provider
				reverseFontLookup: fontPhoneBook,
				// collectionId to Font family, provider and variation name
				reverseCollectionLookup: collectionPhoneBook,
				// cssFontFamily + fontWeight + fontStyle to variation name
				reverseVariationLookup: variationPhoneBook,
				// List of font font details
				fontsAvailable: _.sortBy(fontList, function(data) {
					return data.fontFamily;
				}),
				// Generated google collection id
				googleCollectionId: googleFontListString.slice(0, -1),
				// List of font providers
				fontProviders: fontProviders,
				// How many fonts are part of each provider
				fontProviderCounts: fontProviderCounts
			};
		};
	var generatedViews = generateViews(availableFonts);
	this.generatedViews = generatedViews;
	this.generateViews = generateViews;

	var updateGeneratedViews = function(font, fontDetails) {
			var fontObject = {};
			fontObject[font.fontFamily] = fontDetails;
			var newGeneratedView = generateViews(fontObject);

			_.extend(generatedViews.reverseFontLookup, newGeneratedView.reverseFontLookup);

			_.extend(generatedViews.reverseVariationLookup, newGeneratedView.reverseVariationLookup);

			// Need to make sure nothing else using the same collection exists
			var collectionKey = _.keys(newGeneratedView.reverseCollectionLookup)[0];
			if(typeof collectionKey !== 'undefined') {
				if(typeof generatedViews.reverseCollectionLookup[collectionKey] === 'undefined') {
					generatedViews.reverseCollectionLookup[collectionKey] = {};
				}
				_.extend(generatedViews.reverseCollectionLookup[collectionKey], newGeneratedView.reverseCollectionLookup[collectionKey]);
			}

			// ### Does this need sorted? Can we insert at the correct spot?
			generatedViews.googleCollectionId = '';
			generatedViews.fontsAvailable.push(newGeneratedView.fontsAvailable[0]);

			if(newGeneratedView.googleCollectionId !== "") {
				if(generatedViews.googleCollectionId) {
					generatedViews.googleCollectionId += '|';
				}
				generatedViews.googleCollectionId += newGeneratedView.googleCollectionId;
			}

			// Look through and make sure the provider is listed
			if(newGeneratedView.fontProviders) {
				if(_.indexOf(generatedViews.fontProviders, newGeneratedView.fontProviders[0]) === -1) {
					generatedViews.fontProviders.push(newGeneratedView.fontProviders[0]);
				}
			}

			app.eventAggregator.trigger('updated:font-manager:font-list');
		};

	var setFontLoaded = function(cssFontFamily, fontDescription, identificationDetails) {
			// A collection has been loaded, set all fonts in the collection to true
			if(identificationDetails && typeof identificationDetails.collectionId !== 'undefined') {
				var loadedCollectionFonts = generatedViews.reverseCollectionLookup[identificationDetails.collectionId];
				_.each(loadedCollectionFonts, function(font) {
					availableFonts[font.fontFamily].providers[font.provider].variation[font.variation].loaded = true;
				});

				// A variation name has been provided, set variation to loaded
			} else if(identificationDetails && typeof identificationDetails.variationName !== 'undefined') {
				var loadedFontDetails = generatedViews.reverseFontLookup[cssFontFamily];
				var loadedFontVariations = availableFonts[loadedFontDetails.fontFamily].providers[loadedFontDetails.provider].variation;
				// If it's a google font, then all variations are already loaded
				if(loadedFontDetails.provider === 'google') {
					_.each(loadedFontVariations, function(loadedFontVariation) {
						loadedFontVariation.loaded = true;
					});
				} else {
					if(typeof loadedFontVariations[identificationDetails.variationName] !== 'undefined') {
						loadedFontVariations[identificationDetails.variationName].loaded = true;
					}
				}
			} else {
				// If no identifiction has been provided, set the default font to loaded
				var loadedFontDetails = generatedViews.reverseFontLookup[cssFontFamily];
				var defaultVariation = availableFonts[loadedFontDetails.fontFamily].providers[loadedFontDetails.provider].defaultVariation;
				availableFonts[loadedFontDetails.fontFamily].providers[loadedFontDetails.provider].variation[defaultVariation].loaded = true;
			}
		};

	var variationDetailsSanitation = function(variations) {
			var sanitisedVariation = {};
			_.each(variations, function(variationDetails, variationName) {
				sanitisedVariation[variationName] = {
					"font-style": variationDetails["font-style"],
					"font-weight": variationDetails["font-weight"]
				};
				if(typeof variationDetails["cssFontFamily"] !== 'undefined') {
					sanitisedVariation[variationName]["cssFontFamily"] = variationDetails["cssFontFamily"];
				}
			});
			return sanitisedVariation;
		};

	var minifyStyleWeight = function(fontStyle, fontWeight) {
			return fontStyle.charAt(0) + ('' + fontWeight).slice(0, 1)
		};

	var lengthenMinifiedStyleWeight = function(minifiedStyleWeight) {
			var fontDescriptionPieces = /([a-zA-z]+)([0-9]+)/.exec(minifiedStyleWeight);
			var style = 'unknown';
			var weight = 'unknown';
			if(fontDescriptionPieces.length === 3) {
				style = fontDescriptionPieces[1];
				switch(style) {
				case 'n':
					style = 'normal';
					break;
				case 'i':
					style = 'italic';
					break;
				default:
					style = 'unknown';
				}
				weight = fontDescriptionPieces[2] + '00';
			}
			return {
				style: style,
				weight: weight
			};
		};

	var createCssUrl = function(provider, collectionId) {
			switch(provider) {
			case 'google':
				return app.config.webFont.google.cssUrl + generatedViews.googleCollectionId + app.config.webFont.google.cssExtension;
			case 'fontdeck':
				return app.config.webFont.fontdeck.cssUrl + collectionId.split('{domain}').join(app.config.domain) + app.config.webFont.fontdeck.cssExtension;
			case 'monotype':
				return app.config.webFont.monotype.cssUrl + collectionId + app.config.webFont.monotype.cssExtension;
			case 'myfonts':
				return app.config.webFont.myfonts.cssUrl + collectionId + app.config.webFont.myfonts.cssExtension;
			case 'webtype':
				return app.config.webFont.webtype.cssUrl + collectionId + app.config.webFont.webtype.cssExtension;
			default:
				return '';
			}
		};

	var retrieveCollectionId = function(provider, cssUrl) {
			switch(provider) {
			case 'fontdeck':
				return cssUrl.split(app.config.webFont.fontdeck.cssUrl).join('').split(app.config.domain).join('{domain}').split(app.config.webFont.fontdeck.cssExtension).join('');
			case 'monotype':
				return cssUrl.split(app.config.webFont.monotype.cssUrl).join('').split(app.config.webFont.monotype.cssExtension).join('');
			case 'webtype':
				return cssUrl.split(app.config.webFont.webtype.cssUrl).join('').split(app.config.webFont.webtype.cssExtension).join('');
			default:
				return '';
			}
		};

	var generateBaseFontEntry = function(cssFontFamily, provider) {
			if(typeof cssFontFamily === 'undefined') {
				return false;
			}
			if(typeof provider === 'undefined') {
				provider = 'system';
			}
			try {
				return JSON.parse('{"providers":{"' + provider + '":{"cssFontFamily":"' + cssFontFamily + '","preview":"","defaultVariation":"Normal","variation":{"Normal":{"loaded":false,"font-weight":"400","font-style":"normal"},"Normal Italic":{"loaded":false,"font-weight":"400","font-style":"italic"},"Bold":{"loaded":false,"font-weight":"600","font-style":"normal"},"Bold Italic":{"loaded":false,"font-weight":"600","font-style":"italic"}}}}}');
			} catch(e) {
				return false;
			}
		}

}
