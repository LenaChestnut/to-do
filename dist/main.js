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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/pubsub-js/src/pubsub.js":
/*!**********************************************!*\
  !*** ./node_modules/pubsub-js/src/pubsub.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(module) {/**\n * Copyright (c) 2010,2011,2012,2013,2014 Morgan Roderick http://roderick.dk\n * License: MIT - http://mrgnrdrck.mit-license.org\n *\n * https://github.com/mroderick/PubSubJS\n */\n\n(function (root, factory){\n    'use strict';\n\n    var PubSub = {};\n    root.PubSub = PubSub;\n\n    var define = root.define;\n\n    factory(PubSub);\n\n    // AMD support\n    if (typeof define === 'function' && define.amd){\n        define(function() { return PubSub; });\n\n        // CommonJS and Node.js module support\n    } else if (true){\n        if (module !== undefined && module.exports) {\n            exports = module.exports = PubSub; // Node.js specific `module.exports`\n        }\n        exports.PubSub = PubSub; // CommonJS module 1.1.1 spec\n        module.exports = exports = PubSub; // CommonJS\n    }\n\n}(( typeof window === 'object' && window ) || this, function (PubSub){\n    'use strict';\n\n    var messages = {},\n        lastUid = -1;\n\n    function hasKeys(obj){\n        var key;\n\n        for (key in obj){\n            if ( obj.hasOwnProperty(key) ){\n                return true;\n            }\n        }\n        return false;\n    }\n\n    /**\n     * Returns a function that throws the passed exception, for use as argument for setTimeout\n     * @alias throwException\n     * @function\n     * @param { Object } ex An Error object\n     */\n    function throwException( ex ){\n        return function reThrowException(){\n            throw ex;\n        };\n    }\n\n    function callSubscriberWithDelayedExceptions( subscriber, message, data ){\n        try {\n            subscriber( message, data );\n        } catch( ex ){\n            setTimeout( throwException( ex ), 0);\n        }\n    }\n\n    function callSubscriberWithImmediateExceptions( subscriber, message, data ){\n        subscriber( message, data );\n    }\n\n    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){\n        var subscribers = messages[matchedMessage],\n            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,\n            s;\n\n        if ( !messages.hasOwnProperty( matchedMessage ) ) {\n            return;\n        }\n\n        for (s in subscribers){\n            if ( subscribers.hasOwnProperty(s)){\n                callSubscriber( subscribers[s], originalMessage, data );\n            }\n        }\n    }\n\n    function createDeliveryFunction( message, data, immediateExceptions ){\n        return function deliverNamespaced(){\n            var topic = String( message ),\n                position = topic.lastIndexOf( '.' );\n\n            // deliver the message as it is now\n            deliverMessage(message, message, data, immediateExceptions);\n\n            // trim the hierarchy and deliver message to each level\n            while( position !== -1 ){\n                topic = topic.substr( 0, position );\n                position = topic.lastIndexOf('.');\n                deliverMessage( message, topic, data, immediateExceptions );\n            }\n        };\n    }\n\n    function messageHasSubscribers( message ){\n        var topic = String( message ),\n            found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic])),\n            position = topic.lastIndexOf( '.' );\n\n        while ( !found && position !== -1 ){\n            topic = topic.substr( 0, position );\n            position = topic.lastIndexOf( '.' );\n            found = Boolean(messages.hasOwnProperty( topic ) && hasKeys(messages[topic]));\n        }\n\n        return found;\n    }\n\n    function publish( message, data, sync, immediateExceptions ){\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        var deliver = createDeliveryFunction( message, data, immediateExceptions ),\n            hasSubscribers = messageHasSubscribers( message );\n\n        if ( !hasSubscribers ){\n            return false;\n        }\n\n        if ( sync === true ){\n            deliver();\n        } else {\n            setTimeout( deliver, 0 );\n        }\n        return true;\n    }\n\n    /**\n     * Publishes the message, passing the data to it's subscribers\n     * @function\n     * @alias publish\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publish = function( message, data ){\n        return publish( message, data, false, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Publishes the message synchronously, passing the data to it's subscribers\n     * @function\n     * @alias publishSync\n     * @param { String } message The message to publish\n     * @param {} data The data to pass to subscribers\n     * @return { Boolean }\n     */\n    PubSub.publishSync = function( message, data ){\n        return publish( message, data, true, PubSub.immediateExceptions );\n    };\n\n    /**\n     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe\n     * @function\n     * @alias subscribe\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { String }\n     */\n    PubSub.subscribe = function( message, func ){\n        if ( typeof func !== 'function'){\n            return false;\n        }\n\n        message = (typeof message === 'symbol') ? message.toString() : message;\n\n        // message is not registered yet\n        if ( !messages.hasOwnProperty( message ) ){\n            messages[message] = {};\n        }\n\n        // forcing token as String, to allow for future expansions without breaking usage\n        // and allow for easy use as key names for the 'messages' object\n        var token = 'uid_' + String(++lastUid);\n        messages[message][token] = func;\n        \n        // return token for unsubscribing\n        return token;\n    };\n\n    /**\n     * Subscribes the passed function to the passed message once\n     * @function\n     * @alias subscribeOnce\n     * @param { String } message The message to subscribe to\n     * @param { Function } func The function to call when a new message is published\n     * @return { PubSub }\n     */\n    PubSub.subscribeOnce = function( message, func ){\n        var token = PubSub.subscribe( message, function(){\n            // before func apply, unsubscribe message\n            PubSub.unsubscribe( token );\n            func.apply( this, arguments );\n        });\n        return PubSub;\n    };\n\n    /**\n     * Clears all subscriptions\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     */\n    PubSub.clearAllSubscriptions = function clearAllSubscriptions(){\n        messages = {};\n    };\n\n    /**\n     * Clear subscriptions by the topic\n     * @function\n     * @public\n     * @alias clearAllSubscriptions\n     * @return { int }\n     */\n    PubSub.clearSubscriptions = function clearSubscriptions(topic){\n        var m;\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                delete messages[m];\n            }\n        }\n    };\n\n    /** \n       Count subscriptions by the topic\n     * @function\n     * @public\n     * @alias countSubscriptions\n     * @return { Array }\n    */\n    PubSub.countSubscriptions = function countSubscriptions(topic){\n        var m;\n        var count = 0;\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                count++;\n            }\n        }\n        return count;\n    };\n\n    \n    /** \n       Gets subscriptions by the topic\n     * @function\n     * @public\n     * @alias getSubscriptions\n    */\n    PubSub.getSubscriptions = function getSubscriptions(topic){\n        var m;\n        var list = [];\n        for (m in messages){\n            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0){\n                list.push(m);\n            }\n        }\n        return list;\n    };\n\n    /**\n     * Removes subscriptions\n     *\n     * - When passed a token, removes a specific subscription.\n     *\n\t * - When passed a function, removes all subscriptions for that function\n     *\n\t * - When passed a topic, removes all subscriptions for that topic (hierarchy)\n     * @function\n     * @public\n     * @alias subscribeOnce\n     * @param { String | Function } value A token, function or topic to unsubscribe from\n     * @example // Unsubscribing with a token\n     * var token = PubSub.subscribe('mytopic', myFunc);\n     * PubSub.unsubscribe(token);\n     * @example // Unsubscribing with a function\n     * PubSub.unsubscribe(myFunc);\n     * @example // Unsubscribing from a topic\n     * PubSub.unsubscribe('mytopic');\n     */\n    PubSub.unsubscribe = function(value){\n        var descendantTopicExists = function(topic) {\n                var m;\n                for ( m in messages ){\n                    if ( messages.hasOwnProperty(m) && m.indexOf(topic) === 0 ){\n                        // a descendant of the topic exists:\n                        return true;\n                    }\n                }\n\n                return false;\n            },\n            isTopic    = typeof value === 'string' && ( messages.hasOwnProperty(value) || descendantTopicExists(value) ),\n            isToken    = !isTopic && typeof value === 'string',\n            isFunction = typeof value === 'function',\n            result = false,\n            m, message, t;\n\n        if (isTopic){\n            PubSub.clearSubscriptions(value);\n            return;\n        }\n\n        for ( m in messages ){\n            if ( messages.hasOwnProperty( m ) ){\n                message = messages[m];\n\n                if ( isToken && message[value] ){\n                    delete message[value];\n                    result = value;\n                    // tokens are unique, so we can just stop here\n                    break;\n                }\n\n                if (isFunction) {\n                    for ( t in message ){\n                        if (message.hasOwnProperty(t) && message[t] === value){\n                            delete message[t];\n                            result = true;\n                        }\n                    }\n                }\n            }\n        }\n\n        return result;\n    };\n}));\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/module.js */ \"./node_modules/webpack/buildin/module.js\")(module)))\n\n//# sourceURL=webpack:///./node_modules/pubsub-js/src/pubsub.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(module) {\n\tif (!module.webpackPolyfill) {\n\t\tmodule.deprecate = function() {};\n\t\tmodule.paths = [];\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/module.js?");

/***/ }),

/***/ "./src/domManipulation.js":
/*!********************************!*\
  !*** ./src/domManipulation.js ***!
  \********************************/
/*! exports provided: elements, toggleMenuPanel, projectCardModule, removeNode, hideElement, showElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"elements\", function() { return elements; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toggleMenuPanel\", function() { return toggleMenuPanel; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"projectCardModule\", function() { return projectCardModule; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"removeNode\", function() { return removeNode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"hideElement\", function() { return hideElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"showElement\", function() { return showElement; });\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pubsub-js */ \"./node_modules/pubsub-js/src/pubsub.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pubsub_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./storage.js */ \"./src/storage.js\");\n\n\n\nconst elements = {\n    container: document.getElementById(\"container\"),\n    menuBtn: document.querySelector('.menu-btn'),\n    menuPanel: document.createElement('div'),\n    projectList: document.createElement('ul'),\n    newProjectBtn: document.createElement('button'),\n};\n\nelements.menuPanel.classList.add('menu-panel');\nelements.projectList.classList.add('projects-container');\nelements.newProjectBtn.classList.add('new-project-btn');\n\n// MENU PANEL\n\nfunction toggleMenuPanel() {\n    if (isMenuOpen()) {\n        hideMenuPanel();\n    } else {\n        loadMenuPanel();\n    }\n}\n\nfunction isMenuOpen() {\n    if (elements.container.contains(elements.menuPanel)) {\n        return true;\n    }\n}\n\nfunction loadMenuPanel() {\n    elements.container.appendChild(elements.menuPanel);\n    elements.menuPanel.appendChild(elements.projectList);\n    appendProjectCards();\n    elements.newProjectBtn.textContent = '+ New project';\n    elements.newProjectBtn.style.display = 'block';\n    elements.menuPanel.appendChild(elements.newProjectBtn);\n}\n\nfunction hideMenuPanel() {\n    elements.menuPanel.animate([\n        { transform: 'translateX(0px)' },\n        { transform: 'translateX(-305px)' },\n    ], {\n        duration: 300,\n    });\n    setTimeout(() => {\n        removeNode(elements.menuPanel);\n    }, 300);\n}\n\n// PROJECT CARDS\n\nfunction appendProjectCards() {\n    const projects = Object(_storage_js__WEBPACK_IMPORTED_MODULE_1__[\"getProjects\"])();\n    for (let i = 0; i < projects.length; i++) {\n        projectCardModule.buildCard(projects[i]);\n    }\n    pubsub_js__WEBPACK_IMPORTED_MODULE_0___default.a.publish(\"View projects\");\n}\n\nconst projectCardModule = (() => {\n    function buildCard(project) {\n        const projectCard = document.createElement('li');\n        projectCard.classList.add('project-card');\n\n        const projectName = document.createElement('p');\n        projectName.textContent = project;\n        projectCard.appendChild(projectName);\n\n        const editButton = document.createElement('button');\n        editButton.classList.add(\"edit-btn\");\n        const editIcon = document.createElement('img');\n        editIcon.setAttribute('src', '../dist/assets/edit.svg');\n        editIcon.setAttribute('alt', 'Edit');\n        editButton.appendChild(editIcon);\n\n        const removeButton = document.createElement('button');\n        removeButton.classList.add(\"remove-btn\");\n        const removeIcon = document.createElement('img');\n        removeIcon.setAttribute('src', '../dist/assets/trash.svg');\n        removeIcon.setAttribute('alt', 'remove');\n        removeButton.appendChild(removeIcon);\n\n        projectCard.appendChild(editButton);\n        projectCard.appendChild(removeButton);\n\n        elements.projectList.appendChild(projectCard);\n    }\n\n    // get cards for event listeners assignment\n    function getProjectCards() {\n        const projectCards = document.querySelectorAll(\".project-card\");\n        return projectCards;\n    }\n\n    return {\n        buildCard,\n        getProjectCards,\n    }\n})();\n\n// GENERAL\n\nfunction removeNode(node) {\n    while (node.firstChild) {\n        removeNode(node.firstChild);\n    }\n    node.remove();\n}\n\nfunction hideElement(element) {\n    element.style.display = 'none';\n}\n\nfunction showElement(element) {\n    element.style.display = 'block';\n}\n\n//# sourceURL=webpack:///./src/domManipulation.js?");

/***/ }),

/***/ "./src/eventHandlers.js":
/*!******************************!*\
  !*** ./src/eventHandlers.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _domManipulation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulation.js */ \"./src/domManipulation.js\");\n/* harmony import */ var _formController_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./formController.js */ \"./src/formController.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pubsub-js */ \"./node_modules/pubsub-js/src/pubsub.js\");\n/* harmony import */ var pubsub_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pubsub_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _projectController_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./projectController.js */ \"./src/projectController.js\");\n/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./storage.js */ \"./src/storage.js\");\n\n\n\n\n\n\nconst eventHandler = (() => {\n    _domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"elements\"].menuBtn.addEventListener('click', _domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"toggleMenuPanel\"]);\n\n    //When project cards are created, assign event listenerss\n    pubsub_js__WEBPACK_IMPORTED_MODULE_2___default.a.subscribe(\"View projects\", function() {\n        const projectCards = _domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"projectCardModule\"].getProjectCards();\n\n        for (let i = 0; i < projectCards.length; i++) {\n            projectCards[i].addEventListener('click', function(e) {\n                alert('project clicked');\n            });\n        }\n    });\n\n    _domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"elements\"].newProjectBtn.addEventListener('click', () => {\n        Object(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"hideElement\"])(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"elements\"].newProjectBtn);\n        Object(_formController_js__WEBPACK_IMPORTED_MODULE_1__[\"createProjectForm\"])(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"elements\"].menuPanel, 'project-form');\n    });\n\n    pubsub_js__WEBPACK_IMPORTED_MODULE_2___default.a.subscribe('Create form', function() {\n        const form = document.querySelector('form');\n        form.addEventListener('click', function(e) {\n            // process the event based on the type of clicked element\n            let target = getEventTarget(e);\n            if (target.tagName.toLowerCase() === 'button') {\n                let targetClass = getTargetClass(target);\n                if (targetClass === 'save') {\n                    e.preventDefault();\n                    alert(Object(_formController_js__WEBPACK_IMPORTED_MODULE_1__[\"getFormInput\"])(form.name));\n                } else if (targetClass === 'cancel') {\n                    Object(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"removeNode\"])(form);\n                    Object(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"showElement\"])(_domManipulation_js__WEBPACK_IMPORTED_MODULE_0__[\"elements\"].newProjectBtn);\n                }\n            }\n        });\n\n        // disable or enable save button based on filled in required inputs\n        form.addEventListener('input', function() {\n            Object(_formController_js__WEBPACK_IMPORTED_MODULE_1__[\"changeSaveButtonState\"])(form);\n        });\n    });\n})();\n\nfunction getEventTarget(e) {\n    e = e || window.event;\n    return e.target || e.srcElement;\n}\n\nfunction getTargetClass(eventTarget) {\n    return eventTarget.getAttribute('class');\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (eventHandler);\n\n//# sourceURL=webpack:///./src/eventHandlers.js?");

/***/ }),

/***/ "./src/formController.js":
/*!*******************************!*\
  !*** ./src/formController.js ***!
  \*******************************/
/*! exports provided: createProjectForm, getFormInput, validateInput, changeSaveButtonState, getSaveButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createProjectForm\", function() { return createProjectForm; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getFormInput\", function() { return getFormInput; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"validateInput\", function() { return validateInput; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"changeSaveButtonState\", function() { return changeSaveButtonState; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getSaveButton\", function() { return getSaveButton; });\n/* harmony import */ var _domManipulation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulation */ \"./src/domManipulation.js\");\n\n\n// BASIC FORM ELEMENTS\n\nfunction createFormContainer(name) {\n    const form = document.createElement('form');\n    form.setAttribute('name', `${name}`);\n    return form;\n}\n\nfunction createInput(type, name) {\n    const input = document.createElement('input');\n    input.setAttribute('type', `${type}`);\n    input.setAttribute('name', `${name}`)\n    return input;\n}\n\nfunction createButton(type, source, text, btnClass) {\n    const button = document.createElement('button');\n    button.setAttribute('type', `${type}`);\n    const icon = document.createElement('img');\n    button.setAttribute('class', `${btnClass}`);\n    icon.setAttribute('src', `${source}`);\n    icon.setAttribute('alt', `${text}`);\n\n    if (type === 'submit') {\n        button.disabled = true;\n    }\n\n    button.appendChild(icon);\n    return button;\n}\n\nfunction createProjectForm(container, name) {\n    const form = createFormContainer(name);\n\n    const projectNameField = createInput('text', 'project-name');\n    projectNameField.setAttribute('placeholder', 'Project name');\n    projectNameField.required = true;\n\n    const saveBtn = createButton('submit', '../dist/assets/plus.svg', 'save', 'save');\n    const cancelBtn = createButton('reset', '../dist/assets/x.svg', 'cancel', 'cancel');\n\n    form.appendChild(projectNameField);\n    form.appendChild(saveBtn);\n    form.appendChild(cancelBtn);\n    container.appendChild(form);\n    PubSub.publish('Create form');\n};\n\n// FORM PROCESSING\n\nfunction getFormInput(formName) {\n    const form = document.forms[`${formName}`];\n    if (formName === 'project-form') {\n        return form['project-name'].value;\n    }\n}\n\nfunction validateInput(form) {\n    const formElements = getFormElements(form);\n    const requiredInputs = formElements.filter((item) => (item.required) ? true : false);\n    return requiredInputs.every((input) => (input.value !== '') ? true : false);\n}\n\nfunction getFormElements(form) {\n    const formElements = Array.from(form.elements);\n    return formElements;\n}\n\nfunction changeSaveButtonState(form) {\n    const saveButton = getSaveButton(form);\n    if (validateInput(form)) {\n        saveButton.disabled = false;\n    } else {\n        saveButton.disabled = true;\n    }\n}\n\nfunction getSaveButton(form) {\n    const formElements = getFormElements(form);\n    const saveBtnArr = formElements.filter((item) => {\n        if (item.type === 'submit') {\n            return item;\n        }\n    });\n    const saveBtn = saveBtnArr[0];\n    return saveBtn;\n}\n\n//# sourceURL=webpack:///./src/formController.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _eventHandlers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventHandlers.js */ \"./src/eventHandlers.js\");\n/* harmony import */ var _projectController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectController */ \"./src/projectController.js\");\n\n\n\n//when user clicks on menu button\n// show/hide the menu +\n// view all created projects\n    // Load projects\n//     check localStorage\n//     IF localProject is available, load projects\n//     IF not, load default tutorial project\n// - on click redirect to the project\n// 1. when the project title is clicked, load all its tasks\n// - edit button\n// 1. when the edit button is clicked, display text field with the project name and a save button\n// 2. cancel on lose focus\n\n// updateProjectView\n// add existing projects to the project panel\n\n// #### Storage\n// WHEN the page is first loaded, check localStorage\n//     IF localStorage is populated, get projects and tasks from it\n//     IF localStorage is empty, return false\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/projectController.js":
/*!**********************************!*\
  !*** ./src/projectController.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst ProjectFactory = (projectName) => {\n    let name = projectName;\n    const tasks = [];\n  \n    function getName() {\n        return name;\n    }\n\n    function editName(newProjectName) {\n        name = newProjectName;\n    }\n\n    function addTask(newTask) {\n        tasks.push(newTask);\n    }\n  \n    function getTasks() {\n        return tasks;\n    }\n\n    function removeTask(task) {\n        const i = tasks.indexOf(task);\n        tasks.splice(i, 0);\n    }\n  \n    return {\n        getName,\n        addTask,\n        getTasks,\n        editName,\n        removeTask,\n    }\n}\n\nfunction addProject(name) {\n    \n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ProjectFactory);\n\n\n//# sourceURL=webpack:///./src/projectController.js?");

/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/*! exports provided: getProjects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getProjects\", function() { return getProjects; });\nconst projects = [\"General\", \"Hobby\", \"Work\"];\n\nfunction getProjects() {\n    if (localStorage.length) {\n        return true;\n    } else {\n        return projects;\n    }\n}\n\nfunction updateStorage(projectName) {\n    localStorage.setItem(projectName, JSON.stringify(myLibrary));\n}\n\n//# sourceURL=webpack:///./src/storage.js?");

/***/ })

/******/ });