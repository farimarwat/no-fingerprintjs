// ==UserScript==
// @name         No Fingerprint
// @version      0.2
// @description  Block browser fingerprinting attempts.
// @author       Sam0230
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes     false
// @license      The Unlicense
// @namespace    https://github.com/Sam0230
// ==/UserScript==

let script = document.createElement("script");
script.textContent = "(" + (function() {
	"use strict";
	let debug = function (topOnly) {
		if (!topOnly || window === window.top) {
			// debugger;
		}
	};
	(function () {
		document.documentElement.dataset.fbscriptallow = true;
	})();
	let randomChange = function (n, m) {
		if (!m) {
			m = 0.1;
		}
		return Math.round(n + ((Math.random() - 0.5) * 2 * n * 0.3));
	};
	let setValue = function (object, propertyName, value, writable) {
		if (!writable) {
			writable = false;
		}
		Object.defineProperty(object, propertyName, {
			value: value,
			writable: writable,
			enumerable: true
		});
	};
	(function () { // Date
		window.Date.prototype.getDate					=	window.Date.prototype.getUTCDate					;
		window.Date.prototype.getDay					=	window.Date.prototype.getUTCDay						;
		window.Date.prototype.getFullYear				=	window.Date.prototype.getUTCFullYear				;
		window.Date.prototype.getHours					=	window.Date.prototype.getUTCHours					;
		window.Date.prototype.getMilliseconds			=	window.Date.prototype.getUTCMilliseconds			;
		window.Date.prototype.getMinutes				=	window.Date.prototype.getUTCMinutes					;
		window.Date.prototype.getMonth					=	window.Date.prototype.getUTCMonth					;
		window.Date.prototype.getSeconds				=	window.Date.prototype.getUTCSeconds					;
		window.Date.prototype.getTimezoneOffset			=	function () { return 0; }							;
		window.Date.prototype.getYear					=	function () { return this.getFullYear - 1900; }		;
		window.Date.prototype.setDate					=	window.Date.prototype.setUTCDate					;
		window.Date.prototype.setFullYear				=	window.Date.prototype.setUTCFullYear				;
		window.Date.prototype.setHours					=	window.Date.prototype.setUTCHours					;
		window.Date.prototype.setMilliseconds			=	window.Date.prototype.setUTCMilliseconds			;
		window.Date.prototype.setMinutes				=	window.Date.prototype.setUTCMinutes					;
		window.Date.prototype.setMonth					=	window.Date.prototype.setUTCMonth					;
		window.Date.prototype.setSeconds				=	window.Date.prototype.setUTCSeconds					;
		window.Date.prototype.setYear					=	function (n) { return this.setFullYear(n + 1900); }	;
		window.Date.prototype.toLocaleDateString		=	function () { return ""; }							;
		window.Date.prototype.toLocaleString			=	function () { return ""; }							;
		window.Date.prototype.toLocaleTimeString		=	function () { return ""; }							;
		window.Date.prototype.toString					=	function () { return ""; }							;
		window.Date.prototype.toTimeString				=	function () { return ""; }							;
	})();
	(function () { // navigator
		let a;
		let fakeNavigator = {};
	//	fakeNavigator.appCodeName						=
	//	fakeNavigator.appName							=
	//	fakeNavigator.appVersion						=
	//	fakeNavigator.platform							=
		fakeNavigator.product							=
		fakeNavigator.productSub						=
	//	fakeNavigator.userAgent							=
		fakeNavigator.vendor							=
		fakeNavigator.vendorSub							=
		a = "";
		fakeNavigator.deviceMemory						=
		fakeNavigator.hardwareConcurrency				=
		fakeNavigator.maxTouchPoints					=
		a = 0;
		fakeNavigator.bluetooth							=
		fakeNavigator.clipboard							=
		fakeNavigator.connection						=
	//	fakeNavigator.cookieEnabled						=
		fakeNavigator.credentials						=
		fakeNavigator.doNotTrack						=
		fakeNavigator.geolocation						=
		fakeNavigator.keyboard							=
		fakeNavigator.language							=
		fakeNavigator.languages							=
		fakeNavigator.locks								=
		fakeNavigator.mediaCapabilities					=
		fakeNavigator.mediaDevices						=
		fakeNavigator.mediaSession						=
	//	fakeNavigator.mimeTypes							=
		fakeNavigator.onLine							=
		fakeNavigator.permissions						=
		fakeNavigator.presentation						=
		fakeNavigator.scheduling						=
		fakeNavigator.serviceWorker						=
	//	fakeNavigator.storage							=
		fakeNavigator.usb								=
		fakeNavigator.userActivation					=
		fakeNavigator.userAgentData						=
		fakeNavigator.wakeLock							=
		fakeNavigator.webkitPersistentStorage			=
		fakeNavigator.webkitTemporaryStorage			=
		fakeNavigator.xr								=
		a = {};
		fakeNavigator.hardwareConcurrency				= 4;
		fakeNavigator.deviceMemory						= "undefined";
	//	fakeNavigator.platform 							= "Win32";
		fakeNavigator.plugins							= [];
		setValue(fakeNavigator.plugins, "item",			function item() { return null; },		false);
		setValue(fakeNavigator.plugins, "namedItem",	function namedItem() { return null; },	false);
		setValue(fakeNavigator.plugins, "refresh",		function refresh() { return null; },	false);
		for (let i in window.navigator) {
			if (fakeNavigator[i] !== undefined) {
				try {
					Object.defineProperty(window.navigator, i, {
						get: function () {
							if (fakeNavigator[i] === "undefined") {
								return undefined;
							}
							return fakeNavigator[i];
						}
					});
				} catch (e) {}
			}
		}
	})();
	(function () { // Screen size
		let screenSize = [1920, 1080];
		screen.availWidth && setValue(screen, "availWidth", screenSize[0]);
		screen.availHeight && setValue(screen, "availHeight", screenSize[1] - 40);
		screen.availLeft && setValue(screen, "availLeft", undefined, true);
		screen.availTop && setValue(screen, "availTop", undefined, true);
		screen.width && setValue(screen, "width", screenSize[0]);
		screen.height && setValue(screen, "height", screenSize[1]);
		screen.Brightness && setValue(screen, "Brightness", randomChange(screen.Brightness));
		screen.mozBrightness && setValue(screen, "mozBrightness", randomChange(screen.mozBrightness));
		screen.left && setValue(screen, "left", undefined, true);
		screen.top && setValue(screen, "top", undefined, true);
		screen.enabled && setValue(screen, "enabled", undefined);
		screen.mozEnabled && setValue(screen, "mozEnabled", undefined);
		screen.pixelDepth && setValue(screen, "pixelDepth", 32);
		screen.colorDepth && setValue(screen, "colorDepth", 32);
	})();
	(function () { // Debugger panel size
		let n = Math.round(71.5 + (Math.random() * 15)), wChanged = false, wValue, hChanged = false, hValue;
		Object.defineProperty(window, "outerWidth", {
			get: function () {
				if (!wChanged) {
					return window.innerWidth;
				}
				return wValue;
			},
			set: function (value) {
				wChanged = true;
				wValue = value;
			}
		});
		Object.defineProperty(window, "outerHeight", {
			get: function () {
				if (!hChanged) {
					return window.innerHeight + n;
				}
				return hValue;
			},
			set: function (value) {
				hChanged = true;
				hValue = value;
			}
		});
	})();
	(function () { // AudioContext
		let origGetFloatFrequencyData = window.AnalyserNode.prototype.getFloatFrequencyData;
		window.AnalyserNode.prototype.getFloatFrequencyData = function getFloatFrequencyData(array) {
			let ret = origGetFloatFrequencyData.apply(this, arguments);
			for (let i = 0; i < array.length; i++) {
				array[i] = array[i] + Math.random() * 0.2;
			}
			return ret;
		};
		window.AnalyserNode.prototype.getFloatFrequencyData.toString = origGetFloatFrequencyData.toString.bind(origGetFloatFrequencyData);
		let origGetChannelData = window.AudioBuffer.prototype.getChannelData;
		window.AudioBuffer.prototype.getChannelData = function getChannelData() {
			let ret = origGetChannelData.apply(this, arguments);
			for (let i = 0; i < ret.length; i++) {
				ret[i] = ret[i] + Math.random() * 0.0001;
			}
			return ret;
		};
		window.AudioBuffer.prototype.getChannelData.toString = origGetChannelData.toString.bind(origGetChannelData);
	})();
	(function () { // Canvas
		let origGetContext		= HTMLCanvasElement.prototype.getContext;
		let origGetImageData	= CanvasRenderingContext2D.prototype.getImageData;
		let origReadPixels1		= WebGLRenderingContext.prototype.readPixels;
		let origReadPixels2		= WebGL2RenderingContext.prototype.readPixels;
		let origToDataURL		= HTMLCanvasElement.prototype.toDataURL;
		let origToBlob			= HTMLCanvasElement.prototype.toBlob;
		let getImageData = function getImageData() {
			let imageData = origGetImageData.apply(this, arguments);
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			return imageData;
		};
		CanvasRenderingContext2D.prototype.getImageData = getImageData;
		CanvasRenderingContext2D.prototype.getImageData.toString = origGetImageData.toString.bind(origGetImageData);
		let origIsPointInPath = CanvasRenderingContext2D.prototype.isPointInPath;
		CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath() {
			return false;
		};
		CanvasRenderingContext2D.prototype.isPointInPath.toString = origIsPointInPath.toString.bind(origIsPointInPath);
		let readPixels1 = function readPixels() {
			origReadPixels1.apply(this, arguments);
			let pixels = arguments[6];
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
		};
		WebGLRenderingContext.prototype.readPixels = readPixels1;
		WebGLRenderingContext.prototype.readPixels.toString = origReadPixels1.toString.bind(origReadPixels1);
		let readPixels2 = function readPixels() {
			origReadPixels2.apply(this, arguments);
			let pixels = arguments[6];
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
		};
		WebGL2RenderingContext.prototype.readPixels = readPixels2;
		WebGL2RenderingContext.prototype.readPixels.toString = origReadPixels2.toString.bind(origReadPixels2);
		let toDataURL = function toDataURL() {
			let context = origGetContext.apply(this, ["2d"]);
			let imageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), origImageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), ret;
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			context.putImageData(imageData, 0, 0);
			ret = origToDataURL.apply(this, arguments);
			context.putImageData(origImageData, 0, 0);
			return ret;
		};
		let hookWebGLGetParameter = function (target) {
			let random = {
				"item": function (e) {
					let rand = e.length * Math.random();
					return e[Math.floor(rand)];
				},
				"number": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						tmp.push(Math.pow(2, power[i]));
					}
					return random.item(tmp);
				},
				"int": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						let n = Math.pow(2, power[i]);
						tmp.push(new Int32Array([n, n]));
					}
					return random.item(tmp);
				},
				"float": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						let n = Math.pow(2, power[i]);
						tmp.push(new Float32Array([1, n]));
					}
					return random.item(tmp);
				}
			};
			let origGetParameter = target.getParameter;
			target.getParameter = function (a1) {
				if (a1 === this.STENCIL_BITS							) { return 0;																						}
				if (a1 === this.DEPTH_BITS								) { return 24;																						}
				if (a1 === this.MAX_VARYING_VECTORS						) { return 30;																						}
				if (a1 === this.VENDOR									) { return "WebKit";																				}
				if (a1 === 37445										) { return "Google Inc.";																			}
				if (a1 === this.RENDERER								) { return "WebKit WebGL";																			}
				if (a1 === this.MAX_TEXTURE_SIZE						) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_VERTEX_UNIFORM_VECTORS				) { return random.number([12, 13]);																	}
				if (a1 === this.MAX_CUBE_MAP_TEXTURE_SIZE				) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_RENDERBUFFER_SIZE					) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_VIEWPORT_DIMS						) { return random.int([13, 14, 15]);																}
				if (a1 === this.ALPHA_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.BLUE_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.GREEN_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.RED_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === 34047										) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_TEXTURE_IMAGE_UNITS					) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_VERTEX_ATTRIBS						) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_VERTEX_TEXTURE_IMAGE_UNITS			) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_COMBINED_TEXTURE_IMAGE_UNITS		) { return random.number([4, 5, 6, 7, 8]);															}
				if (a1 === this.MAX_FRAGMENT_UNIFORM_VECTORS			) { return random.number([10, 11, 12, 13]);															}
				if (a1 === this.ALIASED_LINE_WIDTH_RANGE				) { return random.float([0, 10, 11, 12, 13]);														}
				if (a1 === this.ALIASED_POINT_SIZE_RANGE				) { return random.float([0, 10, 11, 12, 13]);														}
				if (a1 === 37446										) { return random.item(["Graphics", "HD Graphics", "Intel(R) HD Graphics"]);						}
				if (a1 === this.VERSION									) { return random.item(["WebGL 1.0", "WebGL 1.0 (OpenGL)", "WebGL 1.0 (OpenGL Chromium)"]);			}
				if (a1 === this.SHADING_LANGUAGE_VERSION				) { return random.item(["WebGL", "WebGL GLSL", "WebGL GLSL ES", "WebGL GLSL ES (OpenGL Chromium"]);	}					
				return origGetParameter.apply(this, arguments);
			};
			target.getParameter.toString = origGetParameter.toString.bind(origGetParameter);
		};
		hookWebGLGetParameter(WebGLRenderingContext.prototype);
		hookWebGLGetParameter(WebGL2RenderingContext.prototype);
		HTMLCanvasElement.prototype.toDataURL = toDataURL;
		HTMLCanvasElement.prototype.toDataURL.toString = origToDataURL.toString.bind(origToDataURL);
		let toBlob = function toBlob(callback, type, encoderOptions) {
			let context = origGetContext.apply(this, ["2d"]);
			let imageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), imageDataOrig = origGetImageData.apply(context, [0, 0, this.height, this.width]);
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			context.putImageData(imageData, 0, 0);
			return origToBlob.apply(this, [function (blob) {
				context.putImageData(imageDataOrig, 0, 0);
				callback(blob);
			}, type, encoderOptions]);
		};
		HTMLCanvasElement.prototype.toBlob = toBlob;
		HTMLCanvasElement.prototype.toBlob.toString = origToBlob.toString.bind(origToBlob);
	})();
	(function () { // Intl
		window.Intl = undefined;
	})();
	(function () { // Fonts
		let offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
		let origOffsetWidthGetter = offsetWidth.get;
		offsetWidth.get = function offsetWidth() {
			let ret = origOffsetWidthGetter.apply(this, arguments);
			if (ret != 0) {
				if (Math.random() >= 0.9) {
					ret += Math.floor((Math.random() >= 0.5 ? -1 : 1) * Math.random() + Math.random());
				}
			}
			return ret;
		};
		offsetWidth.get.toString = origOffsetWidthGetter.toString.bind(origOffsetWidthGetter);
		Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth);
		let offsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
		let origOffsetHeightGetter = offsetHeight.get;
		offsetHeight.get = function offsetHeight() {
			let ret = origOffsetWidthGetter.apply(this, arguments);
			if (ret != 0) {
				if (Math.random() >= 0.9) {
					ret += Math.floor((Math.random() >= 0.5 ? -1 : 1) * Math.random() + Math.random());
				}
			}
			return ret;
		};
		offsetHeight.get.toString = origOffsetHeightGetter.toString.bind(origOffsetHeightGetter);
		Object.defineProperty(HTMLElement.prototype, "offsetHeight", offsetHeight);
	})();
	//
//Canvas
(() => {
    HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
        // Original base64-encoded PNG image data header
        const base64Header = 'data:image/png;base64,';
        
        // Original base64 data for demonstration, not used in randomization
        const originalBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA' +
            'AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO' +
            '9TXL0Y4OHwAAAABJRU5ErkJggg==';
        
        // Calculate the length of the data to be randomized, excluding the header
        const dataLength = originalBase64Data.length - base64Header.length;
        
        // Define the base64 character set
        const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        
        // Generate a new random base64 string of the same length as the original data
        let randomBase64Data = '';
        for (let i = 0; i < dataLength; i++) {
            randomBase64Data += base64Chars.charAt(Math.floor(Math.random() * base64Chars.length));
        }
        
        // Combine the header with the new random base64 data
        return base64Header + randomBase64Data;
    };
})();

//WebGl
(() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    HTMLCanvasElement.prototype.getContext = function(type, options) {
        const context = originalGetContext.call(this, type, options);

        if (type !== "webgl" && type !== "experimental-webgl") {
            return context;
        }

        // Helper functions to introduce randomness
        const randomizeArray = (arr) => arr.map(item => item * (0.95 + Math.random() * 0.1));
        const randomizeValue = (value, min = 0.95, max = 1.05) => typeof value === 'number' ? value * (min + Math.random() * (max - min)) : value;
        const getRandomVendorRenderer = () => {
            const vendors = ["NVIDIA Corporation", "Intel Inc.", "AMD", "WebKit"];
            const renderers = ["GeForce GTX 1050/PCIe/SSE2", "Intel(R) HD Graphics", "AMD Radeon (TM) R9 390", "Mali-T760"];
            return {
                vendor: vendors[Math.floor(Math.random() * vendors.length)],
                renderer: renderers[Math.floor(Math.random() * renderers.length)]
            };
        };

        const wrapFunction = (originalFunction, methodName) => {
            return function(...args) {
                const result = originalFunction.apply(this, args);

                switch (methodName) {
                    case 'getParameter':
                        const randomParams = getRandomVendorRenderer();
                        switch (args[0]) {
                            case context.MAX_TEXTURE_SIZE:
                            case context.MAX_CUBE_MAP_TEXTURE_SIZE:
                                return randomizeValue(result, 2048, 4096);
                            case context.RENDERER:
                                return randomParams.renderer;
                            case context.VENDOR:
                                return randomParams.vendor;
                        }
                        break;
                    case 'getExtension':
                        if (args[0].includes('debug')) {
                            return null;
                        }
                        break;
                    case 'readPixels':
                        // Optionally, modify the pixels parameter to introduce noise or other alterations
                        break;
                }

                return result;
            };
        };

        const methodsToIntercept = ['getParameter', 'getExtension', 'getShaderPrecisionFormat', 'getSupportedExtensions', 'readPixels'];

        methodsToIntercept.forEach(methodName => {
            if (context[methodName]) {
                context[methodName] = wrapFunction(context[methodName].bind(context), methodName);
            }
        });

        return context;
    };
})();


//Navigator
(()=> {
    // Preserve the original navigator properties in case we need them
    const originalNavigator = navigator;

    // Function to generate a random value within a range or array
    const randomize = (options) => Array.isArray(options) ? options[Math.floor(Math.random() * options.length)] : Math.floor(Math.random() * (options.max - options.min + 1)) + options.min;

    // Create a proxy to override the navigator properties
    const spoofedNavigator = new Proxy(originalNavigator, {
        get(target, prop) {
            switch (prop) {
                case 'platform':
                    return randomize(['Win32', 'MacIntel', 'Linux x86_64']);
                case 'userAgent':
                    return `Mozilla/5.0 (${randomize(['Windows NT 10.0; Win64; x64', 'Macintosh; Intel Mac OS X 10_15_7', 'X11; Linux x86_64'])}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomize({min: 70, max: 90})}.0.${randomize({min: 3538, max: 3987})}.${randomize({min: 80, max: 110})} Safari/537.36`;
                case 'language':
                case 'languages':
                    return randomize(['en-US', 'fr-FR', 'de-DE']);
                case 'hardwareConcurrency':
                    return randomize({min: 2, max: 16});
                case 'deviceMemory':
                    return randomize([4, 8, 16]);
                case 'vendor':
                    return randomize(['Google Inc.', 'Apple Computer, Inc.', '']);
                case 'maxTouchPoints':
                    return randomize({min: 0, max: 10});
                // Properties that should not be spoofed to avoid breaking sites can be returned as is
                case 'onLine':
                case 'cookieEnabled':
                    return target[prop];
                // Add more properties to spoof or handle as needed
                default:
                    // Return the original property for everything else
                    return target[prop];
            }
        }
    });

    // Replace the global navigator object with the spoofed one
    Object.defineProperty(window, 'navigator', {
        value: spoofedNavigator,
        writable: false
    });
})();

	//
(()=>{
	// Spoof User-Agent
Object.defineProperty(navigator, 'userAgent', {
	value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
	writable: false,
  });
  
  // Spoof Screen Resolution
  Object.defineProperty(screen, 'width', {
	get: () => Math.floor(Math.random() * 1000) + 1024,
  });
  Object.defineProperty(screen, 'height', {
	get: () => Math.floor(Math.random() * 500) + 768,
  });
  Object.defineProperty(screen, 'colorDepth', {
	get: () => [24, 32][Math.floor(Math.random() * 2)],
  });
  
  // Spoof Plugins and MimeTypes
  const fakePluginArray = {
	0: { name: 'Fake Plugin', description: 'Fake Plugin Description', filename: 'fake.plugin', length: 0 },
	length: 1,
	item: function(index) { return this[0]; },
	namedItem: function(id) { return this[0]; },
  };
  Object.defineProperty(navigator, 'plugins', {
	get: () => fakePluginArray,
  });
  Object.defineProperty(navigator, 'mimeTypes', {
	get: () => fakePluginArray,
  });
  
  // Protect against Canvas Fingerprinting
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function() {
	const context = getContext.apply(this, arguments);
	if (arguments[0] === '2d') {
	  const originalGetImageData = context.getImageData;
	  context.getImageData = function() {
		const imageData = originalGetImageData.apply(this, arguments);
		for (let i = 0; i < imageData.data.length; i += 4) {
		  // Modify the pixel data
		  imageData.data[i] = imageData.data[i] ^ 25; // XOR operation with 25
		  imageData.data[i+1] = imageData.data[i+1] ^ 25;
		  imageData.data[i+2] = imageData.data[i+2] ^ 25;
		}
		return imageData;
	  };
	}
	return context;
  };
  
})();
	let debuggerHook = function (n, m) {
		try {
			let orig = window[n].prototype[m];
			let hook = function () {
				debug();
				try {
					return orig.apply(this, arguments);
				} catch (e) {}
			};
			Object.defineProperty(hook, "name", { value: orig.name, writable: false, enumerable: false, configurable: true });
			window[n].prototype[m] = hook;
			window[n].prototype[m].toString = orig.toString.bind(orig);
		} catch (e) {}
	};
	let debuggerHookAll = function (n) {
		try {
			for (let i in window[n].prototype) {
				try {
					if (window[n].prototype[i] instanceof Function) {
						debuggerHook(n, i);
					}
				} catch (e) {}
			}
		} catch (e) {}
	};
	debug(1);
	try {
		debuggerHookAll("AudioContext");
		debuggerHookAll("BaseAudioContext");
		debuggerHookAll("OfflineAudioCompletionEvent");
		debuggerHookAll("OfflineAudioContext");
		debuggerHookAll("AudioBuffer");
		debuggerHookAll("AnalyserNode");
		debuggerHookAll("HTMLCanvasElement");
		debuggerHookAll("CanvasRenderingContext2D");
		debuggerHookAll("WebGLRenderingContext");
		debuggerHookAll("WebGL2RenderingContext");
	} catch (e) {}
}) + ")()";
document.documentElement.prepend(script);