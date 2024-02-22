// ==UserScript==
// @name         No FingerprintJs
// @version      0.2
// @description  Block browser fingerprinting attempts.
// @author       farimarwat
// @namespace    https://github.com/farimarwat
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
    //Date
    (function () {
        // Randomize Date object behavior
        if (Math.random() < 0.5) { // 50% chance of applying randomization
            const originalDateMethods = {
                getDate: window.Date.prototype.getDate,
                getDay: window.Date.prototype.getDay,
                getFullYear: window.Date.prototype.getFullYear,
                getHours: window.Date.prototype.getHours,
                getMilliseconds: window.Date.prototype.getMilliseconds,
                getMinutes: window.Date.prototype.getMinutes,
                getMonth: window.Date.prototype.getMonth,
                getSeconds: window.Date.prototype.getSeconds,
                getTimezoneOffset: window.Date.prototype.getTimezoneOffset,
                getYear: window.Date.prototype.getYear,
                setDate: window.Date.prototype.setDate,
                setFullYear: window.Date.prototype.setFullYear,
                setHours: window.Date.prototype.setHours,
                setMilliseconds: window.Date.prototype.setMilliseconds,
                setMinutes: window.Date.prototype.setMinutes,
                setMonth: window.Date.prototype.setMonth,
                setSeconds: window.Date.prototype.setSeconds,
                setYear: window.Date.prototype.setYear,
                toLocaleDateString: window.Date.prototype.toLocaleDateString,
                toLocaleString: window.Date.prototype.toLocaleString,
                toLocaleTimeString: window.Date.prototype.toLocaleTimeString,
                toString: window.Date.prototype.toString,
                toTimeString: window.Date.prototype.toTimeString
            };
    
            const randomizedDateMethod = function () {
                // Return original method result with slight random variation
                const originalResult = originalDateMethods[this.name].apply(this, arguments);
                const randomOffset = Math.floor(Math.random() * 5) - 2; // Random offset between -2 and 2
                return originalResult + randomOffset;
            };
    
            // Apply randomized methods to Date object prototype
            for (const methodName in originalDateMethods) {
                window.Date.prototype[methodName] = randomizedDateMethod;
            }
        }
    })();
    
    //Navigator
	(function () { 
        // Randomize navigator object behavior
        if (Math.random() < 0.5) { // 50% chance of applying randomization
            const originalNavigator = { ...window.navigator }; // Copy original navigator object
    
            // Define properties with randomized values
            const randomizeProperty = (property, value) => {
                if (Math.random() < 0.5) { // 50% chance of applying randomization to each property
                    window.navigator[property] = value;
                }
            };
    
            // Randomize selected properties
            randomizeProperty('hardwareConcurrency', Math.floor(Math.random() * 8)); // Randomize hardwareConcurrency between 0 and 7
            randomizeProperty('deviceMemory', `${Math.floor(Math.random() * 16)}GB`); // Randomize deviceMemory between 0GB and 15GB
            randomizeProperty('platform', Math.random() < 0.5 ? 'Win32' : 'Linux'); // Randomize platform between Win32 and Linux with equal probability
            randomizeProperty('userAgent', ''); // Empty userAgent string
            randomizeProperty('language', Math.random() < 0.5 ? 'en-US' : 'en-GB'); // Randomize language between en-US and en-GB with equal probability
    
            // Define getter functions for properties to return randomized values
            for (const property in window.navigator) {
                if (typeof window.navigator[property] === 'function') continue; // Skip methods
                Object.defineProperty(window.navigator, property, {
                    get: () => Math.random() < 0.5 ? originalNavigator[property] : window.navigator[property]
                });
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