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
}) + ")()";
document.documentElement.prepend(script);