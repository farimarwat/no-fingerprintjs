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
		function addNoise(value, magnitude = 1) {
			return value + (Math.random() * 2 - 1) * magnitude;
		}
	
		function adjustSize(value) {
			const adjustment = Math.floor(Math.random() * 4) - 2; // Adjusts by up to +/- 2 pixels
			return value + adjustment;
		}
	
		function adjustFontSize(ctx) {
			// Define the range of the variation
			const variation = 0.02; // Variation range of ±0.01
			const randomVariation = Math.random() * variation - (variation / 2);
		
			// Extract the current font size from the ctx.font property
			const fontParts = ctx.font.match(/(\d+(?:\.\d+)?)(px|pt|em|%)/); // Match the font size and unit
		
			if (fontParts && fontParts.length > 1) {
				const currentFontSize = parseFloat(fontParts[1]); // Convert the font size part to a number
				const fontSizeUnit = fontParts[2]; // Extract the unit (px, pt, em, etc.)
		
				// Apply the random variation to the current font size
				const adjustedFontSize = currentFontSize + currentFontSize * randomVariation; // Apply the variation based on percentage
		
				// Replace the old font size with the new, adjusted size in the ctx.font string
				ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)(px|pt|em|%)/, `${adjustedFontSize.toFixed(2)}${fontSizeUnit}`);
			}
		}
		
		
	
		// Spoofing canvas size
		const originalGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function(type, contextAttributes) {
			this.width = adjustSize(this.width);
			this.height = adjustSize(this.height);
			return originalGetContext.call(this, type, contextAttributes);
		};
	
		// Spoofing canvas rendering methods
		const ctxProto = CanvasRenderingContext2D.prototype;
		const originalFillText = ctxProto.fillText;
		const originalStrokeText = ctxProto.strokeText;
	
		ctxProto.fillText = function(text, x, y, maxWidth) {
			adjustFontSize(this); // Adjust the font size before drawing
			originalFillText.call(this, text, addNoise(x), addNoise(y), maxWidth ? addNoise(maxWidth) : maxWidth);
		};
	
		ctxProto.strokeText = function(text, x, y, maxWidth) {
			adjustFontSize(this); // Adjust the font size before drawing
			originalStrokeText.call(this, text, addNoise(x), addNoise(y), maxWidth ? addNoise(maxWidth) : maxWidth);
		};
	
		// Apply similar overrides for other methods as needed
	})();
	


	//navigator
	(() => {

		const originalNavigator = navigator;
		// Function to generate a random value within a range or array
		const randomize = (options) => Array.isArray(options) ? options[Math.floor(Math.random() * options.length)] : Math.floor(Math.random() * (options.max - options.min + 1)) + options.min;
		// Function to generate consistent language settings
		const generateConsistentLanguages = () => {
			const languages = ['en-US', 'fr-FR', 'de-DE'];
			const selectedLanguage = randomize(languages);
			return {
				language: selectedLanguage.substr(0, 2), // Ensure we're matching the format in your test output
				languages: [selectedLanguage, ...languages.filter(lang => lang !== selectedLanguage)].map(lang => lang.substr(0, 2)) // Adapted to match your output format
			};
		};

		const { language, languages } = generateConsistentLanguages();
		// Create a proxy to override the navigator properties
		const spoofedNavigator = new Proxy(originalNavigator, {
			get(target, prop) {
				switch (prop) {
					case 'language':
						return language;
					case 'languages':
						return languages;
					case 'userAgent':
						var useragent = spoofUserAgent(target[prop]);
						return useragent;
					case 'oscpu':
						return spoofOscpu(target[prop]);
					case 'hardwareConcurrency':
						return randomize({ min: 2, max: 16 });
					case 'deviceMemory':
						return randomize([4, 8, 16]);
					case 'vendor':
						return randomize(['Google Inc.', 'Apple Computer, Inc.', '']);

					default:
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

	//fonts
	(function() {
		const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
		const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
	
		const addNoise = (originalValue) => {
			// This is where the noise is added. The noise should be small enough
			// to not affect layout but enough to disrupt font detection.
			// Adjust the noise level as necessary.
			const noise = Math.random() * 2 - 1; // Noise range example: -1 to 1
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
	


	//Helper Functions
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]]; // Swap elements
		}
		return array;
	}

	function spoofUserAgent(originalUserAgent) {
		// Split the user agent into segments based on common delimiters
		const segments = originalUserAgent.split(/[\s;()]+/);
		// Shuffle the segments to rearrange the order
		const shuffledSegments = shuffleArray(segments);
		// Rejoin the segments into a new user agent string
		const spoofedUserAgent = shuffledSegments.join(' ');
		return spoofedUserAgent;
	}
	function spoofOscpu(originalOscpu) {
		// Return original if undefined
		if (!originalOscpu) return originalOscpu;
	
		// Determine the delimiter; default to space if semicolon is not found
		const delimiter = originalOscpu.includes(';') ? '; ' : ' ';
	
		// Split the oscpu string into segments based on the determined delimiter
		const segments = originalOscpu.split(delimiter);
		
		// Randomly select a segment to append in brackets
		const randomIndex = Math.floor(Math.random() * segments.length);
		const selectedSegment = segments[randomIndex].trim();
	
		// Generate a fake version number (e.g., 1.0, 2.1, etc.)
		const majorVersion = Math.floor(Math.random() * 10); // Random major version 0-9
		const minorVersion = Math.floor(Math.random() * 10); // Random minor version 0-9
		const fakeVersion = `${majorVersion}.${minorVersion}`;
	
		// Append the selected segment and the fake version number in brackets at the end of the original string
		return `${originalOscpu} (${selectedSegment}) [${fakeVersion}]`;
	}
	
	

}) + ")()";
document.documentElement.prepend(script);
