/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/service.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../backend/vapid.json":
/*!*****************************!*\
  !*** ../backend/vapid.json ***!
  \*****************************/
/*! exports provided: public, private, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"public\\\":\\\"BMu5miAZuwTGAm9o-ZxtYVUlmTZAYw3KP1QrzGBNW8vPSxgBlke-Pbl7Rd-Ujxpe-LT5fMFReE5uG7b-4mLl8Fk\\\",\\\"private\\\":\\\"0LVxzWtSuFFWoiSiNoRSurLtq_VSmJRkzTLhP-0LKHs\\\"}\");\n\n//# sourceURL=webpack:///../backend/vapid.json?");

/***/ }),

/***/ "./src/service.js":
/*!************************!*\
  !*** ./src/service.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const VAPID = __webpack_require__(/*! ../../backend/vapid.json */ \"../backend/vapid.json\");\n\n// urlB64ToUint8Array is a magic function that will encode the base64 public key\n// to Array buffer which is needed by the subscription option\nconst urlB64ToUint8Array = base64String => {\n    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);\n    const base64 = (base64String + padding)\n        .replace(/-/g, '+')\n        .replace(/_/g, '/');\n    const rawData = atob(base64);\n    const outputArray = new Uint8Array(rawData.length);\n    for (let i = 0; i < rawData.length; ++i) {\n        outputArray[i] = rawData.charCodeAt(i);\n    }\n\n    return outputArray;\n};\n\nconst saveSubscription = async subscription => {\n    console.log(JSON.stringify(subscription));\n    const SERVER_URL = 'https://backend.local/save-subscription';\n    const response = await fetch(SERVER_URL, {\n        method: 'post',\n        headers: {\n            \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify(subscription)\n    });\n\n    return response.json();\n};\n\nconst showPushNotification = async (title, body, swRegistration) => {\n    const options = {\n        body: body\n    };\n    await swRegistration.showNotification(title, options);\n};\n\nself.addEventListener('install', async (event) => {\n    console.log('ServiceWorker event: ' + event.type);\n    await self.skipWaiting().then(_ => console.log('    skipped waiting.'));\n});\n\nself.addEventListener('activate', async (event) => {\n    console.log('ServiceWorker event: ' + event.type);\n\n    console.log('    activated:');\n    const applicationServerKey = urlB64ToUint8Array(VAPID.public);\n    const options = {applicationServerKey, userVisibleOnly: true};\n\n    console.log(\"    Try subscribing...\");\n    const subscription = await self.registration.pushManager.subscribe(options);\n    await saveSubscription(subscription).then(subscription => {\n        console.log(\"    Subscription saved.\");\n        console.log(subscription);\n    });\n});\n\nself.addEventListener('push', async (event) => {\n    console.log('ServiceWorker event: ' + event.type);\n    if (!!!event.data) {\n        throw new Error('Push event but no data');\n    }\n    await showPushNotification('Tommy November7', event.data.text(), self.registration)\n        .then(_ => console.log('  ', event.data.text()));\n});\n\nconsole.log('Hello from ServiceWorker.');\n\n\n//# sourceURL=webpack:///./src/service.js?");

/***/ })

/******/ });