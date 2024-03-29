//@script-name: no-fingerprintjs
//@script-version: 1.0

//uncomment for extension
// let script = document.createElement("script");
// script.textContent = "(" + (function () {

"use strict";
const KEY_CANVAS_HEIGHT = "canvasHeight";
const KEY_CANVAS_WIDTH = "canvasWidth";
const KEY_CANVAS_TEXT_X = "canvasTextX";
const KEY_CANVAS_TEXT_Y = "canvasTextY";
const KEY_CANVAS_FONT_SIZE = "canvasFontSize";
const KEY_WEBGL_VERSION = "webglVersion";
const KEY_WEBGL_SLV = "webglShadedLanguageVersion";
const KEY_WEBGL_VENDOR = "webglVendor";


const KEY_FONT_OFFSET_HEIGHT = "fontOffsetHeight";
const KEY_FONT_OFFSET_WIDTH = "fontOffsetWidth";
const KEY_AUDIO_TIME_OFFSET = "audioOffset";
const KEY_PLUGIN_INDEX = "pluginIndex";
const KEY_PLUGIN_NAME = "pluginName";
const KEY_USERAGENT_SEG_INDEX = "userAgentSegIndex";
const KEY_HARDWARE_CONCURRENCY = "hardwareConcurrency";
const KEY_SCREEN_WIDTH = "screenWidth";
const KEY_SCREEN_HEIGHT = "screenHeight";
const KEY_TIMEZONE = "timezone";
const KEY_TIMEZONE_OFFSET = "timezoneoffset";
const KEY_UNMASKED_VENDOR_WEBGL = "unmaskedVendorWebgl";
const KEY_UNMASKED_RENDERER_WEBGL = "unmaskedRendererWebgl";
const KEY_SPEECSYNTHESIS_VOICE = "speechVoice";
const KEY_WINDOW_DIMENSION_WIDTH = "windowDimensionWidth";
const KEY_WINDOW_DIMENSION_HEIGHT = "windowDimensionHeight";
const KEY_DARK_MODE_ENABLED = "darkModeEnabled";
const KEY_LANGUAGE = "language";
const KEY_LANGUAGES = "languages";

const RANDOMNESS = 2;
const useSessionStorage = false;


//Helper functions
function randomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
function addNoise(value, key) {
	const adjustment = getOrCreateFloatSessionValue(key, () => randomFloat(-RANDOMNESS, RANDOMNESS));
	return value + adjustment;
}
function getOrCreateFloatSessionValue(key, generator) {
	if (!useSessionStorage) {
		return generator();
	}

	const sessionKey = key;
	let value = sessionStorage.getItem(sessionKey);
	if (value === null) {
		value = generator();
		sessionStorage.setItem(sessionKey, value.toString());
	}
	return parseFloat(value);
}
function getOrCreateIntSessionValue(key, generator) {
	if (!useSessionStorage) {
		return generator();
	}
	const sessionKey = key;
	let value = sessionStorage.getItem(sessionKey);
	if (value === null) {
		value = generator();
		sessionStorage.setItem(sessionKey, value.toString());
	}
	return Number(value);
}

function getOrCreateStringSessionValue(key, generator) {
	if (!useSessionStorage) {
		return generator();
	}

	const sessionKey = key;
	let value = sessionStorage.getItem(sessionKey);
	if (value === null) {
		value = generator();
		sessionStorage.setItem(sessionKey, value.toString());
	}
	return value;
}
function getOrCreateBoolSessionValue(key, generator) {
	if (!useSessionStorage) {
		return generator();
	}
	const sessionKey = key;
	let value = sessionStorage.getItem(sessionKey);
	if (value === null) {
		value = generator();
		sessionStorage.setItem(sessionKey, value ? "true" : "false");
	} else {
		value = value === "true";
	}
	return value;
}

function generateFakePlugins() {
	const pluginsArray = [];
	pluginsArray.refresh = function () { };
	for (let i = 0; i < 10; i++) {
		pluginsArray.push({
			name: `Fake Plugin ${i + 1}`,
			description: `Fake Plugin Description ${i + 1}`,
			filename: `fakeplugin${i + 1}.dll`,
			length: 0,
			item: function (index) { return this[index]; },
			namedItem: function (name) { return this[name]; }
		});
	}
	return pluginsArray;
}
function randomCaseChangeInFirstSegment(str, key) {
	let firstSegment = str.split(' ')[0];
	if (/[a-zA-Z]/.test(firstSegment)) {
		const charPositions = [];
		for (let i = 0; i < firstSegment.length; i++) {
			if (/[a-zA-Z]/.test(firstSegment[i])) {
				charPositions.push(i);
			}
		}

		const randomPos = getOrCreateIntSessionValue(key, () => charPositions[Math.floor(Math.random() * charPositions.length)]);
		const char = firstSegment[randomPos];
		if (char === char.toUpperCase()) {
			firstSegment = firstSegment.substring(0, randomPos) + char.toLowerCase() + firstSegment.substring(randomPos + 1);
		} else {
			firstSegment = firstSegment.substring(0, randomPos) + char.toUpperCase() + firstSegment.substring(randomPos + 1);
		}
	}

	const restOfTheString = str.substring(firstSegment.length);
	return firstSegment + restOfTheString;
}
function randomCaseChangeAnySegment(str, key) {
	const segments = str.split(' ');
	const randomIndex = getOrCreateIntSessionValue(key, () => Math.floor(Math.random() * segments.length));
	if (Math.random() < 0.5) {
		segments[randomIndex] = segments[randomIndex].toLowerCase();
	} else {
		segments[randomIndex] = segments[randomIndex].toUpperCase();
	}
	return segments.join(' ');
}

function getPluginsWithFake() {
	var pluginsArray = [];
	if (navigator.userAgent.toLowerCase().indexOf("android") !== -1) {
		pluginsArray = generateFakePlugins();
	} else {
		pluginsArray = Array.from(navigator.plugins);
	}
	const index = getOrCreateFloatSessionValue(KEY_PLUGIN_INDEX, () => Math.floor(Math.random() * pluginsArray.length));
	const name = getOrCreateStringSessionValue(KEY_PLUGIN_NAME, () => pluginsArray[Math.floor(Math.random() * pluginsArray.length)].name);
	const plugin = pluginsArray[index];
	let fakePlugin = {
		name: name,
		description: plugin.description,
		filename: plugin.filename,
		// Listing the MIME types supported by the plugin
		mimeTypes: Array.from(plugin).map(mimeType => ({
			type: mimeType.type,
			description: mimeType.description,
			suffixes: mimeType.suffixes
		}))
	};
	// Add the fake plugin to the array
	pluginsArray.push(fakePlugin);
	return pluginsArray;
}
function getUserAgentRandomized() {
	return randomCaseChangeAnySegment(navigator.userAgent, KEY_USERAGENT_SEG_INDEX);
}
function getHardwareConcurrencyRandomized() {
	return getOrCreateIntSessionValue(KEY_HARDWARE_CONCURRENCY, () => {
		let baseConcurrency = navigator.hardwareConcurrency;
		let adjustmentValue = Math.floor(Math.random() * RANDOMNESS) + 1;
		let shouldIncrement = baseConcurrency === 2 || Math.random() < 0.5;

		if (!shouldIncrement && adjustmentValue >= baseConcurrency) {
			adjustmentValue = baseConcurrency - 1;
		}
		let adjustment = shouldIncrement ? adjustmentValue : -adjustmentValue;
		let randomizedConcurrency = Math.max(1, baseConcurrency + adjustment);
		return randomizedConcurrency;
	});
}
function getScreenSize() {
	let w = screen.width;
	let h = screen.height;
	w = Math.floor(addNoise(w, KEY_SCREEN_WIDTH));
	h = Math.floor(addNoise(h, KEY_SCREEN_HEIGHT));
	return {
		width: w,
		height: h
	}
}
function setValue(object, propertyName, value, writable) {
	if (!writable) {
		writable = false;
	}
	Object.defineProperty(object, propertyName, {
		value: value,
		writable: writable,
		enumerable: true
	});
};

function getRandomizedTimeZone() {
	return randomCaseChangeInFirstSegment(Intl.DateTimeFormat().resolvedOptions().timeZone, KEY_TIMEZONE);
}

function getLanguageRandomized(){
	return randomCaseChangeInFirstSegment(navigator.language,KEY_LANGUAGE);
}

function getLanguagesRandomized() {
    let languages = navigator.languages;
	const fakeLanguages = [
		"en-US", // English (United States)
		"fr",    // French
		"de",    // German
		"es",    // Spanish
		"it",    // Italian
		"pt-BR", // Portuguese (Brazil)
		"ru",    // Russian
		"ja",    // Japanese
		"ko",    // Korean
		"zh-CN"  // Chinese (China)
	];
    let randomIndex = Math.floor(Math.random() * fakeLanguages.length);
    let randomlySelected = fakeLanguages[randomIndex];
    let modified = randomCaseChangeInFirstSegment(randomlySelected, KEY_LANGUAGES);
    let modifiedLanguages = [...languages, modified];
    return modifiedLanguages;
}


//Global Vars
const pluginsRandomized = getPluginsWithFake();
const userAgentRandomized = getUserAgentRandomized();
const hardwareConcurrencyRandomized = getHardwareConcurrencyRandomized();
const screenRandomized = getScreenSize();
const timezoneRandomized = getRandomizedTimeZone();
const languageRandomized = getLanguageRandomized();
const languagesRandomized = getLanguagesRandomized();


//Canvas
(() => {
	try {
		// Spoofing canvas size
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (type, contextAttributes) {
			this.width = addNoise(this.width, KEY_CANVAS_WIDTH);
			this.height = addNoise(this.height, KEY_CANVAS_HEIGHT);
			let context = originalGetContext.call(this, type, contextAttributes);

			if (context && (type === 'webgl' || type === 'experimental-webgl' || type === 'webgl2')) {
				const originalGetParameter = context.getParameter.bind(context);
				context.getParameter = function (parameter) {
					const debugInfo = this.getExtension('WEBGL_debug_renderer_info');
					if (debugInfo && parameter === debugInfo.UNMASKED_VENDOR_WEBGL) {
						let noisedVendor = randomCaseChangeInFirstSegment(originalGetParameter(debugInfo.UNMASKED_VENDOR_WEBGL), KEY_UNMASKED_VENDOR_WEBGL);
						return noisedVendor;
					} else if (debugInfo && parameter === debugInfo.UNMASKED_RENDERER_WEBGL) {
						let noisedRenderer = randomCaseChangeInFirstSegment(originalGetParameter(debugInfo.UNMASKED_RENDERER_WEBGL), KEY_UNMASKED_RENDERER_WEBGL);
						return noisedRenderer;
					}
					return originalGetParameter(parameter);
				};
			}

			return context;
		};

		// Override fillText on the CanvasRenderingContext2D prototype
		const originalFillText = CanvasRenderingContext2D.prototype.fillText;
		CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
			let adjustedX = addNoise(x, KEY_CANVAS_TEXT_X);
			let adjustedY = addNoise(y, KEY_CANVAS_TEXT_Y);

			const fontRegex = /(\d+)(px|pt|em|%|rem)/; // Regex to extract font size and units
			const match = this.font.match(fontRegex);
			if (match) {
				const originalSize = parseInt(match[1], 10);
				const unit = match[2];
				const newSize = addNoise(originalSize, KEY_CANVAS_FONT_SIZE);
				this.font = this.font.replace(fontRegex, `${newSize}${unit}`);
			}
			// Call the original fillText with adjusted coordinates
			if (maxWidth === undefined) {
				originalFillText.call(this, text, adjustedX, adjustedY);
			} else {
				originalFillText.call(this, text, adjustedX, adjustedY, maxWidth);
			}
		};
	} catch (ex) {
		console.log("NoFingerPrint Exception(Canvas): " + ex);
	}
})();

//WebGl 
(() => {
	try {
		const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
		WebGLRenderingContext.prototype.getParameter = function (parameter) {
			const originalValue = originalGetParameter.call(this, parameter);
			switch (parameter) {
				case this.VERSION:
					let noisedVersion = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_VERSION);
					return noisedVersion;
				case this.VENDOR:
					let noisedVendor = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_VENDOR);
					return noisedVendor;
				case this.SHADING_LANGUAGE_VERSION:
					let noisedSLV = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_SLV);
					return noisedSLV;
				// case this.RENDERER:
				// 	let noisedRenderer = randomCaseChangeAnySegment(originalValue, KEY_WEBGL_RENDERER);
				// 	return noisedRenderer;
				default:
					return originalValue;
			}
		};

		// Repeat for WebGL2RenderingContext if your application uses WebGL 2
		if (typeof WebGL2RenderingContext !== 'undefined') {
			const originalGetParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;
			WebGL2RenderingContext.prototype.getParameter = function (parameter) {
				const originalValue = originalGetParameterWebGL2.call(this, parameter);
				switch (parameter) {
					case this.VERSION:
						let noisedVersion = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_VERSION);
						return noisedVersion;
					case this.VENDOR:
						let noisedVendor = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_VENDOR);
						return noisedVendor;
					case this.SHADING_LANGUAGE_VERSION:
						let noisedSLV = randomCaseChangeInFirstSegment(originalValue, KEY_WEBGL_SLV);
						return noisedSLV;
					// case this.RENDERER:
					// 	let noisedRenderer = randomCaseChangeAnySegment(originalValue, KEY_WEBGL_RENDERER);
					// 	return noisedRenderer;
					default:
						return originalValue;
				}
			};
		}
	} catch (ex) {
		console.log("NoFingerPrint Exception(WebGl): " + ex);
	}
})();

//Font
(() => {
	try {
		const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
		const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

		Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
			get() {
				return addNoise(originalOffsetWidth.get.call(this), KEY_FONT_OFFSET_WIDTH);
			}
		});

		Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
			get() {
				return addNoise(originalOffsetHeight.get.call(this), KEY_FONT_OFFSET_HEIGHT);
			}
		});
	} catch (ex) {
		console.log("NoFingerPrint Exception(Font): " + ex);
	}
})();

//Audio
(() => {
	try {
		const originalCreateOscillator = AudioContext.prototype.createOscillator;
		const originalCreateBuffer = AudioContext.prototype.createBuffer;
		const originalGetChannelData = AudioBuffer.prototype.getChannelData;

		AudioContext.prototype.createOscillator = function () {
			const oscillator = originalCreateOscillator.apply(this, arguments);
			const originalStart = oscillator.start;
			oscillator.start = function (when = 0) {
				const timeOffsetKey = 'audioTimeOffset';
				const randomTimeOffset = getOrCreateFloatSessionValue(timeOffsetKey, () => 0.0001 * Math.random());
				return originalStart.call(this, when + randomTimeOffset);
			};
			return oscillator;
		};

		AudioContext.prototype.createBuffer = function (channels, length, sampleRate) {
			const buffer = originalCreateBuffer.apply(this, arguments);
			return buffer;
		};

		AudioBuffer.prototype.getChannelData = function (channel) {
			const data = originalGetChannelData.apply(this, arguments);
			const noiseValue = getOrCreateFloatSessionValue(KEY_AUDIO_TIME_OFFSET, () => (Math.random() - 0.5) * 2 * 1e-7);
			for (let i = 0; i < data.length; i++) {
				data[i] += noiseValue;
			}
			return data;
		};
	} catch (ex) {
		console.log("NoFingerPrint Exception(Audio): " + ex);
	}
})();

//Navigator
(() => {
	try {
		Object.defineProperty(navigator, 'userAgent', {
			value: userAgentRandomized,
			configurable: true
		});
		Object.defineProperty(navigator, 'plugins', {
			value: pluginsRandomized,
			configurable: true
		});
		Object.defineProperty(navigator, 'hardwareConcurrency', {
			value: hardwareConcurrencyRandomized,
			configurable: true
		});
		Object.defineProperty(navigator, 'language', {
			value: languageRandomized,
			configurable: true
		});
		Object.defineProperty(navigator, 'languages', {
			value: languagesRandomized,
			configurable: true
		});
		
	} catch (e) {
		console.log("NoFingerPrint Exception(Navigator): " + ex);
	}
})();

//Screen
(() => {
	try {
		let screenSize = [screenRandomized.width, screenRandomized.height];
		screen.availWidth && setValue(screen, "availWidth", screenSize[0]);
		screen.availHeight && setValue(screen, "availHeight", screenSize[1]);
		screen.width && setValue(screen, "width", screenSize[0]);
		screen.height && setValue(screen, "height", screenSize[1]);
	} catch (ex) {
		console.log("NoFingerPrint Exception(Screen): " + ex);
	}
})();

//TimeZone
(() => {
	try {
		const originalDateTimeFormat = Intl.DateTimeFormat;
		Intl.DateTimeFormat = function (...args) {
			const instance = new originalDateTimeFormat(...args);
			const originalResolvedOptions = instance.resolvedOptions;
			instance.resolvedOptions = function () {
				const options = originalResolvedOptions.call(this);

				options.timeZone = timezoneRandomized;
				return options;
			};

			return instance;
		};
	} catch (ex) {
		console.log("NoFingerPrint Exception(TimeZone): " + ex);
	}
})();

//TimeZone Offset
(() => {
	try {
		const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
		Date.prototype.getTimezoneOffset = function () {
			var originalOffset = originalGetTimezoneOffset.call(this);
			var noised = originalOffset + getOrCreateFloatSessionValue(KEY_TIMEZONE_OFFSET, () => Math.floor(Math.random() * RANDOMNESS) + 1);
			console.log("Original: " + originalOffset + " Noised: " + noised);
			return noised;
		};
	} catch (ex) {
		console.log("NoFingerPrint Exception(TimeZone Offset): " + ex);
	}

})();

//Media Devices
(() => {
	try {
		const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
		navigator.mediaDevices.enumerateDevices = async () => {
			const devices = await originalEnumerateDevices();
			const spoofedDevices = devices.map(device => {
				const label = getOrCreateStringSessionValue(device.kind, () => {
					const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
					let result = '';
					for (let i = 0; i < 4; i++) {
						result += chars.charAt(Math.floor(Math.random() * chars.length));
					}
					return device.kind + " " + result;
				});
				return {
					deviceId: device.deviceId,
					kind: device.kind,
					label: label,
					groupId: device.groupId
				};
			});

			return spoofedDevices;
		};
	} catch (ex) {
		console.log("NoFingerPrint Exception(Media Devices): " + ex);
	}
})();

//Speach Synthesis
(() => {
	try {
		let originalGetVoices = speechSynthesis.getVoices;
		speechSynthesis.getVoices = function () {
			let voices = originalGetVoices.call(this);
			let index = getOrCreateIntSessionValue(KEY_SPEECSYNTHESIS_VOICE, () => Math.floor(Math.random() * voices.length));

			let fakeVoice = voices[index];
			voices.push(fakeVoice);
			return voices;
		}
	} catch (ex) {
		console.log("NoFingerPrint Exception(Speach Synthesis): " + ex);
	}
})();

//Window dimensions
(() => {
	try {
		var originalW = window.innerWidth;
		var originalH = window.innerHeight;
		Object.defineProperty(window, "innerWidth", {
			get: function () {
				let noisedW = originalW + getOrCreateIntSessionValue(KEY_WINDOW_DIMENSION_WIDTH, () => Math.floor(Math.random() * RANDOMNESS) + 1);
				return noisedW;
			}
		});
		Object.defineProperty(window, "innerHeight", {
			get: function () {
				let noisedH = originalH + getOrCreateIntSessionValue(KEY_WINDOW_DIMENSION_HEIGHT, () => Math.floor(Math.random() * RANDOMNESS) + 1);
				return noisedH;
			}
		});
	} catch (ex) {
		console.log("NoFingerPrint Exception(Window Dimensions): " + ex);
	}

})();

//Dark Mode
(() => {
	try {
		const originalMatchMedia = window.matchMedia;
		let enabled = getOrCreateBoolSessionValue(KEY_DARK_MODE_ENABLED, () => {
			return (Math.random() < 0.5) ? true : false
		})
		console.log("DarkMode: " + enabled);
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: function (query) {
				if (query === '(prefers-color-scheme: dark)') {
					// Simulate dark mode being enabled
					return {
						matches: enabled, // Simulate match for dark mode
						media: query,
						onchange: null,
						addEventListener: function () { },
						removeEventListener: function () { },
						dispatchEvent: function () { },
					};
				} else {
					// For all other queries, use the browser's default behavior
					return originalMatchMedia.call(window, query);
				}
			},
		});
	} catch (ex) {
		console.log("NoFingerPrint Exception(Dark Mode): " + ex);
	}
})();

//uncomment for extension
// }) + ")()";
// document.documentElement.prepend(script);