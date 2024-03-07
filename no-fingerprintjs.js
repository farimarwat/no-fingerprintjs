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
	const KEY_WEBGL_BIT_BLUE = "webglBitBlue";
	const KEY_WEBGL_BIT_GREEN = "webglBitGreen";
	const KEY_WEBGL_BIT_RED = "webglBitRED";
	const KEY_WEBGL_EXTENSION = "webglExtension";
	const KEY_WEBGL_VERSION = "webglVersion";
	const KEY_WEBGL_SLV = "webglShadedLanguageVersion";
	const KEY_WEBGL_RENDERER = "webglRenderer";
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

	const RANDOMNESS = 2;
	const useSessionStorage = false;


	//Helper functions
	function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}
	function addNoise(value, key) {
		// Generate a random floating-point number between -2.5 and 2.5, for example
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
	function generateFakePlugins() {
		const pluginsArray = [];
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
		//return navigator.userAgent + getOrCreateStringSessionValue(KEY_USERAGENT_SUFFIX, () => " (" + (Math.random() * RANDOMNESS).toFixed(2) + ")");
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

	//Global Vars
	const pluginsRandomized = getPluginsWithFake();
	const userAgentRandomized = getUserAgentRandomized();
	const hardwareConcurrencyRandomized = getHardwareConcurrencyRandomized();
	const screenRandomized = getScreenSize();

	//Canvas
	(() => {

		// Spoofing canvas size
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (type, contextAttributes) {
			this.width = addNoise(this.width, KEY_CANVAS_WIDTH);
			this.height = addNoise(this.height, KEY_CANVAS_HEIGHT);
			return originalGetContext.call(this, type, contextAttributes);
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
	})();

	//WebGl params
	(() => {
		const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
		WebGLRenderingContext.prototype.getParameter = function (parameter) {
			const originalValue = originalGetParameter.call(this, parameter);
			switch (parameter) {
				case this.BLUE_BITS:
					const bnoise = getOrCreateFloatSessionValue(KEY_WEBGL_BIT_BLUE, () => Math.floor(Math.random() * RANDOMNESS));
					const bnewValue = originalValue + bnoise;
					// Ensure the modified value doesn't go below 0
					return Math.max(0, bnewValue);
				case this.GREEN_BITS:
					const gnoise = getOrCreateFloatSessionValue(KEY_WEBGL_BIT_GREEN, () => Math.floor(Math.random() * RANDOMNESS));
					const gnewValue = originalValue + gnoise;
					// Ensure the modified value doesn't go below 0
					return Math.max(0, gnewValue);

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
	})();


	//WebGl extensions
	(() => {
		var originalWebGLGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
		WebGLRenderingContext.prototype.getSupportedExtensions = function () {
			var extensions = originalWebGLGetSupportedExtensions.call(this);
			let randomExtension = getOrCreateStringSessionValue(KEY_WEBGL_EXTENSION, () => extensions[Math.floor(Math.random() * extensions.length)]);
			extensions.push(randomExtension);
			return extensions
		};
		// Check and do the same for WebGL2RenderingContext if it exists
		if (typeof WebGL2RenderingContext !== 'undefined') {
			var originalWebGL2GetSupportedExtensions = WebGL2RenderingContext.prototype.getSupportedExtensions;
			WebGL2RenderingContext.prototype.getSupportedExtensions = function () {
				var extensions = originalWebGL2GetSupportedExtensions.call(this);
				let randomExtension = getOrCreateStringSessionValue(KEY_WEBGL_EXTENSION, () => extensions[Math.floor(Math.random() * extensions.length)]);
				extensions.push(randomExtension);
				return extensions
			};
		}

	})();
	//Font
	(() => {
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
	})();

	//Audio
	(() => {
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
	})();

	//Navigator
	(() => {
		// Preserve the original navigator properties in case we need them

		const originalNavigator = navigator;
		// Create a proxy to override the navigator properties
		const spoofedNavigator = new Proxy(originalNavigator, {
			get(target, prop) {
				switch (prop) {
					case 'plugins':
						return pluginsRandomized;
					case 'userAgent':
						return userAgentRandomized;
					case 'hardwareConcurrency':
						return hardwareConcurrencyRandomized;
					default:
						// Return the original property for everything else
						return target[prop];
				}
			}
		});
		try {
			Object.defineProperty(window, 'navigator', {
				value: spoofedNavigator
			});
		} catch (e) {
			console.error("Failed to spoof navigator:", e);
		}
	})();

	//Screen
	(() => {
		let screenSize = [screenRandomized.width, screenRandomized.height];
		screen.availWidth && setValue(screen, "availWidth", screenSize[0]);
		screen.availHeight && setValue(screen, "availHeight", screenSize[1]);
		screen.width && setValue(screen, "width", screenSize[0]);
		screen.height && setValue(screen, "height", screenSize[1]);
	})();

	//uncomment for extension
// }) + ")()";
// document.documentElement.prepend(script);