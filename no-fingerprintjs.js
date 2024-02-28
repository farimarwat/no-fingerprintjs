let script = document.createElement("script");
script.textContent = "(" + (function () {
	"use strict";
	const KEY_CANVAS_HEIGHT = "canvasheight";
	const KEY_CANVAS_WIDTH = "canvaswidth";
	const KEY_CANVAS_TEXT_X = "canvastextx";
	const KEY_CANVAS_TEXT_Y = "canvastexty";
	const KEY_CANVAS_FONT_SIZE = "canvasfontsize";

	const KEY_FONT_OFFSET_HEIGHT = "fontoffsetheight";
	const KEY_FONT_OFFSET_WIDTH = "fontoffsetwidth";
	const KEY_AUDIO_TIME_OFFSET = "audiooffset";
	const RANDOMNESS = 1
	const useSessionStorage = true; // Set this to false to disable sessionStorage
	function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}

	function addNoise(value, key) {
		// Generate a random floating-point number between -2.5 and 2.5, for example
		const adjustment = getOrCreateSessionValue(key, () => randomFloat(-RANDOMNESS, RANDOMNESS));
		return value + adjustment;
	}
	function getOrCreateSessionValue(key, generator) {
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
	//Canvas 2
	(() => {
		// Spoofing canvas size
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (type, contextAttributes) {
			this.width = addNoise(this.width,KEY_CANVAS_WIDTH);
			this.height = addNoise(this.height,KEY_CANVAS_HEIGHT);
			return originalGetContext.call(this, type, contextAttributes);
		};

	 // Override fillText on the CanvasRenderingContext2D prototype
	 const originalFillText = CanvasRenderingContext2D.prototype.fillText;
	 CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
		 let adjustedX = addNoise(x,KEY_CANVAS_TEXT_X);
		 let adjustedY = addNoise(y,KEY_CANVAS_TEXT_Y);

		 const fontRegex = /(\d+)(px|pt|em|%|rem)/; // Regex to extract font size and units
        const match = this.font.match(fontRegex);
        if (match) {
            const originalSize = parseInt(match[1], 10);
            const unit = match[2];
            const newSize = addNoise(originalSize,KEY_CANVAS_FONT_SIZE);
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


	//Font
	(() => {
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
	})();

	//Audio
	(() => {
		const originalCreateOscillator = AudioContext.prototype.createOscillator;
		const originalCreateBuffer = AudioContext.prototype.createBuffer;
		const originalGetChannelData = AudioBuffer.prototype.getChannelData;

		/*function getOrCreateSessionValue(key, generator) {
			let value = sessionStorage.getItem(key);
			if (value === null) {
				value = generator();
				sessionStorage.setItem(key, value);
			}
			return parseFloat(value);
		}*/

		AudioContext.prototype.createOscillator = function () {
			const oscillator = originalCreateOscillator.apply(this, arguments);
			const originalStart = oscillator.start;
			oscillator.start = function (when = 0) {
				const timeOffsetKey = 'audioTimeOffset';
				const randomTimeOffset = getOrCreateSessionValue(timeOffsetKey, () => 0.0001 * Math.random());
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
			const noiseValue = getOrCreateSessionValue(KEY_AUDIO_TIME_OFFSET, () => (Math.random() - 0.5) * 2 * 1e-7);
			for (let i = 0; i < data.length; i++) {
				data[i] += noiseValue;
			}
			return data;
		};
	})();



}) + ")()";
document.documentElement.prepend(script);
