let script = document.createElement("script");
script.textContent = "(" + (function () {
	"use strict";

	//Canvas
	(() => {
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
	})();

	//navigator
	(() => {
		const shuffleArray = (array) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]]; // Swap elements
			}
		};

		// Define a list of profiles for navigator spoofing
		const profiles = [
			// Windows Chrome
			{
				userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
				platform: 'Win32',
				languages: ['en-US', 'en'],
				language: 'en-US',
				maxTouchPoints: 0,
				oscpu: undefined, // Not applicable for Chrome
				productSub: '20030107',
			},
			// Android Chrome
			{
				userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36',
				platform: 'Android',
				languages: ['en-US', 'en'],
				language: 'en-US',
				maxTouchPoints: 5,
				oscpu: undefined,
				productSub: '20030107',
			},
			// macOS Safari (Safari does not use productSub in the same way, but for consistency in spoofing, we'll include it)
			{
				userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
				platform: 'MacIntel',
				languages: ['en-US', 'en'],
				language: 'en-US',
				maxTouchPoints: 0,
				oscpu: undefined,
				productSub: '20030107', // Safari typically doesn't have this, but spoofed for consistency
			},
			// Linux Firefox
			{
				userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:88.0) Gecko/20100101 Firefox/88.0',
				platform: 'Linux x86_64',
				languages: ['en-US', 'en'],
				language: 'en-US',
				maxTouchPoints: 0,
				oscpu: 'Linux x86_64',
				productSub: '20100101',
			},
			// iOS Safari
			{
				userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
				platform: 'iPhone',
				languages: ['en-US', 'en'],
				language: 'en-US',
				maxTouchPoints: 5,
				oscpu: undefined,
				productSub: '20030107', // Again, spoofed for consistency
			},
		];


		shuffleArray(profiles);

		// Keep track of the current profile index
		let currentProfileIndex = 0;
	  
		// Function to get the next profile in a non-repeating manner
		const getNextProfile = () => {
		  const profile = profiles[currentProfileIndex];
		  currentProfileIndex = (currentProfileIndex + 1) % profiles.length;
		  // Optionally reshuffle after a complete cycle
		  if (currentProfileIndex === 0) {
			shuffleArray(profiles);
		  }
		  return profile;
		};
	  
		// Select the initial profile
		const selectedProfile = getNextProfile();
		// Preserve the original navigator properties in case we need them
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
						return selectedProfile.userAgent;
					case 'platform':
						return selectedProfile.platform;
					case 'productSub':
						return selectedProfile.productSub;
					case 'oscpu':
						return selectedProfile.oscpu;
					case 'maxTouchPoints':
						return selectedProfile.maxTouchPoints;
					case 'hardwareConcurrency':
						return randomize({ min: 2, max: 16 });
					case 'deviceMemory':
						return randomize([4, 8, 16]);
					case 'vendor':
						return randomize(['Google Inc.', 'Apple Computer, Inc.', '']);

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

}) + ")()";
document.documentElement.prepend(script);
