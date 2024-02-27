let script = document.createElement("script");
script.textContent = "(" + (function () {
	"use strict";

	//Canvas
	/*(() => {
		HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
			const base64Header = 'data:image/png;base64,';
			const originalBase64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUA' +
				'AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO' +
				'9TXL0Y4OHwAAAABJRU5ErkJggg==';
			const dataLength = originalBase64Data.length - base64Header.length;
			const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
			let randomBase64Data = '';
			for (let i = 0; i < dataLength; i++) {
				randomBase64Data += base64Chars.charAt(Math.floor(Math.random() * base64Chars.length));
			}
			return base64Header + randomBase64Data;
		};
	})();*/

	//Canvas 2
	(() => {
		// Utility functions
		function getOrCreateSessionValue(key, generator) {
			const sessionKey = key; 
			let value = parseFloat(sessionStorage.getItem(sessionKey));
			if (isNaN(value)) {
				value = generator();
				sessionStorage.setItem(sessionKey, value.toString());
			}
			return value;
		}
		
	
		function adjustSize(value) {
			const adjustment = getOrCreateSessionValue('canvasSizeAdjustment', () => Math.floor(Math.random() * 4) - 2);
			return value + adjustment;
		}
	
	
		// Spoofing canvas size
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function(type, contextAttributes) {
			this.width = adjustSize(this.width);
			this.height = adjustSize(this.height);
			return originalGetContext.call(this, type, contextAttributes);
		};
	})();
	

	//Font
	(() => {
		const sessionKey = 'fontNoise';
		let noise = parseFloat(sessionStorage.getItem(sessionKey));
		if (isNaN(noise)) { // Check if noise is not a number, meaning it's not yet set for this session
			noise = Math.random() * 2 - 1; // Noise range example: -1 to 1
			sessionStorage.setItem(sessionKey, noise.toString());
		}
	
		const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
		const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
	
		const addNoise = (originalValue) => {
			return originalValue + noise;
		};
	
		Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
			get() {
				return addNoise(originalOffsetWidth.get.call(this));
			}
		});
	
		Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
			get() {
				return addNoise(originalOffsetHeight.get.call(this));
			}
		});
	})();
	
// Audio Fingerprint Spoofing with sessionStorage
(() => {
    const originalCreateOscillator = AudioContext.prototype.createOscillator;
    const originalCreateBuffer = AudioContext.prototype.createBuffer;
    const originalGetChannelData = AudioBuffer.prototype.getChannelData;

    function getOrCreateSessionValue(key, generator) {
        let value = sessionStorage.getItem(key);
        if (value === null) {
            value = generator();
            sessionStorage.setItem(key, value);
        }
        return parseFloat(value);
    }

    AudioContext.prototype.createOscillator = function() {
        const oscillator = originalCreateOscillator.apply(this, arguments);
        const originalStart = oscillator.start;
        oscillator.start = function(when = 0) {
            const timeOffsetKey = 'audioTimeOffset';
            const randomTimeOffset = getOrCreateSessionValue(timeOffsetKey, () => 0.0001 * Math.random());
            return originalStart.call(this, when + randomTimeOffset);
        };
        return oscillator;
    };

    AudioContext.prototype.createBuffer = function(channels, length, sampleRate) {
        const buffer = originalCreateBuffer.apply(this, arguments);
        return buffer;
    };

    AudioBuffer.prototype.getChannelData = function(channel) {
        const data = originalGetChannelData.apply(this, arguments);
        const noiseKey = `audioNoise${channel}`;
        const noiseValue = getOrCreateSessionValue(noiseKey, () => (Math.random() - 0.5) * 2 * 1e-7);
        for (let i = 0; i < data.length; i++) {
            data[i] += noiseValue;
        }
        return data;
    };
})();



}) + ")()";
document.documentElement.prepend(script);
