let script = document.createElement("script");
script.textContent = "(" + (function () {
	"use strict";
	const KEY_CANVAS_HEIGHT = "canvasHeight";
	const KEY_CANVAS_WIDTH = "canvasWidth";
	const KEY_CANVAS_TEXT_X = "canvasTextX";
	const KEY_CANVAS_TEXT_Y = "canvasTextY";
	const KEY_CANVAS_FONT_SIZE = "canvasFontSize";

	const KEY_WEBGL_COLOR_R = "webglColorR";
	const KEY_WEBGL_COLOR_G = "webglColorG";
	const KEY_WEBGL_COLOR_B = "webglColorB";
	const KEY_WEBGL_BIT_BLUE = "webglBitBlue";
	const KEY_WEBGL_BIT_GREEN = "webglBitGreen";
	const KEY_WEBGL_BIT_RED = "webglBitRED";


	const KEY_FONT_OFFSET_HEIGHT = "fontOffsetHeight";
	const KEY_FONT_OFFSET_WIDTH = "fontOffsetWidth";
	const KEY_AUDIO_TIME_OFFSET = "audioOffset";
	const KEY_PLUGIN_INDEX = "pluginIndex";
	const KEY_PLUGIN_NAME = "pluginName";

	const RANDOMNESS = 2
	const useSessionStorage = true; // Set this to false to disable sessionStorage

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
	function generateFakePlugins(){
		const pluginsArray = [];
		for (let i = 0; i < 10; i++) {
            pluginsArray.push({
                name: `Fake Plugin ${i+1}`,
                description: `Fake Plugin Description ${i+1}`,
                filename: `fakeplugin${i+1}.dll`,
                length: 0,
                item: function(index) { return this[index]; },
                namedItem: function(name) { return this[name]; }
            });
        }
		return pluginsArray;
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

	//WebGl Clear Color
	/*(()=> {
		const originalWebGLClearColor = WebGLRenderingContext.prototype.clearColor;
		WebGLRenderingContext.prototype.clearColor = function(r, g, b, a) {
			// Add a small amount of noise to each color channel
			const noiseIntensity = 0.01; // Adjust the intensity of the noise here
			const newR = getOrCreateSessionValue(KEY_WEBGL_COLOR_R,()=>Math.min(Math.max(0, r + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1));
			const newG = getOrCreateSessionValue(KEY_WEBGL_COLOR_G,()=> Math.min(Math.max(0, g + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1));
			const newB = getOrCreateSessionValue(KEY_WEBGL_COLOR_B,()=>Math.min(Math.max(0, b + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1));
			console.log("WebGl Spoofing: "+"newRed: "+newR+" newG: "+newG+" newB: "+newB)
			// Call the original clearColor function with the modified values
			return originalWebGLClearColor.call(this, newR, newG, newB, a);
		};
	
		// Repeat for WebGL2RenderingContext if your application uses WebGL 2
		if (typeof WebGL2RenderingContext !== 'undefined') {
			const originalWebGL2ClearColor = WebGL2RenderingContext.prototype.clearColor;
			WebGL2RenderingContext.prototype.clearColor = function(r, g, b, a) {
				const noiseIntensity = 0.01; // Adjust the intensity of the noise here
				const newR = Math.min(Math.max(0, r + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1);
				const newG = Math.min(Math.max(0, g + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1);
				const newB = Math.min(Math.max(0, b + (Math.random() * noiseIntensity - noiseIntensity / 2)), 1);
				console.log("WebGl2 Spoofing: "+"newRed: "+newR+" newG: "+newG+" newB: "+newB)

				return originalWebGL2ClearColor.call(this, newR, newG, newB, a);
			};
		}
	})();*/


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
				case this.RED_BITS:
					const rnoise = getOrCreateFloatSessionValue(KEY_WEBGL_BIT_RED, () => Math.floor(Math.random() * RANDOMNESS));
					const rnewValue = originalValue + rnoise;
					// Ensure the modified value doesn't go below 0
					return Math.max(0, rnewValue);
				default:
					return originalValue;
			}


			// For all other parameters, return the original value
			return originalGetParameter.call(this, parameter);
		};

		// Repeat for WebGL2RenderingContext if your application uses WebGL 2
		if (typeof WebGL2RenderingContext !== 'undefined') {
			const originalGetParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;
			WebGL2RenderingContext.prototype.getParameter = function (parameter) {
				const originalValue = originalGetParameterWebGL2.call(this, parameter);
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
					case this.RED_BITS:
						const rnoise = getOrCreateFloatSessionValue(KEY_WEBGL_BIT_RED, () => Math.floor(Math.random() * RANDOMNESS));
						const rnewValue = originalValue + rnoise;
						// Ensure the modified value doesn't go below 0
						return Math.max(0, rnewValue);
					default:
						return originalValue;
				}
			};
		}
	})();

	//Font
	/*(() => {
		const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
		const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

		Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
			get() {
				return addNoise(originalOffsetWidth.get.call(this),KEY_FONT_OFFSET_WIDTH);
			}
		});

		Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
			get() {
				return addNoise(originalOffsetHeight.get.call(this),KEY_FONT_OFFSET_HEIGHT);
			}
		});
	})();*/

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
			const noiseKey = `audioNoise${channel}`;
			const noiseValue = getOrCreateFloatSessionValue(KEY_AUDIO_TIME_OFFSET, () => (Math.random() - 0.5) * 2 * 1e-7);
			for (let i = 0; i < data.length; i++) {
				data[i] += noiseValue;
			}
			return data;
		};
	})();
	const plugins = getPluginsWithFake();
	//Navigor
	(() => {
		// Preserve the original navigator properties in case we need them
		
		const originalNavigator = navigator;
		// Create a proxy to override the navigator properties
		const spoofedNavigator = new Proxy(originalNavigator, {
			get(target, prop) {
				switch (prop) {
					case 'plugins':
						return plugins;
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


}) + ")()";
document.documentElement.prepend(script);
